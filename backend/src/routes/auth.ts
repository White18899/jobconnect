import { Hono } from 'hono';
import { z } from 'zod';
import { Env, UserTokenPayload } from '../config/env';
import { APP_CONSTANTS } from '../config/constants';
import { generateOtp, checkRateLimit } from '../services/otp';
import { hashPassword, verifyPassword } from '../services/password';
import {
  sendSmtpEmail,
  getVerificationEmailHtml,
  getPasswordResetEmailHtml,
  SmtpConfig,
} from '../services/smtp';
import { signJwt, authMiddleware } from '../middlewares/auth';

const authRoutes = new Hono<{ Bindings: Env; Variables: { user: UserTokenPayload } }>();

// Helper to normalize Indian phone numbers if provided
function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  return input.startsWith('+') ? input : `+${digits}`;
}

function getSmtpConfig(env: Env): SmtpConfig {
  return {
    host: env.SMTP_HOST || 'smtp.job-way.in',
    port: parseInt(env.SMTP_PORT || '465', 10),
    user: env.SMTP_USER || 'noreply@job-way.in',
    pass: env.SMTP_PASS || '',
    from: env.SMTP_FROM || 'JobWay <noreply@job-way.in>',
    secure: env.SMTP_SECURE !== 'false',
  };
}

// -------------------------------------------------------------
// 1. REGISTER: Request Verification Code via Email (SMTP)
// -------------------------------------------------------------
const registerRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['worker', 'employer']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

authRoutes.post('/register/request', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = registerRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid registration data' }, 400);
  }

  const { password, role, name, phone } = parsed.data;
  const email = parsed.data.email.trim().toLowerCase();

  // Check if account already exists with this email
  const existingUser = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first();

  if (existingUser) {
    return c.json({ error: 'An account with this email address already exists. Please log in.' }, 400);
  }

  // Rate limit: max 3 requests per 10 minutes per email
  if (c.env.KV) {
    const rateLimitKey = `email_ratelimit:${email}`;
    const { allowed } = await checkRateLimit(
      c.env.KV,
      rateLimitKey,
      APP_CONSTANTS.OTP.MAX_REQUESTS_PER_WINDOW,
      APP_CONSTANTS.OTP.RATE_LIMIT_WINDOW_SECONDS
    );

    if (!allowed) {
      return c.json({ error: 'Too many verification requests. Please wait 10 minutes before requesting again.' }, 429);
    }
  }

  // Hash password using Web Crypto PBKDF2
  const { hash, salt } = await hashPassword(password);
  const code = generateOtp();

  // Stage pending registration in KV with 15-minute TTL (User is NOT created in D1 yet!)
  if (c.env.KV) {
    const pendingData = {
      email,
      passwordHash: hash,
      salt,
      role,
      name: name.trim(),
      phone: phone ? normalizePhone(phone) : null,
      code,
      createdAt: Date.now(),
    };

    await c.env.KV.put(`pending_reg:${email}`, JSON.stringify(pendingData), {
      expirationTtl: 900, // 15 minutes
    });
  }

  // Send verification email via SMTP with custom domain job-way.in
  const smtpConfig = getSmtpConfig(c.env);
  const emailResult = await sendSmtpEmail(
    {
      to: email,
      subject: `Your JobWay Verification Code: ${code}`,
      html: getVerificationEmailHtml(code, email),
      text: `Your JobWay verification code is: ${code}. Valid for 15 minutes.`,
    },
    smtpConfig
  );

  return c.json({
    success: true,
    message: emailResult.success
      ? `Verification code sent to ${email}`
      : `Verification code generated. (SMTP status: ${emailResult.error || 'notice'})`,
    email,
    emailDelivered: emailResult.success,
    emailError: emailResult.success ? undefined : emailResult.error,
    // Provide devCode when in development or if SMTP credentials are still pending configuration
    devCode: (!emailResult.success || c.env.ENVIRONMENT === 'development') ? code : undefined,
  });
});

// -------------------------------------------------------------
// 2. REGISTER: Verify Email Code & Create User Account
// -------------------------------------------------------------
const registerVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(6),
});

authRoutes.post('/register/verify', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = registerVerifySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid parameters' }, 400);
  }

  const email = parsed.data.email.trim().toLowerCase();
  const inputCode = parsed.data.code.trim();

  if (!c.env.KV) {
    return c.json({ error: 'Server KV storage unavailable' }, 500);
  }

  const pendingRaw = await c.env.KV.get(`pending_reg:${email}`);
  if (!pendingRaw) {
    return c.json({ error: 'Verification code has expired or registration session was not found. Please register again.' }, 400);
  }

  let pendingData: any;
  try {
    pendingData = JSON.parse(pendingRaw);
  } catch {
    return c.json({ error: 'Invalid registration state' }, 400);
  }

  if (pendingData.code !== inputCode) {
    return c.json({ error: 'Invalid verification code. Please check your email and try again.' }, 400);
  }

  // Ensure email wasn't registered in the interim
  const doubleCheck = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first();

  if (doubleCheck) {
    await c.env.KV.delete(`pending_reg:${email}`);
    return c.json({ error: 'Account already created. Please log in.' }, 400);
  }

  // Create User Account in D1 (Only verified users are inserted!)
  const userId = 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  const assignedRole = pendingData.role === 'employer' ? 'employer' : 'worker';

  try {
    await c.env.DB.prepare(`
      INSERT INTO users (id, email, password_hash, password_salt, phone, role, is_blocked, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, 0, 1)
    `).bind(
      userId,
      email,
      pendingData.passwordHash,
      pendingData.salt,
      pendingData.phone || null,
      assignedRole
    ).run();

    // Create Profile Record
    if (assignedRole === 'worker') {
      const wpId = 'wp_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
      await c.env.DB.prepare(`
        INSERT INTO worker_profiles (id, user_id, full_name, phone, skills, preferred_area, city, verification_status)
        VALUES (?, ?, ?, ?, '[]', 'Hyderabad', 'Hyderabad', 'pending')
      `).bind(wpId, userId, pendingData.name || 'New Worker', pendingData.phone || null).run();
    } else {
      const epId = 'ep_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
      await c.env.DB.prepare(`
        INSERT INTO employer_profiles (id, user_id, business_name, business_type, contact_person, city, area, exact_address, latitude, longitude, verification_status)
        VALUES (?, ?, ?, 'Trade Workshop', ?, 'Hyderabad', 'City Center', 'Pending Address', 17.3850, 78.4867, 'pending')
      `).bind(epId, userId, pendingData.name || 'My Business', pendingData.name || 'Owner').run();
    }
  } catch (dbErr: any) {
    console.error('Account creation DB error:', dbErr);
    return c.json({ error: dbErr.message || 'Failed to initialize account profile. Please try again.' }, 500);
  }

  // Clean up pending registration from KV
  await c.env.KV.delete(`pending_reg:${email}`);

  // Issue JWT Token
  const secret = c.env.JWT_SECRET || 'jobconnect-super-secret-key-change-in-prod';
  const token = await signJwt(
    {
      userId,
      email,
      phone: pendingData.phone || undefined,
      role: assignedRole,
    },
    secret,
    7 * 86400
  );

  return c.json({
    success: true,
    token,
    user: {
      id: userId,
      email,
      name: pendingData.name,
      role: assignedRole,
      isVerified: true,
    },
  });
});

// -------------------------------------------------------------
// 3. LOGIN: Authenticate with Email & Password
// -------------------------------------------------------------
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

authRoutes.post('/login', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid login details' }, 400);
  }

  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;

  const user = await c.env.DB.prepare(`
    SELECT id, email, password_hash, password_salt, phone, role, is_blocked, is_verified
    FROM users WHERE email = ?
  `).bind(email).first<{
    id: string;
    email: string;
    password_hash: string | null;
    password_salt: string | null;
    phone: string | null;
    role: 'worker' | 'employer' | 'admin';
    is_blocked: number;
    is_verified: number;
  }>();

  if (!user) {
    return c.json({ error: 'No account found with this email address. Please check your spelling or register.' }, 401);
  }

  if (user.is_blocked === 1) {
    return c.json({ error: 'Your account has been suspended. Please contact support.' }, 403);
  }

  // Password Verification
  let passwordMatches = false;
  if (user.password_hash && user.password_salt) {
    passwordMatches = await verifyPassword(password, user.password_hash, user.password_salt);
  } else {
    // Demo accounts fallback if password was not set initially
    passwordMatches = (password === 'Password@123' || password === '123456');
  }

  if (!passwordMatches) {
    return c.json({ error: 'Incorrect password. Please try again or use forgot password.' }, 401);
  }

  // Fetch Display Name
  let displayName = user.email;
  if (user.role === 'worker') {
    const wp = await c.env.DB.prepare('SELECT full_name FROM worker_profiles WHERE user_id = ?').bind(user.id).first<{ full_name: string }>();
    if (wp?.full_name) displayName = wp.full_name;
  } else if (user.role === 'employer') {
    const ep = await c.env.DB.prepare('SELECT business_name FROM employer_profiles WHERE user_id = ?').bind(user.id).first<{ business_name: string }>();
    if (ep?.business_name) displayName = ep.business_name;
  } else if (user.role === 'admin') {
    displayName = 'Super Administrator';
  }

  // Issue JWT Token
  const secret = c.env.JWT_SECRET || 'jobconnect-super-secret-key-change-in-prod';
  const token = await signJwt(
    {
      userId: user.id,
      email: user.email,
      phone: user.phone || undefined,
      role: user.role,
    },
    secret,
    7 * 86400
  );

  return c.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: displayName,
      role: user.role,
      isVerified: user.is_verified === 1,
    },
  });
});

// -------------------------------------------------------------
// 4. FORGOT PASSWORD: Request Reset Code via Email (SMTP)
// -------------------------------------------------------------
const forgotRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

authRoutes.post('/forgot-password/request', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = forgotRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid email address' }, 400);
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();

  if (!user) {
    // Return friendly success message even if not found to prevent email enumeration
    return c.json({
      success: true,
      message: 'If an account exists with this email, a password reset code has been sent.',
    });
  }

  const code = generateOtp();
  if (c.env.KV) {
    await c.env.KV.put(`pwd_reset:${email}`, code, { expirationTtl: 900 });
  }

  const smtpConfig = getSmtpConfig(c.env);
  const emailResult = await sendSmtpEmail(
    {
      to: email,
      subject: `Your JobWay Password Reset Code: ${code}`,
      html: getPasswordResetEmailHtml(code, email),
      text: `Your JobWay password reset code is: ${code}. Valid for 15 minutes.`,
    },
    smtpConfig
  );

  return c.json({
    success: true,
    message: emailResult.success
      ? `Password reset code sent to ${email}`
      : `Reset code generated. (SMTP status: ${emailResult.error || 'notice'})`,
    email,
    devCode: (!emailResult.success || c.env.ENVIRONMENT === 'development') ? code : undefined,
  });
});

// -------------------------------------------------------------
// 5. FORGOT PASSWORD: Verify Reset Code & Set New Password
// -------------------------------------------------------------
const forgotVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(6),
  newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
});

authRoutes.post('/forgot-password/verify', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = forgotVerifySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid parameters' }, 400);
  }

  const email = parsed.data.email.trim().toLowerCase();
  const inputCode = parsed.data.code.trim();

  if (!c.env.KV) {
    return c.json({ error: 'Server KV storage unavailable' }, 500);
  }

  const storedCode = await c.env.KV.get(`pwd_reset:${email}`);
  if (!storedCode || storedCode !== inputCode) {
    return c.json({ error: 'Invalid or expired password reset code.' }, 400);
  }

  // Hash new password
  const { hash, salt } = await hashPassword(parsed.data.newPassword);

  await c.env.DB.prepare(`
    UPDATE users SET password_hash = ?, password_salt = ?, updated_at = CURRENT_TIMESTAMP
    WHERE email = ?
  `).bind(hash, salt, email).run();

  await c.env.KV.delete(`pwd_reset:${email}`);

  return c.json({
    success: true,
    message: 'Your password has been successfully reset. You can now log in with your new password.',
  });
});

// -------------------------------------------------------------
// 6. ADMIN PASSWORD LOGIN
// -------------------------------------------------------------
authRoutes.post('/admin-login', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const password = body.password?.trim();
  const configuredPassword = c.env.ADMIN_PASSWORD || 'JobConnect@Admin2026';

  if (!password || password !== configuredPassword) {
    return c.json({ error: 'Invalid admin password. Access denied.' }, 401);
  }

  let adminUser = await c.env.DB.prepare(
    "SELECT id, email, phone, role, is_blocked, is_verified FROM users WHERE role = 'admin' LIMIT 1"
  ).first<{ id: string; email: string | null; phone: string | null; role: 'admin'; is_blocked: number; is_verified: number }>();

  if (!adminUser) {
    const adminId = 'usr_admin_01';
    await c.env.DB.prepare(
      "INSERT OR IGNORE INTO users (id, email, phone, role, is_blocked, is_verified) VALUES (?, 'admin@job-way.in', '+919999999999', 'admin', 0, 1)"
    ).bind(adminId).run();
    adminUser = {
      id: adminId,
      email: 'admin@job-way.in',
      phone: '+919999999999',
      role: 'admin',
      is_blocked: 0,
      is_verified: 1,
    };
  }

  const secret = c.env.JWT_SECRET || 'jobconnect_prod_secret_f9a8b7c6d5e4_2026_super_secure_key';
  const token = await signJwt(
    {
      userId: adminUser.id,
      email: adminUser.email || 'admin@job-way.in',
      role: 'admin',
    },
    secret,
    7 * 86400
  );

  return c.json({
    success: true,
    token,
    user: {
      id: adminUser.id,
      email: adminUser.email || 'admin@job-way.in',
      name: 'Super Administrator',
      role: 'admin',
      isVerified: true,
    },
  });
});

// -------------------------------------------------------------
// 7. CURRENT USER CONTEXT (/api/auth/me)
// -------------------------------------------------------------
authRoutes.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  const userRow = await c.env.DB.prepare(
    'SELECT id, email, phone, role, is_blocked, is_verified FROM users WHERE id = ?'
  ).bind(user.userId).first();

  if (!userRow) {
    return c.json({ error: 'User not found' }, 404);
  }

  let profile = null;
  if (user.role === 'worker') {
    profile = await c.env.DB.prepare('SELECT * FROM worker_profiles WHERE user_id = ?').bind(user.userId).first();
  } else if (user.role === 'employer') {
    profile = await c.env.DB.prepare('SELECT * FROM employer_profiles WHERE user_id = ?').bind(user.userId).first();
  }

  return c.json({
    user: userRow,
    profile,
  });
});

export default authRoutes;

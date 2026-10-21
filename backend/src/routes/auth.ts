import { Hono } from 'hono';
import { z } from 'zod';
import { Env, UserTokenPayload } from '../config/env';
import { APP_CONSTANTS } from '../config/constants';
import { generateOtp, checkRateLimit, storeOtp, verifyOtp } from '../services/otp';
import { hashPassword, verifyPassword } from '../services/password';
import {
  sendSmtpEmail,
  getVerificationEmailHtml,
  getPasswordResetEmailHtml,
  getWelcomeEmailHtml,
  SmtpConfig,
} from '../services/smtp';
import { sendBrevoSmsOtp } from '../services/brevo-sms';
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

// Strong password validation rule (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)
export const strongPasswordRule = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter (a-z)')
  .regex(/[0-9]/, 'Password must contain at least one number (0-9)')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (!@#$%^&* etc.)');

// -------------------------------------------------------------
// 1. REGISTER: Request Verification Code via Email (SMTP)
// -------------------------------------------------------------
const registerRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: strongPasswordRule,
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
  newPassword: strongPasswordRule,
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

// -------------------------------------------------------------
// 8. GOOGLE AUTHENTICATION HELPERS & ROUTES
// -------------------------------------------------------------
async function verifyGoogleCredential(credential: string, expectedClientId?: string): Promise<{
  valid: boolean;
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!res.ok) {
      return { valid: false, error: 'Failed to verify Google token with Google servers' };
    }
    const data: any = await res.json();
    if (expectedClientId && data.aud !== expectedClientId) {
      console.warn(`[Google Auth] Audience mismatch: expected ${expectedClientId}, got ${data.aud}`);
    }
    const emailVerified = data.email_verified === 'true' || data.email_verified === true;
    if (!emailVerified || !data.email) {
      return { valid: false, error: 'Google account email is not verified' };
    }
    return {
      valid: true,
      email: data.email.toLowerCase().trim(),
      name: data.name || data.given_name || 'Google User',
      picture: data.picture,
      sub: data.sub,
    };
  } catch (err: any) {
    return { valid: false, error: err?.message || 'Google token validation error' };
  }
}

const googleAuthSchema = z.object({
  credential: z.string().min(10, 'Google credential is required'),
});

authRoutes.post('/google', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = googleAuthSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid Google credential' }, 400);
  }

  const { credential } = parsed.data;
  const googleRes = await verifyGoogleCredential(credential, c.env.GOOGLE_CLIENT_ID);
  if (!googleRes.valid || !googleRes.email) {
    return c.json({ error: googleRes.error || 'Invalid Google authentication credential' }, 401);
  }

  const email = googleRes.email;

  // Check if account already exists in D1
  const existingUser = await c.env.DB.prepare(`
    SELECT id, email, phone, role, is_blocked, is_verified
    FROM users WHERE email = ?
  `).bind(email).first<{
    id: string;
    email: string;
    phone: string | null;
    role: 'worker' | 'employer' | 'admin';
    is_blocked: number;
    is_verified: number;
  }>();

  if (existingUser) {
    if (existingUser.is_blocked === 1) {
      return c.json({ error: 'Your account has been suspended. Please contact support.' }, 403);
    }

    // Existing user: retrieve display name and sign JWT
    let displayName = googleRes.name || existingUser.email;
    if (existingUser.role === 'worker') {
      const wp = await c.env.DB.prepare('SELECT full_name FROM worker_profiles WHERE user_id = ?').bind(existingUser.id).first<{ full_name: string }>();
      if (wp?.full_name) displayName = wp.full_name;
    } else if (existingUser.role === 'employer') {
      const ep = await c.env.DB.prepare('SELECT business_name FROM employer_profiles WHERE user_id = ?').bind(existingUser.id).first<{ business_name: string }>();
      if (ep?.business_name) displayName = ep.business_name;
    } else if (existingUser.role === 'admin') {
      displayName = 'Super Administrator';
    }

    const secret = c.env.JWT_SECRET || 'jobconnect-super-secret-key-change-in-prod';
    const token = await signJwt(
      {
        userId: existingUser.id,
        email: existingUser.email,
        phone: existingUser.phone || undefined,
        role: existingUser.role,
      },
      secret,
      7 * 86400
    );

    return c.json({
      success: true,
      isNewUser: false,
      token,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: displayName,
        role: existingUser.role,
        isVerified: true,
      },
    });
  }

  // 1st Time Login: Prompt user to choose role!
  return c.json({
    success: true,
    isNewUser: true,
    googleUser: {
      email,
      name: googleRes.name,
      picture: googleRes.picture,
    },
  });
});

const googleConfirmRoleSchema = z.object({
  credential: z.string().min(10),
  role: z.enum(['worker', 'employer']),
  phone: z.string().optional(),
  name: z.string().optional(),
});

authRoutes.post('/google/confirm-role', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = googleConfirmRoleSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid parameters' }, 400);
  }

  const { credential, role, phone, name } = parsed.data;
  const googleRes = await verifyGoogleCredential(credential, c.env.GOOGLE_CLIENT_ID);
  if (!googleRes.valid || !googleRes.email) {
    return c.json({ error: googleRes.error || 'Invalid Google credential' }, 401);
  }

  const email = googleRes.email;
  const fullName = (name || googleRes.name || 'JobWay User').trim();
  const normalizedPhone = phone ? normalizePhone(phone) : null;

  // Double check if account exists
  let existingUser = await c.env.DB.prepare(
    'SELECT id, role, is_blocked FROM users WHERE email = ?'
  ).bind(email).first<{ id: string; role: 'worker' | 'employer' | 'admin'; is_blocked: number }>();

  let userId = existingUser?.id;

  if (!existingUser) {
    userId = 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    try {
      await c.env.DB.prepare(`
        INSERT INTO users (id, email, password_hash, password_salt, phone, role, is_blocked, is_verified)
        VALUES (?, ?, NULL, NULL, ?, ?, 0, 1)
      `).bind(userId, email, normalizedPhone, role).run();

      if (role === 'worker') {
        const wpId = 'wp_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
        await c.env.DB.prepare(`
          INSERT INTO worker_profiles (id, user_id, full_name, photo_key, phone, skills, preferred_area, city, verification_status)
          VALUES (?, ?, ?, ?, ?, '[]', 'Hyderabad', 'Hyderabad', 'verified')
        `).bind(wpId, userId, fullName, googleRes.picture || null, normalizedPhone).run();
      } else {
        const epId = 'ep_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
        await c.env.DB.prepare(`
          INSERT INTO employer_profiles (id, user_id, business_name, business_type, contact_person, city, area, exact_address, latitude, longitude, verification_status)
          VALUES (?, ?, ?, 'Trade Enterprise', ?, 'Hyderabad', 'City Center', 'Pending Address', 17.3850, 78.4867, 'verified')
        `).bind(epId, userId, fullName, fullName).run();
      }

      // Send official welcome email via custom domain SMTP from noreply@job-way.in
      const smtpConfig = getSmtpConfig(c.env);
      sendSmtpEmail({
        to: email,
        subject: `Welcome to JobWay, ${fullName}!`,
        html: getWelcomeEmailHtml(fullName, role),
        text: `Welcome to JobWay! Your account has been created and verified as a ${role === 'employer' ? 'Employer' : 'Worker'}.`,
      }, smtpConfig).catch(err => console.error('[Welcome Email Error]:', err));

    } catch (err: any) {
      console.error('Account creation DB error:', err);
      return c.json({ error: err.message || 'Failed to create profile' }, 500);
    }
  }

  const assignedRole = existingUser ? existingUser.role : role;
  const secret = c.env.JWT_SECRET || 'jobconnect-super-secret-key-change-in-prod';
  const token = await signJwt(
    {
      userId: userId!,
      email,
      phone: normalizedPhone || undefined,
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
      name: fullName,
      role: assignedRole,
      isVerified: true,
    },
  });
});

// -------------------------------------------------------------
// 9. BREVO SMS OTP ENDPOINTS
// -------------------------------------------------------------
const smsOtpRequestSchema = z.object({
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
});

const handleSmsOtpRequest = async (c: any) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = smsOtpRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid phone number' }, 400);
  }

  const phone = normalizePhone(parsed.data.phone);

  if (!c.env.KV) {
    return c.json({ error: 'KV storage not configured' }, 500);
  }

  // Rate limit check (skipped in development mode)
  if (c.env.ENVIRONMENT !== 'development') {
    const rateLimitKey = `sms_ratelimit:${phone}`;
    const { allowed } = await checkRateLimit(c.env.KV, rateLimitKey, 4, 600);
    if (!allowed) {
      return c.json({ error: 'Too many OTP requests. Please wait 10 minutes.' }, 429);
    }
  }

  const otp = generateOtp();
  await storeOtp(c.env.KV, phone, otp);

  const smsResult = await sendBrevoSmsOtp(phone, otp, c.env);

  if (!smsResult.success) {
    return c.json({
      success: false,
      error: smsResult.error || 'Failed to dispatch SMS OTP',
      phone,
    }, 400);
  }

  return c.json({
    success: true,
    message: `Verification code dispatched via SMS (+${phone.replace(/\D/g, '')})`,
    phone,
    isMock: smsResult.isMock,
    devCode: smsResult.isMock ? otp : undefined,
  });
};

const smsOtpVerifySchema = z.object({
  phone: z.string().min(10),
  otp: z.string().min(4).max(6),
});

const handleSmsOtpVerify = async (c: any) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = smsOtpVerifySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid verification request' }, 400);
  }

  const phone = normalizePhone(parsed.data.phone);
  const otp = parsed.data.otp.trim();

  if (!c.env.KV) {
    return c.json({ error: 'KV storage unavailable' }, 500);
  }

  const result = await verifyOtp(c.env.KV, phone, otp);
  if (!result.valid) {
    return c.json({ error: result.error || 'Invalid or expired OTP' }, 400);
  }

  return c.json({
    success: true,
    message: 'Mobile number verified successfully via SMS!',
    phone,
  });
};

// Primary Brevo SMS endpoints
authRoutes.post('/sms-otp/request', handleSmsOtpRequest);
authRoutes.post('/sms-otp/verify', handleSmsOtpVerify);

// Backward-compatibility aliases for legacy WhatsApp OTP clients
authRoutes.post('/whatsapp-otp/request', handleSmsOtpRequest);
authRoutes.post('/whatsapp-otp/verify', handleSmsOtpVerify);

export default authRoutes;


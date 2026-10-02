import { Hono } from 'hono';
import { z } from 'zod';
import { Env, UserTokenPayload } from '../config/env';
import { APP_CONSTANTS } from '../config/constants';
import { generateOtp, storeOtp, verifyOtp, sendSms, checkRateLimit } from '../services/otp';
import { signJwt, authMiddleware } from '../middlewares/auth';

const authRoutes = new Hono<{ Bindings: Env; Variables: { user: UserTokenPayload } }>();

const requestOtpSchema = z.object({
  phone: z.string().min(10, 'Valid 10-digit mobile number required').max(14),
  role: z.enum(['worker', 'employer']).optional(),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().min(4).max(6),
  role: z.enum(['worker', 'employer']).optional(),
});

// Helper to normalize Indian phone numbers to +91XXXXXXXXXX
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

// 1. Request OTP
authRoutes.post('/request-otp', async (c) => {
  const body = await c.req.json();
  const parsed = requestOtpSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid phone number' }, 400);
  }

  const phone = normalizePhone(parsed.data.phone);

  // Rate limit: max 3 requests per 10 minutes
  if (c.env.KV) {
    const rateLimitKey = `otp_ratelimit:${phone}`;
    const { allowed } = await checkRateLimit(
      c.env.KV,
      rateLimitKey,
      APP_CONSTANTS.OTP.MAX_REQUESTS_PER_WINDOW,
      APP_CONSTANTS.OTP.RATE_LIMIT_WINDOW_SECONDS
    );

    if (!allowed) {
      return c.json({ error: 'Too many OTP requests. Please wait 10 minutes before requesting again.' }, 429);
    }
  }

  const otp = generateOtp();

  if (c.env.KV) {
    await storeOtp(c.env.KV, phone, otp);
  }

  // Send SMS via provider or console in dev
  await sendSms(phone, otp, c.env.SMS_API_KEY);

  return c.json({
    success: true,
    message: 'OTP sent to mobile number',
    phone,
    // If no SMS gateway configured, return OTP so user can log in without paid SMS credits
    devOtp: c.env.SMS_API_KEY ? undefined : otp,
  });
});

// 2. Verify OTP and Login/Register
authRoutes.post('/verify-otp', async (c) => {
  const body = await c.req.json();
  const parsed = verifyOtpSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid parameters' }, 400);
  }

  const phone = normalizePhone(parsed.data.phone);
  const inputOtp = parsed.data.otp.trim();
  const selectedRole = parsed.data.role || 'worker';

  // Verify OTP via KV
  if (c.env.KV) {
    const verifyResult = await verifyOtp(c.env.KV, phone, inputOtp);
    if (!verifyResult.valid) {
      return c.json({ error: verifyResult.error || 'Invalid OTP' }, 400);
    }
  } else {
    // If KV not configured, allow dev default '123456'
    if (inputOtp !== '123456') {
      return c.json({ error: 'Invalid OTP' }, 400);
    }
  }

  // Look up user in D1
  let user = await c.env.DB.prepare(
    'SELECT id, phone, role, is_blocked, is_verified FROM users WHERE phone = ?'
  ).bind(phone).first<{ id: string; phone: string; role: 'worker' | 'employer' | 'admin'; is_blocked: number; is_verified: number }>();

  if (user) {
    if (user.is_blocked === 1) {
      return c.json({ error: 'Your account has been blocked. Please contact support.' }, 403);
    }
  } else {
    // Create new user (Public sign-ups can NEVER be admin!)
    const userId = 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    const assignedRole = selectedRole === 'employer' ? 'employer' : 'worker';

    await c.env.DB.prepare(
      'INSERT INTO users (id, phone, role, is_blocked, is_verified) VALUES (?, ?, ?, 0, 0)'
    ).bind(userId, phone, assignedRole).run();

    user = {
      id: userId,
      phone,
      role: assignedRole,
      is_blocked: 0,
      is_verified: 0,
    };

    // Create initial profile row
    if (assignedRole === 'worker') {
      const wpId = 'wp_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
      await c.env.DB.prepare(`
        INSERT INTO worker_profiles (id, user_id, full_name, skills, preferred_area, city, verification_status)
        VALUES (?, ?, 'New Worker', '[]', 'Hyderabad', 'Hyderabad', 'pending')
      `).bind(wpId, userId).run();
    } else {
      const epId = 'ep_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
      await c.env.DB.prepare(`
        INSERT INTO employer_profiles (id, user_id, business_name, business_type, contact_person, city, area, exact_address, latitude, longitude, verification_status)
        VALUES (?, ?, 'My Business', 'Shop', 'Owner', 'Hyderabad', 'City Center', 'Pending Address', 17.3850, 78.4867, 'pending')
      `).bind(epId, userId).run();
    }
  }

  const secret = c.env.JWT_SECRET || 'jobconnect-super-secret-key-change-in-prod';
  const token = await signJwt(
    {
      userId: user.id,
      phone: user.phone,
      role: user.role,
    },
    secret,
    7 * 86400 // 7-day token
  );

  return c.json({
    success: true,
    token,
    user: {
      id: user.id,
      phone: user.phone,
      role: user.role,
      isVerified: user.is_verified === 1,
    },
  });
});

// 3. Current User Context
authRoutes.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  const userRow = await c.env.DB.prepare(
    'SELECT id, phone, role, is_blocked, is_verified FROM users WHERE id = ?'
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

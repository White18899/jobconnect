import { Context, Next } from 'hono';
import { Env, UserTokenPayload } from '../config/env';
import { checkRateLimit } from '../services/otp';

export function rateLimit(limit: number = 30, windowSeconds: number = 60) {
  return async (c: Context<{ Bindings: Env; Variables: { user?: UserTokenPayload } }>, next: Next) => {
    // If KV is not bound (e.g. testing without KV), skip gracefully
    if (!c.env.KV) {
      await next();
      return;
    }

    const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || '127.0.0.1';
    const user = c.get('user');
    const identifier = user ? `usr:${user.userId}` : `ip:${ip}`;
    const key = `ratelimit:${identifier}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;

    const { allowed, remaining } = await checkRateLimit(c.env.KV, key, limit, windowSeconds);

    c.header('X-RateLimit-Limit', limit.toString());
    c.header('X-RateLimit-Remaining', remaining.toString());

    if (!allowed) {
      return c.json({ error: 'Too many requests. Please slow down and try again later.' }, 429);
    }

    await next();
  };
}

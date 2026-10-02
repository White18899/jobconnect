import { Context, Next } from 'hono';
import { Env, UserTokenPayload } from '../config/env';

// Lightweight Web Crypto JWT implementation for Cloudflare Workers
async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signJwt(payload: UserTokenPayload, secret: string, expiresInSec: number = 86400): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSec,
  };

  const enc = new TextEncoder();
  const b64Header = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const b64Payload = btoa(JSON.stringify(fullPayload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const data = `${b64Header}.${b64Payload}`;

  const key = await getKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const b64Sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${b64Sig}`;
}

export async function verifyJwt(token: string, secret: string): Promise<UserTokenPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [b64Header, b64Payload, b64Sig] = parts;
    const data = `${b64Header}.${b64Payload}`;
    const enc = new TextEncoder();

    // Convert signature from base64url to Uint8Array
    const sigStr = atob(b64Sig.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBytes = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) {
      sigBytes[i] = sigStr.charCodeAt(i);
    }

    const key = await getKey(secret);
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(data));
    if (!valid) return null;

    const payloadStr = atob(b64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadStr) as UserTokenPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

export async function authMiddleware(c: Context<{ Bindings: Env; Variables: { user: UserTokenPayload } }>, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token format' }, 401);
  }

  const token = authHeader.substring(7).trim();
  const secret = c.env.JWT_SECRET || 'jobconnect-super-secret-key-change-in-prod';
  const payload = await verifyJwt(token, secret);

  if (!payload) {
    return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401);
  }

  // Check if user is blocked in D1
  if (c.env.DB) {
    const userRow = await c.env.DB.prepare('SELECT is_blocked FROM users WHERE id = ?').bind(payload.userId).first<{ is_blocked: number }>();
    if (userRow && userRow.is_blocked === 1) {
      return c.json({ error: 'Account suspended. Contact support.' }, 403);
    }
  }

  c.set('user', payload);
  await next();
}

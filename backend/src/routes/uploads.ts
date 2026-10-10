import { Hono } from 'hono';
import { z } from 'zod';
import { Env, UserTokenPayload } from '../config/env';
import { authMiddleware } from '../middlewares/auth';
import { generateStorageKey } from '../services/storage';

const uploadRoutes = new Hono<{ Bindings: Env; Variables: { user: UserTokenPayload } }>();

const signSchema = z.object({
  category: z.enum(['workers', 'employers', 'shops', 'payments', 'docs']),
  filename: z.string().min(1),
  contentType: z.string().min(3),
});

// 1. Generate Upload Key & URL Metadata
uploadRoutes.post('/uploads/sign', authMiddleware, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const parsed = signSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid parameters' }, 400);
  }

  const { category, filename, contentType } = parsed.data;
  const key = generateStorageKey(category, user.userId, filename);

  // In Cloudflare Workers, we provide the key and direct PUT endpoint
  const uploadUrl = `/api/uploads/file/${encodeURIComponent(key)}`;

  return c.json({
    key,
    uploadUrl,
    contentType,
    expiresIn: 900,
  });
});

// 2. Direct binary file upload to R2
uploadRoutes.put('/uploads/file/:key', authMiddleware, async (c) => {
  const user = c.get('user');
  const rawKey = c.req.param('key') || '';
  const key = decodeURIComponent(rawKey);

  // Ensure user owns this key or is admin
  if (!key.includes(user.userId) && user.role !== 'admin') {
    return c.json({ error: 'Unauthorized to upload to this path' }, 403);
  }

  const contentType = c.req.header('Content-Type') || 'application/octet-stream';
  const arrayBuffer = await c.req.arrayBuffer();

  if (c.env.FILES) {
    await c.env.FILES.put(key, arrayBuffer, {
      httpMetadata: { contentType },
      customMetadata: { uploadedBy: user.userId, uploadedAt: new Date().toISOString() },
    });
  }

  return c.json({ success: true, key, size: arrayBuffer.byteLength });
});

// 3. Authenticated file access (Owner or Admin only)
uploadRoutes.get('/uploads/file/:key', authMiddleware, async (c) => {
  const user = c.get('user');
  const rawKey = c.req.param('key') || '';
  const key = decodeURIComponent(rawKey);

  // Security check: Only resource owner or admin can retrieve private verification docs
  if (!key.includes(user.userId) && user.role !== 'admin') {
    return c.json({ error: 'Access denied to private document' }, 403);
  }

  if (!c.env.FILES) {
    return c.json({ error: 'R2 storage not configured' }, 500);
  }

  const object = await c.env.FILES.get(key);
  if (!object) {
    return c.json({ error: 'File not found' }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'private, max-age=300');

  return new Response(object.body, { headers });
});

export default uploadRoutes;

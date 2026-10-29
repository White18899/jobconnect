import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Env, UserTokenPayload } from './config/env';
import { errorHandler } from './middlewares/error';
import authRoutes from './routes/auth';
import workerRoutes from './routes/worker';
import employerRoutes from './routes/employer';
import paymentRoutes from './routes/payments';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/uploads';
import chatRoutes from './routes/chat';

const app = new Hono<{ Bindings: Env; Variables: { user: UserTokenPayload } }>();

// Logger
app.use('*', logger());

// Restrictive CORS
app.use('*', async (c, next) => {
  const allowedOrigin = c.env.FRONTEND_URL || '*';
  const corsMiddleware = cors({
    origin: allowedOrigin === '*' ? '*' : (origin) => {
      // Strict regex for permitted origins
      const ALLOWED_ORIGIN_REGEX = /^(https:\/\/(www\.)?job-way\.in|https:\/\/[a-z0-9-]+\.pages\.dev|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/;
      if (!origin || ALLOWED_ORIGIN_REGEX.test(origin)) {
        return origin;
      }
      return allowedOrigin !== '*' ? allowedOrigin : 'https://job-way.in';
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Content-Length', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400,
    credentials: true,
  });
  return corsMiddleware(c, next);
});

// Global Error Handler
app.onError(errorHandler);

// Health check
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'JobConnect API Engine',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT || 'development',
  });
});

// Mount Routes with /api prefix
app.route('/api/auth', authRoutes);
app.route('/api', workerRoutes);
app.route('/api', employerRoutes);
app.route('/api', paymentRoutes);
app.route('/api', adminRoutes);
app.route('/api', uploadRoutes);
app.route('/api', chatRoutes);

// Fallback 404
app.notFound((c) => {
  return c.json({ error: 'Endpoint not found', path: c.req.path }, 404);
});

export default app;

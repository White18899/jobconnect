import { Context } from 'hono';

export function errorHandler(err: Error, c: Context) {
  console.error('[API ERROR]:', err);
  return c.json(
    {
      error: err.message || 'Internal Server Error',
      status: 500,
    },
    500
  );
}

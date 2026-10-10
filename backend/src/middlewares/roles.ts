import { Context, Next } from 'hono';
import { Env, UserTokenPayload } from '../config/env';

export function roleGuard(allowedRoles: Array<'worker' | 'employer' | 'admin'>) {
  return async (c: Context<{ Bindings: Env; Variables: { user: UserTokenPayload } }>, next: Next) => {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Unauthorized: User context missing' }, 401);
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json({
        error: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Your role is '${user.role}'`
      }, 403);
    }

    await next();
  };
}

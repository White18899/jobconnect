export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  FILES: R2Bucket;
  JWT_SECRET?: string;
  SMS_API_KEY?: string;
  ADMIN_PASSWORD?: string;
  UPI_ID?: string;
  ENVIRONMENT?: string;
  FRONTEND_URL?: string;
}

export interface UserTokenPayload {
  userId: string;
  phone: string;
  role: 'worker' | 'employer' | 'admin';
  exp?: number;
  iat?: number;
}

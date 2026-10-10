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
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;
  SMTP_SECURE?: string;
}

export interface UserTokenPayload {
  userId: string;
  email?: string;
  phone?: string;
  role: 'worker' | 'employer' | 'admin';
  exp?: number;
  iat?: number;
}


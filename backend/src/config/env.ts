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
  GOOGLE_CLIENT_ID?: string;
  BREVO_API_KEY?: string;
  BREVO_SMS_SENDER?: string;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  WHATSAPP_CLOUD_API_TOKEN?: string;
  WHATSAPP_TEMPLATE_NAME?: string;
  GEMINI_API_KEY?: string;
}


export interface UserTokenPayload {
  userId: string;
  email?: string;
  phone?: string;
  role: 'worker' | 'employer' | 'admin';
  exp?: number;
  iat?: number;
}


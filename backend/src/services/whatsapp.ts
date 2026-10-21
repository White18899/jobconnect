/**
 * JobConnect / JobWay WhatsApp Service (Migrated to Brevo SMS)
 * Dispatches Authentication OTPs using Brevo Transactional SMS.
 * Kept for backward compatibility.
 */

import { Env } from '../config/env';
import { sendBrevoSmsOtp, BrevoSmsSendResult } from './brevo-sms';

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  isMock?: boolean;
}

export async function sendWhatsAppOtp(
  phone: string,
  otp: string,
  env: Env
): Promise<WhatsAppSendResult> {
  console.log(`[WhatsApp -> Brevo SMS Migration] Routing OTP request to Brevo SMS for: ${phone}`);
  const result: BrevoSmsSendResult = await sendBrevoSmsOtp(phone, otp, env);
  return {
    success: result.success,
    messageId: result.messageId ? String(result.messageId) : undefined,
    error: result.error,
    isMock: result.isMock,
  };
}


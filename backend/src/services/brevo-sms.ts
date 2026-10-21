/**
 * JobConnect / JobWay Brevo Transactional SMS Service
 * Dispatches Authentication OTP SMS messages via Brevo API v3 (https://api.brevo.com/v3/transactionalSMS/send).
 */

import { Env } from '../config/env';

export interface BrevoSmsSendResult {
  success: boolean;
  messageId?: string | number;
  reference?: string;
  error?: string;
  isMock?: boolean;
  remainingCredits?: number;
}

/**
 * Normalizes phone numbers to standard international format without '+' or spaces
 * as required by Brevo Transactional SMS API (e.g. 919849123434 for India).
 */
export function formatBrevoRecipient(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  // 10 digits -> Indian mobile number
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }
  // 11 digits starting with 0 -> Indian mobile with leading trunk prefix
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return `91${digitsOnly.slice(1)}`;
  }
  return digitsOnly;
}

/**
 * Dispatches an OTP via Brevo Transactional SMS API v3.
 * Falls back gracefully to mock in development or when no API key is set.
 */
export async function sendBrevoSmsOtp(
  phone: string,
  otp: string,
  env: Env
): Promise<BrevoSmsSendResult> {
  const recipient = formatBrevoRecipient(phone);
  const apiKey = (env.BREVO_API_KEY || env.SMS_API_KEY || '').trim();
  const sender = (env.BREVO_SMS_SENDER || 'JobWay').trim().slice(0, 11);

  console.log(`[Brevo SMS Gateway] Preparing OTP dispatch to: +${recipient}`);

  // If Brevo API key is not configured, fallback gracefully with developer log
  if (!apiKey || apiKey === '' || apiKey.toLowerCase().includes('mock')) {
    console.log(`[Brevo SMS MOCK Gateway] OTP for +${recipient} is: ${otp}`);
    return {
      success: true,
      isMock: true,
      messageId: `mock_sms_${Date.now()}`,
    };
  }

  try {
    const url = 'https://api.brevo.com/v3/transactionalSMS/send';
    const payload = {
      sender,
      recipient,
      content: `Your JobWay verification code is: ${otp}. Valid for 10 minutes. Please do not share this code.`,
      type: 'transactional',
      tag: 'otpVerification',
      unicodeEnabled: false,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data: any = await res.json().catch(() => ({}));

    if (!res.ok) {
      let errorMsg = data?.message || `Brevo SMS dispatch error (${res.status})`;
      if (data?.code === 'not_enough_credits') {
        errorMsg = 'SMS provider has insufficient credits. Please contact support or use email verification.';
      } else if (data?.code === 'unauthorized' || res.status === 401) {
        errorMsg = 'Brevo API authentication error. Please verify your BREVO_API_KEY.';
      } else if (data?.code === 'invalid_parameter') {
        errorMsg = data?.message || 'Invalid phone number or SMS parameters.';
      }
      console.error('[Brevo SMS Error]', JSON.stringify(data));
      return {
        success: false,
        error: errorMsg,
      };
    }

    const messageId = data?.messageId || data?.reference;
    return {
      success: true,
      messageId,
      reference: data?.reference,
      remainingCredits: data?.remainingCredits,
    };
  } catch (err: any) {
    console.error('[Brevo SMS Exception]', err.message);
    return {
      success: false,
      error: err.message || 'Network exception dispatching Brevo SMS',
    };
  }
}

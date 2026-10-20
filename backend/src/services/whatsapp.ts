/**
 * JobConnect / JobWay WhatsApp Cloud API Service
 * Dispatches Authentication OTP templates via Meta WhatsApp Business Cloud API.
 */

import { Env } from '../config/env';

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
  // Normalize phone for WhatsApp international format (e.g., 919849123434)
  const digitsOnly = phone.replace(/\D/g, '');
  const cleanPhone = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;

  console.log(`[WhatsApp Gateway] Dispatching OTP to: +${cleanPhone}`);

  const token = env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = env.WHATSAPP_TEMPLATE_NAME || 'jobway_otp_code';

  // If Meta credentials are not configured yet, fallback gracefully with developer log
  if (!token || !phoneNumberId || token.includes('mock') || token === '') {
    console.log(`[WhatsApp MOCK Gateway] OTP for +${cleanPhone} is: ${otp}`);
    return {
      success: true,
      isMock: true,
      messageId: `mock_wa_${Date.now()}`,
    };
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: otp,
                },
              ],
            },
            {
              type: 'button',
              sub_type: 'url',
              index: '0',
              parameters: [
                {
                  type: 'text',
                  text: otp,
                },
              ],
            },
          ],
        },
      }),
    });

    const data: any = await res.json();

    if (!res.ok) {
      const errorMsg = data?.error?.message || `Meta WhatsApp API error (${res.status})`;
      console.error('[WhatsApp Error]', JSON.stringify(data));
      return {
        success: false,
        error: errorMsg,
      };
    }

    const messageId = data?.messages?.[0]?.id;
    return {
      success: true,
      messageId,
    };
  } catch (err: any) {
    console.error('[WhatsApp Exception]', err.message);
    return {
      success: false,
      error: err.message || 'Network exception dispatching WhatsApp message',
    };
  }
}

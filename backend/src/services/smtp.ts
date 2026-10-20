/**
 * JobConnect / JobWay SMTP Client for Cloudflare Workers
 * Communicates over TCP/TLS sockets using native 'cloudflare:sockets'.
 * Designed for job-way.in custom domain email verification.
 */

import { connect } from 'cloudflare:sockets';

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  secure?: boolean; // true for port 465 (SSL), false for port 587 (STARTTLS)
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SmtpResponse {
  code: number;
  message: string;
}

class SmtpSocketClient {
  private socket: any;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private decoder = new TextDecoder();
  private encoder = new TextEncoder();
  private buffer = '';

  constructor(private config: SmtpConfig) {}

  async connect(timeoutMs: number = 8000): Promise<void> {
    const isPort465 = this.config.port === 465 || this.config.secure === true;
    const socketOptions: any = {
      allowHalfOpen: false,
      secureTransport: isPort465 ? 'on' : 'starttls',
    };

    this.socket = connect(
      { hostname: this.config.host, port: this.config.port },
      socketOptions
    );

    this.reader = this.socket.readable.getReader();
    this.writer = this.socket.writable.getWriter();

    // Read initial greeting from SMTP server (expect 220)
    const greeting = await this.readReply(timeoutMs);
    if (greeting.code !== 220) {
      throw new Error(`SMTP Greeting failed: ${greeting.code} ${greeting.message}`);
    }

    // Send EHLO
    await this.sendCommand('EHLO job-way.in');
    const ehloReply = await this.readReply(timeoutMs);
    if (ehloReply.code !== 250) {
      throw new Error(`SMTP EHLO failed: ${ehloReply.code} ${ehloReply.message}`);
    }

    // Handle STARTTLS for port 587 if not already TLS
    if (!isPort465 && this.socket.secureTransport === 'starttls' && !this.socket.upgraded) {
      await this.sendCommand('STARTTLS');
      const starttlsReply = await this.readReply(timeoutMs);
      if (starttlsReply.code === 220) {
        if (this.reader) {
          this.reader.releaseLock();
          this.reader = null;
        }
        if (this.writer) {
          this.writer.releaseLock();
          this.writer = null;
        }

        this.socket = this.socket.startTls({ expectedServerHostname: this.config.host });
        this.reader = this.socket.readable.getReader();
        this.writer = this.socket.writable.getWriter();
        this.buffer = '';

        await this.sendCommand('EHLO job-way.in');
        await this.readReply(timeoutMs);
      }
    }
  }

  async authenticate(timeoutMs: number = 8000): Promise<void> {
    if (!this.config.user || !this.config.pass) {
      return; // Anonymous SMTP if no credentials
    }

    await this.sendCommand('AUTH LOGIN');
    const authStart = await this.readReply(timeoutMs);
    if (authStart.code !== 334) {
      throw new Error(`SMTP AUTH LOGIN refused: ${authStart.code} ${authStart.message}`);
    }

    // Send Base64 Username
    await this.sendCommand(btoa(this.config.user));
    const userReply = await this.readReply(timeoutMs);
    if (userReply.code !== 334) {
      throw new Error(`SMTP Username rejected: ${userReply.code} ${userReply.message}`);
    }

    // Send Base64 Password
    await this.sendCommand(btoa(this.config.pass));
    const passReply = await this.readReply(timeoutMs);
    if (passReply.code !== 235) {
      throw new Error(`SMTP Authentication failed: ${passReply.code} ${passReply.message}`);
    }
  }

  async sendMail(options: SendEmailOptions, timeoutMs: number = 10000): Promise<string> {
    // Extract raw email from sender e.g. "JobWay <noreply@job-way.in>" -> "noreply@job-way.in"
    const senderEmailMatch = this.config.from.match(/<([^>]+)>/);
    const senderAddress = senderEmailMatch ? senderEmailMatch[1] : this.config.from.trim();

    // MAIL FROM
    await this.sendCommand(`MAIL FROM:<${senderAddress}>`);
    const mailReply = await this.readReply(timeoutMs);
    if (mailReply.code !== 250) {
      throw new Error(`SMTP MAIL FROM rejected: ${mailReply.code} ${mailReply.message}`);
    }

    // RCPT TO
    await this.sendCommand(`RCPT TO:<${options.to.trim()}>`);
    const rcptReply = await this.readReply(timeoutMs);
    if (rcptReply.code !== 250 && rcptReply.code !== 251) {
      throw new Error(`SMTP RCPT TO rejected: ${rcptReply.code} ${rcptReply.message}`);
    }

    // DATA
    await this.sendCommand('DATA');
    const dataReply = await this.readReply(timeoutMs);
    if (dataReply.code !== 354) {
      throw new Error(`SMTP DATA rejected: ${dataReply.code} ${dataReply.message}`);
    }

    const messageId = `<${crypto.randomUUID()}@job-way.in>`;
    const dateStr = new Date().toUTCString();

    const headers = [
      `From: ${this.config.from}`,
      `To: ${options.to.trim()}`,
      `Subject: ${options.subject}`,
      `Date: ${dateStr}`,
      `Message-ID: ${messageId}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      'X-Mailer: JobWay Edge SMTP Engine (Cloudflare Workers)',
    ].join('\r\n');

    // Dot-stuffing for SMTP content transparency
    const escapedHtml = options.html.replace(/\r?\n\./g, '\r\n..');
    const fullPayload = `${headers}\r\n\r\n${escapedHtml}\r\n.\r\n`;

    await this.sendRaw(fullPayload);
    const sendReply = await this.readReply(timeoutMs);
    if (sendReply.code !== 250) {
      throw new Error(`SMTP Send Data rejected: ${sendReply.code} ${sendReply.message}`);
    }

    // QUIT
    try {
      await this.sendCommand('QUIT');
      await this.readReply(2000).catch(() => {});
    } catch {}

    return messageId;
  }

  async close(): Promise<void> {
    try {
      if (this.reader) {
        this.reader.releaseLock();
      }
      if (this.writer) {
        this.writer.releaseLock();
      }
      if (this.socket) {
        await this.socket.close();
      }
    } catch {}
  }

  private async sendCommand(cmd: string): Promise<void> {
    await this.sendRaw(`${cmd}\r\n`);
  }

  private async sendRaw(data: string): Promise<void> {
    if (!this.writer) throw new Error('SMTP writer not initialized');
    await this.writer.write(this.encoder.encode(data));
  }

  private async readReply(timeoutMs: number): Promise<SmtpResponse> {
    if (!this.reader) throw new Error('SMTP reader not initialized');

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('SMTP response timed out')), timeoutMs)
    );

    const readLoop = async (): Promise<SmtpResponse> => {
      while (true) {
        const lineEnd = this.buffer.indexOf('\r\n');
        if (lineEnd !== -1) {
          const line = this.buffer.substring(0, lineEnd);
          this.buffer = this.buffer.substring(lineEnd + 2);

          // Standard SMTP reply is 3 digits followed by a space for final line, or hyphen for continuation
          const codeMatch = line.match(/^(\d{3})([ -])(.*)$/);
          if (codeMatch) {
            const code = parseInt(codeMatch[1], 10);
            const isContinuation = codeMatch[2] === '-';
            const message = codeMatch[3];

            if (!isContinuation) {
              return { code, message };
            }
          }
          continue;
        }

        const { value, done } = await this.reader!.read();
        if (done) {
          throw new Error('SMTP socket closed by remote host');
        }
        if (value) {
          this.buffer += this.decoder.decode(value, { stream: true });
        }
      }
    };

    return Promise.race([readLoop(), timeoutPromise]);
  }
}

/**
 * Send an email via SMTP.
 */
export async function sendSmtpEmail(
  options: SendEmailOptions,
  config: SmtpConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // If SMTP is not yet configured or missing credentials, log and return graceful error
  if (!config.host || !config.from) {
    console.warn('[SMTP Notice] SMTP host or from address not configured in environment.');
    return {
      success: false,
      error: 'SMTP server configuration is incomplete on server.',
    };
  }

  const client = new SmtpSocketClient(config);
  try {
    await client.connect(8000);
    await client.authenticate(8000);
    const messageId = await client.sendMail(options, 10000);
    return { success: true, messageId };
  } catch (err: any) {
    console.error('[SMTP Error] Failed to send email via SMTP:', err?.message || err);
    return {
      success: false,
      error: err?.message || 'Failed to send email via SMTP',
    };
  } finally {
    await client.close();
  }
}

/**
 * HTML Email Template for Registration Verification Code
 */
export function getVerificationEmailHtml(code: string, recipientEmail: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your JobWay Account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 560px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 30px 24px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.02em;">JobWay</h1>
      <p style="margin: 6px 0 0; color: #bfdbfe; font-size: 13px; font-weight: 600;">job-way.in • India's Verified Employment Platform</p>
    </div>
    <div style="padding: 34px 28px;">
      <h2 style="margin: 0 0 12px; font-size: 19px; font-weight: 800; color: #0f172a;">Confirm Your Email Address</h2>
      <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
        Thank you for joining <strong>JobWay</strong>. Please use the 6-digit verification code below to verify your email (<strong>${recipientEmail}</strong>) and complete your registration.
      </p>
      
      <div style="background: #eff6ff; border: 2px dashed #93c5fd; border-radius: 12px; padding: 22px; text-align: center; margin: 26px 0;">
        <div style="font-size: 12px; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Your 6-Digit Verification Code</div>
        <div style="font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #1e3a8a; font-family: monospace;">${code}</div>
      </div>

      <div style="background: #f8fafc; border-left: 4px solid #2563eb; border-radius: 4px; padding: 12px 14px; margin-bottom: 22px;">
        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #334155;">
          ⏱️ <strong>Valid for 15 minutes:</strong> Your account will only be created and activated once this code is entered on the signup screen.
        </p>
      </div>

      <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
        If you did not initiate this request, you can safely ignore this email. No account will be created without this verification.
      </p>
    </div>
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.5;">
      JobWay (job-way.in). Direct trade connections with zero agency commissions.<br>
      This is an automated system notification sent from noreply@job-way.in.
    </div>
  </div>
</body>
</html>`;
}

/**
 * HTML Email Template for Password Reset
 */
export function getPasswordResetEmailHtml(code: string, recipientEmail: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your JobWay Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 560px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 30px 24px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.02em;">JobWay</h1>
      <p style="margin: 6px 0 0; color: #bfdbfe; font-size: 13px; font-weight: 600;">job-way.in • Password Assistance</p>
    </div>
    <div style="padding: 34px 28px;">
      <h2 style="margin: 0 0 12px; font-size: 19px; font-weight: 800; color: #0f172a;">Password Reset Code</h2>
      <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
        We received a request to reset the password for your JobWay account (<strong>${recipientEmail}</strong>). Please enter the 6-digit code below to set a new password:
      </p>
      
      <div style="background: #fef2f2; border: 2px dashed #fca5a5; border-radius: 12px; padding: 22px; text-align: center; margin: 26px 0;">
        <div style="font-size: 12px; font-weight: 800; color: #dc2626; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Your Reset Code</div>
        <div style="font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #991b1b; font-family: monospace;">${code}</div>
      </div>

      <div style="background: #f8fafc; border-left: 4px solid #ef4444; border-radius: 4px; padding: 12px 14px; margin-bottom: 22px;">
        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #334155;">
          ⏱️ <strong>Valid for 15 minutes:</strong> If you did not request a password reset, please change your password immediately or disregard this email.
        </p>
      </div>
    </div>
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 11px; color: #94a3b8;">
      JobWay (job-way.in). All rights reserved.
    </div>
  </div>
</body>
</html>`;
}

/**
 * HTML Email Template for New User Welcome (Google Sign-In / Direct Registration)
 */
export function getWelcomeEmailHtml(name: string, role: 'worker' | 'employer'): string {
  const roleTitle = role === 'employer' ? 'Employer / Hiring Partner' : 'Verified Trade Professional';
  const roleDescription = role === 'employer' 
    ? 'You can now publish trade openings, browse verified candidates, and hire technical workers directly with zero platform commissions.'
    : 'You can now complete your technical profile, showcase your skills, and get discovered by local employers for high-paying trade jobs.';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to JobWay</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 560px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center;">
      <h1 style="margin: 0; color: #f59e0b; font-size: 26px; font-weight: 800; letter-spacing: -0.02em;">JobWay</h1>
      <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px; font-weight: 600;">job-way.in • Direct Employment Network</p>
    </div>
    <div style="padding: 34px 28px;">
      <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 800; color: #0f172a;">Welcome to JobWay, ${name}!</h2>
      <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #475569;">
        Your account has been successfully created and verified on <strong>JobWay</strong> as a <strong>${roleTitle}</strong>.
      </p>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Your Next Step:</div>
        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748b;">
          ${roleDescription}
        </p>
      </div>

      <div style="text-align: center; margin: 28px 0 16px;">
        <a href="https://job-way.in/login.html" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; letter-spacing: -0.01em;">
          Go to Your Dashboard →
        </a>
      </div>
    </div>
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 11px; color: #94a3b8;">
      JobWay (job-way.in) • Official transactional email from noreply@job-way.in
    </div>
  </div>
</body>
</html>`;
}


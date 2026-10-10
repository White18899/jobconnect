import { Hono } from 'hono';
import { z } from 'zod';
import { Env, UserTokenPayload } from '../config/env';
import { APP_CONSTANTS } from '../config/constants';
import { authMiddleware } from '../middlewares/auth';
import { roleGuard } from '../middlewares/roles';

const paymentRoutes = new Hono<{ Bindings: Env; Variables: { user: UserTokenPayload } }>();

// 1. Create Payment Order / Retrieve UPI QR Data
paymentRoutes.post('/applications/:id/payment', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  const appId = c.req.param('id');
  const employer = await c.env.DB.prepare('SELECT id FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!employer) return c.json({ error: 'Employer profile not found' }, 401);

  // Validate application
  const app = await c.env.DB.prepare(`
    SELECT a.id, a.status, a.job_id, a.worker_id, j.title as job_title, wp.full_name as worker_name
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN worker_profiles wp ON a.worker_id = wp.id
    WHERE a.id = ? AND a.employer_id = ?
  `).bind(appId, employer.id).first<any>();

  if (!app) {
    return c.json({ error: 'Application not found or unauthorized' }, 404);
  }

  // Check if an existing payment order exists for this application
  let payment = await c.env.DB.prepare(
    'SELECT * FROM payments WHERE application_id = ?'
  ).bind(appId).first<any>();

  const upiId = c.env.UPI_ID || APP_CONSTANTS.DEFAULT_UPI_ID;
  const payeeName = APP_CONSTANTS.DEFAULT_PAYEE_NAME;
  const amount = APP_CONSTANTS.VERIFICATION_FEE_INR;

  if (!payment) {
    // Generate unique order code: JC-<YEAR><MONTH>-<RANDOM>
    const now = new Date();
    const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderCode = `JC-${ym}-${randPart}`;
    const paymentId = 'pay_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);

    await c.env.DB.prepare(`
      INSERT INTO payments (id, application_id, employer_id, amount, order_code, status)
      VALUES (?, ?, ?, ?, ?, 'awaiting_payment')
    `).bind(paymentId, appId, employer.id, amount, orderCode).run();

    payment = {
      id: paymentId,
      application_id: appId,
      employer_id: employer.id,
      amount,
      order_code: orderCode,
      status: 'awaiting_payment',
    };
  }

  // Construct UPI payment link & QR data
  // Format: upi://pay?pa={UPI_ID}&pn={NAME}&am={AMOUNT}&cu=INR&tn={ORDER_CODE}
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(payment.order_code)}`;

  return c.json({
    paymentId: payment.id,
    orderCode: payment.order_code,
    amount: payment.amount,
    currency: 'INR',
    upiId,
    payeeName,
    upiUrl,
    status: payment.status,
    application: {
      id: app.id,
      jobTitle: app.job_title,
      workerName: app.worker_name,
    },
    refundPolicy: 'Full ₹499 refund if verification is rejected by admin. No refund once worker contact is unlocked.',
  });
});

// 2. Submit Payment Verification (UTR + Screenshot)
const submitPaymentSchema = z.object({
  upi_ref: z.string().min(10, 'Valid 12-digit UTR reference required').max(22),
  screenshot_key: z.string().optional(),
});

paymentRoutes.post('/payments/:id/submit', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  const paymentId = c.req.param('id');
  const employer = await c.env.DB.prepare('SELECT id FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!employer) return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.json();
  const parsed = submitPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid UTR reference' }, 400);
  }

  const utrClean = parsed.data.upi_ref.trim().toUpperCase();

  // Enforce UNIQUE constraint check on UTR across all payments
  const existingUtr = await c.env.DB.prepare(
    'SELECT id FROM payments WHERE upi_ref = ? AND id != ?'
  ).bind(utrClean, paymentId).first();

  if (existingUtr) {
    return c.json({
      error: 'This UPI reference (UTR) has already been used for another verification. Duplicate payments are not allowed.'
    }, 409);
  }

  // Get current payment
  const payment = await c.env.DB.prepare(
    'SELECT * FROM payments WHERE id = ? AND employer_id = ?'
  ).bind(paymentId, employer.id).first<any>();

  if (!payment) {
    return c.json({ error: 'Payment record not found' }, 404);
  }

  // Update payment status to pending_verification
  await c.env.DB.prepare(`
    UPDATE payments SET
      upi_ref = ?,
      screenshot_key = COALESCE(?, screenshot_key),
      status = 'pending_verification',
      submitted_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(utrClean, parsed.data.screenshot_key, paymentId).run();

  // Update application status to pending_verification
  await c.env.DB.prepare(`
    UPDATE applications SET
      status = 'pending_verification',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(payment.application_id).run();

  // Create notification for admin
  const notifId = 'notif_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  await c.env.DB.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, metadata_json)
    VALUES (?, ?, 'Payment Submitted', 'Verification fee ₹499 submitted with UTR: ' || ?, 'payment', ?)
  `).bind(
    notifId,
    user.userId,
    utrClean,
    JSON.stringify({ paymentId, applicationId: payment.application_id })
  ).run();

  return c.json({
    success: true,
    message: 'Payment proof submitted. Our admin team will verify the transaction within 1-2 hours.',
    status: 'pending_verification',
    utr: utrClean,
  });
});

// 3. Get Payment Status
paymentRoutes.get('/payments/:id', authMiddleware, async (c) => {
  const paymentId = c.req.param('id');
  const payment = await c.env.DB.prepare(`
    SELECT p.*, a.job_id, a.worker_id, j.title as job_title, wp.full_name as worker_name
    FROM payments p
    JOIN applications a ON p.application_id = a.id
    JOIN jobs j ON a.job_id = j.id
    JOIN worker_profiles wp ON a.worker_id = wp.id
    WHERE p.id = ?
  `).bind(paymentId).first<any>();

  if (!payment) {
    return c.json({ error: 'Payment not found' }, 404);
  }

  return c.json({ payment });
});

export default paymentRoutes;

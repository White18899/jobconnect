import { Hono } from 'hono';
import { z } from 'zod';
import { Env, UserTokenPayload } from '../config/env';
import { authMiddleware } from '../middlewares/auth';
import { roleGuard } from '../middlewares/roles';
import { logAdminAudit } from '../services/audit';

const adminRoutes = new Hono<{ Bindings: Env; Variables: { user: UserTokenPayload } }>();

// All admin routes require admin role
adminRoutes.use('*', authMiddleware, roleGuard(['admin']));

// 1. Admin Dashboard Metrics
adminRoutes.get('/admin/dashboard', async (c) => {
  const pendingVerifications = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM payments WHERE status = 'pending_verification'"
  ).first<{ count: number }>();

  const activeJobs = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM jobs WHERE status = 'open'"
  ).first<{ count: number }>();

  const totalWorkers = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM users WHERE role = 'worker'"
  ).first<{ count: number }>();

  const totalEmployers = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM users WHERE role = 'employer'"
  ).first<{ count: number }>();

  const totalRevenue = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'successful'"
  ).first<{ total: number }>();

  const pendingRefunds = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM payments WHERE status = 'rejected' AND refund_status != 'completed'"
  ).first<{ count: number }>();

  return c.json({
    metrics: {
      pendingVerifications: pendingVerifications?.count || 0,
      activeJobs: activeJobs?.count || 0,
      totalWorkers: totalWorkers?.count || 0,
      totalEmployers: totalEmployers?.count || 0,
      totalRevenue: totalRevenue?.total || 0,
      pendingRefunds: pendingRefunds?.count || 0,
    }
  });
});

// 2. Verification Queue
adminRoutes.get('/admin/verifications', async (c) => {
  const { status = 'pending_verification' } = c.req.query();

  const { results } = await c.env.DB.prepare(`
    SELECT
      p.id as payment_id, p.amount, p.order_code, p.upi_ref, p.screenshot_key, p.status as payment_status,
      p.submitted_at, p.reject_reason, p.refund_status,
      a.id as application_id, a.status as application_status, a.applied_at,
      j.id as job_id, j.title as job_title, j.category as job_category,
      wp.id as worker_id, wp.full_name as worker_name, wp.skills as worker_skills,
      wp.id_proof_type, wp.id_number_masked, wp.id_doc_key, wp.selfie_key,
      uw.phone as worker_phone,
      ep.id as employer_id, ep.business_name, ep.contact_person, ep.area, ep.city,
      ep.exact_address, ep.business_proof_type, ep.business_proof_key, ep.shop_photo_key,
      ue.phone as employer_phone
    FROM payments p
    JOIN applications a ON p.application_id = a.id
    JOIN jobs j ON a.job_id = j.id
    JOIN worker_profiles wp ON a.worker_id = wp.id
    JOIN users uw ON wp.user_id = uw.id
    JOIN employer_profiles ep ON p.employer_id = ep.id
    JOIN users ue ON ep.user_id = ue.id
    WHERE p.status = ? OR ? = 'all'
    ORDER BY p.submitted_at DESC
  `).bind(status, status).all();

  return c.json({ verifications: results || [] });
});

// 3. Verification Detail View
adminRoutes.get('/admin/verifications/:id', async (c) => {
  const paymentId = c.req.param('id');

  const detail = await c.env.DB.prepare(`
    SELECT
      p.id as payment_id, p.amount, p.order_code, p.upi_ref, p.screenshot_key, p.status as payment_status,
      p.submitted_at, p.reviewed_at, p.reviewed_by, p.reject_reason, p.refund_status, p.refund_ref,
      a.id as application_id, a.status as application_status,
      j.id as job_id, j.title as job_title, j.category, j.salary_min, j.salary_max,
      wp.id as worker_id, wp.full_name as worker_name, wp.skills, wp.experience_years,
      wp.preferred_area, wp.city as worker_city, wp.id_proof_type, wp.id_number_masked,
      wp.id_doc_key, wp.selfie_key, wp.skill_proof_key,
      uw.phone as worker_phone,
      ep.id as employer_id, ep.business_name, ep.business_type, ep.contact_person, ep.area, ep.city as employer_city,
      ep.exact_address, ep.latitude, ep.longitude, ep.business_proof_type, ep.business_proof_key,
      ep.shop_photo_key, ep.utility_bill_key,
      ue.phone as employer_phone
    FROM payments p
    JOIN applications a ON p.application_id = a.id
    JOIN jobs j ON a.job_id = j.id
    JOIN worker_profiles wp ON a.worker_id = wp.id
    JOIN users uw ON wp.user_id = uw.id
    JOIN employer_profiles ep ON p.employer_id = ep.id
    JOIN users ue ON ep.user_id = ue.id
    WHERE p.id = ?
  `).bind(paymentId).first();

  if (!detail) {
    return c.json({ error: 'Verification item not found' }, 404);
  }

  return c.json({ verification: detail });
});

// 4. Approve Verification (Checklist completed)
const approveSchema = z.object({
  checklist: z.object({
    documents_clear: z.boolean(),
    name_matched: z.boolean(),
    selfie_matched: z.boolean(),
    shop_exists: z.boolean(),
    no_duplicate_account: z.boolean(),
  }),
  notes: z.string().optional(),
});

adminRoutes.post('/admin/payments/:id/approve', async (c) => {
  const admin = c.get('user');
  const paymentId = c.req.param('id');
  const body = await c.req.json();
  const parsed = approveSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'All checklist criteria must be verified before approval' }, 400);
  }

  const payment = await c.env.DB.prepare(
    'SELECT id, application_id, employer_id, upi_ref FROM payments WHERE id = ?'
  ).bind(paymentId).first<any>();

  if (!payment) return c.json({ error: 'Payment record not found' }, 404);

  // Update payment status = successful
  await c.env.DB.prepare(`
    UPDATE payments SET
      status = 'successful',
      reviewed_by = ?,
      reviewed_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(admin.userId, paymentId).run();

  // Unlock application
  await c.env.DB.prepare(`
    UPDATE applications SET
      status = 'unlocked',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(payment.application_id).run();

  // Record Admin Review
  const reviewId = 'rev_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  await c.env.DB.prepare(`
    INSERT INTO admin_reviews (id, target_type, target_id, admin_id, action, checklist_json, reason)
    VALUES (?, 'payment', ?, ?, 'approve', ?, ?)
  `).bind(reviewId, paymentId, admin.userId, JSON.stringify(parsed.data.checklist), parsed.data.notes || 'Approved').run();

  // Log Audit Log
  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'approve', 'payment', paymentId, {
    applicationId: payment.application_id,
    upi_ref: payment.upi_ref,
    checklist: parsed.data.checklist,
  }, ip);

  return c.json({
    success: true,
    message: 'Verification approved! Application has been unlocked. Worker phone is visible to employer, and shop address is visible to worker.',
  });
});

// 5. Reject Verification
const rejectSchema = z.object({
  reason: z.string().min(5, 'Rejection reason is required'),
});

adminRoutes.post('/admin/payments/:id/reject', async (c) => {
  const admin = c.get('user');
  const paymentId = c.req.param('id');
  const body = await c.req.json();
  const parsed = rejectSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Reason required' }, 400);
  }

  const payment = await c.env.DB.prepare(
    'SELECT id, application_id FROM payments WHERE id = ?'
  ).bind(paymentId).first<any>();

  if (!payment) return c.json({ error: 'Payment not found' }, 404);

  // Update payment status = rejected
  await c.env.DB.prepare(`
    UPDATE payments SET
      status = 'rejected',
      reject_reason = ?,
      reviewed_by = ?,
      reviewed_at = CURRENT_TIMESTAMP,
      refund_status = 'initiated',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(parsed.data.reason, admin.userId, paymentId).run();

  // Update application status = verification_rejected
  await c.env.DB.prepare(`
    UPDATE applications SET
      status = 'verification_rejected',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(payment.application_id).run();

  // Audit Log
  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'reject', 'payment', paymentId, {
    reason: parsed.data.reason,
    applicationId: payment.application_id,
  }, ip);

  return c.json({
    success: true,
    message: 'Verification rejected. Refund status set to initiated per refund policy.',
  });
});

// 6. Record Refund (Manual Refund confirmation)
const refundSchema = z.object({
  refund_ref: z.string().min(6, 'Refund UTR or transaction ID is required'),
  refund_notes: z.string().optional(),
});

adminRoutes.post('/admin/payments/:id/refund', async (c) => {
  const admin = c.get('user');
  const paymentId = c.req.param('id');
  const body = await c.req.json();
  const parsed = refundSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid refund data' }, 400);
  }

  await c.env.DB.prepare(`
    UPDATE payments SET
      status = 'refunded',
      refund_status = 'completed',
      refund_ref = ?,
      refund_notes = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(parsed.data.refund_ref, parsed.data.refund_notes || 'Refund processed', paymentId).run();

  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'refund', 'payment', paymentId, {
    refund_ref: parsed.data.refund_ref,
  }, ip);

  return c.json({ success: true, message: 'Refund recorded successfully' });
});

// 7. User Management: List users
adminRoutes.get('/admin/users', async (c) => {
  const { role, is_blocked } = c.req.query();
  let query = 'SELECT id, phone, role, is_blocked, is_verified, created_at FROM users WHERE 1=1';
  const params: any[] = [];

  if (role) {
    query += ' AND role = ?';
    params.push(role);
  }
  if (is_blocked !== undefined) {
    query += ' AND is_blocked = ?';
    params.push(is_blocked === 'true' || is_blocked === '1' ? 1 : 0);
  }

  query += ' ORDER BY created_at DESC LIMIT 50';
  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json({ users: results || [] });
});

// 8. Block / Suspend User
adminRoutes.post('/admin/users/:id/block', async (c) => {
  const admin = c.get('user');
  const targetUserId = c.req.param('id');

  await c.env.DB.prepare(
    'UPDATE users SET is_blocked = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(targetUserId).run();

  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'block', 'user', targetUserId, {}, ip);

  return c.json({ success: true, message: 'User blocked' });
});

// 9. Unblock User
adminRoutes.post('/admin/users/:id/unblock', async (c) => {
  const admin = c.get('user');
  const targetUserId = c.req.param('id');

  await c.env.DB.prepare(
    'UPDATE users SET is_blocked = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(targetUserId).run();

  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'unblock', 'user', targetUserId, {}, ip);

  return c.json({ success: true, message: 'User unblocked' });
});

// 10. Moderate Jobs (list all jobs including employer business info)
adminRoutes.get('/admin/jobs', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT j.*, ep.business_name, ep.contact_person, u.phone as employer_phone
    FROM jobs j
    JOIN employer_profiles ep ON j.employer_id = ep.id
    JOIN users u ON ep.user_id = u.id
    ORDER BY j.created_at DESC
  `).all();

  return c.json({ jobs: results || [] });
});

// 11. Delete Spam Job
adminRoutes.delete('/admin/jobs/:id', async (c) => {
  const admin = c.get('user');
  const jobId = c.req.param('id');

  await c.env.DB.prepare('DELETE FROM jobs WHERE id = ?').bind(jobId).run();

  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'delete_job', 'job', jobId, {}, ip);

  return c.json({ success: true, message: 'Job removed successfully' });
});

export default adminRoutes;

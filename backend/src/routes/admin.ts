import { Hono } from 'hono';
import { z } from 'zod';
import { Env, UserTokenPayload } from '../config/env';
import { authMiddleware } from '../middlewares/auth';
import { roleGuard } from '../middlewares/roles';
import { logAdminAudit } from '../services/audit';
import { hashPassword } from '../services/password';

const adminRoutes = new Hono<{ Bindings: Env; Variables: { user: UserTokenPayload } }>();

// All admin routes require admin role
adminRoutes.use('/admin/*', authMiddleware, roleGuard(['admin']));

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

// 7. User Management: List all users with full Worker & Employer profile joins
adminRoutes.get('/admin/users', async (c) => {
  const { role, search } = c.req.query();
  let query = `
    SELECT 
      u.id, 
      u.email, 
      u.phone, 
      u.role, 
      u.is_blocked, 
      u.is_verified, 
      u.created_at,
      wp.id as worker_id,
      wp.full_name as worker_name,
      wp.trade_title as worker_title,
      wp.skills as worker_skills,
      wp.experience_years as worker_exp,
      wp.city as worker_city,
      wp.preferred_area as worker_area,
      wp.verification_status as worker_verification_status,
      ep.id as employer_id,
      ep.business_name as employer_business_name,
      ep.business_type as employer_business_type,
      ep.contact_person as employer_contact_person,
      ep.city as employer_city,
      ep.area as employer_area,
      ep.verification_status as employer_verification_status
    FROM users u
    LEFT JOIN worker_profiles wp ON u.id = wp.user_id
    LEFT JOIN employer_profiles ep ON u.id = ep.user_id
    WHERE 1=1
  `;
  const params: any[] = [];
  if (role && role !== 'all') {
    query += ' AND u.role = ?';
    params.push(role);
  }
  if (search) {
    query += ' AND (u.email LIKE ? OR u.phone LIKE ? OR wp.full_name LIKE ? OR ep.business_name LIKE ? OR wp.trade_title LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY u.created_at DESC';

  const { results } = await c.env.DB.prepare(query).bind(...params).all<any>();
  const users = (results || []).map((row: any) => {
    let parsedSkills: string[] = [];
    if (row.worker_skills) {
      try {
        parsedSkills = typeof row.worker_skills === 'string' ? JSON.parse(row.worker_skills) : row.worker_skills;
      } catch {
        parsedSkills = [];
      }
    }
    const displayName = row.worker_name || row.employer_business_name || (row.role === 'admin' ? 'Super Administrator' : (row.email?.split('@')[0] || 'User'));
    return {
      id: row.id,
      email: row.email,
      phone: row.phone,
      role: row.role,
      name: displayName,
      is_blocked: row.is_blocked === 1,
      is_verified: row.is_verified === 1,
      created_at: row.created_at,
      // Worker info
      worker_id: row.worker_id,
      worker_name: row.worker_name,
      worker_title: row.worker_title,
      worker_skills: parsedSkills,
      worker_exp: row.worker_exp,
      worker_city: row.worker_city,
      worker_area: row.worker_area,
      worker_verification_status: row.worker_verification_status,
      // Employer info
      employer_id: row.employer_id,
      employer_business_name: row.employer_business_name,
      employer_business_type: row.employer_business_type,
      employer_contact_person: row.employer_contact_person,
      employer_city: row.employer_city,
      employer_area: row.employer_area,
      employer_verification_status: row.employer_verification_status,
    };
  });

  return c.json({ users });
});

// 7b. Create User directly from Admin
adminRoutes.post('/admin/users', async (c) => {
  const admin = c.get('user');
  const body = await c.req.json();
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || 'Password@123';
  const role = body.role === 'employer' ? 'employer' : 'worker';
  const name = (body.name || 'User').trim();
  const phone = (body.phone || '').trim();
  const city = body.city || 'Visakhapatnam';
  const tradeTitle = body.trade_title || (role === 'worker' ? 'Technical Specialist' : 'Tech Company');

  if (!email || !email.includes('@')) {
    return c.json({ error: 'Valid email address is required' }, 400);
  }

  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) {
    return c.json({ error: 'An account with this email already exists' }, 400);
  }

  const { hash, salt } = await hashPassword(password);
  const userId = 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);

  await c.env.DB.prepare(`
    INSERT INTO users (id, email, password_hash, password_salt, phone, role, is_blocked, is_verified, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(userId, email, hash, salt, phone || null, role).run();

  if (role === 'worker') {
    const wpId = 'wp_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    await c.env.DB.prepare(`
      INSERT INTO worker_profiles (id, user_id, full_name, phone, trade_title, skills, experience_years, city, preferred_area, verification_status, digilocker_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, '["Software Engineering"]', 2, ?, 'Madhurawada IT SEZ', 'verified', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(wpId, userId, name, phone || null, tradeTitle, city).run();
  } else {
    const epId = 'ep_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    await c.env.DB.prepare(`
      INSERT INTO employer_profiles (id, user_id, business_name, business_type, contact_person, city, area, exact_address, latitude, longitude, verification_status, created_at, updated_at)
      VALUES (?, ?, ?, 'Enterprise SaaS', ?, ?, 'Madhurawada IT SEZ', 'Visakhapatnam, Andhra Pradesh', 17.6868, 83.2185, 'verified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(epId, userId, name, name, city).run();
  }

  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'create_user', 'user', userId, { email, role }, ip);

  return c.json({ success: true, userId, message: 'Account provisioned successfully' });
});

// 8. Edit User Account & Profile (Name, Email, Phone, Role, Verified, Password)
adminRoutes.put('/admin/users/:id', async (c) => {
  const admin = c.get('user');
  const targetId = c.req.param('id');
  const body = await c.req.json();

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(targetId).first<any>();
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const newEmail = body.email !== undefined ? body.email.trim().toLowerCase() : user.email;
  const newPhone = body.phone !== undefined ? body.phone.trim() : user.phone;
  const newBlocked = body.is_blocked !== undefined ? (body.is_blocked ? 1 : 0) : user.is_blocked;
  const newVerified = body.is_verified !== undefined ? (body.is_verified ? 1 : 0) : user.is_verified;
  const newRole = body.role || user.role;

  let updateSql = 'UPDATE users SET email = ?, phone = ?, role = ?, is_blocked = ?, is_verified = ?, updated_at = CURRENT_TIMESTAMP';
  const updateParams: any[] = [newEmail, newPhone, newRole, newBlocked, newVerified];

  if (body.password && body.password.trim().length >= 6) {
    const { hash, salt } = await hashPassword(body.password.trim());
    updateSql += ', password_hash = ?, password_salt = ?';
    updateParams.push(hash, salt);
  }

  updateSql += ' WHERE id = ?';
  updateParams.push(targetId);

  await c.env.DB.prepare(updateSql).bind(...updateParams).run();

  // If worker, update worker_profiles
  if (newRole === 'worker' || user.role === 'worker') {
    const wp = await c.env.DB.prepare('SELECT id FROM worker_profiles WHERE user_id = ?').bind(targetId).first<any>();
    if (wp) {
      const skillsVal = Array.isArray(body.skills) ? JSON.stringify(body.skills) : body.skills;
      await c.env.DB.prepare(`
        UPDATE worker_profiles SET
          full_name = COALESCE(?, full_name),
          trade_title = COALESCE(?, trade_title),
          city = COALESCE(?, city),
          preferred_area = COALESCE(?, preferred_area),
          experience_years = COALESCE(?, experience_years),
          skills = COALESCE(?, skills),
          phone = COALESCE(?, phone),
          verification_status = CASE WHEN ? = 1 THEN 'verified' ELSE 'pending' END,
          digilocker_verified = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).bind(
        body.name || null,
        body.trade_title || null,
        body.city || null,
        body.preferred_area || null,
        body.experience !== undefined ? Number(body.experience) : null,
        skillsVal || null,
        newPhone || null,
        newVerified,
        newVerified,
        targetId
      ).run();
    }
  }

  // If employer, update employer_profiles
  if (newRole === 'employer' || user.role === 'employer') {
    const ep = await c.env.DB.prepare('SELECT id FROM employer_profiles WHERE user_id = ?').bind(targetId).first<any>();
    if (ep) {
      await c.env.DB.prepare(`
        UPDATE employer_profiles SET
          business_name = COALESCE(?, business_name),
          business_type = COALESCE(?, business_type),
          contact_person = COALESCE(?, contact_person),
          city = COALESCE(?, city),
          area = COALESCE(?, area),
          verification_status = CASE WHEN ? = 1 THEN 'verified' ELSE 'pending' END,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).bind(
        body.business_name || body.name || null,
        body.business_type || null,
        body.contact_person || null,
        body.city || null,
        body.preferred_area || body.area || null,
        newVerified,
        targetId
      ).run();
    }
  }

  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'edit_user', 'user', targetId, { email: newEmail }, ip);

  return c.json({ success: true, message: 'User updated successfully' });
});

// 9. Delete User Permanently (Cascading worker / employer profiles & jobs)
adminRoutes.delete('/admin/users/:id', async (c) => {
  const admin = c.get('user');
  const targetId = c.req.param('id');

  if (targetId === admin.userId || targetId === 'usr_admin_01' || targetId === 'admin_01') {
    return c.json({ error: 'Cannot delete primary root administrator account' }, 400);
  }

  const ep = await c.env.DB.prepare('SELECT id FROM employer_profiles WHERE user_id = ?').bind(targetId).first<any>();
  if (ep) {
    await c.env.DB.prepare('DELETE FROM payments WHERE employer_id = ?').bind(ep.id).run();
    await c.env.DB.prepare('DELETE FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE employer_id = ?)').bind(ep.id).run();
    await c.env.DB.prepare('DELETE FROM jobs WHERE employer_id = ?').bind(ep.id).run();
    await c.env.DB.prepare('DELETE FROM employer_profiles WHERE id = ?').bind(ep.id).run();
  }

  const wp = await c.env.DB.prepare('SELECT id FROM worker_profiles WHERE user_id = ?').bind(targetId).first<any>();
  if (wp) {
    await c.env.DB.prepare('DELETE FROM applications WHERE worker_id = ?').bind(wp.id).run();
    await c.env.DB.prepare('DELETE FROM worker_profiles WHERE id = ?').bind(wp.id).run();
  }

  await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(targetId).run();

  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'delete_user', 'user', targetId, {}, ip);

  return c.json({ success: true, message: 'Account and associated records deleted permanently' });
});

// 10. Toggle User Verification
adminRoutes.post('/admin/users/:id/toggle-verify', async (c) => {
  const admin = c.get('user');
  const targetId = c.req.param('id');

  const user = await c.env.DB.prepare('SELECT is_verified, role FROM users WHERE id = ?').bind(targetId).first<any>();
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const newStatus = user.is_verified === 1 ? 0 : 1;
  const statusText = newStatus === 1 ? 'verified' : 'pending';

  await c.env.DB.prepare('UPDATE users SET is_verified = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(newStatus, targetId).run();

  if (user.role === 'worker') {
    await c.env.DB.prepare('UPDATE worker_profiles SET verification_status = ?, digilocker_verified = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?').bind(statusText, newStatus, targetId).run();
  } else if (user.role === 'employer') {
    await c.env.DB.prepare('UPDATE employer_profiles SET verification_status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?').bind(statusText, targetId).run();
  }

  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'toggle_verify', 'user', targetId, { is_verified: newStatus }, ip);

  return c.json({ success: true, is_verified: newStatus === 1, message: `Verification status set to ${statusText}` });
});

// 11. Block / Suspend User
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

// 12. Unblock User
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

// 13. List All Platform Jobs
adminRoutes.get('/admin/jobs', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT j.*, ep.business_name, ep.contact_person, u.phone as employer_phone
    FROM jobs j
    LEFT JOIN employer_profiles ep ON j.employer_id = ep.id
    LEFT JOIN users u ON ep.user_id = u.id
    ORDER BY j.created_at DESC
  `).all();

  return c.json({ jobs: results || [] });
});

// 14. Edit Job
adminRoutes.put('/admin/jobs/:id', async (c) => {
  const admin = c.get('user');
  const jobId = c.req.param('id');
  const body = await c.req.json();

  const job = await c.env.DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(jobId).first<any>();
  if (!job) {
    return c.json({ error: 'Job not found' }, 404);
  }

  const title = body.title || job.title;
  const category = body.category || job.category;
  const salaryMin = body.salary_min !== undefined ? Number(body.salary_min) : job.salary_min;
  const salaryMax = body.salary_max !== undefined ? Number(body.salary_max) : job.salary_max;
  const city = body.location_city || job.location_city;
  const area = body.location_area || job.location_area;
  const vacancies = body.vacancies !== undefined ? Number(body.vacancies) : job.vacancies;
  const status = body.status || job.status;

  await c.env.DB.prepare(`
    UPDATE jobs SET
      title = ?, category = ?, salary_min = ?, salary_max = ?,
      location_city = ?, location_area = ?, vacancies = ?, status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(title, category, salaryMin, salaryMax, city, area, vacancies, status, jobId).run();

  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'edit_job', 'job', jobId, { title, status }, ip);

  return c.json({ success: true, message: 'Job updated successfully' });
});

// 15. Delete Job
adminRoutes.delete('/admin/jobs/:id', async (c) => {
  const admin = c.get('user');
  const jobId = c.req.param('id');

  await c.env.DB.prepare('DELETE FROM applications WHERE job_id = ?').bind(jobId).run();
  await c.env.DB.prepare('DELETE FROM jobs WHERE id = ?').bind(jobId).run();

  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  await logAdminAudit(c.env.DB, admin.userId, 'delete_job', 'job', jobId, {}, ip);

  return c.json({ success: true, message: 'Job removed successfully' });
});

export default adminRoutes;

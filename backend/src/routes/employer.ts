import { Hono } from 'hono';
import { z } from 'zod';
import { Env, UserTokenPayload } from '../config/env';
import { authMiddleware } from '../middlewares/auth';
import { roleGuard } from '../middlewares/roles';
import { sanitizeWorkerProfile } from '../services/privacy';

const employerRoutes = new Hono<{ Bindings: Env; Variables: { user: UserTokenPayload } }>();

// 1. Get Employer Profile
employerRoutes.get('/employer/profile', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  let profile = await c.env.DB.prepare(
    'SELECT * FROM employer_profiles WHERE user_id = ?'
  ).bind(user.userId).first();

  if (!profile) {
    const epId = 'ep_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    await c.env.DB.prepare(`
      INSERT INTO employer_profiles (id, user_id, business_name, business_type, contact_person, city, area, exact_address, latitude, longitude, verification_status, unlock_credits, created_at, updated_at)
      VALUES (?, ?, ?, 'Company', ?, 'Visakhapatnam', 'Madhurawada IT SEZ', 'Visakhapatnam, Andhra Pradesh', 17.6868, 83.2185, 'verified', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(epId, user.userId, user.email?.split('@')[0] || 'Employer', user.email?.split('@')[0] || 'Employer').run();

    profile = await c.env.DB.prepare('SELECT * FROM employer_profiles WHERE id = ?').bind(epId).first();
  }

  const credits = (profile as any)?.unlock_credits !== undefined && (profile as any)?.unlock_credits !== null
    ? Number((profile as any).unlock_credits)
    : 3;

  return c.json({ profile, credits });
});

// 2. Update Employer Profile
const updateEmployerSchema = z.object({
  business_name: z.string().min(2),
  business_type: z.string().min(2),
  contact_person: z.string().min(2),
  city: z.string().min(2),
  area: z.string().min(2),
  exact_address: z.string().min(5),
  latitude: z.number(),
  longitude: z.number(),
  business_proof_type: z.enum(['udyam', 'gst', 'shop_licence', 'trade_licence', 'rent_agreement']).optional(),
  business_proof_key: z.string().optional(),
  shop_photo_key: z.string().optional(),
  utility_bill_key: z.string().optional(),
});

employerRoutes.put('/employer/profile', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const parsed = updateEmployerSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, 400);
  }

  const d = parsed.data;
  await c.env.DB.prepare(`
    UPDATE employer_profiles SET
      business_name = COALESCE(?, business_name),
      business_type = COALESCE(?, business_type),
      contact_person = COALESCE(?, contact_person),
      city = COALESCE(?, city),
      area = COALESCE(?, area),
      exact_address = COALESCE(?, exact_address),
      latitude = COALESCE(?, latitude),
      longitude = COALESCE(?, longitude),
      business_proof_type = COALESCE(?, business_proof_type),
      business_proof_key = COALESCE(?, business_proof_key),
      shop_photo_key = COALESCE(?, shop_photo_key),
      utility_bill_key = COALESCE(?, utility_bill_key),
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).bind(
    d.business_name,
    d.business_type,
    d.contact_person,
    d.city,
    d.area,
    d.exact_address,
    d.latitude,
    d.longitude,
    d.business_proof_type,
    d.business_proof_key,
    d.shop_photo_key,
    d.utility_bill_key,
    user.userId
  ).run();

  const updated = await c.env.DB.prepare('SELECT * FROM employer_profiles WHERE user_id = ?').bind(user.userId).first();
  return c.json({ success: true, profile: updated });
});

// 3. Post a Job
const postJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  salary_min: z.number().min(100),
  salary_max: z.number().min(100),
  salary_period: z.enum(['hourly', 'daily', 'monthly']).default('monthly'),
  location_area: z.string().min(2),
  location_city: z.string().min(2),
  working_hours: z.string().min(3),
  requirements: z.union([z.array(z.string()), z.string()]).optional(),
  vacancies: z.number().min(1).default(1),
  max_applications: z.number().min(0).default(0),
});

employerRoutes.post('/employer/jobs', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  const employer = await c.env.DB.prepare('SELECT id FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!employer) {
    return c.json({ error: 'Employer profile not found. Please complete profile first.' }, 400);
  }

  const body = await c.req.json();
  const parsed = postJobSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid job data' }, 400);
  }

  const d = parsed.data;
  const jobId = 'job_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  const reqJson = typeof d.requirements === 'string' ? d.requirements : (d.requirements ? JSON.stringify(d.requirements) : '[]');

  await c.env.DB.prepare(`
    INSERT INTO jobs (
      id, employer_id, title, description, category, salary_min, salary_max, salary_period,
      location_area, location_city, working_hours, requirements, vacancies, max_applications, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
  `).bind(
    jobId,
    employer.id,
    d.title,
    d.description,
    d.category,
    d.salary_min,
    d.salary_max,
    d.salary_period,
    d.location_area,
    d.location_city,
    d.working_hours,
    reqJson,
    d.vacancies,
    d.max_applications || 0
  ).run();

  return c.json({ success: true, jobId, message: 'Job posted successfully' });
});

// 4. Get Employer's Posted Jobs with applicant counts
employerRoutes.get('/employer/jobs', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  const employer = await c.env.DB.prepare('SELECT id FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!employer) {
    return c.json({ jobs: [] });
  }

  const { results } = await c.env.DB.prepare(`
    SELECT
      j.*,
      COUNT(a.id) as applicant_count,
      SUM(CASE WHEN a.status = 'unlocked' THEN 1 ELSE 0 END) as unlocked_count,
      SUM(CASE WHEN a.status = 'pending_verification' THEN 1 ELSE 0 END) as pending_verification_count
    FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
    WHERE j.employer_id = ?
    GROUP BY j.id
    ORDER BY j.created_at DESC
  `).bind(employer!.id).all();

  return c.json({ jobs: results || [] });
});

// 4b. Get All Applications for Employer across all jobs
employerRoutes.get('/employer/applications', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  let employer = await c.env.DB.prepare('SELECT id, unlock_credits FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string; unlock_credits: number }>();
  if (!employer) {
    const epId = 'ep_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    await c.env.DB.prepare(`
      INSERT INTO employer_profiles (id, user_id, business_name, business_type, contact_person, city, area, exact_address, latitude, longitude, verification_status, created_at, updated_at)
      VALUES (?, ?, ?, 'Tech Company', ?, 'Visakhapatnam', 'Madhurawada IT SEZ', 'Visakhapatnam, Andhra Pradesh', 17.6868, 83.2185, 'verified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(epId, user.userId, user.email?.split('@')[0] || 'Employer', user.email?.split('@')[0] || 'Employer').run();
    employer = { id: epId, unlock_credits: 3 };
  }

  const { results } = await c.env.DB.prepare(`
    SELECT
      a.id as application_id, a.id, a.status as application_status, a.status, a.applied_at,
      j.id as job_id, j.title as job_title, j.category as job_category,
      wp.id as worker_id, wp.full_name as worker_name, wp.trade_title, wp.skills as worker_skills,
      wp.experience_years as worker_experience, wp.preferred_area as worker_area, wp.city as worker_city,
      wp.verification_status as worker_verification_status, wp.digilocker_verified, wp.id_number_masked,
      u.phone as worker_phone, u.email as worker_email,
      ep.business_name as employer_name,
      p.status as payment_status
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN worker_profiles wp ON a.worker_id = wp.id
    JOIN users u ON wp.user_id = u.id
    JOIN employer_profiles ep ON a.employer_id = ep.id
    LEFT JOIN payments p ON p.application_id = a.id
    WHERE a.employer_id = ?
    ORDER BY a.applied_at DESC
  `).bind(employer.id).all<any>();

  const applications = (results || []).map((row: any) => {
    const isUnlocked = row.application_status === 'unlocked' || row.status === 'unlocked';
    const rawPhone = row.worker_phone || '+91 98491 55678';
    const maskedPhone = rawPhone.length > 5 ? rawPhone.slice(0, 6) + '••••' + rawPhone.slice(-2) : '+91 98••••••42';
    
    let parsedSkills: string[] = [];
    try {
      parsedSkills = typeof row.worker_skills === 'string' ? JSON.parse(row.worker_skills) : (row.worker_skills || []);
    } catch {
      parsedSkills = [];
    }

    return {
      id: row.id || row.application_id,
      application_id: row.application_id || row.id,
      job_id: row.job_id,
      job_title: row.job_title,
      employer_name: row.employer_name,
      worker_id: row.worker_id,
      worker_name: row.worker_name,
      worker_category: row.trade_title || row.job_category || 'Software Engineering',
      worker_skills: parsedSkills,
      worker_experience: row.worker_experience || 0,
      worker_city: row.worker_city || 'Visakhapatnam',
      worker_area: row.worker_area || 'Central Area',
      applied_date: row.applied_at ? row.applied_at.split('T')[0] : new Date().toISOString().split('T')[0],
      status: row.application_status || row.status || 'applied',
      priority: 'STANDARD',
      unlocked: isUnlocked,
      phone_masked: maskedPhone,
      phone_unlocked: rawPhone,
      worker_phone: isUnlocked ? rawPhone : maskedPhone,
      worker_email: isUnlocked ? row.worker_email : 'Locked (Unlock to view)',
      address_masked: 'Address Protected (Unlock to view)',
      address_unlocked: `${row.worker_area || ''}, ${row.worker_city || 'Visakhapatnam'}`,
      experience_notes: `${row.worker_experience || 0}+ years experienced ${row.trade_title || row.job_category || 'specialist'}`,
      verification_status: row.worker_verification_status || 'verified',
      digilocker_verified: !!row.digilocker_verified,
    };
  });

  const liveCredits = employer?.unlock_credits !== undefined && employer?.unlock_credits !== null ? Number(employer.unlock_credits) : 3;
  return c.json({ applications, credits: liveCredits });
});

// 4c. Unlock Candidate Application Contact Details
employerRoutes.post('/employer/applications/:id/unlock', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  const appId = c.req.param('id');
  let employer = await c.env.DB.prepare('SELECT id, unlock_credits FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string; unlock_credits: number }>();
  if (!employer) {
    const epId = 'ep_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    await c.env.DB.prepare(`
      INSERT INTO employer_profiles (id, user_id, business_name, business_type, contact_person, city, area, exact_address, latitude, longitude, verification_status, unlock_credits, created_at, updated_at)
      VALUES (?, ?, ?, 'Company', ?, 'Visakhapatnam', 'Madhurawada IT SEZ', 'Visakhapatnam, Andhra Pradesh', 17.6868, 83.2185, 'verified', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(epId, user.userId, user.email?.split('@')[0] || 'Employer', user.email?.split('@')[0] || 'Employer').run();
    employer = { id: epId, unlock_credits: 3 };
  }

  const currentCredits = employer.unlock_credits !== undefined && employer.unlock_credits !== null ? Number(employer.unlock_credits) : 3;

  let body: any = {};
  try {
    body = await c.req.json();
  } catch {}

  const targetWorkerId = body?.worker_id;

  // 1. Check if application already exists in DB
  const app = await c.env.DB.prepare('SELECT id, status, worker_id FROM applications WHERE id = ? AND employer_id = ?').bind(appId, employer.id).first<{ id: string; status: string; worker_id: string }>();

  if (app && app.status === 'unlocked') {
    return c.json({
      success: true,
      message: 'Candidate contact details are already unlocked',
      remainingCredits: currentCredits
    });
  }

  // Insufficient credits check
  if (currentCredits < 1) {
    return c.json({
      error: 'Insufficient unlock credits. Please purchase an unlock bundle.',
      needCredits: true,
      remainingCredits: 0
    }, 402);
  }

  const newCredits = Math.max(0, currentCredits - 1);

  if (app) {
    await c.env.DB.prepare("UPDATE applications SET status = 'unlocked', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(app.id).run();
    await c.env.DB.prepare("UPDATE employer_profiles SET unlock_credits = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(newCredits, employer.id).run();

    const workerRow = await c.env.DB.prepare(`
      SELECT wp.id as worker_id, wp.full_name, u.phone, u.email, wp.city, wp.area
      FROM applications a
      JOIN worker_profiles wp ON a.worker_id = wp.id
      JOIN users u ON wp.user_id = u.id
      WHERE a.id = ?
    `).bind(app.id).first<{ worker_id: string; full_name: string; phone: string; email: string; city: string; area: string }>();

    return c.json({
      success: true,
      message: 'Applicant contact details unlocked successfully',
      remainingCredits: newCredits,
      phone: workerRow?.phone,
      email: workerRow?.email
    });
  }

  // 2. Directory candidate added to cart or worker profile ID
  const lookupWorkerId = targetWorkerId || appId;
  const worker = await c.env.DB.prepare(`
    SELECT wp.id as worker_id, wp.full_name, u.phone, u.email, wp.city, wp.area
    FROM worker_profiles wp
    JOIN users u ON wp.user_id = u.id
    WHERE wp.id = ? OR wp.user_id = ?
  `).bind(lookupWorkerId, lookupWorkerId).first<{ worker_id: string; full_name: string; phone: string; email: string; city: string; area: string }>();

  if (worker) {
    const existing = await c.env.DB.prepare('SELECT id, status FROM applications WHERE worker_id = ? AND employer_id = ?').bind(worker.worker_id, employer.id).first<{ id: string; status: string }>();
    if (existing) {
      await c.env.DB.prepare("UPDATE applications SET status = 'unlocked', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(existing.id).run();
    } else {
      const newAppId = (typeof appId === 'string' && appId.startsWith('app_')) ? appId : 'app_' + crypto.randomUUID().replace(/-/g, '').slice(0, 8);
      await c.env.DB.prepare(`
        INSERT INTO applications (id, job_id, worker_id, employer_id, status, created_at, updated_at)
        VALUES (?, 'dir_selected', ?, ?, 'unlocked', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(newAppId, worker.worker_id, employer.id).run();
    }

    await c.env.DB.prepare("UPDATE employer_profiles SET unlock_credits = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(newCredits, employer.id).run();

    return c.json({
      success: true,
      message: 'Candidate contact details unlocked successfully',
      remainingCredits: newCredits,
      phone: worker.phone,
      email: worker.email
    });
  }

  // 3. Fallback for client mock/localStorage candidates: deduct credit and confirm unlock
  await c.env.DB.prepare("UPDATE employer_profiles SET unlock_credits = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(newCredits, employer.id).run();

  return c.json({
    success: true,
    message: 'Candidate contact details unlocked successfully',
    remainingCredits: newCredits
  });
});

// 4d. Batch Unlock Selected Candidates from Cart
employerRoutes.post('/employer/applications/unlock-batch', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  let employer = await c.env.DB.prepare('SELECT id, unlock_credits FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string; unlock_credits: number }>();
  if (!employer) {
    const epId = 'ep_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    await c.env.DB.prepare(`
      INSERT INTO employer_profiles (id, user_id, business_name, business_type, contact_person, city, area, exact_address, latitude, longitude, verification_status, unlock_credits, created_at, updated_at)
      VALUES (?, ?, ?, 'Company', ?, 'Visakhapatnam', 'Madhurawada IT SEZ', 'Visakhapatnam, Andhra Pradesh', 17.6868, 83.2185, 'verified', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(epId, user.userId, user.email?.split('@')[0] || 'Employer', user.email?.split('@')[0] || 'Employer').run();
    employer = { id: epId, unlock_credits: 3 };
  }

  const currentCredits = employer.unlock_credits !== undefined && employer.unlock_credits !== null ? Number(employer.unlock_credits) : 3;

  let body: any = {};
  try {
    body = await c.req.json();
  } catch {}

  const items: Array<{ id: string; worker_id?: string }> = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) {
    return c.json({ error: 'No items provided' }, 400);
  }

  if (currentCredits < items.length) {
    return c.json({
      error: `Need ${items.length} credits to unlock all, but you have ${currentCredits}. Please recharge.`,
      needCredits: true,
      required: items.length,
      available: currentCredits,
      remainingCredits: currentCredits
    }, 402);
  }

  const newCredits = Math.max(0, currentCredits - items.length);
  await c.env.DB.prepare("UPDATE employer_profiles SET unlock_credits = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(newCredits, employer.id).run();

  for (const item of items) {
    const appId = item.id;
    const workerId = item.worker_id;

    const app = await c.env.DB.prepare('SELECT id FROM applications WHERE id = ? AND employer_id = ?').bind(appId, employer.id).first();
    if (app) {
      await c.env.DB.prepare("UPDATE applications SET status = 'unlocked', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(appId).run();
    } else if (workerId) {
      const existing = await c.env.DB.prepare('SELECT id FROM applications WHERE worker_id = ? AND employer_id = ?').bind(workerId, employer.id).first();
      if (existing) {
        await c.env.DB.prepare("UPDATE applications SET status = 'unlocked', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(existing.id).run();
      } else {
        const newAppId = (typeof appId === 'string' && appId.startsWith('app_')) ? appId : 'app_' + crypto.randomUUID().replace(/-/g, '').slice(0, 8);
        await c.env.DB.prepare(`
          INSERT INTO applications (id, job_id, worker_id, employer_id, status, created_at, updated_at)
          VALUES (?, 'dir_selected', ?, ?, 'unlocked', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(newAppId, workerId, employer.id).run();
      }
    }
  }

  return c.json({
    success: true,
    count: items.length,
    remainingCredits: newCredits,
    message: `Successfully unlocked ${items.length} candidate(s)`
  });
});

// 5. Update Job Status (open / closed)
employerRoutes.put('/employer/jobs/:id', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  const jobId = c.req.param('id');
  const employer = await c.env.DB.prepare('SELECT id FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!employer) return c.json({ error: 'Unauthorized' }, 401);

  const { status } = await c.req.json();
  if (!['open', 'closed'].includes(status)) {
    return c.json({ error: 'Status must be open or closed' }, 400);
  }

  await c.env.DB.prepare(
    'UPDATE jobs SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND employer_id = ?'
  ).bind(status, jobId, employer.id).run();

  return c.json({ success: true, message: `Job marked as ${status}` });
});

// 6. Get Applicants for a specific job
employerRoutes.get('/jobs/:id/applicants', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  const jobId = c.req.param('id');
  const employer = await c.env.DB.prepare('SELECT id FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!employer) return c.json({ error: 'Unauthorized' }, 401);

  // Verify job ownership
  const job = await c.env.DB.prepare('SELECT id, title FROM jobs WHERE id = ? AND employer_id = ?').bind(jobId, employer.id).first();
  if (!job) {
    return c.json({ error: 'Job not found or access denied' }, 404);
  }

  const { results } = await c.env.DB.prepare(`
    SELECT
      a.id as application_id, a.status as application_status, a.applied_at,
      wp.id as worker_id, wp.full_name, wp.photo_key, wp.skills, wp.experience_years,
      wp.preferred_area, wp.city, wp.expected_salary_min, wp.expected_salary_max,
      wp.salary_period, wp.verification_status as worker_verification_status,
      wp.id_number_masked,
      u.phone as worker_phone,
      p.id as payment_id, p.status as payment_status, p.order_code, p.upi_ref
    FROM applications a
    JOIN worker_profiles wp ON a.worker_id = wp.id
    JOIN users u ON wp.user_id = u.id
    LEFT JOIN payments p ON p.application_id = a.id
    WHERE a.job_id = ?
    ORDER BY a.applied_at DESC
  `).bind(jobId).all<any>();

  // Sanitize each applicant: PHONE IS ONLY RETURNED IF APPLICATION IS UNLOCKED!
  const sanitized = (results || []).map((row: any) => {
    const isUnlocked = row.application_status === 'unlocked';
    return {
      application_id: row.application_id,
      application_status: row.application_status,
      applied_at: row.applied_at,
      payment_id: row.payment_id,
      payment_status: row.payment_status,
      order_code: row.order_code,
      worker: sanitizeWorkerProfile({
        id: row.worker_id,
        full_name: row.full_name,
        photo_key: row.photo_key,
        skills: row.skills ? JSON.parse(row.skills) : [],
        experience_years: row.experience_years,
        preferred_area: row.preferred_area,
        city: row.city,
        expected_salary_min: row.expected_salary_min,
        expected_salary_max: row.expected_salary_max,
        salary_period: row.salary_period,
        verification_status: row.worker_verification_status,
        id_number_masked: row.id_number_masked,
        user_phone: row.worker_phone,
      }, isUnlocked),
    };
  });

  return c.json({ job, applicants: sanitized });
});

// 7. Accept Applicant
employerRoutes.post('/applications/:id/accept', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  const appId = c.req.param('id');
  const employer = await c.env.DB.prepare('SELECT id FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!employer) return c.json({ error: 'Unauthorized' }, 401);

  const app = await c.env.DB.prepare(
    'SELECT id, status FROM applications WHERE id = ? AND employer_id = ?'
  ).bind(appId, employer.id).first<{ id: string; status: string }>();

  if (!app) return c.json({ error: 'Application not found' }, 404);

  await c.env.DB.prepare(
    "UPDATE applications SET status = 'accepted', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(appId).run();

  return c.json({ success: true, message: 'Applicant accepted. Please proceed with ₹499 verification fee.' });
});

// 8. Reject Applicant
employerRoutes.post('/applications/:id/reject', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  const appId = c.req.param('id');
  const employer = await c.env.DB.prepare('SELECT id FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!employer) return c.json({ error: 'Unauthorized' }, 401);

  await c.env.DB.prepare(
    "UPDATE applications SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND employer_id = ?"
  ).bind(appId, employer.id).run();

  return c.json({ success: true, message: 'Applicant rejected' });
});

// 9. Unlocked Worker Page: Returns worker phone number and call trigger ONLY if application is unlocked
employerRoutes.get('/employer/applications/:id', authMiddleware, roleGuard(['employer']), async (c) => {
  const user = c.get('user');
  const appId = c.req.param('id');
  const employer = await c.env.DB.prepare('SELECT id FROM employer_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!employer) return c.json({ error: 'Unauthorized' }, 401);

  const row = await c.env.DB.prepare(`
    SELECT
      a.id as application_id, a.status as application_status, a.applied_at,
      j.id as job_id, j.title as job_title,
      wp.id as worker_id, wp.full_name, wp.photo_key, wp.skills, wp.experience_years,
      wp.preferred_area, wp.city, wp.id_number_masked, wp.verification_status,
      u.phone as worker_phone,
      p.status as payment_status, p.upi_ref, p.amount
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN worker_profiles wp ON a.worker_id = wp.id
    JOIN users u ON wp.user_id = u.id
    LEFT JOIN payments p ON p.application_id = a.id
    WHERE a.id = ? AND a.employer_id = ?
  `).bind(appId, employer.id).first<any>();

  if (!row) {
    return c.json({ error: 'Application not found' }, 404);
  }

  const isUnlocked = row.application_status === 'unlocked';
  const sanitized = sanitizeWorkerProfile({
    id: row.worker_id,
    full_name: row.full_name,
    photo_key: row.photo_key,
    skills: row.skills ? JSON.parse(row.skills) : [],
    experience_years: row.experience_years,
    preferred_area: row.preferred_area,
    city: row.city,
    id_number_masked: row.id_number_masked,
    verification_status: row.verification_status,
    user_phone: row.worker_phone,
  }, isUnlocked);

  return c.json({
    application: {
      id: row.application_id,
      status: row.application_status,
      applied_at: row.applied_at,
      isUnlocked,
    },
    job: {
      id: row.job_id,
      title: row.job_title,
    },
    worker: sanitized,
    payment: {
      status: row.payment_status,
      amount: row.amount || 499,
      upi_ref: row.upi_ref,
    },
  });
});

export default employerRoutes;

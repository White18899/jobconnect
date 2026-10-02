import { Hono } from 'hono';
import { z } from 'zod';
import { Env, UserTokenPayload } from '../config/env';
import { authMiddleware } from '../middlewares/auth';
import { roleGuard } from '../middlewares/roles';
import { maskIdNumber, sanitizeEmployerProfile } from '../services/privacy';

const workerRoutes = new Hono<{ Bindings: Env; Variables: { user: UserTokenPayload } }>();

// 1. Get Worker Profile
workerRoutes.get('/worker/profile', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  const profile = await c.env.DB.prepare(
    'SELECT * FROM worker_profiles WHERE user_id = ?'
  ).bind(user.userId).first();

  if (!profile) {
    return c.json({ error: 'Worker profile not found' }, 404);
  }

  return c.json({ profile });
});

// 2. Update Worker Profile
const updateProfileSchema = z.object({
  full_name: z.string().min(2),
  skills: z.array(z.string()).optional(),
  experience_years: z.number().min(0).max(50).optional(),
  preferred_area: z.string().min(2),
  city: z.string().min(2),
  expected_salary_min: z.number().optional(),
  expected_salary_max: z.number().optional(),
  salary_period: z.enum(['hourly', 'daily', 'monthly']).optional(),
  id_proof_type: z.enum(['aadhaar_masked', 'voter_id', 'driving_licence']).optional(),
  id_number_raw: z.string().optional(),
  photo_key: z.string().optional(),
  id_doc_key: z.string().optional(),
  selfie_key: z.string().optional(),
  skill_proof_key: z.string().optional(),
});

workerRoutes.put('/worker/profile', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, 400);
  }

  const data = parsed.data;
  const skillsJson = data.skills ? JSON.stringify(data.skills) : undefined;
  const maskedId = data.id_number_raw ? maskIdNumber(data.id_number_raw) : undefined;

  await c.env.DB.prepare(`
    UPDATE worker_profiles SET
      full_name = COALESCE(?, full_name),
      skills = COALESCE(?, skills),
      experience_years = COALESCE(?, experience_years),
      preferred_area = COALESCE(?, preferred_area),
      city = COALESCE(?, city),
      expected_salary_min = COALESCE(?, expected_salary_min),
      expected_salary_max = COALESCE(?, expected_salary_max),
      salary_period = COALESCE(?, salary_period),
      id_proof_type = COALESCE(?, id_proof_type),
      id_number_masked = COALESCE(?, id_number_masked),
      photo_key = COALESCE(?, photo_key),
      id_doc_key = COALESCE(?, id_doc_key),
      selfie_key = COALESCE(?, selfie_key),
      skill_proof_key = COALESCE(?, skill_proof_key),
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).bind(
    data.full_name,
    skillsJson,
    data.experience_years,
    data.preferred_area,
    data.city,
    data.expected_salary_min,
    data.expected_salary_max,
    data.salary_period,
    data.id_proof_type,
    maskedId,
    data.photo_key,
    data.id_doc_key,
    data.selfie_key,
    data.skill_proof_key,
    user.userId
  ).run();

  const updated = await c.env.DB.prepare('SELECT * FROM worker_profiles WHERE user_id = ?').bind(user.userId).first();
  return c.json({ success: true, profile: updated });
});

// 3. Public / Worker Job Feed (Exact shop address is strictly hidden)
workerRoutes.get('/jobs', async (c) => {
  const { category, city, min_salary, limit = '20', offset = '0' } = c.req.query();

  let query = `
    SELECT
      j.id, j.title, j.description, j.category, j.salary_min, j.salary_max, j.salary_period,
      j.location_area, j.location_city, j.working_hours, j.requirements, j.vacancies, j.status, j.created_at,
      ep.business_name, ep.business_type, ep.verification_status as employer_verified
    FROM jobs j
    JOIN employer_profiles ep ON j.employer_id = ep.id
    WHERE j.status = 'open'
  `;

  const params: any[] = [];
  if (category) {
    query += ' AND (j.category = ? OR j.category LIKE ?)';
    params.push(category, `%${category}%`);
  }
  if (city) {
    query += ' AND j.location_city = ?';
    params.push(city);
  }
  if (min_salary) {
    query += ' AND j.salary_max >= ?';
    params.push(parseInt(min_salary, 10));
  }

  query += ' ORDER BY j.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit, 10), parseInt(offset, 10));

  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  return c.json({ jobs: results || [] });
});

// 4. Job Details (Exact address remains hidden)
workerRoutes.get('/jobs/:id', async (c) => {
  const jobId = c.req.param('id');
  const job = await c.env.DB.prepare(`
    SELECT
      j.*,
      ep.business_name, ep.business_type, ep.area as employer_area, ep.city as employer_city,
      ep.verification_status as employer_verification_status
    FROM jobs j
    JOIN employer_profiles ep ON j.employer_id = ep.id
    WHERE j.id = ?
  `).bind(jobId).first();

  if (!job) {
    return c.json({ error: 'Job not found' }, 404);
  }

  return c.json({ job });
});

// 5. Apply for Job
workerRoutes.post('/jobs/:id/apply', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  const jobId = c.req.param('id');

  // Find worker profile
  const worker = await c.env.DB.prepare('SELECT id FROM worker_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!worker) {
    return c.json({ error: 'Worker profile missing. Please complete profile first.' }, 400);
  }

  // Find job & employer
  const job = await c.env.DB.prepare('SELECT id, employer_id, status FROM jobs WHERE id = ?').bind(jobId).first<{ id: string; employer_id: string; status: string }>();
  if (!job || job.status !== 'open') {
    return c.json({ error: 'Job is no longer open for applications' }, 400);
  }

  // Check if already applied
  const existing = await c.env.DB.prepare(
    'SELECT id, status FROM applications WHERE job_id = ? AND worker_id = ?'
  ).bind(jobId, worker.id).first();

  if (existing) {
    return c.json({ error: 'You have already applied for this job', application: existing }, 409);
  }

  const appId = 'app_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  await c.env.DB.prepare(`
    INSERT INTO applications (id, job_id, worker_id, employer_id, status)
    VALUES (?, ?, ?, ?, 'applied')
  `).bind(appId, jobId, worker.id, job.employer_id).run();

  return c.json({
    success: true,
    message: 'Application submitted successfully',
    applicationId: appId,
  });
});

// 6. Worker Applications List
workerRoutes.get('/worker/applications', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  const worker = await c.env.DB.prepare('SELECT id FROM worker_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!worker) {
    return c.json({ applications: [] });
  }

  const { results } = await c.env.DB.prepare(`
    SELECT
      a.id as application_id, a.status as application_status, a.applied_at, a.updated_at,
      j.id as job_id, j.title as job_title, j.category as job_category, j.salary_min, j.salary_max,
      j.salary_period, j.location_area, j.location_city,
      ep.id as employer_id, ep.business_name, ep.business_type,
      p.status as payment_status
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN employer_profiles ep ON a.employer_id = ep.id
    LEFT JOIN payments p ON p.application_id = a.id
    WHERE a.worker_id = ?
    ORDER BY a.applied_at DESC
  `).bind(worker.id).all();

  return c.json({ applications: results || [] });
});

// 7. Unlocked Job Page: Only returns exact shop address & map coordinates if status === 'unlocked'
workerRoutes.get('/worker/applications/:id', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  const appId = c.req.param('id');

  const worker = await c.env.DB.prepare('SELECT id FROM worker_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!worker) {
    return c.json({ error: 'Worker profile not found' }, 404);
  }

  const appRow = await c.env.DB.prepare(`
    SELECT
      a.id as application_id, a.status as application_status, a.applied_at,
      j.id as job_id, j.title as job_title, j.description, j.category, j.salary_min, j.salary_max,
      j.salary_period, j.working_hours, j.requirements,
      ep.id as employer_id, ep.business_name, ep.business_type, ep.contact_person, ep.area, ep.city,
      ep.exact_address, ep.latitude, ep.longitude,
      u.phone as employer_phone
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN employer_profiles ep ON a.employer_id = ep.id
    JOIN users u ON ep.user_id = u.id
    WHERE a.id = ? AND a.worker_id = ?
  `).bind(appId, worker.id).first<any>();

  if (!appRow) {
    return c.json({ error: 'Application not found or unauthorized' }, 404);
  }

  const isUnlocked = appRow.application_status === 'unlocked';
  const sanitizedEmployer = sanitizeEmployerProfile({
    business_name: appRow.business_name,
    business_type: appRow.business_type,
    contact_person: appRow.contact_person,
    area: appRow.area,
    city: appRow.city,
    exact_address: appRow.exact_address,
    latitude: appRow.latitude,
    longitude: appRow.longitude,
  }, isUnlocked);

  return c.json({
    application: {
      id: appRow.application_id,
      status: appRow.application_status,
      applied_at: appRow.applied_at,
    },
    job: {
      id: appRow.job_id,
      title: appRow.job_title,
      description: appRow.description,
      category: appRow.job_category,
      salary_min: appRow.salary_min,
      salary_max: appRow.salary_max,
      salary_period: appRow.salary_period,
      working_hours: appRow.working_hours,
      requirements: appRow.requirements ? JSON.parse(appRow.requirements) : [],
    },
    employer: sanitizedEmployer,
    // Phone of employer only accessible if unlocked
    employerPhone: isUnlocked ? appRow.employer_phone : undefined,
  });
});

export default workerRoutes;

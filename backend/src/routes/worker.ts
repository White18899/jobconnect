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
  let profile = await c.env.DB.prepare(
    'SELECT * FROM worker_profiles WHERE user_id = ?'
  ).bind(user.userId).first();

  const userRow = await c.env.DB.prepare(
    'SELECT email, phone FROM users WHERE id = ?'
  ).bind(user.userId).first<{ email: string; phone: string | null }>();

  if (!profile) {
    const wpId = 'wp_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    const fallbackName = (user.email || userRow?.email || 'Worker').split('@')[0];
    await c.env.DB.prepare(`
      INSERT INTO worker_profiles (id, user_id, full_name, phone, skills, preferred_area, city, verification_status)
      VALUES (?, ?, ?, ?, '[]', 'Visakhapatnam', 'Visakhapatnam', 'pending')
    `).bind(wpId, user.userId, fallbackName, userRow?.phone || null).run();

    profile = await c.env.DB.prepare(
      'SELECT * FROM worker_profiles WHERE user_id = ?'
    ).bind(user.userId).first();
  }

  let parsedEducations = [];
  if ((profile as any).educations) {
    try {
      parsedEducations = typeof (profile as any).educations === 'string'
        ? JSON.parse((profile as any).educations)
        : (profile as any).educations;
    } catch {}
  } else if ((profile as any).education_level || (profile as any).education_institute) {
    parsedEducations = [{
      id: 'edu_1',
      level: (profile as any).education_level || '',
      institute: (profile as any).education_institute || '',
      specialization: (profile as any).education_specialization || '',
      year: (profile as any).education_year || '',
    }];
  }

  return c.json({
    profile: {
      ...profile,
      educations: parsedEducations,
      email: userRow?.email || user.email,
      phone: (profile as any).phone || userRow?.phone,
    }
  });
});

// 2. Update Worker Profile
const educationItemSchema = z.object({
  id: z.string().optional(),
  level: z.string().optional(),
  institute: z.string().optional(),
  specialization: z.string().optional(),
  year: z.union([z.number(), z.string()]).optional(),
});

const updateProfileSchema = z.object({
  full_name: z.string().min(2).optional(),
  trade_title: z.string().optional(),
  phone: z.string().optional(),
  photo_key: z.string().optional(),
  photo_thumb: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience_years: z.number().min(0).max(50).optional(),
  education_level: z.string().optional(),
  education_institute: z.string().optional(),
  education_year: z.number().optional(),
  education_specialization: z.string().optional(),
  educations: z.array(educationItemSchema).optional(),
  past_company: z.string().optional(),
  experience_description: z.string().optional(),
  preferred_area: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  expected_salary_min: z.number().optional(),
  expected_salary_max: z.number().optional(),
  salary_period: z.enum(['hourly', 'daily', 'monthly']).optional(),
  linkedin_url: z.string().optional(),
  linkedin_synced: z.number().optional(),
  id_proof_type: z.enum(['national_id', 'aadhaar_masked', 'voter_id', 'driving_licence', 'passport']).optional(),
  id_number_raw: z.string().optional(),
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

  let educationsJson: string | undefined = undefined;
  if (data.educations) {
    educationsJson = JSON.stringify(data.educations);
    if (data.educations.length > 0) {
      const first = data.educations[0];
      if (!data.education_level && first.level) data.education_level = first.level;
      if (!data.education_institute && first.institute) data.education_institute = first.institute;
      if (!data.education_specialization && first.specialization) data.education_specialization = first.specialization;
      if (!data.education_year && first.year) {
        data.education_year = parseInt(String(first.year), 10) || undefined;
      }
    }
  }

  // Update users phone if provided
  if (data.phone) {
    await c.env.DB.prepare('UPDATE users SET phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(data.phone, user.userId).run();
  }

  await c.env.DB.prepare(`
    UPDATE worker_profiles SET
      full_name = COALESCE(?, full_name),
      trade_title = COALESCE(?, trade_title),
      phone = COALESCE(?, phone),
      photo_key = COALESCE(?, photo_key),
      photo_thumb = COALESCE(?, photo_thumb),
      skills = COALESCE(?, skills),
      experience_years = COALESCE(?, experience_years),
      education_level = COALESCE(?, education_level),
      education_institute = COALESCE(?, education_institute),
      education_year = COALESCE(?, education_year),
      education_specialization = COALESCE(?, education_specialization),
      educations = COALESCE(?, educations),
      past_company = COALESCE(?, past_company),
      experience_description = COALESCE(?, experience_description),
      linkedin_url = COALESCE(?, linkedin_url),
      linkedin_synced = COALESCE(?, linkedin_synced),
      preferred_area = COALESCE(?, preferred_area),
      city = COALESCE(?, city),
      expected_salary_min = COALESCE(?, expected_salary_min),
      expected_salary_max = COALESCE(?, expected_salary_max),
      salary_period = COALESCE(?, salary_period),
      id_proof_type = COALESCE(?, id_proof_type),
      id_number_masked = COALESCE(?, id_number_masked),
      id_doc_key = COALESCE(?, id_doc_key),
      selfie_key = COALESCE(?, selfie_key),
      skill_proof_key = COALESCE(?, skill_proof_key),
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).bind(
    data.full_name ?? null,
    data.trade_title ?? null,
    data.phone ?? null,
    data.photo_key ?? null,
    data.photo_thumb ?? null,
    skillsJson ?? null,
    data.experience_years ?? null,
    data.education_level ?? null,
    data.education_institute ?? null,
    data.education_year ?? null,
    data.education_specialization ?? null,
    educationsJson ?? null,
    data.past_company ?? null,
    data.experience_description ?? null,
    data.linkedin_url ?? null,
    data.linkedin_synced ?? null,
    data.preferred_area ?? null,
    data.city ?? null,
    data.expected_salary_min ?? null,
    data.expected_salary_max ?? null,
    data.salary_period ?? null,
    data.id_proof_type ?? null,
    maskedId ?? null,
    data.id_doc_key ?? null,
    data.selfie_key ?? null,
    data.skill_proof_key ?? null,
    user.userId
  ).run();

  const updated = await c.env.DB.prepare('SELECT * FROM worker_profiles WHERE user_id = ?').bind(user.userId).first();
  let parsedEducations = [];
  if ((updated as any)?.educations) {
    try {
      parsedEducations = typeof (updated as any).educations === 'string'
        ? JSON.parse((updated as any).educations)
        : (updated as any).educations;
    } catch {}
  }
  return c.json({
    success: true,
    profile: {
      ...updated,
      educations: parsedEducations,
    }
  });
});

// 2a. Real Sync / Import Details from LinkedIn
const linkedInSchema = z.object({
  linkedin_url: z.string().min(3, 'Valid LinkedIn profile URL or username required'),
});

workerRoutes.post('/worker/linkedin-sync', authMiddleware, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = linkedInSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message || 'Invalid LinkedIn URL' }, 400);
  }

  const rawInput = parsed.data.linkedin_url.trim();
  let targetUrl = rawInput;
  if (!targetUrl.startsWith('http')) {
    if (!targetUrl.includes('linkedin.com/in/')) {
      targetUrl = `https://www.linkedin.com/in/${targetUrl.replace(/^@/, '')}`;
    } else {
      targetUrl = `https://${targetUrl}`;
    }
  }
  targetUrl = targetUrl.split('?')[0].replace(/\/+$/, '');

  // SSRF Protection: Strictly validate URL protocol and domain whitelist
  try {
    const parsedUrl = new URL(targetUrl);
    const allowedHosts = ['linkedin.com', 'www.linkedin.com'];
    if (parsedUrl.protocol !== 'https:' || !allowedHosts.includes(parsedUrl.hostname.toLowerCase())) {
      return c.json({ error: 'Invalid URL. Only secure HTTPS links to linkedin.com are supported.' }, 400);
    }
  } catch {
    return c.json({ error: 'Malformed LinkedIn profile URL.' }, 400);
  }

  let handle = targetUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '').replace(/\/.*$/, '').replace(/[^a-zA-Z0-9_-]/g, '');
  if (!handle) handle = 'professional';

  // Smart Name heuristic fallback from handle: e.g. "satya-nadella" -> "Satya Nadella"
  const nameFromHandle = handle
    .split(/[-_.]/)
    .filter(w => !['in', 'profile', 'user'].includes(w.toLowerCase()))
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  let extractedName = nameFromHandle || 'LinkedIn Professional';
  let headline = '';
  let pastCompany = '';
  let educationInstitute = '';
  let educationLevel = 'ITI Certificate (Industrial Training Institute)';
  let educationSpec = '';
  let locationCity = '';
  let photoUrl = '';
  let experienceDesc = '';
  let detectedSkills: string[] = [];
  let isLiveFetched = false;

  try {
    let html = '';
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    if (res.ok) {
      html = await res.text();
    }

    let ogTitle = '';
    let ogDesc = '';
    let ogImage = '';
    let authorName = '';

    if (html && html.length > 500 && !html.includes('/authwall')) {
      const ogTitleMatch = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                           html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:title["']/i);
      const ogDescMatch = html.match(/<meta\s+(?:property|name)=["']og:description["']\s+content=["']([^"']+)["']/i) ||
                          html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:description["']/i);
      const ogImageMatch = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                           html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i);

      ogTitle = ogTitleMatch ? ogTitleMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim() : '';
      ogDesc = ogDescMatch ? ogDescMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim() : '';
      ogImage = ogImageMatch ? ogImageMatch[1].replace(/&amp;/g, '&').trim() : '';
    }

    const isLoginWall = !ogTitle ||
      ogTitle.toLowerCase().includes('log in') ||
      ogTitle.toLowerCase().includes('sign up') ||
      ogTitle === 'LinkedIn' ||
      !ogDesc;

    // High-deliverability fallback via microlink if LinkedIn blocked direct Cloudflare IP or showed login wall
    if (isLoginWall || !ogImage || ogImage.includes('static.licdn.com/aero-v1/sc/h/')) {
      try {
        const microRes = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}`, {
          headers: { 'Accept': 'application/json' },
        });
        if (microRes.ok) {
          const microJson: any = await microRes.json();
          if (microJson.status === 'success' && microJson.data) {
            ogTitle = microJson.data.title || ogTitle;
            ogDesc = microJson.data.description || ogDesc;
            ogImage = microJson.data.image?.url || ogImage;
            authorName = microJson.data.author || '';
          }
        }
      } catch (microErr) {
        console.error('Microlink error:', microErr);
      }
    }

    if (authorName) {
      isLiveFetched = true;
      extractedName = authorName.trim();
    } else if (ogTitle) {
      isLiveFetched = true;
      const cleanedTitle = ogTitle.replace(/\s*\|\s*LinkedIn\s*$/i, '');
      const titleParts = cleanedTitle.split(/\s*[-–—]\s*/);
      if (titleParts.length > 0 && titleParts[0].trim()) {
        extractedName = titleParts[0].trim();
      }
      if (titleParts.length > 1) {
        headline = titleParts.slice(1).join(' - ').trim();
      }
    }

    if (ogDesc) {
      isLiveFetched = true;
      experienceDesc = ogDesc;
      const expMatch = ogDesc.match(/(?:Experience|Current):\s*([^·\n]+)/i);
      if (expMatch) pastCompany = expMatch[1].trim();

      const eduMatch = ogDesc.match(/Education:\s*([^·\n]+)/i);
      if (eduMatch) {
        educationInstitute = eduMatch[1].trim();
        educationLevel = "Bachelor's Degree / Diploma";
        educationSpec = 'Technical Trade / Engineering';
      }

      const locMatch = ogDesc.match(/Location:\s*([^·\n]+)/i);
      if (locMatch) locationCity = locMatch[1].trim();
    }

    if (ogImage && !ogImage.includes('static.licdn.com/aero-v1/sc/h/')) {
      photoUrl = ogImage;
    }

      // Detect technical & engineering skills
      const combinedText = `${ogTitle} ${ogDesc} ${headline}`.toLowerCase();
      const techSkills = [
        'Full-Stack Development', 'React', 'TypeScript', 'Node.js', 'Next.js',
        'QA Automation', 'Playwright', 'Cypress', 'Selenium', 'API Testing',
        'System Architecture', 'Agile / Scrum', 'Engineering Management', 'Team Leadership',
        'Cloud Infrastructure', 'DevOps', 'Kubernetes', 'Docker', 'Terraform', 'AWS',
        'Mobile Development', 'React Native', 'Flutter', 'Swift', 'Kotlin',
        'Technical Recruiting', 'HR Operations', 'Talent Acquisition'
      ];
      detectedSkills = techSkills.filter(skill => {
        const s = skill.toLowerCase();
        if (s.includes('react') && combinedText.includes('react')) return true;
        if (s.includes('typescript') && combinedText.includes('typescript')) return true;
        if (s.includes('node') && combinedText.includes('node')) return true;
        if (s.includes('qa') && (combinedText.includes('qa') || combinedText.includes('test') || combinedText.includes('sdet'))) return true;
        if (s.includes('devops') && (combinedText.includes('devops') || combinedText.includes('cloud') || combinedText.includes('infra') || combinedText.includes('sre'))) return true;
        if (s.includes('leadership') && (combinedText.includes('lead') || combinedText.includes('manager') || combinedText.includes('director'))) return true;
        if (s.includes('mobile') && (combinedText.includes('mobile') || combinedText.includes('ios') || combinedText.includes('android') || combinedText.includes('flutter'))) return true;
        if (s.includes('recruiting') && (combinedText.includes('recruit') || combinedText.includes('talent') || combinedText.includes('hr'))) return true;
        return combinedText.includes(s);
      });
  } catch (fetchErr) {
    console.error('LinkedIn live fetch error:', fetchErr);
  }

  // Fallback defaults if empty
  if (!headline) headline = `${extractedName} • Technical Professional`;
  if (!experienceDesc) {
    experienceDesc = `Hands-on trade specialist with real field experience. Profile imported from LinkedIn (${targetUrl}).`;
  }

  const educations = educationInstitute ? [
    {
      id: 'edu_1',
      level: educationLevel,
      institute: educationInstitute,
      specialization: educationSpec || 'General Trade',
      year: 2021
    }
  ] : [];

  return c.json({
    success: true,
    message: isLiveFetched
      ? `Real profile details extracted from LinkedIn for ${extractedName}!`
      : `Profile imported for ${extractedName} from LinkedIn!`,
    isLiveFetched,
    profile: {
      full_name: extractedName,
      headline,
      past_company: pastCompany || undefined,
      experience_description: experienceDesc,
      photo_key: photoUrl || undefined,
      city: locationCity || undefined,
      education_level: educationLevel,
      education_institute: educationInstitute,
      education_specialization: educationSpec,
      educations,
      skills: detectedSkills.length > 0 ? detectedSkills : undefined,
      linkedin_url: targetUrl,
      linkedin_synced: 1,
    }
  });
});

// 3. Public / Worker Job Feed (Exact shop address is strictly hidden)
workerRoutes.get('/jobs', async (c) => {
  const { category, city, min_salary, limit = '20', offset = '0' } = c.req.query();

  let query = `
    SELECT
      j.id, j.employer_id, j.title, j.description, j.category, j.salary_min, j.salary_max, j.salary_period,
      j.location_area, j.location_city, j.working_hours, j.requirements, j.vacancies,
      COALESCE(j.max_applications, 0) as max_applications,
      (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as applications_count,
      j.cover_image, j.maps_url,
      j.status, j.created_at,
      ep.user_id as employer_user_id,
      u.email as employer_email,
      COALESCE(ep.business_name, 'Direct Employer') as business_name,
      COALESCE(ep.business_type, 'Enterprise') as business_type,
      COALESCE(ep.verification_status, 'verified') as employer_verified
    FROM jobs j
    LEFT JOIN employer_profiles ep ON j.employer_id = ep.id
    LEFT JOIN users u ON ep.user_id = u.id
    WHERE j.status = 'open'
  `;

  const params: any[] = [];
  if (category && category !== 'all') {
    query += ' AND (j.category = ? OR j.category LIKE ?)';
    params.push(category, `%${category}%`);
  }
  if (city && city !== 'all') {
    if (city.toLowerCase() === 'visakhapatnam') {
      query += ' AND (j.location_city = ? OR j.location_city LIKE ?)';
      params.push('Visakhapatnam', '%Visakhapatnam%');
    } else {
      query += ' AND (j.location_area LIKE ? OR j.location_city LIKE ?)';
      params.push(`%${city}%`, `%${city}%`);
    }
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

// 3b. Public Candidates Directory Feed (Live from Cloudflare D1 worker_profiles)
workerRoutes.get('/candidates', async (c) => {
  const { category, city, limit = '50', offset = '0' } = c.req.query();

  let query = `
    SELECT
      wp.id,
      wp.full_name as name,
      wp.trade_title,
      wp.skills,
      wp.experience_years as experience,
      wp.city,
      wp.preferred_area,
      wp.photo_key,
      wp.photo_thumb,
      wp.verification_status,
      wp.digilocker_verified,
      wp.created_at,
      wp.phone
    FROM worker_profiles wp
    JOIN users u ON wp.user_id = u.id
    WHERE u.is_blocked = 0
  `;

  const params: any[] = [];
  if (city && city !== 'all') {
    query += ' AND wp.city = ?';
    params.push(city);
  }
  if (category && category !== 'all') {
    query += ' AND (wp.trade_title LIKE ? OR wp.skills LIKE ?)';
    params.push(`%${category}%`, `%${category}%`);
  }

  query += ' ORDER BY wp.experience_years DESC, wp.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit, 10), parseInt(offset, 10));

  const { results } = await c.env.DB.prepare(query).bind(...params).all<any>();

  const candidates = (results || []).map((row: any) => {
    let parsedSkills: string[] = [];
    try {
      parsedSkills = typeof row.skills === 'string' ? JSON.parse(row.skills) : (row.skills || []);
    } catch {
      parsedSkills = [];
    }

    // Mask phone for public candidate directory view
    const rawPhone = row.phone || '';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const lastDigits = cleanPhone.slice(-4) || '9999';
    const maskedPhone = `+91 ••••••${lastDigits}`;

    return {
      id: row.id,
      name: row.name,
      trade_title: row.trade_title || 'Technical Specialist',
      category: row.trade_title || 'Software Engineering',
      skills: parsedSkills,
      experience: row.experience || 0,
      city: row.city || 'Visakhapatnam',
      preferred_area: row.preferred_area || '',
      photo_key: row.photo_key || '',
      photo_thumb: row.photo_thumb || '',
      verified: row.verification_status === 'verified' || row.digilocker_verified === 1,
      phone: maskedPhone,
      phone_masked: maskedPhone,
      unlocked: false,
    };
  });

  return c.json({ candidates });
});

// 4. Job Details (Exact address remains hidden)
workerRoutes.get('/jobs/:id', async (c) => {
  const jobId = c.req.param('id');
  const job = await c.env.DB.prepare(`
    SELECT
      j.*,
      COALESCE(j.max_applications, 0) as max_applications,
      (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as applications_count,
      COALESCE(ep.business_name, 'Direct Employer') as business_name,
      COALESCE(ep.business_type, 'Enterprise') as business_type,
      ep.area as employer_area,
      ep.city as employer_city,
      COALESCE(ep.verification_status, 'verified') as employer_verification_status
    FROM jobs j
    LEFT JOIN employer_profiles ep ON j.employer_id = ep.id
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
  const body = await c.req.json().catch(() => ({}));

  // Find or auto-provision worker profile
  let worker = await c.env.DB.prepare('SELECT id FROM worker_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (!worker) {
    const wpId = 'wp_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    const workerName = body.name || (user.email ? user.email.split('@')[0] : 'Trade Worker');
    await c.env.DB.prepare(`
      INSERT INTO worker_profiles (id, user_id, full_name, phone, trade_title, skills, experience_years, city, preferred_area, verification_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, '["Software Engineering"]', 2, ?, 'Central Area', 'verified', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(wpId, user.userId, workerName, body.phone || user.phone || null, body.category || 'Software Engineer', body.city || 'Visakhapatnam').run();
    worker = { id: wpId };
  }

  // Find job & employer
  const job = await c.env.DB.prepare('SELECT id, employer_id, status, COALESCE(max_applications, 0) as max_applications FROM jobs WHERE id = ?').bind(jobId).first<{ id: string; employer_id: string; status: string; max_applications: number }>();
  if (!job || job.status !== 'open') {
    return c.json({ error: 'Job is no longer open for applications' }, 400);
  }

  // Check if job application limit reached
  if (job.max_applications && job.max_applications > 0) {
    const appCount = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM applications WHERE job_id = ?'
    ).bind(jobId).first<{ count: number }>();
    if (appCount && appCount.count >= job.max_applications) {
      return c.json({
        error: `Application limit reached (${job.max_applications} applicants max). This opening is no longer accepting new applications.`
      }, 400);
    }
  }

  // Check if already applied
  const existing = await c.env.DB.prepare(
    'SELECT id, status FROM applications WHERE job_id = ? AND worker_id = ?'
  ).bind(jobId, worker.id).first<any>();

  if (existing) {
    return c.json({
      success: true,
      alreadyApplied: true,
      message: 'You have already applied for this job',
      applicationId: existing.id,
      application: existing
    }, 200);
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

// 5b. Unapply / Withdraw Job Application
workerRoutes.delete('/jobs/:id/apply', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  const jobId = c.req.param('id');

  const worker = await c.env.DB.prepare('SELECT id FROM worker_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (worker) {
    await c.env.DB.prepare('DELETE FROM applications WHERE (job_id = ? OR id = ?) AND worker_id = ?').bind(jobId, jobId, worker.id).run();
  }

  return c.json({ success: true, message: 'Application withdrawn successfully' });
});

workerRoutes.post('/jobs/:id/unapply', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  const jobId = c.req.param('id');

  const worker = await c.env.DB.prepare('SELECT id FROM worker_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (worker) {
    await c.env.DB.prepare('DELETE FROM applications WHERE (job_id = ? OR id = ?) AND worker_id = ?').bind(jobId, jobId, worker.id).run();
  }

  return c.json({ success: true, message: 'Application withdrawn successfully' });
});

workerRoutes.delete('/worker/applications/:appId', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  const appId = c.req.param('appId');

  const worker = await c.env.DB.prepare('SELECT id FROM worker_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  if (worker) {
    await c.env.DB.prepare('DELETE FROM applications WHERE (id = ? OR job_id = ?) AND worker_id = ?').bind(appId, appId, worker.id).run();
  }

  return c.json({ success: true, message: 'Application withdrawn successfully' });
});

// 6. Worker Applications List
workerRoutes.get('/worker/applications', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  const worker = await c.env.DB.prepare('SELECT id FROM worker_profiles WHERE user_id = ?').bind(user.userId).first<{ id: string }>();
  const workerId = worker ? worker.id : user.userId;

  const { results } = await c.env.DB.prepare(`
    SELECT
      a.id as application_id, a.status as application_status, a.applied_at, a.updated_at,
      j.id as job_id, j.title as job_title, j.category as job_category, j.salary_min, j.salary_max,
      j.salary_period, j.location_area, j.location_city, j.maps_url as job_maps_url,
      ep.id as employer_id, ep.business_name, ep.business_type, ep.area as employer_area, ep.city as employer_city,
      ep.exact_address as employer_address, ep.maps_url as employer_maps_url,
      p.status as payment_status
    FROM applications a
    LEFT JOIN jobs j ON a.job_id = j.id
    LEFT JOIN employer_profiles ep ON a.employer_id = ep.id
    LEFT JOIN payments p ON p.application_id = a.id
    WHERE (a.worker_id = ? OR a.worker_id = ?)
    ORDER BY a.applied_at DESC
  `).bind(workerId, user.userId).all<any>();

  const applications = (results || []).map((row: any) => {
    const isUnlocked = row.application_status === 'unlocked';
    const workplaceLoc = row.location_area
      ? `${row.location_area}, ${row.location_city || 'Visakhapatnam'}`
      : (row.employer_address || `${row.employer_area || 'Visakhapatnam'}, ${row.employer_city || 'Visakhapatnam'}`);
    const mapsUrl = row.job_maps_url || row.employer_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(workplaceLoc)}`;

    return {
      id: row.application_id,
      application_id: row.application_id,
      job_id: row.job_id,
      job_title: row.job_title || 'Direct Candidate Shortlist',
      job_category: row.job_category || 'Technical',
      worker_category: row.job_category || 'Technical',
      employer_name: row.business_name || 'Hiring Employer',
      employer_id: row.employer_id,
      applied_date: row.applied_at ? row.applied_at.split('T')[0] : new Date().toISOString().split('T')[0],
      status: row.application_status || 'applied',
      priority: 'STANDARD',
      salary_min: row.salary_min,
      salary_max: row.salary_max,
      location_area: row.location_area || row.employer_area,
      location_city: row.location_city || row.employer_city,
      workplace_location: workplaceLoc,
      maps_url: mapsUrl,
      unlocked: isUnlocked,
      worker_experience: 3,
    };
  });

  return c.json({ applications });
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

// 8. Get Worker Notifications
workerRoutes.get('/worker/notifications', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  const { results } = await c.env.DB.prepare(`
    SELECT id, title, message, type, is_read, metadata_json, created_at
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 50
  `).bind(user.userId).all<any>();

  const notifications = (results || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    message: r.message,
    type: r.type,
    is_read: Boolean(r.is_read),
    metadata: r.metadata_json ? (typeof r.metadata_json === 'string' ? JSON.parse(r.metadata_json) : r.metadata_json) : null,
    created_at: r.created_at
  }));

  const unreadCount = notifications.filter(n => !n.is_read).length;
  return c.json({ notifications, unreadCount });
});

// 9. Mark Worker Notification as Read
workerRoutes.post('/worker/notifications/:id/read', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  const notifId = c.req.param('id');
  await c.env.DB.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').bind(notifId, user.userId).run();
  return c.json({ success: true });
});

// 10. Mark All Worker Notifications as Read
workerRoutes.post('/worker/notifications/read-all', authMiddleware, roleGuard(['worker']), async (c) => {
  const user = c.get('user');
  await c.env.DB.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').bind(user.userId).run();
  return c.json({ success: true });
});

export default workerRoutes;

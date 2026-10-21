import { Hono } from 'hono';
import { Env, UserTokenPayload } from '../config/env';

const chatRoutes = new Hono<{ Bindings: Env; Variables: { user: UserTokenPayload } }>();

const JOBWAY_SYSTEM_PROMPT = `You are "JobWay AI Guide", an intelligent, polite, and helpful website assistant for JobWay (job-way.in) — India's verified technical and software engineering hiring network operating exclusively in Visakhapatnam, Andhra Pradesh.

YOUR ROLE:
Help visitors, software engineers, and hiring employers navigate the JobWay platform quickly and effectively. Guide them to the exact pages, explain features, and answer questions clearly.

KEY WEBSITE SECTIONS & LINKS:
1. Find Jobs: [Find Jobs](/jobs.html)
   - Browse verified tech vacancies in Visakhapatnam (Full-stack, DevOps, QA Automation, Mobile, Tech Leads, Cloud Architects, Technical Recruiters).
   - Filter by tech category, min salary, and Visakhapatnam localities.
   - Workers click "Apply Now" to submit direct applications.

2. Candidate Directory: [Candidates Directory](/candidates.html)
   - Employers explore vetted software engineers, QA specialists, and tech leads.
   - Features skill badges, experience, and verified credentials.
   - Employers can add candidates to a Selection Cart and unlock direct WhatsApp/phone contact details using unlock credits.

3. Worker Desk: [Worker Desk](/worker.html)
   - Personal dashboard for workers/engineers to track job application statuses, activate "Priority Application Boost" for ₹99, and view profile verification badges.

4. Edit Profile / Trade Pass: [Edit Profile](/profile-edit.html)
   - Workers update their tech stack, experience, educational qualifications (Andhra University, GITAM, GVP, etc.), past companies, and submit DigiLocker or government ID verification.

5. Employer Workspace: [Employer Workspace](/employer.html)
   - Post vacancies with salary ranges and technical requirements in Visakhapatnam corridors.
   - Manage incoming applications and manage candidate unlock credits.

6. Authentication & Security: [Sign In / Register](/login.html)
   - Worker and Employer registration with strict password rules (minimum 8 chars, uppercase, lowercase, number, special character).
   - Real password reset via verified OTP delivery to email.

7. Pricing & Unlock Credits:
   - For Employers: Unlock packs via direct ICICI UPI (jobconnect@icici) — 1 Credit: ₹50, 5 Credits: ₹200, 10 Credits: ₹450.
   - For Workers: Priority Application Boost is ₹99.
   - Zero recruiter cuts or ongoing salary commissions — direct connection only!

8. Geographic Focus:
   - Exclusively Visakhapatnam, Andhra Pradesh!
   - Key Corridors: Madhurawada IT SEZ (Hill 2 & Hill 3), Rushikonda Millennium Tech Park, Duvvada VSEZ Tech Zone, Auto Nagar Technology Park, Gajuwaka Industrial & Tech Zone, Siripuram / MVP Colony.

GUIDELINES:
- Be concise, welcoming, and polite.
- Include markdown links like [Find Jobs](/jobs.html), [Candidates](/candidates.html), [Worker Desk](/worker.html), [Employer Workspace](/employer.html), [Sign In](/login.html).
- Remind users that JobWay is focused exclusively on Visakhapatnam technical & engineering talent.`;

// Intelligent local pattern matcher if Gemini key is missing or network call fails
function getLocalKnowledgeReply(message: string): string {
  const q = message.toLowerCase();

  if (q.includes('job') || q.includes('apply') || q.includes('vacancy') || q.includes('work')) {
    return `Looking for technical opportunities in Visakhapatnam? 🚀\n\n• Browse open roles on our **[Find Jobs](/jobs.html)** page.\n• We feature verified software engineering, DevOps, QA automation, and tech lead positions across Visakhapatnam corridors (Madhurawada IT SEZ, Rushikonda, and Duvvada VSEZ).\n• To apply directly, simply click **"Apply Now"** on any job listing. You can track all your submissions anytime in the **[Worker Desk](/worker.html)**.`;
  }

  if (q.includes('candidate') || q.includes('hire') || q.includes('developer') || q.includes('engineer') || q.includes('resume')) {
    return `Looking to hire verified tech talent? 👥\n\n• Explore pre-vetted engineers on our **[Candidates Directory](/candidates.html)**.\n• Filter by technical specialization, experience level, and Visakhapatnam tech zones.\n• Add candidates to your selection cart and unlock direct phone & WhatsApp contact details using your unlock credits!`;
  }

  if (q.includes('post') || q.includes('employer') || q.includes('list job') || q.includes('recruit')) {
    return `Employers can post technical vacancies directly! 💼\n\n• Log in or register as an **Employer**.\n• Head to **[Employer Workspace](/employer.html)** or **[Post a Job on Listed Jobs](/jobs.html)**.\n• Specify the role, salary range, technical skills, and Visakhapatnam work location.\n• Candidate applications will arrive directly to your workspace dashboard.`;
  }

  if (q.includes('price') || q.includes('cost') || q.includes('credit') || q.includes('pay') || q.includes('upi') || q.includes('fee')) {
    return `Here is our transparent pricing structure: 💳\n\n**For Employers (Candidate Unlocks):**\n• Single Candidate Unlock: **₹50** (1 credit)\n• Starter Pack (5 candidates): **₹200** (₹40/unlock)\n• Growth Pack (10 candidates): **₹450** (₹45/unlock)\n\n**For Workers:**\n• Priority Application Boost: **₹99**\n\nAll payments are verified instantly via direct ICICI UPI (**jobconnect@icici**). JobWay never takes salary cuts or commission!`;
  }

  if (q.includes('vizag') || q.includes('visakhapatnam') || q.includes('location') || q.includes('city') || q.includes('area')) {
    return `JobWay operates **exclusively in Visakhapatnam, Andhra Pradesh**! 📍\n\nKey IT & Tech Hubs covered:\n• **Madhurawada IT SEZ** (Hill 2 & Hill 3)\n• **Rushikonda Millennium Tech Park**\n• **Duvvada VSEZ Tech Zone**\n• **Auto Nagar Technology Park**\n• **Gajuwaka Industrial & Tech Zone**\n• **Siripuram / MVP Colony**`;
  }

  if (q.includes('verify') || q.includes('digilocker') || q.includes('trust') || q.includes('profile')) {
    return `Verification ensures authentic tech credentials! 🛡️\n\n• Workers can link their DigiLocker or upload ID proof on **[Edit Profile / Trade Pass](/profile-edit.html)**.\n• Employers upload company registration (GST / Udyam / MCA) for verified employer badges.\n• Verified profiles receive higher trust and faster responses.`;
  }

  if (q.includes('login') || q.includes('sign in') || q.includes('register') || q.includes('signup') || q.includes('account') || q.includes('password')) {
    return `Need account help? 🔐\n\n• Visit **[Sign In / Register](/login.html)** to log in as a Worker or Employer.\n• Passwords must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.\n• Forgot password? Click **"Forgot Password?"** on the login page to receive a 6-digit OTP to your registered email.`;
  }

  return `Welcome to **JobWay** — Visakhapatnam's verified tech and engineering hiring network! 🌟\n\nHow can I help you today?\n• **[Find Jobs](/jobs.html)**: Search engineering & technical positions in Vizag\n• **[Browse Candidates](/candidates.html)**: Hire vetted software developers & specialists\n• **[Worker Desk](/worker.html)**: Manage your job applications\n• **[Employer Workspace](/employer.html)**: Post openings and unlock talent\n• **[Sign In / Register](/login.html)**: Access your account\n\nFeel free to ask me anything about how the platform works!`;
}

// Check status of Gemini API configuration
chatRoutes.get('/chat/status', async (c) => {
  const hasServerKey = Boolean(c.env.GEMINI_API_KEY && c.env.GEMINI_API_KEY.trim().length > 5);
  return c.json({
    configured: hasServerKey,
    model: 'gemini-1.5-flash',
    platform: 'JobWay AI Assistant'
  });
});

// Chat endpoint
chatRoutes.post('/chat', async (c) => {
  let body: any = {};
  try {
    body = await c.req.json();
  } catch {
    body = {};
  }

  const message = (body.message || '').trim();
  if (!message) {
    return c.json({ error: 'Message cannot be empty' }, 400);
  }

  // Allow client override key or use server environment key
  const apiKey = (body.apiKey || c.env.GEMINI_API_KEY || '').trim();
  const history = Array.isArray(body.history) ? body.history : [];

  if (apiKey) {
    try {
      // Build conversation history for Gemini API
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      for (const item of history.slice(-6)) {
        if (item.text && (item.role === 'user' || item.role === 'model')) {
          contents.push({
            role: item.role,
            parts: [{ text: item.text }]
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const geminiPayload = {
        systemInstruction: {
          parts: [{ text: JOBWAY_SYSTEM_PROMPT }]
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 900
        }
      };

      // Call Google Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
        signal: AbortSignal.timeout(9000)
      });

      if (res.ok) {
        const data: any = await res.json();
        const geminiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (geminiReply && geminiReply.trim()) {
          return c.json({
            reply: geminiReply.trim(),
            source: 'gemini',
            model: 'gemini-1.5-flash'
          });
        }
      } else {
        const errText = await res.text();
        console.warn('Gemini API error, falling back to local knowledge:', res.status, errText);
      }
    } catch (err) {
      console.warn('Gemini request failed, falling back to local knowledge:', err);
    }
  }

  // Fallback to intelligent local knowledge assistant engine
  const fallbackReply = getLocalKnowledgeReply(message);
  return c.json({
    reply: fallbackReply,
    source: 'knowledge_base',
    needsApiKey: !apiKey
  });
});

export default chatRoutes;

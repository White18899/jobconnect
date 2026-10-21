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
   - Personal dashboard for workers/engineers to track job application statuses, activate "Priority Application Boost" for ₹149, and view profile verification badges.

4. Edit Profile / Trade Pass: [Edit Profile](/profile-edit.html)
   - Workers update their tech stack, experience, educational qualifications (Andhra University, GITAM, GVP, etc.), past companies, and submit DigiLocker or government ID verification.

5. Employer Workspace: [Employer Workspace](/employer.html)
   - Post vacancies with salary ranges and technical requirements in Visakhapatnam corridors.
   - Manage incoming applications and manage candidate unlock credits.

6. Authentication & Security: [Sign In / Register](/login.html)
   - Worker and Employer registration with strict password rules (minimum 8 chars, uppercase, lowercase, number, special character).
   - Real password reset via verified OTP delivery to email.

7. Pricing & Unlock Credits:
   - For Employers (Candidate Unlocks):
     • Starter Pack (1 Unlock): ₹75
     • Growth Bundle (5 Unlocks): ₹249 (₹49/ea) — Most Popular (Save 35%)
     • Scale Pack (10 Unlocks): ₹475 (₹47/ea)
   - For Tech Candidates: 100% Free to browse jobs, apply, create profile, and get verified. Optional Priority Application Boost is ₹149.
   - Zero recruiter cuts or ongoing salary commissions — direct connection only!

8. Geographic Focus:
   - Exclusively Visakhapatnam, Andhra Pradesh!
   - Key Corridors: Madhurawada IT SEZ (Hill 2 & Hill 3), Rushikonda Millennium Tech Park, Duvvada VSEZ Tech Zone, Auto Nagar Technology Park, Gajuwaka Industrial & Tech Zone, Siripuram / MVP Colony.

GUIDELINES:
- Be concise, welcoming, and polite.
- Include markdown links like [Find Jobs](/jobs.html), [Candidates](/candidates.html), [Worker Desk](/worker.html), [Employer Workspace](/employer.html), [Sign In](/login.html).
- Remind users that JobWay is focused exclusively on Visakhapatnam technical & engineering talent.`;

// Intelligent local knowledge assistant engine if Gemini key is denied or network fails
function getLocalKnowledgeReply(message: string, history: Array<{ role: string; text: string }> = []): string {
  const q = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|hola|greetings|good\s*(morning|afternoon|evening)|yo)\b/i.test(q)) {
    return `Hello! 👋 I'm your **JobWay AI Assistant** for Visakhapatnam.\n\nHow can I help you today?\n• Looking for technical jobs? Check **[Find Jobs](/jobs.html)**\n• Looking to hire engineers? Browse **[Candidates](/candidates.html)**\n• Need a walkthrough? Ask me *"how to use it"*!`;
  }

  // How to use / Getting started / Walkthrough
  if (q.includes('how to use') || q.includes('how it work') || q.includes('how does it work') || q.includes('how do i use') || q.includes('guide') || q.includes('tutorial') || q.includes('steps') || q.includes('start') || q.includes('getting started')) {
    return `Here is a quick walkthrough on how to use **JobWay**: 🚀\n\n**1. For Job Seekers (Software Engineers & Tech Talent):**\n• **Search**: Head to **[Find Jobs](/jobs.html)** to explore verified engineering positions in Visakhapatnam.\n• **Apply**: Click **"Apply Now"** directly on any listing with your details.\n• **Track**: Check your active applications anytime on your **[Worker Desk](/worker.html)**.\n• **Get Verified**: Connect your DigiLocker or upload ID in **[Edit Profile](/profile-edit.html)** for higher employer trust.\n\n**2. For Employers (Hiring Companies & Recruiters):**\n• **Find Talent**: Search pre-vetted engineers on **[Candidates](/candidates.html)** by tech stack and Vizag location.\n• **Unlock Direct Contact**: Add candidates to your selection cart and unlock direct WhatsApp & phone numbers using credits.\n• **Post Vacancies**: Post engineering roles directly in the **[Employer Workspace](/employer.html)**.\n\nWhat would you like to explore first?`;
  }

  // Who are you / About
  if (q.includes('who are you') || q.includes('what are you') || q.includes('what is jobway') || q.includes('tell me about') || q.includes('about you') || q.includes('about jobway')) {
    return `I am the **JobWay AI Guide**! 🤖\n\n**JobWay** is Visakhapatnam's premier verified technical and software engineering hiring network.\n\nKey highlights:\n• **100% Focused on Visakhapatnam**: Centered on Madhurawada IT SEZ, Rushikonda Millennium Park, and Duvvada VSEZ.\n• **Verified Talent**: Profiles backed by DigiLocker and credential checks.\n• **Zero Recruiter Cuts**: Direct connection between verified tech talent and employers without agency commissions!\n\nFeel free to ask me anything about finding jobs or hiring talent in Vizag!`;
  }

  // Features / Capabilities
  if (q.includes('feature') || q.includes('what can you do') || q.includes('capabilities') || q.includes('what do you do')) {
    return `Here are the core features available on **JobWay**: ✨\n\n• **[Find Jobs](/jobs.html)**: Search software, DevOps, QA, and tech lead positions with salary transparency.\n• **[Candidate Directory](/candidates.html)**: Filter pre-vetted engineers by tech stack, experience, and Vizag locality.\n• **[Worker Desk](/worker.html)**: Track job application statuses and activate Priority Application Boost.\n• **[Employer Workspace](/employer.html)**: Post openings and manage incoming applicant pipelines.\n• **[DigiLocker Verification](/profile-edit.html)**: Government-backed trust badges for engineers.\n• **[Instant UPI Unlock Credits](/candidates.html)**: Transparent candidate unlock pricing starting at ₹75/unlock (or ₹249 for 5 unlocks) via ICICI UPI without recruiter markups.`;
  }

  // Job Search / Applying
  if (q.includes('job') || q.includes('apply') || q.includes('vacancy') || q.includes('work') || q.includes('opening') || q.includes('role')) {
    return `Looking for technical opportunities in Visakhapatnam? 🚀\n\n• Browse open roles on our **[Find Jobs](/jobs.html)** page.\n• We feature verified software engineering, DevOps, QA automation, and tech lead positions across Visakhapatnam corridors (Madhurawada IT SEZ, Rushikonda, and Duvvada VSEZ).\n• To apply directly, simply click **"Apply Now"** on any job listing. You can track all your submissions anytime in the **[Worker Desk](/worker.html)**.`;
  }

  // Candidates / Hiring
  if (q.includes('candidate') || q.includes('hire') || q.includes('developer') || q.includes('engineer') || q.includes('talent') || q.includes('resume') || q.includes('cv')) {
    return `Looking to hire verified tech talent? 👥\n\n• Explore pre-vetted engineers on our **[Candidates Directory](/candidates.html)**.\n• Filter by technical specialization, experience level, and Visakhapatnam tech zones.\n• Add candidates to your selection cart and unlock direct phone & WhatsApp contact details using your unlock credits!`;
  }

  // Employer / Posting jobs
  if (q.includes('post') || q.includes('employer') || q.includes('list job') || q.includes('recruit') || q.includes('company')) {
    return `Employers can post technical vacancies directly! 💼\n\n• Log in or register as an **Employer**.\n• Head to **[Employer Workspace](/employer.html)** or **[Post a Job on Listed Jobs](/jobs.html)**.\n• Specify the role, salary range, technical skills, and Visakhapatnam work location.\n• Candidate applications will arrive directly to your workspace dashboard.`;
  }

  // Pricing / Credits / Payment
  if (q.includes('price') || q.includes('cost') || q.includes('credit') || q.includes('pay') || q.includes('upi') || q.includes('fee') || q.includes('pricing') || q.includes('rate')) {
    return `Here is our transparent pricing structure: 💳\n\n**For Employers (Candidate Unlocks):**\n• **Starter Pack**: **₹75** (1 candidate unlock)\n• **Growth Bundle**: **₹249** (5 candidate unlocks • ₹49/ea • *Most Popular • Save 35%*)\n• **Scale Pack**: **₹475** (10 candidate unlocks • ₹47/ea)\n\n**For Tech Candidates & Engineers:**\n• **100% Free**: Search, apply, build profiles, and get verified for free.\n• **Priority Application Boost**: **₹149** (optional visibility boost on your Worker Desk)\n\nAll payments are verified via direct ICICI UPI (**jobconnect@icici**). JobWay never takes salary cuts or recruiter commissions!`;
  }

  // Location / Vizag corridors
  if (q.includes('vizag') || q.includes('visakhapatnam') || q.includes('location') || q.includes('city') || q.includes('area') || q.includes('place') || q.includes('where')) {
    return `JobWay operates **exclusively in Visakhapatnam, Andhra Pradesh**! 📍\n\nKey IT & Tech Hubs covered:\n• **Madhurawada IT SEZ** (Hill 2 & Hill 3)\n• **Rushikonda Millennium Tech Park**\n• **Duvvada VSEZ Tech Zone**\n• **Auto Nagar Technology Park**\n• **Gajuwaka Industrial & Tech Zone**\n• **Siripuram / MVP Colony**`;
  }

  // Verification / DigiLocker
  if (q.includes('verify') || q.includes('verification') || q.includes('digilocker') || q.includes('trust') || q.includes('badge')) {
    return `Verification ensures authentic tech credentials! 🛡️\n\n• Workers can link their DigiLocker or upload ID proof on **[Edit Profile / Trade Pass](/profile-edit.html)**.\n• Employers upload company registration (GST / Udyam / MCA) for verified employer badges.\n• Verified profiles receive higher trust and faster responses.`;
  }

  // Auth / Login / Password
  if (q.includes('login') || q.includes('sign in') || q.includes('register') || q.includes('signup') || q.includes('account') || q.includes('password') || q.includes('reset') || q.includes('forgot')) {
    return `Need account help? 🔐\n\n• Visit **[Sign In / Register](/login.html)** to log in as a Worker or Employer.\n• Passwords must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.\n• Forgot password? Click **"Forgot Password?"** on the login page to receive a 6-digit OTP to your registered email.`;
  }

  // Support / Contact
  if (q.includes('contact') || q.includes('support') || q.includes('email') || q.includes('phone') || q.includes('help')) {
    return `Need direct support? 💬\n\n• You can reach our Visakhapatnam support desk directly at **support@job-way.in**.\n• For candidate unlock verification, share your UPI transaction UTR number in your employer workspace.\n• Or feel free to ask me any question about navigating JobWay right here!`;
  }

  // General fallback
  return `I'm here to help you get the most out of **JobWay Visakhapatnam**! 🌟\n\nHere are some popular topics you can ask me about:\n• **"How to use it"**: Quick guide for candidates & employers\n• **"Find jobs"**: View tech openings in Vizag\n• **"Hire candidates"**: Browse vetted software engineers\n• **"Pricing"**: Unlock credit costs and UPI details\n• **"IT corridors"**: Technology hubs in Visakhapatnam\n\nWhat can I help you with?`;
}

// Check status of Gemini API configuration
chatRoutes.get('/chat/status', async (c) => {
  const hasServerKey = Boolean(c.env.GEMINI_API_KEY && c.env.GEMINI_API_KEY.trim().length > 5);
  return c.json({
    configured: hasServerKey,
    model: 'gemini-3.8-flash',
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

  // Use secure server-side API key
  const apiKey = (c.env.GEMINI_API_KEY || '').trim();
  const history = Array.isArray(body.history) ? body.history : [];
  let geminiDenied = false;

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

      const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest'];
      let geminiReply: string | null = null;

      for (const model of candidateModels) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const res = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiPayload),
            signal: AbortSignal.timeout(9000)
          });

          if (res.ok) {
            const data: any = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim()) {
              geminiReply = text.trim();
              return c.json({
                reply: geminiReply,
                source: 'gemini',
                model
              });
            }
          } else {
            const errText = await res.text();
            console.warn(`[Gemini API] Model ${model} returned ${res.status}:`, errText);
            if (res.status === 403) {
              geminiDenied = true;
            }
          }
        } catch (callErr) {
          console.warn(`[Gemini API] Request error for ${model}:`, callErr);
        }
      }
    } catch (err) {
      console.warn('Gemini request failed, falling back to local knowledge:', err);
    }
  }

  // Fallback to intelligent local knowledge assistant engine
  const fallbackReply = getLocalKnowledgeReply(message, history);
  return c.json({
    reply: fallbackReply,
    source: 'knowledge_base',
    needsApiKey: !apiKey,
    geminiPermissionDenied: geminiDenied
  });
});

export default chatRoutes;

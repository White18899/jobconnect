# JobWay (JobConnect)

India's Verified Technical & Industrial Trades Network — connecting certified automation engineers, CNC machinists, EV technicians, and precision engineering specialists directly with vetted industrial employers across India with zero wage brokerage deductions.

---

## Architecture

- **Frontend:** Vanilla HTML5, modern CSS3 (`editorial.css`, `style.css`), and JavaScript (`api.js`, `app.js`). Hosted on **Cloudflare Pages**.
- **Backend:** **Cloudflare Workers** built with **Hono**, TypeScript, and Zod.
- **Database:** **Cloudflare D1** (Serverless SQL with relational migrations).
- **Session & KV:** **Cloudflare Workers KV** (OTPs, rate limits, session store).
- **Object Storage:** **Cloudflare R2** (worker resumes, KYC docs, and certifications).
- **Mailing:** SMTP relay (Brevo SMTP) for OTPs and notifications.

---

## Directory Structure

```
jobconnect/
├── backend/                  # Cloudflare Workers API Engine
│   ├── src/
│   │   ├── config/           # Environment, constants, and typed bindings
│   │   ├── db/               # D1 SQL schemas and migrations
│   │   ├── middlewares/      # Auth, role-guards, rate-limiting, error handling
│   │   ├── routes/           # Auth, Worker, Employer, Admin, Payments, Uploads
│   │   ├── services/         # OTP, SMTP, Privacy shielding, R2 Storage
│   │   └── index.ts          # Hono app entry point
│   ├── wrangler.toml         # Workers deployment & D1/KV/R2 bindings config
│   └── package.json
├── public/                   # Cloudflare Pages static frontend
│   ├── assets/               # Lettermarks, trade badges, hero photography
│   ├── css/                  # Swiss editorial design system & core styles
│   ├── js/                   # Live API client with offline fallback & page controllers
│   ├── index.html            # Public landing showcase
│   ├── jobs.html             # Vacancies directory & live application drawer
│   ├── candidates.html       # Verified tradesmen directory & employer unlock cart
│   ├── worker.html           # Worker desk & Trade Pass management
│   ├── employer.html         # Employer terminal & vacancy management
│   ├── profile-edit.html     # Worker Trade Pass editor & workshop photo uploader
│   ├── login.html            # Unified OTP authentication
│   └── admin.html            # Ledger oversight & candidate verification
├── wrangler.jsonc            # Cloudflare Pages configuration
├── package.json              # Workspace root scripts
└── serve.json                # Local development server configuration
```

---

## Development

### 1. Start Local Frontend
```bash
npm run dev
# Serves frontend on http://localhost:3000
```

### 2. Start Local Backend
```bash
npm run backend:dev
# Runs Cloudflare Workers dev server on http://localhost:8787
```

---

## Deployment

### Frontend (Cloudflare Pages)
```bash
npm run deploy:frontend
```

### Backend (Cloudflare Workers)
```bash
npm run backend:deploy
```

### D1 Database Migrations (Remote)
```bash
npm run backend:migrate
```

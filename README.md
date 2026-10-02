# JobConnect (జాబ్‌కనెక్ట్ / जॉबकनेक्ट)

> Direct, privacy-first blue-collar job platform connecting skilled workers (mechanics, cooks, welders, helpers, electricians) with local shops and small businesses.

Built with a **Cloudflare Full-Stack Edge Architecture**:
- **API Engine**: Cloudflare Workers + Hono (TypeScript)
- **Database**: Cloudflare D1 (Serverless SQLite) with versioned migrations
- **Private Storage**: Cloudflare R2 (Masked ID proofs, live selfies, shop photos, payment receipts)
- **Session & Caching**: Cloudflare KV (5-minute OTP hashing, write rate limiting)
- **Frontend**: React + Tailwind CSS + Lucide Icons + `qrcode.react` (Mobile-First, i18n English/Telugu/Hindi, Cloudflare Pages ready)

---

## 🌟 Key Architecture & Privacy Highlights

1. **Strict Server-Enforced Privacy**:
   - **Worker Phone Numbers**: Stripped across the network and hidden until an application is **unlocked** by admin approval.
   - **Employer Exact Address & GPS**: Hidden publicly (only locality and city are shown). Exact door number, street, and Google Maps pin unlock only after verification approval.
   - **Zero Raw Aadhaar Storage**: IDs are masked (`XXXX-XXXX-4912`) before persistence in D1 in compliance with UIDAI privacy standards.
   - **Private R2 Buckets**: Verification documents are never publicly accessible; served exclusively through authenticated short-lived presigned URLs (15-min TTL).

2. **Normal QR UPI Payment & Verification Flow**:
   - Employer accepts an applicant and initiates payment.
   - System generates dynamic UPI payment link & QR: `upi://pay?pa=jobconnect@icici&pn=JobConnect&am=499&cu=INR&tn={orderCode}`.
   - Employer pays ₹499 and enters the 12-digit UPI reference (UTR) + uploads screenshot.
   - **D1 UNIQUE constraint on `upi_ref`** prevents reusing payments.
   - Admin inspects the verification queue with a 5-point compliance checklist:
     1. Documents are clear and readable.
     2. Name matches on ID and application.
     3. Live selfie matches photo ID.
     4. Shop storefront and map pin verified.
     5. No duplicate or suspended accounts.
   - **Approve**: Payment = `successful`, Application = `unlocked`. Worker phone and exact shop map pin are revealed.
   - **Reject**: Payment = `rejected`, Application = `verification_rejected`. Admin logs manual refund UTR to complete the transaction.

3. **Multilingual (i18n)**:
   - Full support for **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)** with an instant dropdown switcher.

---

## 📂 Repository Structure

```
jobconnect/
├── backend/                             # Cloudflare Workers API
│   ├── src/
│   │   ├── config/                      # Bindings (D1, KV, R2), constants
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   │   ├── 0001_initial_schema.sql
│   │   │   │   └── 0002_seed_sample_data.sql
│   │   │   └── schema.sql               # Master schema
│   │   ├── middlewares/                 # JWT Auth, Role Guard, Rate Limiting, Error Handler
│   │   ├── routes/                      # Auth, Worker, Employer, Payments, Admin, Uploads
│   │   ├── services/                    # OTP KV hash, R2 storage, Privacy sanitizers, Audit logger
│   │   ├── scripts/seed-admin.ts        # CLI admin bootstrap
│   │   └── index.ts                     # Hono app entry point
│   ├── wrangler.toml                    # Cloudflare bindings configuration
│   └── package.json
│
├── frontend/                            # React + Tailwind + Vite (Cloudflare Pages)
│   ├── src/
│   │   ├── components/                  # Common UI, Layout, Auth, Worker, Employer, Admin
│   │   ├── contexts/                    # AuthContext (Role Switcher), LanguageContext (i18n)
│   │   ├── i18n/                        # en.json, te.json, hi.json
│   │   ├── pages/                       # Shared, Worker, Employer, and Admin views
│   │   ├── services/                    # API client (switches seamlessly with mock data)
│   │   ├── App.tsx                      # Main app controller
│   │   └── index.css                    # Tailwind + subtle glassmorphism tokens
│   └── package.json
└── README.md
```

---

## 🚀 Cloudflare Deployment Guide

### Prerequisites
- Node.js (v18+)
- Cloudflare Account & [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

```bash
npm install -g wrangler
wrangler login
```

---

### Step 1: Provision Cloudflare Resources

#### 1. Create Cloudflare D1 SQLite Database
```bash
wrangler d1 create jobconnect-db
```
*Copy the `database_id` from the output and paste it into `backend/wrangler.toml`:*
```toml
[[d1_databases]]
binding = "DB"
database_name = "jobconnect-db"
database_id = "<YOUR_D1_DATABASE_ID>"
```

#### 2. Create Cloudflare R2 Private Bucket
```bash
wrangler r2 bucket create jobconnect-files
```

#### 3. Create Cloudflare KV Namespace for OTP & Rate Limiting
```bash
wrangler kv:namespace create "KV"
```
*Copy the namespace `id` and update `backend/wrangler.toml`:*
```toml
[[kv_namespaces]]
binding = "KV"
id = "<YOUR_KV_NAMESPACE_ID>"
```

#### 4. Configure Production Secrets
```bash
cd backend
wrangler secret put JWT_SECRET
# Enter a secure 64-character random string

wrangler secret put SMS_API_KEY
# Enter your SMS gateway key (Fast2SMS / Twilio)

wrangler secret put UPI_ID
# e.g., yourcompany@icici
```

---

### Step 2: Run Database Migrations

#### Local Database (Development)
```bash
cd backend
npm run db:migrate:local
```

#### Remote Cloudflare D1 (Production)
```bash
cd backend
npm run db:migrate:remote
```

#### Seed Initial Admin Account
Admin accounts **cannot** be created through public signup. Run this command:
```bash
wrangler d1 execute jobconnect-db --remote --command "INSERT OR REPLACE INTO users (id, phone, role, is_blocked, is_verified) VALUES ('usr_admin_master', '+919999999999', 'admin', 0, 1);"
```

---

### Step 3: Deploy Backend Worker
```bash
cd backend
npm run deploy
```
*Your API is now live at `https://jobconnect-backend.<your-subdomain>.workers.dev`.*

---

### Step 4: Deploy Frontend to Cloudflare Pages

```bash
cd frontend
npm run build

# Deploy directly via Wrangler Pages
npx wrangler pages project create jobconnect
npx wrangler pages deploy dist --project-name jobconnect
```

---

## 💻 Local Development

### 1. Run Backend Worker Locally
```bash
cd backend
npm install
npm run dev
# Server runs on http://127.0.0.1:8787
```

### 2. Run Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
# UI runs on http://localhost:5173 (proxies /api to 127.0.0.1:8787)
```

---

## 🔒 Security & Privacy Implementation Details

| Feature | Implementation | Guarantee |
| :--- | :--- | :--- |
| **Worker Contact Privacy** | `sanitizeWorkerProfile` in `services/privacy.ts` | Phone number is omitted or masked (`+91 98***`) until application status is `unlocked`. |
| **Employer Address Privacy** | `sanitizeEmployerProfile` in `services/privacy.ts` | Only locality and city are sent over the wire until application status is `unlocked`. |
| **UTR Payment Uniqueness** | SQLite `UNIQUE(upi_ref)` constraint in D1 | Reusing a payment UTR returns HTTP `409 Conflict`. |
| **Rate Limiting** | `rateLimit.ts` via KV | Max 3 OTP requests per 10 mins per phone; max 30 API writes per minute per IP. |
| **Audit Trail** | `audit_logs` table in D1 | Every admin approval, rejection, block, or refund records admin ID, IP, and timestamp. |

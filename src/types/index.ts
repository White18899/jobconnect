export type UserRole = "worker" | "employer" | "admin";

export type ApplicationStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "HIRED"
  | "REJECTED";

export type PaymentStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export type PaymentType =
  | "employer_unlock"
  | "worker_priority";

export type UnlockStatus =
  | "ACTIVE"
  | "REVOKED";

export type PriorityStatus =
  | "STANDARD"
  | "PRIORITY_PENDING"
  | "PRIORITY_ACTIVE";

export type UnlockPlanId =
  | "1_WORKER"
  | "5_WORKERS"
  | "10_WORKERS";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface WorkerProtectedDetails {
  phone: string;
  fullAddress: string;
  emergencyContact: string;
  aadhaarLast4: string;
  previousEmployerName: string;
  resumeDownloadUrl: string;
}

export interface WorkerPrivateDocument extends WorkerProtectedDetails {
  workerId: string;
  updatedAt?: string;
}

export interface WorkExperienceItem {
  id: string;
  role: string;
  company: string;
  durationYears: number;
  description: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  fullName: string;
  category: string;
  experienceYears: number;
  expectedSalary: string;
  city: string;
  state: string;
  skills: string[];
  education: string;
  languages: string[];
  workExperience: WorkExperienceItem[];
  certifications: CertificationItem[];
  portfolio: PortfolioItem[];
  profileCompletion: number;
  resumeName?: string;
  protectedDetails?: WorkerProtectedDetails;
}

export interface EmployerProtectedDetails {
  contactPersonPhone: string;
  directEmail: string;
  fullAddress: string;
  taxGstId: string;
  hrName: string;
}

export interface EmployerPrivateDocument extends EmployerProtectedDetails {
  employerId: string;
  unlockCredits: number;
  updatedAt?: string;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  city: string;
  state: string;
  activeJobsCount: number;
  totalHires: number;
  unlockCredits: number;
  description: string;
  protectedDetails?: EmployerProtectedDetails;
}

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  employerLocation: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  experienceYears: number;
  education: string;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: "monthly" | "daily" | "hourly";
  jobType: "Full-Time" | "Part-Time" | "Contract" | "Temporary";
  location: string;
  workingHours: string;
  numberOfWorkers: number;
  duration: string;
  deadline: string;
  createdAt: string;
  status: "active" | "draft" | "closed";
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  employerId: string;
  employerName: string;
  workerId: string;
  workerName: string;
  workerCategory: string;
  workerExperience: number;
  workerCity: string;
  appliedDate: string;
  status: ApplicationStatus;
  priorityStatus: PriorityStatus;
  priorityPaymentId?: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: PaymentType;
  planId?: UnlockPlanId;
  amount: number;
  unlocksCount?: number;
  applicationId?: string;
  jobTitle?: string;
  utrNumber: string;
  screenshotUrl?: string;
  submittedAt: string;
  verifiedAt?: string;
  status: PaymentStatus;
  notes?: string;
}

export interface WorkerUnlockPlan {
  id: UnlockPlanId;
  name: string;
  price: number;
  unlocksCount: number;
  isPopular?: boolean;
  features: string[];
}

export interface WorkerUnlockRecord {
  id: string;
  employerId: string;
  employerName: string;
  workerId: string;
  workerName: string;
  planId?: UnlockPlanId;
  creditUsed: number;
  unlockedAt: string;
  status: UnlockStatus;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "application" | "payment" | "unlock" | "system" | "hire";
}

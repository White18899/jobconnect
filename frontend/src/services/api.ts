import { Job, Application } from './mockData';

const BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL) || 'https://jobconnect-backend.white018899.workers.dev/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('jobconnect_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('jobconnect_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('jobconnect_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Network request failed');
  }
  return data;
}

export const api = {
  // Auth
  requestOtp: (phone: string, role?: 'worker' | 'employer') =>
    request<{ success: boolean; message: string; devOtp?: string; smsDelivered?: boolean; smsError?: string }>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, role }),
    }),

  verifyOtp: (phone: string, otp: string, role?: 'worker' | 'employer') =>
    request<{ success: boolean; token: string; user: any }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, role }),
    }),

  getMe: () => request<{ user: any; profile: any }>('/auth/me'),

  // Worker & Jobs
  getJobs: (filters?: { category?: string; city?: string; min_salary?: number }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.min_salary) params.append('min_salary', filters.min_salary.toString());
    return request<{ jobs: Job[] }>(`/jobs?${params.toString()}`);
  },

  getJobById: (id: string) => request<{ job: Job }>(`/jobs/${id}`),

  applyJob: (id: string) =>
    request<{ success: boolean; message: string; applicationId: string }>(`/jobs/${id}/apply`, {
      method: 'POST',
    }),

  getWorkerApplications: () => request<{ applications: Application[] }>('/worker/applications'),

  getUnlockedJob: (applicationId: string) =>
    request<{ application: any; job: any; employer: any; employerPhone?: string }>(
      `/worker/applications/${applicationId}`
    ),

  updateWorkerProfile: (data: Partial<Worker>) =>
    request<{ success: boolean; profile: any }>('/worker/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Employer
  getEmployerJobs: () => request<{ jobs: any[] }>('/employer/jobs'),

  postJob: (data: any) =>
    request<{ success: boolean; jobId: string }>('/employer/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getJobApplicants: (jobId: string) =>
    request<{ job: any; applicants: any[] }>(`/jobs/${jobId}/applicants`),

  acceptApplication: (applicationId: string) =>
    request<{ success: boolean; message: string }>(`/applications/${applicationId}/accept`, {
      method: 'POST',
    }),

  rejectApplication: (applicationId: string) =>
    request<{ success: boolean; message: string }>(`/applications/${applicationId}/reject`, {
      method: 'POST',
    }),

  getUnlockedWorker: (applicationId: string) =>
    request<{ application: any; job: any; worker: any; payment: any }>(
      `/employer/applications/${applicationId}`
    ),

  // Payments
  createPaymentOrder: (applicationId: string) =>
    request<{
      paymentId: string;
      orderCode: string;
      amount: number;
      currency: string;
      upiId: string;
      payeeName: string;
      upiUrl: string;
      status: string;
      refundPolicy: string;
    }>(`/applications/${applicationId}/payment`, {
      method: 'POST',
    }),

  submitPaymentProof: (paymentId: string, upiRef: string, screenshotKey?: string) =>
    request<{ success: boolean; message: string; status: string; utr: string }>(
      `/payments/${paymentId}/submit`,
      {
        method: 'POST',
        body: JSON.stringify({ upi_ref: upiRef, screenshot_key: screenshotKey }),
      }
    ),

  getPaymentStatus: (paymentId: string) => request<{ payment: any }>(`/payments/${paymentId}`),

  // Admin
  getAdminDashboard: () => request<{ metrics: any }>('/admin/dashboard'),

  getAdminVerifications: (status: string = 'pending_verification') =>
    request<{ verifications: any[] }>(`/admin/verifications?status=${status}`),

  getAdminVerificationDetail: (id: string) =>
    request<{ verification: any }>(`/admin/verifications/${id}`),

  approveVerification: (paymentId: string, checklist: any, notes?: string) =>
    request<{ success: boolean; message: string }>(`/admin/payments/${paymentId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ checklist, notes }),
    }),

  rejectVerification: (paymentId: string, reason: string) =>
    request<{ success: boolean; message: string }>(`/admin/payments/${paymentId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  recordRefund: (paymentId: string, refundRef: string, refundNotes?: string) =>
    request<{ success: boolean; message: string }>(`/admin/payments/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ refund_ref: refundRef, refund_notes: refundNotes }),
    }),

  getAdminUsers: (role?: string) =>
    request<{ users: any[] }>(`/admin/users${role ? `?role=${role}` : ''}`),

  blockUser: (userId: string) =>
    request<{ success: boolean; message: string }>(`/admin/users/${userId}/block`, {
      method: 'POST',
    }),

  unblockUser: (userId: string) =>
    request<{ success: boolean; message: string }>(`/admin/users/${userId}/unblock`, {
      method: 'POST',
    }),

  deleteAdminJob: (jobId: string) =>
    request<{ success: boolean; message: string }>(`/admin/jobs/${jobId}`, {
      method: 'DELETE',
    }),
};

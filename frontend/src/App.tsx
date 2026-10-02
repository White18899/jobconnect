import React, { useState } from 'react';
import { useAuth, UserRole } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { PhoneOtpModal } from './components/auth/PhoneOtpModal';

// Shared
import { LandingPage } from './pages/shared/LandingPage';

// Worker Pages
import { JobFeedPage } from './pages/worker/JobFeedPage';
import { JobDetailPage } from './pages/worker/JobDetailPage';
import { MyApplicationsPage } from './pages/worker/MyApplicationsPage';
import { WorkerProfilePage } from './pages/worker/WorkerProfilePage';

// Employer Pages
import { MyJobsPage } from './pages/employer/MyJobsPage';
import { PostJobPage } from './pages/employer/PostJobPage';
import { ApplicantsPage } from './pages/employer/ApplicantsPage';
import { EmployerProfilePage } from './pages/employer/EmployerProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { VerificationDetailPage } from './pages/admin/VerificationDetailPage';
import { PaymentsLedgerPage } from './pages/admin/PaymentsLedgerPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';

// Mock Data
import { INITIAL_JOBS, INITIAL_APPLICATIONS, Job, Application } from './services/mockData';

export const App: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const { t } = useLanguage();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedJobIdForApplicants, setSelectedJobIdForApplicants] = useState<string | undefined>(undefined);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('worker');

  // Dynamic Application and Job State (supports full interactive state changes!)
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(
    new Set(INITIAL_APPLICATIONS.map((a) => a.job_id))
  );

  // Toast / notification banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Worker Action: Apply for a job
  const handleApplyJob = (job: Job) => {
    if (appliedJobIds.has(job.id)) return;

    const newApp: Application = {
      id: 'app_' + Date.now(),
      job_id: job.id,
      job_title: job.title,
      job_category: job.category,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      salary_period: job.salary_period,
      location_area: job.location_area,
      location_city: job.location_city,
      employer_id: job.employer_id,
      business_name: job.business_name,
      business_type: job.business_type,
      status: 'applied',
      applied_at: new Date().toISOString(),
      worker: {
        id: 'wp_curr',
        full_name: 'Ramesh Kumar Goud',
        phone: '+91 9123456780',
        skills: ['Mechanic', 'Welder'],
        experience_years: 4.5,
        preferred_area: 'Kukatpally',
        city: 'Hyderabad',
        expected_salary_min: 18000,
        expected_salary_max: 24000,
        salary_period: 'monthly',
        id_proof_type: 'aadhaar_masked',
        id_number_masked: 'XXXX-XXXX-4912',
        verification_status: 'verified',
      },
    };

    setApplications([newApp, ...applications]);
    setAppliedJobIds(new Set([...appliedJobIds, job.id]));
    showToast(`Successfully applied for "${job.title}"!`);
  };

  // Employer Action: Accept Applicant
  const handleAcceptApplicant = (appId: string) => {
    setApplications(
      applications.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: 'accepted',
              payment_status: 'awaiting_payment',
              order_code: `JC-202610-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            }
          : app
      )
    );
    showToast('Applicant accepted! Please proceed to pay the ₹499 verification fee.');
  };

  // Employer Action: Reject Applicant
  const handleRejectApplicant = (appId: string) => {
    setApplications(
      applications.map((app) =>
        app.id === appId ? { ...app, status: 'rejected' } : app
      )
    );
    showToast('Applicant declined.');
  };

  // Employer Action: Payment Submitted (UTR + Screenshot)
  const handlePaymentSubmitted = (appId: string, utr: string) => {
    setApplications(
      applications.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: 'pending_verification',
              payment_status: 'pending_verification',
              upi_ref: utr,
              amount: 499,
            }
          : app
      )
    );
    showToast('₹499 Payment proof submitted! Admin is reviewing verification.');
  };

  // Admin Action: Approve Verification
  const handleAdminApprove = (appId: string) => {
    setApplications(
      applications.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: 'unlocked',
              payment_status: 'successful',
              // Reveal exact shop address & worker contact
              exact_address:
                app.exact_address ||
                'Plot 42, Phase 3, Near Ganesh Temple, KPHB Colony, Hyderabad 500072',
              latitude: app.latitude || 17.4938,
              longitude: app.longitude || 78.3995,
              employer_phone: app.employer_phone || '+91 9876543210',
            }
          : app
      )
    );
    showToast('Verification approved! Application has been UNLOCKED.');
  };

  // Admin Action: Reject Verification
  const handleAdminReject = (appId: string, reason: string) => {
    setApplications(
      applications.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: 'verification_rejected',
              payment_status: 'rejected',
            }
          : app
      )
    );
    showToast(`Verification rejected: ${reason}. Marked for ₹499 refund.`);
  };

  // Admin Action: Record Refund
  const handleRefundRecorded = (appId: string, ref: string, notes: string) => {
    setApplications(
      applications.map((app) =>
        app.id === appId
          ? {
              ...app,
              payment_status: 'refunded',
            }
          : app
      )
    );
    showToast(`Refund of ₹499 recorded with UTR: ${ref}`);
  };

  // Employer Action: Post Job
  const handleJobCreated = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
    setCurrentTab('employer_jobs');
    showToast(`Job "${newJob.title}" posted successfully!`);
  };

  // Employer Action: Toggle job status
  const handleToggleJobStatus = (jobId: string) => {
    setJobs(
      jobs.map((j) =>
        j.id === jobId ? { ...j, status: j.status === 'open' ? 'closed' : 'open' } : j
      )
    );
  };

  // Render Page Content based on currentTab & user role
  const renderContent = () => {
    // 1. Landing Page
    if (currentTab === 'landing') {
      return (
        <LandingPage
          onStartWorker={() => {
            switchRole('worker');
            setCurrentTab('jobs');
          }}
          onStartEmployer={() => {
            switchRole('employer');
            setCurrentTab('employer_jobs');
          }}
          onOpenAdmin={() => {
            switchRole('admin');
            setCurrentTab('admin_dashboard');
          }}
        />
      );
    }

    // 2. Worker Views
    if (currentTab === 'jobs') {
      return (
        <JobFeedPage
          jobs={jobs}
          onSelectJob={(job) => {
            setSelectedJob(job);
            setCurrentTab('job_detail');
          }}
          onApplyJob={handleApplyJob}
          appliedJobIds={appliedJobIds}
        />
      );
    }

    if (currentTab === 'job_detail' && selectedJob) {
      return (
        <JobDetailPage
          job={selectedJob}
          onBack={() => setCurrentTab('jobs')}
          onApply={handleApplyJob}
          hasApplied={appliedJobIds.has(selectedJob.id)}
        />
      );
    }

    if (currentTab === 'applications') {
      return (
        <MyApplicationsPage
          applications={applications}
          onViewJob={(app) => {
            const foundJob = jobs.find((j) => j.id === app.job_id);
            if (foundJob) {
              setSelectedJob(foundJob);
              setCurrentTab('job_detail');
            }
          }}
          onExploreJobs={() => setCurrentTab('jobs')}
        />
      );
    }

    if (currentTab === 'worker_profile') {
      return <WorkerProfilePage />;
    }

    // 3. Employer Views
    if (currentTab === 'employer_jobs') {
      return (
        <MyJobsPage
          jobs={jobs}
          onSelectJobForApplicants={(jobId) => {
            setSelectedJobIdForApplicants(jobId);
            setCurrentTab('applicants');
          }}
          onPostNewJob={() => setCurrentTab('post_job')}
          onToggleStatus={handleToggleJobStatus}
        />
      );
    }

    if (currentTab === 'post_job') {
      return (
        <PostJobPage
          onJobCreated={handleJobCreated}
          onCancel={() => setCurrentTab('employer_jobs')}
        />
      );
    }

    if (currentTab === 'applicants') {
      return (
        <ApplicantsPage
          applications={applications}
          jobs={jobs}
          selectedJobId={selectedJobIdForApplicants}
          onAcceptApplicant={handleAcceptApplicant}
          onRejectApplicant={handleRejectApplicant}
          onPaymentSubmitted={handlePaymentSubmitted}
        />
      );
    }

    if (currentTab === 'employer_profile') {
      return <EmployerProfilePage />;
    }

    // 4. Admin Views
    if (currentTab === 'admin_dashboard') {
      return (
        <AdminDashboardPage
          applications={applications}
          jobs={jobs}
          onNavigate={(tab) => setCurrentTab(tab)}
        />
      );
    }

    if (currentTab === 'admin_queue') {
      return (
        <VerificationDetailPage
          applications={applications}
          onApprove={handleAdminApprove}
          onReject={handleAdminReject}
          onBack={() => setCurrentTab('admin_dashboard')}
        />
      );
    }

    if (currentTab === 'admin_payments') {
      return (
        <PaymentsLedgerPage
          applications={applications}
          onRefundRecorded={handleRefundRecorded}
          onBack={() => setCurrentTab('admin_dashboard')}
        />
      );
    }

    if (currentTab === 'admin_users') {
      return <UserManagementPage onBack={() => setCurrentTab('admin_dashboard')} />;
    }

    // Default fallback
    return (
      <JobFeedPage
        jobs={jobs}
        onSelectJob={(job) => {
          setSelectedJob(job);
          setCurrentTab('job_detail');
        }}
        onApplyJob={handleApplyJob}
        appliedJobIds={appliedJobIds}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 pb-12">
      {/* Top Navbar */}
      <Navbar
        onOpenLogin={(defaultRole) => {
          if (defaultRole) setAuthDefaultRole(defaultRole);
          setIsAuthModalOpen(true);
        }}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4">
        {renderContent()}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      {currentTab !== 'landing' && (
        <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
      )}

      {/* Phone OTP Login & Role Selection Modal */}
      <PhoneOtpModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultRole={authDefaultRole}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          showToast('Logged in successfully!');
        }}
      />
    </div>
  );
};
export default App;

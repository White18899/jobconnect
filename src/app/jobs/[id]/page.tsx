"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  Zap,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { getJobById, submitApplication, submitPaymentRecord } from "@/services";
import { Job } from "@/types";
import { PriorityPaymentModal } from "@/components/ui/PriorityPaymentModal";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";

function JobDetailContent() {
  const params = useParams();
  const jobId = (params?.id as string) || "job-101";
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const [appliedFree, setAppliedFree] = useState(false);
  const [appliedPriority, setAppliedPriority] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);

  useEffect(() => {
    if (jobId) {
      getJobById(jobId).then((data) => {
        setJob(data);
        setLoading(false);
      });
    }
  }, [jobId]);

  const handleApplyFree = async () => {
    if (!job) return;
    await submitApplication(job.id, "wrk-1", false);
    setAppliedFree(true);
  };

  const handlePriorityPaymentSubmitted = async (utr: string, fileName?: string) => {
    if (!job) return;
    const app = await submitApplication(job.id, "wrk-1", true);
    await submitPaymentRecord({
      userId: "wrk-1",
      userName: "Ramesh Kumar Rao",
      userEmail: "ramesh.electrician@gmail.com",
      type: "worker_priority",
      amount: 299,
      applicationId: app.id,
      jobTitle: job.title,
      utrNumber: utr,
      screenshotUrl: fileName || "receipt.png",
    });
    setAppliedPriority(true);
  };

  if (loading) {
    return <SkeletonCard />;
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
        <p className="text-xs text-slate-600">The job posting you requested might have been closed or removed.</p>
        <Link href="/find-jobs" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl">
          Browse Other Vacancies
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/find-jobs"
        className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600 mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to All Jobs
      </Link>

      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-md border border-blue-200">
              {job.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {job.title}
            </h1>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4 text-slate-400" />
                {job.employerName}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                {job.location}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                Posted {job.createdAt}
              </span>
            </div>
          </div>

          {/* Salary Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left md:text-right shrink-0">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Expected Salary</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
            </div>
            <span className="text-xs text-slate-500 capitalize font-medium">
              Per {job.salaryPeriod}
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-700">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Experience</span>
            <strong className="text-slate-900 text-sm">{job.experienceYears}+ Years Required</strong>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Job Type</span>
            <strong className="text-slate-900 text-sm">{job.jobType}</strong>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Working Hours</span>
            <strong className="text-slate-900 text-sm">{job.workingHours}</strong>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Workers Needed</span>
            <strong className="text-slate-900 text-sm">{job.numberOfWorkers} Tradesmen</strong>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-slate-900">Job Description</h3>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Required Skills */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-slate-900">Required Trade Skills</h3>
          <div className="flex gap-2 flex-wrap">
            {job.requiredSkills.map((skill, i) => (
              <span
                key={i}
                className="text-xs bg-blue-50 text-blue-800 font-bold px-3 py-1.5 rounded-xl border border-blue-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div>
            <span className="font-bold text-slate-900">Education Requirement:</span> {job.education}
          </div>
          <div>
            <span className="font-bold text-slate-900">Contract Duration:</span> {job.duration}
          </div>
          <div>
            <span className="font-bold text-slate-900">Application Deadline:</span> {job.deadline}
          </div>
        </div>
      </div>

      {/* Section 17 Application Options Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-600/30 shadow-lg space-y-6 mt-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-3 py-0.5 rounded-full">
            Application Portal
          </span>
          <h2 className="text-2xl font-black text-slate-900">Choose How You Wish to Apply</h2>
          <p className="text-xs text-slate-600">Every worker can apply 100% Free.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Standard Free Application Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">STANDARD APPLICATION</h3>
                <span className="text-sm font-black text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  FREE
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Apply normally with your trade profile. The employer will review your profile in standard order.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free application submission
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Standard employer candidate queue
                </li>
              </ul>
            </div>

            {appliedFree ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-bold text-center">
                Application Submitted Free ✓
              </div>
            ) : (
              <button
                onClick={handleApplyFree}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                APPLY FREE
              </button>
            )}
          </div>

          {/* Priority Application Card (₹299) */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white rounded-2xl p-6 border-2 border-amber-400 flex flex-col justify-between space-y-4 relative shadow-sm">
            <span className="absolute -top-3 right-4 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              RECOMMENDED BOOST
            </span>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-5 h-5 text-amber-600 fill-amber-500" />
                  PRIORITY APPLICATION
                </h3>
                <span className="text-xl font-black text-amber-600">₹299</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Highlight your application at the top of the employer&apos;s queue with priority alerts.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2 text-amber-900 font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> Priority visibility in candidate list
                </li>
                <li className="flex items-center gap-2 text-amber-900 font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> Priority notification sent to HR
                </li>
                <li className="flex items-center gap-2 text-amber-900 font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> Highlighted Priority badge
                </li>
              </ul>
            </div>

            {appliedPriority ? (
              <div className="bg-amber-100 border border-amber-400 text-amber-900 p-3 rounded-xl text-xs font-bold text-center">
                Priority Application Submitted! UTR Pending Verification ⚡
              </div>
            ) : (
              <button
                onClick={() => setIsPriorityModalOpen(true)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                APPLY WITH PRIORITY (₹299)
              </button>
            )}
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-3 mt-4">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Important Disclaimer:</strong> ₹299 Priority Application is completely optional. Priority application provides enhanced visibility and review priority, but payment does <strong>NOT</strong> guarantee selection, interview, or employment.
          </p>
        </div>
      </div>

      {/* Priority Payment Modal */}
      <PriorityPaymentModal
        isOpen={isPriorityModalOpen}
        jobTitle={job.title}
        employerName={job.employerName}
        onClose={() => setIsPriorityModalOpen(false)}
        onSubmitPayment={handlePriorityPaymentSubmitted}
      />
    </>
  );
}

export default function JobDetailPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <Suspense fallback={<SkeletonCard />}>
          <JobDetailContent />
        </Suspense>
      </main>

      <PublicFooter />
    </div>
  );
}

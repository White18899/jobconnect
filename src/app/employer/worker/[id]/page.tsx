"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import {
  User,
  Shield,
  Lock,
  Unlock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Award,
  FileText,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  Plus,
  Zap,
} from "lucide-react";
import {
  getWorkerProfile,
  getEmployerProfile,
  isWorkerUnlocked,
  unlockWorkerProfile,
} from "@/services";
import { WorkerProfile, EmployerProfile } from "@/types";
import { UnlockWorkerModal } from "@/components/ui/UnlockWorkerModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";

function EmployerWorkerDetailContent() {
  const params = useParams();
  const router = useRouter();
  const workerId = (params?.id as string) || "wrk-1";

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const fetchData = async () => {
    if (!workerId) return;
    const w = await getWorkerProfile(workerId);
    const emp = await getEmployerProfile("emp-1");
    const unl = await isWorkerUnlocked("emp-1", workerId);

    setWorker(w);
    setEmployer(emp);
    setIsUnlocked(unl);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [workerId]);

  const handleConfirmUnlock = async () => {
    if (!worker || !employer) return;
    setIsUnlocking(true);
    const res = await unlockWorkerProfile("emp-1", worker.id);
    setIsUnlocking(false);
    setIsUnlockModalOpen(false);
    if (res.success) {
      await fetchData();
    }
  };

  if (loading) {
    return <SkeletonCard />;
  }

  if (!worker) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold">Worker Profile Not Found</h2>
        <Link href="/employer/applications" className="text-xs text-blue-600 font-bold hover:underline">
          Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Link
        href="/employer/applications"
        className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Candidate Applications
      </Link>

      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-md border border-blue-200">
                Trade: {worker.category}
              </span>
              {isUnlocked ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5" /> Details Unlocked 🔓
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-600" /> Protected Profile 🔒
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{worker.fullName}</h1>
            <p className="text-xs text-slate-600 font-medium">
              {worker.experienceYears}+ Years Trade Experience • {worker.city}, {worker.state}
            </p>
          </div>

          {/* Unlock Button CTA */}
          <div className="shrink-0">
            {!isUnlocked ? (
              <button
                onClick={() => setIsUnlockModalOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                Unlock Worker Profile (1 Credit)
              </button>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Worker Details Unlocked ✓
              </div>
            )}
          </div>
        </div>

        {/* Section: Professional Info */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Professional Overview ✓
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Expected Pay</span>
              <strong className="text-slate-900 text-sm">{worker.expectedSalary}</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Qualification</span>
              <strong className="text-slate-900 text-sm">{worker.education}</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">City</span>
              <strong className="text-slate-900 text-sm">{worker.city}</strong>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Profile Rating</span>
              <strong className="text-slate-900 text-sm">{worker.profileCompletion}% Complete</strong>
            </div>
          </div>
        </div>

        {/* Trade Skills */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900">Trade Skills & Competencies</h3>
          <div className="flex gap-2 flex-wrap">
            {worker.skills.map((s, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-xl border border-slate-200">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" /> Trade Certifications
          </h3>
          <div className="space-y-2">
            {worker.certifications.map((c) => (
              <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex justify-between">
                <div>
                  <strong className="text-slate-900">{c.title}</strong>
                  <p className="text-slate-500 text-[11px]">{c.issuer}</p>
                </div>
                <span className="text-slate-400 font-semibold">{c.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Protected Information (Prompt Section 28 Visualization) */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              Protected Information State
            </h3>

            {!isUnlocked ? (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                🔒 Locked Details
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                🔓 Unlocked Access
              </span>
            )}
          </div>

          {!isUnlocked ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3 text-xs text-slate-600">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Protected Information 🔒</h4>
              <p className="max-w-md mx-auto">
                Candidate phone number, full home address, emergency contacts, previous workplace references, and resume download link are currently locked.
              </p>
              <button
                onClick={() => setIsUnlockModalOpen(true)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Unlock Candidate Details (Uses 1 Credit)
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>🔓 Details Unlocked</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Contact Phone Number 🔓</span>
                  <strong className="text-slate-900 text-sm">{worker.protectedDetails?.phone || "N/A"}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Full Address 🔓</span>
                  <strong className="text-slate-900 text-sm">{worker.protectedDetails?.fullAddress || "N/A"}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Emergency Contact 🔓</span>
                  <strong className="text-slate-900 text-sm">{worker.protectedDetails?.emergencyContact || "N/A"}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Previous Employer Reference 🔓</span>
                  <strong className="text-slate-900 text-sm">{worker.protectedDetails?.previousEmployerName || "N/A"}</strong>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Resume File 🔓</span>
                  <a
                    href="#download"
                    className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl gap-2 hover:bg-slate-800"
                  >
                    <FileText className="w-4 h-4" /> Download {worker.resumeName || "Resume.pdf"}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unlock Confirmation Modal (Prompt Rule #32) */}
      <UnlockWorkerModal
        isOpen={isUnlockModalOpen}
        workerName={worker.fullName}
        availableCredits={employer?.unlockCredits || 5}
        onClose={() => setIsUnlockModalOpen(false)}
        onConfirm={handleConfirmUnlock}
        isProcessing={isUnlocking}
      />
    </div>
  );
}

export default function EmployerWorkerDetailPage() {
  return (
    <EmployerLayout>
      <Suspense fallback={<SkeletonCard />}>
        <EmployerWorkerDetailContent />
      </Suspense>
    </EmployerLayout>
  );
}

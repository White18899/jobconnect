"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import {
  Briefcase,
  Users,
  CheckSquare,
  KeyRound,
  Plus,
  ArrowRight,
  Zap,
  Building2,
  Lock,
  Unlock,
  Sparkles,
} from "lucide-react";
import {
  getEmployerProfile,
  getEmployerJobs,
  getEmployerApplications,
  getWorkerUnlocks,
} from "@/services";
import { EmployerProfile, Job, Application, WorkerUnlockRecord } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";

export default function EmployerDashboardPage() {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [unlocks, setUnlocks] = useState<WorkerUnlockRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEmployerProfile("emp-1"),
      getEmployerJobs("emp-1"),
      getEmployerApplications("emp-1"),
      getWorkerUnlocks(),
    ]).then(([emp, jList, appList, unlList]) => {
      setProfile(emp);
      setJobs(jList);
      setApplications(appList);
      setUnlocks(unlList);
      setLoading(false);
    });
  }, []);

  const activeJobsCount = jobs.filter((j) => j.status === "active").length;
  const shortlistedCount = applications.filter((a) => a.status === "SHORTLISTED").length;
  const hiredCount = applications.filter((a) => a.status === "HIRED").length;

  return (
    <EmployerLayout>
      <div className="space-y-8">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>{profile?.companyName || "Apex Electrical Infra Ltd"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Employer Hiring Dashboard
            </h1>
            <p className="text-xs text-slate-300">
              Manage trade job posts, candidate pipelines, and worker profile unlock credits.
            </p>
          </div>

          {/* Prompt Section 23: Available Unlock Credits Box */}
          <div className="bg-gradient-to-br from-blue-900/80 to-indigo-900/80 border border-blue-600/50 p-5 rounded-2xl text-center space-y-2 shrink-0 w-full sm:w-auto">
            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block">
              Available Unlock Credits
            </span>
            <div className="text-3xl font-black text-white">
              {profile?.unlockCredits || 5} Credits
            </div>
            <Link
              href="/employer/worker-unlock-plans"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Buy More Credits
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Total Jobs</span>
            <div className="text-2xl font-black text-slate-900">{jobs.length}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Active Jobs</span>
            <div className="text-2xl font-black text-slate-900">{activeJobsCount}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Applications</span>
            <div className="text-2xl font-black text-slate-900">{applications.length}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <CheckSquare className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Shortlisted</span>
            <div className="text-2xl font-black text-slate-900">{shortlistedCount}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Hired Workers</span>
            <div className="text-2xl font-black text-slate-900">{hiredCount}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Unlock className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-blue-900 font-bold uppercase">Unlocked</span>
            <div className="text-2xl font-black text-blue-700">{unlocks.length}</div>
          </div>
        </div>

        {/* Action Button Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-xs gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Need to hire more tradesmen?</h3>
            <p className="text-xs text-slate-500">Post a new job vacancy to start receiving qualified applicant profiles.</p>
          </div>
          <Link
            href="/employer/post-job"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Post a Job
          </Link>
        </div>

        {/* Recent Applicants & Active Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Recent Applicants */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Recent Applicants
              </h3>
              <Link href="/employer/applications" className="text-xs text-blue-600 font-bold hover:underline">
                View All Applications →
              </Link>
            </div>

            {loading ? (
              <SkeletonCard />
            ) : applications.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No applications received yet.</p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{app.workerName}</h4>
                        {app.priorityStatus !== "STANDARD" && (
                          <StatusBadge status={app.priorityStatus} type="priority" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        Trade: <strong>{app.workerCategory}</strong> • Exp: <strong>{app.workerExperience} Yrs</strong>
                      </p>
                      <span className="text-[10px] text-slate-400 block">Applied for: {app.jobTitle}</span>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <StatusBadge status={app.status} />
                      <Link
                        href={`/employer/worker/${app.workerId}`}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        Review Profile <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Active Jobs Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Active Postings
              </h3>
              <Link href="/employer/my-jobs" className="text-xs text-blue-600 font-bold hover:underline">
                Manage Jobs
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.map((j) => (
                <div key={j.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{j.title}</h4>
                      <p className="text-xs text-slate-500">{j.location}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                      {j.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Applications: <strong>3 Candidates</strong></span>
                    <span>Deadline: {j.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
}

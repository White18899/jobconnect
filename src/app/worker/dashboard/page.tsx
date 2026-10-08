"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { WorkerLayout } from "@/components/layout/WorkerLayout";
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  Award,
  Zap,
  User,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
} from "lucide-react";
import {
  getWorkerApplications,
  getAllJobs,
  getWorkerProfile,
  getNotifications,
} from "@/services";
import { Application, Job, WorkerProfile } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";

export default function WorkerDashboardPage() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getWorkerProfile("user-wrk-1"),
      getWorkerApplications("wrk-1"),
      getAllJobs(),
    ]).then(([p, apps, jList]) => {
      setProfile(p);
      setApplications(apps);
      setJobs(jList.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const totalApps = applications.length;
  const underReviewCount = applications.filter((a) => a.status === "UNDER_REVIEW").length;
  const shortlistedCount = applications.filter((a) => a.status === "SHORTLISTED").length;
  const hiredCount = applications.filter((a) => a.status === "HIRED").length;
  const priorityCount = applications.filter((a) => a.priorityStatus === "PRIORITY_ACTIVE" || a.priorityStatus === "PRIORITY_PENDING").length;

  return (
    <WorkerLayout>
      <div className="space-y-8">
        {/* Top Banner Greeting & Profile Completion Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <User className="w-3.5 h-3.5" />
              <span>Welcome Back, {profile?.fullName || "Ramesh Kumar"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Worker Control Dashboard
            </h1>
            <p className="text-xs text-slate-300">
              Trade: <strong className="text-white">{profile?.category || "Electrician"}</strong> • City:{" "}
              <strong className="text-white">{profile?.city || "Visakhapatnam"}</strong>
            </p>
          </div>

          {/* Profile Completion Indicator (Prompt Rule #12) */}
          <div className="w-full md:w-72 bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl space-y-2 shrink-0">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">Profile Completion</span>
              <span className="font-black text-blue-400">{profile?.profileCompletion || 85}%</span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${profile?.profileCompletion || 85}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Complete your trade credentials to improve hiring opportunities.
            </p>
            <Link
              href="/worker/profile"
              className="inline-block text-[11px] text-blue-400 font-bold hover:underline pt-0.5"
            >
              Update Profile Details →
            </Link>
          </div>
        </div>

        {/* Stats Grid (Prompt Section 12) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Available Jobs</span>
            <div className="text-2xl font-black text-slate-900">{jobs.length + 15}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Applications</span>
            <div className="text-2xl font-black text-slate-900">{totalApps}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Under Review</span>
            <div className="text-2xl font-black text-slate-900">{underReviewCount}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Shortlisted</span>
            <div className="text-2xl font-black text-slate-900">{shortlistedCount}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Hired Jobs</span>
            <div className="text-2xl font-black text-slate-900">{hiredCount}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
            <span className="text-[10px] text-amber-900 font-bold uppercase">Priority Apps</span>
            <div className="text-2xl font-black text-amber-700">{priorityCount}</div>
          </div>
        </div>

        {/* Two Column Layout: Recent Applications & Recommended Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Recent Applications */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Recent Applications
              </h3>
              <Link
                href="/worker/my-applications"
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <SkeletonCard />
            ) : applications.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No applications submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">{app.jobTitle}</h4>
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {app.employerName}
                      </p>
                      <span className="text-[10px] text-slate-400 block">Applied {app.appliedDate}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <StatusBadge status={app.status} />
                      {app.priorityStatus !== "STANDARD" && (
                        <StatusBadge status={app.priorityStatus} type="priority" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Recommended Trade Vacancies */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Recommended Trade Vacancies
              </h3>
              <Link href="/find-jobs" className="text-xs text-blue-600 font-bold hover:underline">
                Explore All
              </Link>
            </div>

            <div className="space-y-3">
              {jobs.map((j) => (
                <div key={j.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{j.title}</h4>
                      <p className="text-xs text-slate-500">{j.employerName} • {j.location}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ₹{j.salaryMin / 1000}k–{j.salaryMax / 1000}k
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">Exp: {j.experienceYears}+ Yrs</span>
                    <Link
                      href={`/jobs/${j.id}`}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      Apply Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
}

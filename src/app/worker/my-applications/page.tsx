"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { WorkerLayout } from "@/components/layout/WorkerLayout";
import { FileText, Building2, Calendar, Zap, ChevronRight } from "lucide-react";
import { getWorkerApplications } from "@/services";
import { Application } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "ALL" | "APPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "HIRED" | "REJECTED" | "PRIORITY"
  >("ALL");

  useEffect(() => {
    getWorkerApplications("wrk-1").then((apps) => {
      setApplications(apps);
      setLoading(false);
    });
  }, []);

  const filteredApps = applications.filter((app) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "PRIORITY")
      return app.priorityStatus === "PRIORITY_ACTIVE" || app.priorityStatus === "PRIORITY_PENDING";
    return app.status === activeTab;
  });

  const tabs = [
    { id: "ALL", label: "All Applications" },
    { id: "APPLIED", label: "Applied" },
    { id: "UNDER_REVIEW", label: "Under Review" },
    { id: "SHORTLISTED", label: "Shortlisted" },
    { id: "HIRED", label: "Hired ✓" },
    { id: "REJECTED", label: "Rejected" },
    { id: "PRIORITY", label: "Priority ⚡" },
  ];

  return (
    <WorkerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Job Applications
          </h1>
          <p className="text-xs text-slate-500">Track application progress, priority upgrades, and interview status.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === t.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content list */}
        {loading ? (
          <SkeletonCard />
        ) : filteredApps.length === 0 ? (
          <EmptyState
            title="No Applications Found"
            description="You don't have any job applications matching this filter status."
            actionText="Find & Apply for Jobs"
            actionHref="/find-jobs"
          />
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={app.status} />
                    {app.priorityStatus !== "STANDARD" && (
                      <StatusBadge status={app.priorityStatus} type="priority" />
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{app.jobTitle}</h3>
                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {app.employerName}
                  </p>
                  <span className="text-[11px] text-slate-400 block">Applied Date: {app.appliedDate}</span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <Link
                    href={`/jobs/${app.jobId}`}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                  >
                    View Job <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WorkerLayout>
  );
}

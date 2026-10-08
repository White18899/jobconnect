"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { Users, CheckCircle2, Lock, Unlock, Zap, ChevronRight, Check, X, Award } from "lucide-react";
import { getEmployerApplications, updateApplicationStatus, isWorkerUnlocked } from "@/services";
import { Application } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"NEW" | "UNDER_REVIEW" | "SHORTLISTED" | "HIRED" | "REJECTED">("NEW");
  const [unlockedMap, setUnlockedMap] = useState<{ [key: string]: boolean }>({});

  const fetchApps = async () => {
    const apps = await getEmployerApplications("emp-1");
    setApplications(apps);

    const map: { [key: string]: boolean } = {};
    for (const a of apps) {
      map[a.workerId] = await isWorkerUnlocked("emp-1", a.workerId);
    }
    setUnlockedMap(map);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleStatusUpdate = async (id: string, status: any) => {
    await updateApplicationStatus(id, status);
    fetchApps();
  };

  const filtered = applications.filter((a) => {
    if (activeTab === "NEW") return a.status === "APPLIED";
    return a.status === activeTab;
  });

  const tabs = [
    { id: "NEW", label: `New (${applications.filter((a) => a.status === "APPLIED").length})` },
    { id: "UNDER_REVIEW", label: "Under Review" },
    { id: "SHORTLISTED", label: "Shortlisted" },
    { id: "HIRED", label: "Hired ✓" },
    { id: "REJECTED", label: "Rejected" },
  ];

  return (
    <EmployerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Job Applicant Management</h1>
          <p className="text-xs text-slate-500">Review candidate trade profiles, shortlist, and unlock contact details.</p>
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

        {loading ? (
          <SkeletonCard />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Candidates Found"
            description="There are no applicants matching this status tab currently."
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => {
              const isUnlocked = unlockedMap[app.workerId];
              return (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={app.status} />
                        {app.priorityStatus !== "STANDARD" && (
                          <StatusBadge status={app.priorityStatus} type="priority" />
                        )}
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> Unlocked 🔓
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-600" /> Protected 🔒
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">{app.workerName}</h3>
                      <p className="text-xs text-slate-600">
                        Trade: <strong>{app.workerCategory}</strong> • Experience: <strong>{app.workerExperience} Years</strong> • City: <strong>{app.workerCity}</strong>
                      </p>
                      <span className="text-[11px] text-slate-400 block">Applied for position: {app.jobTitle} on {app.appliedDate}</span>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Link
                        href={`/employer/worker/${app.workerId}`}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1"
                      >
                        View Profile & Unlock <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Update Status:</span>
                      <button
                        onClick={() => handleStatusUpdate(app.id, "SHORTLISTED")}
                        className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg border border-purple-200 cursor-pointer"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, "HIRED")}
                        className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-200 cursor-pointer"
                      >
                        Hire Worker ✓
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </EmployerLayout>
  );
}

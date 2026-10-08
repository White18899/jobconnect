"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { Briefcase, Plus, Users, Edit, Trash2, Eye } from "lucide-react";
import { getEmployerJobs, deleteJob, updateJobStatus } from "@/services";
import { Job } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function EmployerMyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "draft" | "closed">("active");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchJobs = () => {
    getEmployerJobs("emp-1").then((j) => {
      setJobs(j);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    await deleteJob(deleteTargetId);
    setDeleteTargetId(null);
    fetchJobs();
  };

  const handleToggleStatus = async (id: string, currentStatus: "active" | "draft" | "closed") => {
    const nextStatus = currentStatus === "active" ? "closed" : "active";
    await updateJobStatus(id, nextStatus);
    fetchJobs();
  };

  const filteredJobs = jobs.filter((j) => j.status === activeTab);

  return (
    <EmployerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Job Listings</h1>
            <p className="text-xs text-slate-500">Manage active job vacancies, drafts, and closed positions.</p>
          </div>
          <Link
            href="/employer/post-job"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs gap-1.5"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {(["active", "draft", "closed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab} Vacancies ({jobs.filter((j) => j.status === tab).length})
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            title={`No ${activeTab} jobs`}
            description="You don't have any job postings in this status tab."
            actionText="Post a Job Now"
            actionHref="/employer/post-job"
          />
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded border border-blue-200">
                      {job.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">Created {job.createdAt}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                  <p className="text-xs text-slate-600">
                    Location: <strong>{job.location}</strong> • Salary: ₹{job.salaryMin.toLocaleString()}–₹{job.salaryMax.toLocaleString()}/mo
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    href={`/employer/applications?jobId=${job.id}`}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" /> View Applications (3)
                  </Link>

                  <button
                    onClick={() => handleToggleStatus(job.id, job.status)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl"
                  >
                    {job.status === "active" ? "Close Job" : "Re-open Job"}
                  </button>

                  <button
                    onClick={() => setDeleteTargetId(job.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Job Post?"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete Job"
        variant="danger"
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
      />
    </EmployerLayout>
  );
}

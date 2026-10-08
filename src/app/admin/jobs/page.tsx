"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Briefcase, Trash2 } from "lucide-react";
import { getAllJobs, updateJobStatus, deleteJob } from "@/services";
import { Job } from "@/types";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = () => {
    getAllJobs().then((j) => setJobs(j));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (id: string, current: string) => {
    await updateJobStatus(id, current === "active" ? "closed" : "active");
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    await deleteJob(id);
    fetchJobs();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Job Postings</h1>
          <p className="text-xs text-slate-400">Audit, close, or delete trade job vacancies published by employers.</p>
        </div>

        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Job Title</th>
                  <th className="p-3">Employer</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Salary Min/Max</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">{j.title}</td>
                    <td className="p-3 text-slate-300">{j.employerName}</td>
                    <td className="p-3 text-blue-400">{j.category}</td>
                    <td className="p-3">{j.location}</td>
                    <td className="p-3 font-bold text-emerald-400">₹{j.salaryMin}–₹{j.salaryMax}</td>
                    <td className="p-3 text-slate-400">{j.createdAt}</td>
                    <td className="p-3 font-bold uppercase text-[10px]">{j.status}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(j.id, j.status)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded"
                      >
                        {j.status === "active" ? "Close" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(j.id)}
                        className="p-1 bg-rose-900/60 hover:bg-rose-800 text-rose-300 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { FileCheck } from "lucide-react";
import { getAllApplications, updateApplicationStatus } from "@/services";
import { Application } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  const fetchApps = () => {
    getAllApplications().then((apps) => setApplications(apps));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleStatusChange = async (id: string, status: any) => {
    await updateApplicationStatus(id, status);
    fetchApps();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Applications</h1>
          <p className="text-xs text-slate-400">All submitted candidate applications across employers and trades.</p>
        </div>

        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Worker Candidate</th>
                  <th className="p-3">Employer</th>
                  <th className="p-3">Job Target</th>
                  <th className="p-3">Applied Date</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">{a.workerName} ({a.workerCategory})</td>
                    <td className="p-3 text-slate-300">{a.employerName}</td>
                    <td className="p-3 text-slate-300">{a.jobTitle}</td>
                    <td className="p-3 text-slate-400">{a.appliedDate}</td>
                    <td className="p-3"><StatusBadge status={a.priorityStatus} type="priority" /></td>
                    <td className="p-3"><StatusBadge status={a.status} /></td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleStatusChange(a.id, "SHORTLISTED")}
                        className="px-2 py-1 bg-purple-900/60 text-purple-300 text-[10px] font-bold rounded"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleStatusChange(a.id, "REJECTED")}
                        className="px-2 py-1 bg-rose-900/60 text-rose-300 text-[10px] font-bold rounded"
                      >
                        Reject
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

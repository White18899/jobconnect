"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Building } from "lucide-react";
import { getAllEmployerProfiles } from "@/services";
import { EmployerProfile } from "@/types";

export default function AdminEmployersPage() {
  const [employers, setEmployers] = useState<EmployerProfile[]>([]);
  const [statusMap, setStatusMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getAllEmployerProfiles().then((empList) => {
      setEmployers(empList);
      const initialMap: { [key: string]: string } = {};
      empList.forEach((e) => (initialMap[e.id] = "Active"));
      setStatusMap(initialMap);
    });
  }, []);

  const toggleStatus = (id: string) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: prev[id] === "Active" ? "Suspended" : "Active",
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Employer Account Directory</h1>
          <p className="text-xs text-slate-400">Manage business accounts, available unlock credits, and suspension states.</p>
        </div>

        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Company / Business</th>
                  <th className="p-3">Industry</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Unlock Credits</th>
                  <th className="p-3">Total Hires</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {employers.map((e) => {
                  const status = statusMap[e.id] || "Active";
                  return (
                    <tr key={e.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-white">{e.companyName}</td>
                      <td className="p-3 text-purple-300">{e.industry}</td>
                      <td className="p-3">{e.city}</td>
                      <td className="p-3 font-bold text-amber-400">{e.unlockCredits} Unlocks</td>
                      <td className="p-3">{e.totalHires} Hires</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            status === "Active"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : "bg-rose-950 text-rose-400 border border-rose-800"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => toggleStatus(e.id)}
                          className={`px-3 py-1 text-[11px] font-bold rounded cursor-pointer ${
                            status === "Active"
                              ? "bg-rose-900/60 hover:bg-rose-800 text-rose-200"
                              : "bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200"
                          }`}
                        >
                          {status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Key } from "lucide-react";
import { getWorkerUnlocks } from "@/services";
import { WorkerUnlockRecord } from "@/types";

export default function AdminWorkerUnlocksPage() {
  const [unlocks, setUnlocks] = useState<WorkerUnlockRecord[]>([]);

  useEffect(() => {
    getWorkerUnlocks().then((u) => setUnlocks(u));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Worker Profile Unlock Audit Log</h1>
          <p className="text-xs text-slate-400">Complete record of employer credit redemptions for worker contact details.</p>
        </div>

        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Employer</th>
                  <th className="p-3">Unlocked Worker</th>
                  <th className="p-3">Package Used</th>
                  <th className="p-3">Credits Consumed</th>
                  <th className="p-3">Unlocked Date</th>
                  <th className="p-3 font-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {unlocks.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">{u.employerName}</td>
                    <td className="p-3 text-blue-400 font-semibold">{u.workerName}</td>
                    <td className="p-3">{u.planId || "5_WORKERS"}</td>
                    <td className="p-3 font-bold text-amber-400">{u.creditUsed} Credit</td>
                    <td className="p-3 text-slate-400">{u.unlockedAt}</td>
                    <td className="p-3 font-bold text-emerald-400">{u.status}</td>
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

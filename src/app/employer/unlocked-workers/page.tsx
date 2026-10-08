"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { KeyRound, Unlock, Plus, User, ArrowRight } from "lucide-react";
import { getEmployerProfile, getWorkerUnlocks } from "@/services";
import { EmployerProfile, WorkerUnlockRecord } from "@/types";

export default function EmployerUnlockedWorkersPage() {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [unlocks, setUnlocks] = useState<WorkerUnlockRecord[]>([]);

  useEffect(() => {
    getEmployerProfile("emp-1").then((emp) => setProfile(emp));
    getWorkerUnlocks().then((unl) => setUnlocks(unl));
  }, []);

  const totalUsed = unlocks.length;
  const availableCredits = profile?.unlockCredits || 0;

  return (
    <EmployerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Unlocked Workers Directory</h1>
            <p className="text-xs text-slate-500">View candidates whose contact details & resumes have been unlocked.</p>
          </div>

          <Link
            href="/employer/worker-unlock-plans"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Buy More Credits
          </Link>
        </div>

        {/* Credits Overview Box (Prompt Section 31) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200">
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
              Available Credits
            </span>
            <span className="text-3xl font-black text-blue-700">{availableCredits}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Used Credits
            </span>
            <span className="text-3xl font-black text-slate-900">{totalUsed}</span>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
              Remaining Unlocks
            </span>
            <span className="text-3xl font-black text-emerald-800">{availableCredits}</span>
          </div>
        </div>

        {/* List of Unlocked Workers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Unlock className="w-4 h-4 text-emerald-600" /> Unlocked Candidates ({unlocks.length})
          </h3>

          {unlocks.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No worker profiles unlocked yet.</p>
          ) : (
            <div className="space-y-3">
              {unlocks.map((u) => (
                <div
                  key={u.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{u.workerName}</h4>
                    <p className="text-xs text-slate-600">
                      Unlocked on: <strong>{u.unlockedAt}</strong> • Credit Used: <strong>1 Credit</strong>
                    </p>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      Contact Details & Resume Active 🔓
                    </span>
                  </div>

                  <Link
                    href={`/employer/worker/${u.workerId}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </EmployerLayout>
  );
}

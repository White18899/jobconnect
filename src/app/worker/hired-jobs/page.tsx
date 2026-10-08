"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { WorkerLayout } from "@/components/layout/WorkerLayout";
import { CheckCircle2, Lock, Unlock, Phone, Mail, MapPin, Building2 } from "lucide-react";
import { getWorkerApplications, getEmployerProfile, isWorkerUnlocked } from "@/services";
import { Application, EmployerProfile } from "@/types";

export default function HiredJobsPage() {
  const [hiredApps, setHiredApps] = useState<Application[]>([]);
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(true);

  useEffect(() => {
    getWorkerApplications("wrk-1").then((apps) => {
      const hired = apps.filter((a) => a.status === "HIRED" || a.status === "SHORTLISTED");
      setHiredApps(hired);
    });
    getEmployerProfile("emp-1").then((emp) => setEmployer(emp));
    isWorkerUnlocked("emp-1", "wrk-1").then((unl) => setIsUnlocked(unl));
  }, []);

  return (
    <WorkerLayout>
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-widest">
            Hired Opportunities
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Hired Jobs & Unlocked Employer Contacts
          </h1>
          <p className="text-xs text-slate-500">
            View employers who hired or shortlisted you along with reciprocal unlocked contact details.
          </p>
        </div>

        {hiredApps.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Status: {app.status} ✓
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{app.jobTitle}</h3>
                <p className="text-xs text-slate-600 font-semibold">{app.employerName}</p>
              </div>

              <div className="flex items-center gap-2">
                {isUnlocked ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                    <Unlock className="w-3.5 h-3.5" /> Employer Unlocked 🔓
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-600" /> Details Protected 🔒
                  </span>
                )}
              </div>
            </div>

            {/* Reciprocal Employer Detail Display (Prompt Rule #33) */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Employer Verified Contact Information</h4>

              {isUnlocked && employer ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">HR Direct Contact Phone 🔓</span>
                    <strong className="text-slate-900 text-sm">{employer.protectedDetails?.contactPersonPhone || "N/A"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">Recruitment Email 🔓</span>
                    <strong className="text-slate-900 text-sm">{employer.protectedDetails?.directEmail || "N/A"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">Office & Workplace Address 🔓</span>
                    <strong className="text-slate-900 text-sm">{employer.protectedDetails?.fullAddress || "N/A"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">Company GST / Reg ID 🔓</span>
                    <strong className="text-slate-900 text-sm">{employer.protectedDetails?.taxGstId || "N/A"}</strong>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2 text-xs text-slate-600">
                  <Lock className="w-6 h-6 text-amber-600 mx-auto" />
                  <p className="font-bold text-slate-900">Employer Details Currently Protected 🔒</p>
                  <p>Employer contact information unlocks automatically after employer profile unlock confirmation.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </WorkerLayout>
  );
}

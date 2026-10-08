"use client";

import React, { useState, useEffect } from "react";
import { WorkerLayout } from "@/components/layout/WorkerLayout";
import { Building2, MapPin, CheckCircle2, Lock, Unlock } from "lucide-react";
import { getEmployerProfile, isWorkerUnlocked } from "@/services";
import { EmployerProfile } from "@/types";

export default function WorkerEmployerDetailsPage() {
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [unlocked, setUnlocked] = useState(true);

  useEffect(() => {
    getEmployerProfile("emp-1").then((e) => setEmployer(e));
    isWorkerUnlocked("emp-1", "wrk-1").then((u) => setUnlocked(u));
  }, []);

  if (!employer) return <WorkerLayout>Loading...</WorkerLayout>;

  return (
    <WorkerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Employer Information Directory</h1>
          <p className="text-xs text-slate-500">View company details and unlocked HR contacts.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                {employer.industry}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">{employer.companyName}</h2>
              <p className="text-xs text-slate-500">{employer.city}, {employer.state}</p>
            </div>
            {unlocked ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                Unlocked 🔓
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                Protected 🔒
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <h3 className="font-bold text-slate-900 text-sm">Company Description</h3>
            <p>{employer.description}</p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">HR & Contact Details</h3>
            {unlocked ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Phone</span>
                  <strong className="text-slate-900">{employer.protectedDetails?.contactPersonPhone || "N/A"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Email</span>
                  <strong className="text-slate-900">{employer.protectedDetails?.directEmail || "N/A"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Address</span>
                  <strong className="text-slate-900">{employer.protectedDetails?.fullAddress || "N/A"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">GST Tax ID</span>
                  <strong className="text-slate-900">{employer.protectedDetails?.taxGstId || "N/A"}</strong>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-2xl border text-center text-xs text-slate-600">
                Contact information is locked until an official worker unlock relationship exists.
              </div>
            )}
          </div>
        </div>
      </div>
    </WorkerLayout>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Users,
  Building,
  Briefcase,
  FileCheck,
  CreditCard,
  Zap,
  CheckCircle,
  XCircle,
  Key,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import {
  getAllWorkerProfiles,
  getAllEmployerProfiles,
  getAllJobs,
  getAllApplications,
  getAllPaymentRecords,
  getWorkerUnlocks,
} from "@/services";
import { PaymentRecord } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";

export default function AdminDashboardPage() {
  const [workersCount, setWorkersCount] = useState(0);
  const [employersCount, setEmployersCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [appsCount, setAppsCount] = useState(0);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [unlocksCount, setUnlocksCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllWorkerProfiles(),
      getAllEmployerProfiles(),
      getAllJobs(),
      getAllApplications(),
      getAllPaymentRecords(),
      getWorkerUnlocks(),
    ]).then(([w, e, j, a, p, u]) => {
      setWorkersCount(w.length);
      setEmployersCount(e.length);
      setJobsCount(j.length);
      setAppsCount(a.length);
      setPayments(p);
      setUnlocksCount(u.length);
      setLoading(false);
    });
  }, []);

  const pendingPayments = payments.filter((p) => p.status === "PENDING");
  const approvedPayments = payments.filter((p) => p.status === "VERIFIED");
  const rejectedPayments = payments.filter((p) => p.status === "REJECTED");
  const priorityPayments = payments.filter((p) => p.type === "worker_priority");

  const employerRevenue = payments
    .filter((p) => p.type === "employer_unlock" && p.status === "VERIFIED")
    .reduce((sum, p) => sum + p.amount, 0);

  const priorityRevenue = payments
    .filter((p) => p.type === "worker_priority" && p.status === "VERIFIED")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRevenue = employerRevenue + priorityRevenue;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Platform Control Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Admin Overview & Analytics
            </h1>
            <p className="text-xs text-slate-300">
              Monitor payments, verify UTR records, inspect trade listings, and manage platform security.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-purple-500/30 p-4 rounded-2xl text-right shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Revenue Verified
            </span>
            <div className="text-3xl font-black text-emerald-400">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">
              Employer: ₹{employerRevenue} • Priority: ₹{priorityRevenue}
            </span>
          </div>
        </div>

        {/* Prompt Section 36: Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Workers</span>
            <div className="text-2xl font-black text-white">{workersCount}</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Employers</span>
            <div className="text-2xl font-black text-white">{employersCount}</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Active Jobs</span>
            <div className="text-2xl font-black text-white">{jobsCount}</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Applications</span>
            <div className="text-2xl font-black text-white">{appsCount}</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 bg-amber-950/20 space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase">Pending Verification</span>
            <div className="text-2xl font-black text-amber-400">{pendingPayments.length}</div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Approved Payments</span>
              <div className="text-xl font-black text-emerald-400">{approvedPayments.length}</div>
            </div>
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Rejected Payments</span>
              <div className="text-xl font-black text-rose-400">{rejectedPayments.length}</div>
            </div>
            <XCircle className="w-6 h-6 text-rose-400" />
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Active Unlocks</span>
              <div className="text-xl font-black text-purple-400">{unlocksCount}</div>
            </div>
            <Key className="w-6 h-6 text-purple-400" />
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Priority Payments</span>
              <div className="text-xl font-black text-amber-400">{priorityPayments.length}</div>
            </div>
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
        </div>

        {/* Pending Verification Priority Hub */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-amber-400" />
              Payments Requiring Admin Verification ({pendingPayments.length})
            </h3>
            <Link
              href="/admin/payment-verification"
              className="text-xs text-purple-400 font-bold hover:underline"
            >
              Open Verification Hub →
            </Link>
          </div>

          {loading ? (
            <SkeletonCard />
          ) : pendingPayments.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No pending payments requiring verification.</p>
          ) : (
            <div className="space-y-3">
              {pendingPayments.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{p.userName}</span>
                      <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800">
                        ₹{p.amount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Type: <strong className="text-white capitalize">{p.type.replace("_", " ")}</strong> • UTR:{" "}
                      <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                        {p.utrNumber}
                      </code>
                    </p>
                    <span className="text-[10px] text-slate-500 block">Submitted {p.submittedAt}</span>
                  </div>

                  <Link
                    href="/admin/payment-verification"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-xs shrink-0"
                  >
                    Verify Payment UTR
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

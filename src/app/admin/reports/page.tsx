"use client";

import React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BarChart3, TrendingUp, DollarSign, Users, Briefcase, Award } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Analytics & Financial Reports</h1>
          <p className="text-xs text-slate-400">Recruitment metrics, revenue breakdown, and trade activity distribution.</p>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Employer Unlock Revenue</span>
            <div className="text-3xl font-black text-emerald-400">₹4,990</div>
            <p className="text-xs text-slate-400">From ₹149, ₹499 & ₹949 Credit Packages</p>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Priority Application Revenue</span>
            <div className="text-3xl font-black text-amber-400">₹1,495</div>
            <p className="text-xs text-slate-400">From ₹299 Optional Priority Submissions</p>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-purple-500/40 bg-purple-950/20 space-y-2">
            <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Total Gross Revenue</span>
            <div className="text-3xl font-black text-white">₹6,485</div>
            <p className="text-xs text-slate-400">100% Verified UTR Transactions</p>
          </div>
        </div>

        {/* Trade Activity Distribution Table */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" /> Trade Category Recruitment Performance
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-900 rounded-xl flex justify-between items-center">
              <div>
                <strong className="text-white">Electrician</strong>
                <p className="text-slate-400 text-[11px]">42 Applications • 8 Hires</p>
              </div>
              <span className="font-bold text-emerald-400">92% Match Rate</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl flex justify-between items-center">
              <div>
                <strong className="text-white">Welder (MIG/TIG)</strong>
                <p className="text-slate-400 text-[11px]">35 Applications • 12 Hires</p>
              </div>
              <span className="font-bold text-emerald-400">88% Match Rate</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl flex justify-between items-center">
              <div>
                <strong className="text-white">AC Technician</strong>
                <p className="text-slate-400 text-[11px]">28 Applications • 5 Hires</p>
              </div>
              <span className="font-bold text-emerald-400">85% Match Rate</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

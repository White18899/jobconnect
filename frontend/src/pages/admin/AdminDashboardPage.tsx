import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Application, Job } from '../../services/mockData';
import {
  LayoutDashboard,
  CheckSquare,
  CreditCard,
  Users,
  Briefcase,
  RotateCcw,
  IndianRupee,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface AdminDashboardPageProps {
  applications: Application[];
  jobs: Job[];
  onNavigate: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  applications,
  jobs,
  onNavigate,
}) => {
  const pendingCount = applications.filter((a) => a.status === 'pending_verification').length;
  const unlockedCount = applications.filter((a) => a.status === 'unlocked').length;
  const activeJobsCount = jobs.filter((j) => j.status === 'open').length;
  const totalRevenue = unlockedCount * 499;

  return (
    <div className="max-w-2xl mx-auto pb-16 space-y-6">
      <div className="pt-1">
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Admin Operations Command
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Compliance oversight, document verification queue, and transaction audits
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-4 text-amber-950">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 uppercase tracking-wide">
            <span>Pending Check</span>
            <CheckSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 font-heading text-amber-900">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-700">Awaiting UTR review</span>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-300 rounded-2xl p-4 text-emerald-950">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase tracking-wide">
            <span>Unlocked</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 font-heading text-emerald-900">
            {unlockedCount}
          </div>
          <span className="text-[11px] text-emerald-700">Verified & Approved</span>
        </div>

        <div className="bg-blue-500/10 border border-blue-300 rounded-2xl p-4 text-blue-950">
          <div className="flex items-center justify-between text-xs font-bold text-blue-800 uppercase tracking-wide">
            <span>Active Jobs</span>
            <Briefcase className="w-4 h-4 text-brand-900" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 font-heading text-brand-900">
            {activeJobsCount}
          </div>
          <span className="text-[11px] text-brand-700">Open in feed</span>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wide">
            <span>Fee Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 font-heading text-white">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">₹499 per unlock</span>
        </div>
      </div>

      {/* Main Action Modules */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Operational Modules
        </h2>

        {/* Verification Queue Card */}
        <Card hoverEffect onClick={() => onNavigate('admin_queue')} className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Verification Queue ({pendingCount} pending)
              </h3>
              <p className="text-xs text-slate-500">
                Review submitted ₹499 UTRs, verify documents, and approve contact unlocking.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </Card>

        {/* Payments & Refunds Card */}
        <Card hoverEffect onClick={() => onNavigate('admin_payments')} className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-brand-900 flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Payments & Manual Refunds
              </h3>
              <p className="text-xs text-slate-500">
                Audit transactions, track unique UTRs, and process manual refund logs.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </Card>

        {/* User Moderation Card */}
        <Card hoverEffect onClick={() => onNavigate('admin_users')} className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                User Management & Block
              </h3>
              <p className="text-xs text-slate-500">
                Inspect accounts, prevent duplicate profiles, and suspend suspicious users.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </Card>
      </div>
    </div>
  );
};

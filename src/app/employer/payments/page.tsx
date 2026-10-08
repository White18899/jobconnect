"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { CreditCard, Plus, Clock } from "lucide-react";
import { getAllPaymentRecords } from "@/services";
import { PaymentRecord } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function EmployerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    getAllPaymentRecords().then((list) => {
      setPayments(list.filter((p) => p.userId === "user-emp-1" || p.type === "employer_unlock"));
    });
  }, []);

  return (
    <EmployerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Payment History</h1>
            <p className="text-xs text-slate-500">Track worker unlock plan payment submissions and admin verification status.</p>
          </div>
          <Link
            href="/employer/worker-unlock-plans"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Buy Unlock Credits
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          {payments.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No payment records found.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">Amount: ₹{p.amount}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-xs text-slate-600">
                      Package: <strong>{p.planId || "Worker Unlock Plan"}</strong> ({p.unlocksCount} Unlocks)
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      UTR Ref: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-900 font-mono font-bold">{p.utrNumber}</code> • Date: {p.submittedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </EmployerLayout>
  );
}

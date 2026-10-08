"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";
import { getAllPaymentRecords, verifyPayment } from "@/services";
import { PaymentRecord } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AdminEmployerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  const fetchPayments = () => {
    getAllPaymentRecords().then((list) => {
      setPayments(list.filter((p) => p.type === "employer_unlock"));
    });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (id: string, action: "VERIFY" | "REJECT") => {
    await verifyPayment(id, action);
    fetchPayments();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Employer Unlock Payments</h1>
          <p className="text-xs text-slate-400">Payment records for ₹149 (1 Worker), ₹499 (5 Workers), and ₹949 (10 Workers) plans.</p>
        </div>

        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Employer</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Unlocks</th>
                  <th className="p-3">UTR</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono">{p.id}</td>
                    <td className="p-3 font-bold text-white">{p.userName}</td>
                    <td className="p-3">{p.planId || "5_WORKERS"}</td>
                    <td className="p-3 font-bold text-emerald-400">₹{p.amount}</td>
                    <td className="p-3">{p.unlocksCount} Unlocks</td>
                    <td className="p-3 font-mono text-amber-300">{p.utrNumber}</td>
                    <td className="p-3"><StatusBadge status={p.status} /></td>
                    <td className="p-3 text-right space-x-2">
                      {p.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleAction(p.id, "VERIFY")}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleAction(p.id, "REJECT")}
                            className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-rose-300 rounded text-[11px] font-bold"
                          >
                            Reject
                          </button>
                        </>
                      )}
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

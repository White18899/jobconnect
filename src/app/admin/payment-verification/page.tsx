"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CheckCircle, XCircle, Clock, Eye, AlertCircle, FileText, Image as ImageIcon } from "lucide-react";
import { getAllPaymentRecords, verifyPayment } from "@/services";
import { PaymentRecord } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export default function AdminPaymentVerificationPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const fetchPayments = () => {
    getAllPaymentRecords().then((list) => {
      setPayments(list);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (id: string, action: "VERIFY" | "REJECT") => {
    await verifyPayment(id, action);
    fetchPayments();
  };

  const pendingPayments = payments.filter((p) => p.status === "PENDING");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-800 uppercase tracking-widest">
            Verification Queue
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Payment UTR Verification Hub
          </h1>
          <p className="text-xs text-slate-400">
            Inspect transaction UTRs, review payment screenshots, and approve unlock credits or priority application badges.
          </p>
        </div>

        {/* Pending verification cards */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading payment records...</div>
        ) : pendingPayments.length === 0 ? (
          <EmptyState
            title="All Payments Verified!"
            description="There are currently no pending UTR payment submissions requiring administrator verification."
          />
        ) : (
          <div className="space-y-6">
            {pendingPayments.map((p) => (
              <div
                key={p.id}
                className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800 uppercase">
                        {p.type.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Payment ID: {p.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1">{p.userName}</h3>
                    <p className="text-xs text-slate-400">{p.userEmail}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Amount</span>
                    <span className="text-3xl font-black text-emerald-400">₹{p.amount}</span>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">UTR / Ref Number</span>
                    <code className="text-amber-300 font-mono font-bold text-sm bg-slate-800 px-2 py-0.5 rounded block mt-0.5">
                      {p.utrNumber}
                    </code>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Plan / Purpose</span>
                    <strong className="text-white text-sm">
                      {p.planId ? `${p.planId} (${p.unlocksCount} Unlocks)` : `Priority App (Job: ${p.jobTitle})`}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted Date</span>
                    <strong className="text-white">{p.submittedAt}</strong>
                  </div>
                </div>

                {/* Screenshot Placeholder View */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ImageIcon className="w-5 h-5 text-purple-400" />
                    <span>Payment Screenshot: <strong>{p.screenshotUrl || "payment_receipt.png"}</strong></span>
                  </div>
                  <button
                    onClick={() => setSelectedScreenshot(p.screenshotUrl || "Sample Receipt Proof")}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    View Screenshot Proof
                  </button>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleVerify(p.id, "REJECT")}
                    className="w-full sm:w-auto px-6 py-2.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject Payment
                  </button>
                  <button
                    onClick={() => handleVerify(p.id, "VERIFY")}
                    className="w-full sm:w-auto px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Verify & Activate Entitlements ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Simple Modal Preview for Screenshot */}
        {selectedScreenshot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full text-center space-y-4 text-white">
              <h4 className="text-base font-bold">Payment Screenshot Verification Proof</h4>
              <div className="p-8 border border-dashed border-slate-700 rounded-xl bg-slate-950 text-xs text-slate-400">
                [ Screenshot Preview: UPI Transfer of ₹499/₹299 Verified ]
              </div>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="px-6 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

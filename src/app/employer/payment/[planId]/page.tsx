"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { CreditCard, Upload, CheckCircle2, AlertCircle, ArrowLeft, Clock } from "lucide-react";
import { submitPaymentRecord } from "@/services";
import { UNLOCK_PLANS } from "@/lib/mockData";
import { UnlockPlanId } from "@/types";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";

function EmployerPaymentContent() {
  const params = useParams();
  const router = useRouter();
  const planId = ((params?.planId as UnlockPlanId) || "5_WORKERS") as UnlockPlanId;
  const targetPlan = UNLOCK_PLANS.find((p) => p.id === planId) || UNLOCK_PLANS[1];

  const [utr, setUtr] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim()) {
      setError("Please enter the UTR / Transaction Ref Number.");
      return;
    }

    setLoading(true);
    await submitPaymentRecord({
      userId: "emp-1",
      userName: "Apex Electrical Infra Ltd",
      userEmail: "careers@apexelectricalinfra.com",
      type: "employer_unlock",
      planId: targetPlan.id,
      amount: targetPlan.price,
      unlocksCount: targetPlan.unlocksCount,
      utrNumber: utr,
      screenshotUrl: fileName || "payment_proof.png",
    });

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link
        href="/employer/worker-unlock-plans"
        className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Unlock Plans
      </Link>

      {/* Workflow steps bar (Prompt Section 30) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between text-[11px] font-bold text-slate-500 overflow-x-auto gap-2">
        <span className="text-blue-600">1. Choose Plan ✓</span>
        <span>→</span>
        <span className={submitted ? "text-blue-600" : "text-slate-900"}>2. Submit Payment</span>
        <span>→</span>
        <span className={submitted ? "text-amber-600 font-black" : "text-slate-400"}>3. Pending Admin Verification</span>
        <span>→</span>
        <span className="text-slate-400">4. Credits Activated</span>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Payment Submitted for Verification!</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            We received your payment UTR <strong className="text-slate-900">{utr}</strong> for the{" "}
            <strong>{targetPlan.name}</strong> (₹{targetPlan.price}). Platform Administrators are verifying your transaction.
          </p>

          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs font-semibold max-w-md mx-auto">
            Current Status: <strong>PENDING VERIFICATION</strong>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/employer/payments"
              className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Track Payment History
            </Link>
            <Link
              href="/employer/dashboard"
              className="px-6 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded">
                Selected Package
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{targetPlan.name}</h2>
              <p className="text-xs text-slate-500">{targetPlan.unlocksCount} Worker Profile Unlocks</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-semibold">Total Price</span>
              <span className="text-3xl font-black text-blue-600">₹{targetPlan.price}</span>
            </div>
          </div>

          {/* Bank / UPI Payment Instructions Placeholder */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" /> Payment Transfer Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Official UPI ID</span>
                <strong className="text-slate-900">jobconnect.business@upi</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Bank Account</span>
                <strong className="text-slate-900">9182910293810 (HDFC Bank)</strong>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                12-Digit UTR / Transaction Ref Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. UPI/328912304910/APEX"
                value={utr}
                onChange={(e) => {
                  setUtr(e.target.value);
                  setError("");
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {error && <p className="text-xs text-rose-600 mt-1 font-semibold">{error}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Upload Payment Proof Screenshot (Optional Placeholder)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-slate-700">
                  {fileName ? fileName : "Click to select screenshot file"}
                </p>
                <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              {loading ? "Submitting Payment..." : "Submit Payment UTR"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function EmployerPaymentPage() {
  return (
    <EmployerLayout>
      <Suspense fallback={<SkeletonCard />}>
        <EmployerPaymentContent />
      </Suspense>
    </EmployerLayout>
  );
}

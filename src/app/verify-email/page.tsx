"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Mail, CheckCircle2, RefreshCw } from "lucide-react";
import { getCurrentUser } from "@/services";

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">Verify Your Email Address</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              We have dispatched a verification link to your registered email address. Please open the link to activate your JobConnect account.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-3">
            <p>Did not receive the email?</p>
            <button
              onClick={handleResend}
              className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-800 font-bold rounded-xl text-xs hover:bg-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Resend Verification Email
            </button>
            {resent && (
              <p className="text-xs text-emerald-600 font-bold animate-in fade-in">
                Verification link resent successfully!
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/worker/dashboard"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all"
            >
              Continue to Portal Dashboard
            </Link>
            <Link href="/login" className="text-xs text-slate-500 font-semibold hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

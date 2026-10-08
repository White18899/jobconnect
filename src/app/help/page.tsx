import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { HelpCircle, BookOpen, ShieldCheck, PhoneCall, Zap, Key } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">
            Help Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">How Can We Help You Today?</h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Find step-by-step guides for workers, employers, priority applications, and unlock credit management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-amber-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Priority Application Guide</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Learn how the ₹299 optional priority application gives your candidate profile top visibility on employer dashboards.
            </p>
            <Link href="/faq#priority" className="text-xs text-blue-600 font-bold hover:underline inline-block pt-1">
              Read Guide →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Worker Unlock Credits</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              How employers select between ₹149 (1 Worker), ₹499 (5 Workers), and ₹949 (10 Workers) plans and submit payment UTR for verification.
            </p>
            <Link href="/faq#unlocks" className="text-xs text-blue-600 font-bold hover:underline inline-block pt-1">
              Read Guide →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Protected Information</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Understand what personal worker details remain protected before profile unlock and how reciprocal visibility operates.
            </p>
            <Link href="/faq#privacy" className="text-xs text-blue-600 font-bold hover:underline inline-block pt-1">
              Read Guide →
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold">Still Need Help?</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Our support representatives are available Monday through Saturday to assist you with payment verification or account guidance.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Contact Customer Support
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

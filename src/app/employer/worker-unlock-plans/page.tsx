"use client";

import React from "react";
import Link from "next/link";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { CheckCircle2, KeyRound, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { UNLOCK_PLANS } from "@/lib/mockData";

export default function WorkerUnlockPlansPage() {
  return (
    <EmployerLayout>
      <div className="space-y-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-widest">
            Credit Packages
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Worker Unlock Plans
          </h1>
          <p className="text-xs text-slate-600">
            Purchase credits to unlock protected candidate phone numbers, full addresses, emergency contacts, and resumes. Credits do not expire.
          </p>
        </div>

        {/* 3 Plans Grid (Prompt Section 29) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {UNLOCK_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-8 border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-xl ${
                plan.isPopular
                  ? "border-blue-600 ring-2 ring-blue-600/20 scale-105"
                  : "border-slate-200"
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
                  MOST POPULAR
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium">/ {plan.unlocksCount} Worker Unlock</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={`/employer/payment/${plan.id}`}
                  className={`block text-center w-full py-3 rounded-xl font-bold text-xs transition-all shadow-sm ${
                    plan.isPopular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  Choose {plan.name}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">Need Custom Enterprise Bulk Unlocks?</h4>
            <p className="text-xs text-slate-300">Contact our enterprise sales team for customized packages of 50+ worker unlocks.</p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shrink-0"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </EmployerLayout>
  );
}

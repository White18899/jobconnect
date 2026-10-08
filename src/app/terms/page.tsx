import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Terms & Conditions</h1>
          <p className="text-xs text-slate-500">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">1. Platform Services</h2>
            <p>
              JobConnect provides an online matching platform for employers looking to hire blue-collar tradespeople and workers seeking job opportunities. JobConnect acts as a technology intermediary and is not a labor contractor or employer of record.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">2. Free Worker Applications & Priority Disclaimer</h2>
            <p>
              Submitting job applications is free of charge for all registered workers. Workers may choose to purchase an optional ₹299 Priority Application boost. <strong>Disclaimer:</strong> ₹299 priority status enhances application visibility and review order, but does NOT guarantee employment, interview, or selection.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">3. Worker Unlock Plans</h2>
            <p>
              Employers purchase Worker Unlock Credits (₹149 for 1 worker, ₹499 for 5 workers, ₹949 for 10 workers) to view protected contact details and resumes. Unlocks consume 1 credit per unique candidate and enable reciprocal employer contact visibility.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">4. Payment & Verification Policy</h2>
            <p>
              All payments submitted via UTR and screenshot upload are subject to manual or automated verification by JobConnect Administrators. Fraudulent UTR submissions will result in instant account suspension.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

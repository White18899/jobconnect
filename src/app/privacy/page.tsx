import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">1. Data Security & Protected Fields</h2>
            <p>
              JobConnect enforces strict privacy boundaries for blue-collar workers. Professional trade skills, experience, and general city location are visible on job applications, while phone numbers, full addresses, emergency contacts, and resumes remain locked.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">2. Profile Unlock & Reciprocal Disclosure</h2>
            <p>
              Protected fields are revealed strictly when an employer executes an explicit Worker Unlock transaction. Upon profile unlock, reciprocal disclosure rules grant the candidate visibility of employer HR contact information for mutual safety.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900">3. Usage of Personal Information</h2>
            <p>
              JobConnect does not sell worker or employer personal data to third-party telemarketers. Information is processed solely for employment matching, payment verification, and security logging.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

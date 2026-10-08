import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "How do workers apply for jobs on JobConnect?",
      a: "Workers can browse all active job listings by category, location, and salary, and submit their application completely FREE of charge.",
    },
    {
      q: "What is the ₹299 Priority Application?",
      a: "The ₹299 Priority Application is an OPTIONAL feature for workers who wish to highlight their profile to employers, giving them top placement in candidate lists and priority review notifications.",
    },
    {
      q: "Does ₹299 Priority Application guarantee employment?",
      a: "No. The ₹299 priority application enhances profile visibility and review priority, but payment does NOT guarantee selection, interview, or employment.",
    },
    {
      q: "How do employers unlock worker contact details?",
      a: "Employers choose one of three Worker Unlock Plans (₹149 for 1 worker, ₹499 for 5 workers, ₹949 for 10 workers). Once payment UTR is verified by Admin, credits are activated to unlock candidate phone numbers and resumes.",
    },
    {
      q: "What is Reciprocal Visibility?",
      a: "When an employer unlocks a candidate profile, both parties are granted access to each other's verified contact details, facilitating transparent communication.",
    },
    {
      q: "How are payments verified?",
      a: "Payments are processed via Bank/UPI transfer. Users submit their 12-digit UTR/Ref number and screenshot. Platform Administrators verify the transaction before activating credits or priority badges.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">
            Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Frequently Asked Questions</h1>
          <p className="text-slate-600 text-sm">
            Everything you need to know about JobConnect rules, payments, and privacy.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-base font-bold text-slate-900 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

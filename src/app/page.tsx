"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  UserCheck,
  Building2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Search,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Award,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { UNLOCK_PLANS } from "@/lib/mockData";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-950 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Recruitment Platform for Blue-Collar Workforce</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Find the Right Job. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500">
                  Hire the Right Worker.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
                JobConnect bridges the gap between employers needing skilled tradespeople and workers looking for reliable employment. Electricians, welders, technicians, drivers, and helpers — all in one platform.
              </p>

              {/* Call to action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/find-jobs"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Find Jobs
                </Link>

                <Link
                  href="/employer/post-job"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-base transition-all flex items-center justify-center gap-2"
                >
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Hire Workers
                </Link>
              </div>

              {/* Stats highlights */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white">5,000+</span>
                  <p className="text-xs text-slate-400">Verified Tradesmen</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white">1,200+</span>
                  <p className="text-xs text-slate-400">Active Employers</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white">98%</span>
                  <p className="text-xs text-slate-400">Match Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Live Job Matching</span>
                  </div>
                  <span className="text-[11px] text-blue-400 font-mono">JobConnect Feed</span>
                </div>

                {/* Sample job item */}
                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/70 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">Senior Industrial Electrician</h4>
                      <p className="text-xs text-slate-400">Apex Electrical Infra Ltd • Visakhapatnam</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      ₹28,000/mo
                    </span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">High Voltage</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Motor Control</span>
                  </div>
                </div>

                {/* Sample worker candidate item */}
                <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/70 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">Ramesh Kumar (Electrician)</h4>
                      <p className="text-xs text-slate-400">6+ Years Exp • ITI Certified</p>
                    </div>
                    <span className="text-xs text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800 flex items-center gap-1 font-bold">
                      <Zap className="w-3 h-3 fill-amber-400" /> Priority ⚡
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-800/80">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contact details protected until Employer Unlock</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    href="/find-jobs"
                    className="inline-flex items-center gap-1 text-xs text-blue-400 font-bold hover:underline"
                  >
                    Browse 250+ Active Worker Listings <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How JobConnect Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How JobConnect Works
            </h2>
            <p className="text-slate-600 text-base mt-3">
              Simple, transparent, and direct process designed specifically for workers and employers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Workers */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">For Workers</h3>
                  <p className="text-xs text-slate-500">Get hired by top employers nearby</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Create Profile</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Add your skills, trade experience, expected pay, and certifications. Keep contact info safe.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Find & Apply for Jobs</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Apply completely FREE to matching trade jobs, or choose optional ₹299 Priority visibility.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Get Hired</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Employer reviews your trade record, unlocks your profile, and contacts you directly to start work!
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/register"
                className="block text-center py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Register as Worker
              </Link>
            </div>

            {/* For Employers */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">For Employers</h3>
                  <p className="text-xs text-slate-500">Hire verified tradespeople fast</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Post a Job</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Specify trade category, experience required, wages, working hours, and location.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Review Workers</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Inspect trade skills, work history, education, and portfolio of applicants.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Hire the Right Worker</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Use Worker Unlock Credits to reveal contact details & resume, then complete hiring.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/employer/post-job"
                className="block text-center py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Post Job as Employer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Worker & Employer Benefits */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">Why Choose JobConnect?</h2>
            <p className="text-slate-400 text-sm mt-2">
              Designed with enterprise security, privacy safeguards, and efficiency at every level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Find Nearby Jobs</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter jobs by city, location radius, trade category, and salary expectations.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Protected Profiles</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sensitive phone numbers & workplace details stay protected until authorized unlock.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Optional Priority</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Workers can optionally choose ₹299 Priority visibility to highlight their application.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Reciprocal Visibility</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                When an employer unlocks a candidate, both parties gain mutual verified details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Worker Unlock Plans (₹149, ₹499, ₹949) */}
      <section className="py-20 bg-slate-50" id="plans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">
              For Employers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Worker Unlock Plans
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Purchase worker access credits to unlock phone numbers, full addresses, and resumes of qualified candidates. Credits do not expire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    POPULAR CHOICE
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
        </div>
      </section>

      {/* Priority Application (₹299) Explanation */}
      <section className="py-16 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-amber-300 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Zap className="w-9 h-9 fill-amber-500" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  <span>Worker Feature</span>
                  <span>•</span>
                  <span>OPTIONAL</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Priority Application — ₹299
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Want your job application to be reviewed first? Choose Priority Application when submitting to stand out with enhanced visibility and direct priority notifications to employers.
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-900 pt-2">
                  <span className="flex items-center gap-1">⚡ Top of Employer List</span>
                  <span className="flex items-center gap-1">⚡ Highlighted Badge</span>
                  <span className="flex items-center gap-1">⚡ Instant SMS/Push Alert</span>
                </div>
                <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 italic">
                  <strong>Important Disclaimer:</strong> ₹299 is optional and does not guarantee selection, interview, or employment.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm mt-2">Clear answers about how JobConnect works</p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900">Is applying for jobs free for workers?</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Yes! Workers can apply for any job completely FREE. The ₹299 Priority Application is strictly an optional boost.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900">How do Employer Unlock Plans work?</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Employers can browse candidate skills and experience for free. To see a candidate&apos;s phone number, full address, and download their resume, employers purchase Worker Unlock Credits (₹149 for 1 worker, ₹499 for 5 workers, ₹949 for 10 workers).
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h4 className="text-base font-bold text-slate-900">What is Reciprocal Visibility?</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                When an employer unlocks a worker&apos;s profile, reciprocal visibility is enabled: the worker also unlocks access to the employer&apos;s direct HR contact details so both parties can communicate safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

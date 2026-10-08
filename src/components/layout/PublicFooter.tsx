import React from "react";
import Link from "next/link";
import { Briefcase, ShieldCheck, Heart, Mail, Phone, MapPin } from "lucide-react";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                JOB<span className="text-blue-500">CONNECT</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              India&apos;s premier blue-collar recruitment platform. Connecting qualified electricians, welders, technicians, drivers, and helpers with verified employers safely and efficiently.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 p-3 rounded-xl max-w-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Verified profiles, reciprocal privacy safeguards & priority job matching.</span>
            </div>
          </div>

          {/* Col 2: For Workers */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              For Workers
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/find-jobs" className="hover:text-blue-400 transition-colors">
                  Find Nearby Jobs
                </Link>
              </li>
              <li>
                <Link href="/worker/profile" className="hover:text-blue-400 transition-colors">
                  Build Free Profile
                </Link>
              </li>
              <li>
                <Link href="/find-jobs" className="hover:text-blue-400 transition-colors">
                  Priority Application (₹299)
                </Link>
              </li>
              <li>
                <Link href="/worker/my-applications" className="hover:text-blue-400 transition-colors">
                  Track Applications
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-400 transition-colors">
                  Worker Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Employers */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/employer/post-job" className="hover:text-blue-400 transition-colors">
                  Post a Worker Job
                </Link>
              </li>
              <li>
                <Link href="/employer/worker-unlock-plans" className="hover:text-blue-400 transition-colors">
                  Worker Unlock Plans
                </Link>
              </li>
              <li>
                <Link href="/employer/applications" className="hover:text-blue-400 transition-colors">
                  Review Candidates
                </Link>
              </li>
              <li>
                <Link href="/employer/unlocked-workers" className="hover:text-blue-400 transition-colors">
                  Unlocked Workers
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-400 transition-colors">
                  Employer Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Help & Legal */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-4">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-blue-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-400 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 JobConnect Recruitment Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-400">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-slate-400">
              Privacy Policy
            </Link>
            <Link href="/admin/dashboard" className="text-purple-400 hover:text-purple-300">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

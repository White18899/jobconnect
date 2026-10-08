"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function AccessRestrictedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-black text-slate-900">Access Restricted</h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            You don&apos;t have permission to view this portal page. Please select your authorized portal view using the header switcher or log in with proper role credentials.
          </p>

          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

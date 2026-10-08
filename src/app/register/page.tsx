"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { UserCheck, Building2, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { registerWorker, registerEmployer, setCurrentUserRole } from "@/services";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"worker" | "employer" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!selectedRole) {
      setError("Please select whether you are a Worker or an Employer.");
      return;
    }

    setLoading(true);
    try {
      let registeredUser;
      if (selectedRole === "worker") {
        registeredUser = await registerWorker(email, password);
      } else {
        registeredUser = await registerEmployer(email, password);
      }
      setLoading(false);
      router.push(`/${registeredUser.role}/dashboard`);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Create your JobConnect Account</h1>
          <p className="text-xs text-slate-600">
            Join thousands of workers and employers across India on a safe recruitment platform.
          </p>
        </div>

        {/* Step 1: Select Role Cards */}
        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Worker Card */}
            <div
              onClick={() => setSelectedRole("worker")}
              className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-blue-600 transition-all cursor-pointer shadow-xs hover:shadow-xl text-center space-y-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">I am a Worker</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Looking for electrician, welder, technician, driver, or helper jobs. Free applications & secure profile.
              </p>
              <button className="px-6 py-2.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                Register as Worker
              </button>
            </div>

            {/* Employer Card */}
            <div
              onClick={() => setSelectedRole("employer")}
              className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-slate-900 transition-all cursor-pointer shadow-xs hover:shadow-xl text-center space-y-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mx-auto group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">I am an Employer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Looking to hire qualified tradespeople. Post jobs, review applications, and unlock worker details.
              </p>
              <button className="px-6 py-2.5 bg-slate-100 text-slate-900 font-bold text-xs rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
                Register as Employer
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Form */
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-md mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                  Role Selected
                </span>
                <h3 className="text-lg font-bold text-slate-900 capitalize">
                  {selectedRole} Registration
                </h3>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                className="text-xs text-slate-500 font-semibold hover:text-slate-900 underline"
              >
                Change Role
              </button>
            </div>

            {error && <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">{error}</p>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
              Already registered?{" "}
              <Link href="/login" className="text-blue-600 font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

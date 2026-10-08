"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Briefcase, Lock, Mail, ArrowRight, Shield } from "lucide-react";
import { loginUser, setCurrentUserRole } from "@/services";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("worker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginUser(email, password, role);
      setLoading(false);
      router.push(`/${user.role}/dashboard`);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-md w-full space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black mx-auto shadow-md">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Welcome Back</h1>
            <p className="text-xs text-slate-500">Sign in to your JobConnect account</p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 border border-slate-200">
            <button
              type="button"
              onClick={() => setRole("worker")}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === "worker"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "hover:text-slate-900"
              }`}
            >
              Worker Login
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                role === "employer"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "hover:text-slate-900"
              }`}
            >
              Employer Login
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl font-medium leading-relaxed">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder={role === "worker" ? "ramesh@example.com" : "careers@apexelectrical.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">Password</label>
                <Link href="/forgot-password" className="text-xs text-blue-600 font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? "Signing in..." : `Sign In as ${role === "worker" ? "Worker" : "Employer"}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Google Sign-in Placeholder */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setCurrentUserRole(role);
                router.push(`/${role}/dashboard`);
              }}
              className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Links */}
          <div className="pt-2 text-center text-xs text-slate-600 space-y-1">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 font-bold hover:underline">
                Register Here
              </Link>
            </p>
            <p className="pt-1">
              <Link href="/admin/dashboard" className="text-purple-600 font-semibold hover:underline">
                Are you a Platform Admin? Login here →
              </Link>
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, UserCheck, Shield, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { getCurrentUser, setCurrentUserRole } from "@/services";
import { UserRole } from "@/types";

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>("worker");

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) setActiveRole(u.role);
    });
  }, []);

  const handleRoleSwitch = async (role: UserRole) => {
    await setCurrentUserRole(role);
    setActiveRole(role);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:bg-blue-700 transition-colors">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                JOB<span className="text-blue-600">CONNECT</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                Blue-Collar Recruitment Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/find-jobs" className="hover:text-blue-600 transition-colors">
              Find Jobs
            </Link>

            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Role Quick Switcher & Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Portal Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200">
              <button
                onClick={() => handleRoleSwitch("worker")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeRole === "worker"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200 font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                Worker
              </button>
              <button
                onClick={() => handleRoleSwitch("employer")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeRole === "employer"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200 font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                Employer
              </button>
              <button
                onClick={() => handleRoleSwitch("admin")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeRole === "admin"
                    ? "bg-white text-purple-700 shadow-xs border border-slate-200 font-bold"
                    : "hover:text-slate-900"
                }`}
              >
                Admin
              </button>
            </div>

            <Link
              href={`/${activeRole}/dashboard`}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Go to {activeRole.toUpperCase()} Dashboard
            </Link>

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-blue-600"
          >
            Home
          </Link>
          <Link
            href="/find-jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-blue-600"
          >
            Find Jobs
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-blue-600"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-blue-600"
          >
            Contact
          </Link>
          <Link
            href="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-800 hover:text-blue-600"
          >
            FAQ
          </Link>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <p className="text-xs text-slate-500 font-medium">Select Portal View:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  handleRoleSwitch("worker");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-xs font-bold rounded-lg border text-center ${
                  activeRole === "worker"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Worker
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch("employer");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-xs font-bold rounded-lg border text-center ${
                  activeRole === "employer"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Employer
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch("admin");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-xs font-bold rounded-lg border text-center ${
                  activeRole === "admin"
                    ? "bg-purple-50 border-purple-300 text-purple-700"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Admin
              </button>
            </div>

            <Link
              href={`/${activeRole}/dashboard`}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs mt-3"
            >
              Open {activeRole.toUpperCase()} Portal
            </Link>

            <div className="flex gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

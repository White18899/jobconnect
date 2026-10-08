"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  FileText,
  CheckCircle,
  User,
  Building2,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Briefcase,
  Zap,
} from "lucide-react";
import { getNotifications, getCurrentUser, setCurrentUserRole } from "@/services";

export const WorkerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    getNotifications("worker").then((n) => setUnreadNotifs(n.filter((item) => !item.isRead).length));
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/worker/dashboard", icon: LayoutDashboard },
    { name: "Find Jobs", href: "/find-jobs", icon: Search },
    { name: "My Applications", href: "/worker/my-applications", icon: FileText },
    { name: "Hired Jobs", href: "/worker/hired-jobs", icon: CheckCircle },
    { name: "My Profile", href: "/worker/profile", icon: User },
    { name: "Employer Details", href: "/worker/employer-details", icon: Building2 },
    { name: "Notifications", href: "/worker/notifications", icon: Bell, count: unreadNotifs },
    { name: "Settings", href: "/worker/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await setCurrentUserRole("worker");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 min-h-screen sticky top-0 shrink-0 border-r border-slate-800">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-white leading-none">
                JOB<span className="text-blue-500">CONNECT</span>
              </span>
              <span className="text-[10px] text-blue-400 font-semibold uppercase mt-0.5">
                Worker Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Nav list */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {item.count && item.count > 0 ? (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Priority Badge Promo */}
        <div className="p-4 m-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>Priority Application</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug mb-3">
            Stand out to employers with ₹299 priority status on job applications.
          </p>
          <Link
            href="/find-jobs"
            className="block text-center w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Find & Apply
          </Link>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              RK
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">Ramesh Kumar</span>
              <span className="text-[10px] text-slate-400 truncate">Worker Account</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-base">Worker Portal</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-800"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 text-slate-300 px-4 py-4 space-y-2 border-b border-slate-800 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.count ? (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-900/30"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

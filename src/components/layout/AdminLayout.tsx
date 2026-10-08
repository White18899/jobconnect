"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck,
  CreditCard,
  Zap,
  CheckCircle,
  Users,
  Building,
  Briefcase,
  Key,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { getNotifications, setCurrentUserRole } from "@/services";

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingVerifications, setPendingVerifications] = useState(2);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Applications", href: "/admin/applications", icon: FileCheck },
    { name: "Employer Payments", href: "/admin/employer-payments", icon: CreditCard },
    { name: "Priority Payments", href: "/admin/priority-payments", icon: Zap },
    { name: "Payment Verification", href: "/admin/payment-verification", icon: CheckCircle, count: pendingVerifications },
    { name: "Workers", href: "/admin/workers", icon: Users },
    { name: "Employers", href: "/admin/employers", icon: Building },
    { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { name: "Worker Unlocks", href: "/admin/worker-unlocks", icon: Key },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await setCurrentUserRole("admin");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 text-slate-300 min-h-screen sticky top-0 shrink-0 border-r border-slate-800">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-white leading-none">
                JOB<span className="text-purple-500">CONNECT</span>
              </span>
              <span className="text-[10px] text-purple-400 font-bold uppercase mt-0.5 tracking-wider">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Nav list */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-sm font-bold"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {item.count && item.count > 0 ? (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">Administrator</span>
              <span className="text-[10px] text-slate-400 truncate">Platform Admin</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-950 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-base">Admin Portal</span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-900"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950 text-slate-300 px-4 py-4 space-y-2 border-b border-slate-800 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive ? "bg-purple-600 text-white" : "hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.count ? (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
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
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full text-slate-100">
        {children}
      </main>
    </div>
  );
};

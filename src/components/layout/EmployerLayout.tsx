"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  CheckSquare,
  Unlock,
  KeyRound,
  CreditCard,
  Bell,
  UserCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
} from "lucide-react";
import { getEmployerProfile, getNotifications, setCurrentUserRole } from "@/services";

export const EmployerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [credits, setCredits] = useState<number>(5);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    getEmployerProfile("emp-1").then((emp) => {
      if (emp) setCredits(emp.unlockCredits);
    });
    getNotifications("employer").then((n) => setUnreadNotifs(n.filter((i) => !i.isRead).length));
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
    { name: "My Jobs", href: "/employer/my-jobs", icon: Briefcase },
    { name: "Post Job", href: "/employer/post-job", icon: PlusCircle },
    { name: "Applications", href: "/employer/applications", icon: Users },
    { name: "Hired Workers", href: "/employer/hired-workers", icon: CheckSquare },
    { name: "Worker Unlock Plans", href: "/employer/worker-unlock-plans", icon: KeyRound },
    { name: "Unlocked Workers", href: "/employer/unlocked-workers", icon: Unlock },
    { name: "Payments", href: "/employer/payments", icon: CreditCard },
    { name: "Notifications", href: "/employer/notifications", icon: Bell, count: unreadNotifs },
    { name: "My Profile", href: "/employer/profile", icon: UserCheck },
    { name: "Settings", href: "/employer/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await setCurrentUserRole("employer");
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
              <span className="text-[10px] text-emerald-400 font-semibold uppercase mt-0.5">
                Employer Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Unlock Credits Banner */}
        <div className="p-3.5 mx-3 mt-3 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 rounded-xl border border-blue-700/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-300 uppercase tracking-wide font-bold">
              Available Credits
            </span>
            <span className="text-lg font-black text-white">{credits} Unlocks</span>
          </div>
          <Link
            href="/employer/worker-unlock-plans"
            className="px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3 h-3" /> Buy More
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

        {/* User profile & Logout */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              AP
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">Apex Electrical</span>
              <span className="text-[10px] text-slate-400 truncate">Employer Account</span>
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
          <span className="font-bold text-white text-base">Employer Portal</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-600 text-white font-bold px-2.5 py-1 rounded-full">
            {credits} Credits
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
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

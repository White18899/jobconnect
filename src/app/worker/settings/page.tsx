"use client";

import React, { useState } from "react";
import { WorkerLayout } from "@/components/layout/WorkerLayout";
import { Settings, Shield, Bell, Lock, CheckCircle2 } from "lucide-react";

export default function WorkerSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Worker Settings</h1>
          <p className="text-xs text-slate-500">Account security, privacy preferences, and notifications.</p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Settings updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" /> Account Security & Password
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" /> Notification Preferences
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-blue-600 w-4 h-4" />
                <span>Receive SMS alerts when an employer shortlists your application</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-blue-600 w-4 h-4" />
                <span>Receive push updates on Priority Payment verification</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-blue-600 w-4 h-4" />
                <span>Notify me when an employer unlocks my contact details</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            Save Settings
          </button>
        </form>
      </div>
    </WorkerLayout>
  );
}

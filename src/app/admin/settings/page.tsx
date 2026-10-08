"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Settings, Shield, Key, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Settings</h1>
          <p className="text-xs text-slate-400">Security configurations, payment verification thresholds, and admin access.</p>
        </div>

        {saved && (
          <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Platform settings saved!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" /> Security Controls
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Admin Passkey</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" /> Payment & Plan Pricing Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div>
                <label className="block text-[11px] font-bold mb-1">1 Worker Unlock Price</label>
                <input type="number" defaultValue={149} className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl" />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1">5 Worker Unlocks Price</label>
                <input type="number" defaultValue={499} className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl" />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1">10 Worker Unlocks Price</label>
                <input type="number" defaultValue={949} className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            Save Admin Settings
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

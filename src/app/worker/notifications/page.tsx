"use client";

import React, { useState, useEffect } from "react";
import { WorkerLayout } from "@/components/layout/WorkerLayout";
import { Bell, CheckCircle2, Zap, Unlock, Briefcase } from "lucide-react";
import { getNotifications, markNotificationAsRead } from "@/services";
import { NotificationItem } from "@/types";

export default function WorkerNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    getNotifications("worker").then((n) => setNotifications(n));
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Notifications & Alerts</h1>
          <p className="text-xs text-slate-500">Updates regarding your applications, priority status, and profile unlocks.</p>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.isRead
                  ? "bg-blue-50/60 border-blue-200 shadow-xs"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>

              {!n.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </WorkerLayout>
  );
}

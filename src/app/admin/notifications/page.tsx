"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Bell } from "lucide-react";
import { getNotifications, markNotificationAsRead } from "@/services";
import { NotificationItem } from "@/types";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    getNotifications("admin").then((n) => setNotifications(n));
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Admin System Notifications</h1>
          <p className="text-xs text-slate-400">System alerts for pending payments, employer registrations, and priority submissions.</p>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.isRead
                  ? "bg-purple-950/60 border-purple-800 shadow-xs"
                  : "bg-slate-950 border-slate-800"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-900/60 text-purple-300 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              </div>

              {!n.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

"use client";

import React, { useState } from "react";
import {
  X,
  Bell,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Clock,
  ShieldCheck,
  Check,
  Trash2,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "appointment" | "reminder" | "system";
  isRead: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Appointment Confirmed",
      message: "Your appointment with Dr. Esita Jabed has been confirmed for today at 05:00 PM.",
      time: "2 hours ago",
      type: "appointment",
      isRead: false,
    },
    {
      id: "notif-2",
      title: "WhatsApp Reminder Active",
      message: "Automated WhatsApp notifications are scheduled 2 hours before your clinic checkup.",
      time: "5 hours ago",
      type: "reminder",
      isRead: false,
    },
    {
      id: "notif-3",
      title: "Account Auto-Registered",
      message: "Your patient health profile has been linked to your verified mobile number.",
      time: "1 day ago",
      type: "system",
      isRead: true,
    },
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xl border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Notifications
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Live alerts for bookings &amp; reminders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        {notifications.length > 0 && (
          <div className="py-2.5 flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={markAllRead}
              className="text-sky-600 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={clearAll}
              className="text-slate-400 hover:text-rose-500 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No new notifications.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  item.isRead
                    ? "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    : "bg-sky-50/40 dark:bg-sky-950/20 border-sky-200/60 dark:border-sky-900/40 text-slate-900 dark:text-slate-100 shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isRead ? "bg-slate-300 dark:bg-slate-600" : "bg-sky-500"
                      }`}
                    />
                    <h4 className="text-xs font-bold leading-tight">{item.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed pl-4 text-slate-600 dark:text-slate-300">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

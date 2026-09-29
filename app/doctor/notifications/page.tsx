"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  RotateCcw,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { DoctorNotificationItem } from "@/lib/types/doctor";

export default function DoctorNotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount,
    activeClinic,
  } = useDoctor();

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredList = notifications.filter((n) => {
    if (filter === "unread" && n.isRead) return false;
    return true;
  });

  const getIcon = (type: DoctorNotificationItem["type"]) => {
    switch (type) {
      case "check_in":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "lab_result":
        return <FlaskConical className="w-5 h-5 text-purple-600" />;
      case "follow_up":
        return <RotateCcw className="w-5 h-5 text-amber-600" />;
      case "reminder":
        return <Clock className="w-5 h-5 text-sky-600" />;
      case "system":
        return <AlertCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Notification Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational alerts, patient check-ins, lab updates, and clinical reminders at {activeClinic.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "all"
              ? "bg-sky-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "unread"
              ? "bg-sky-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Unread Alerts ({unreadNotificationsCount})
        </button>
      </div>

      {/* Notification Items */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No notifications found under this filter.
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-4 md:p-5 rounded-3xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !item.isRead
                  ? "bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/60 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.title}
                    </h3>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-sky-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">{item.timestamp}</span>
                </div>
              </div>

              {item.link && (
                <Link
                  href={item.link}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 flex-shrink-0"
                >
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

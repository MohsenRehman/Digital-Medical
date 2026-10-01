"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";

export function QuickClinicalInsights() {
  const { doctor, activeClinic, appointments, waitingQueue, followUps, consultations } = useDoctor();

  const clinicDate = "2026-09-24";

  // Filter doctor-specific items
  const doctorTodayApts = useMemo(() => {
    return appointments.filter(
      (a) =>
        (!doctor?.id || a.doctorId === doctor.id) &&
        (!activeClinic?.id || a.clinicId === activeClinic.id) &&
        a.scheduledAt === clinicDate
    );
  }, [appointments, doctor, activeClinic]);

  const completedTodayCount = useMemo(() => {
    return doctorTodayApts.filter((a) => a.status === "completed").length;
  }, [doctorTodayApts]);

  const waitingCount = useMemo(() => {
    const fromApts = doctorTodayApts.filter((a) => a.status === "waiting").length;
    return waitingQueue.length > 0 ? waitingQueue.length : fromApts;
  }, [doctorTodayApts, waitingQueue]);

  const followUpsDueCount = useMemo(() => {
    return followUps.filter(
      (f) =>
        (!doctor?.id || f.doctorId === doctor.id) &&
        (!activeClinic?.id || f.clinicId === activeClinic.id) &&
        f.status !== "completed"
    ).length;
  }, [followUps, doctor, activeClinic]);

  const insights = [
    {
      id: "workload",
      label: "Today's Workload",
      count: doctorTodayApts.length,
      text: "appointments scheduled today",
      href: "/doctor/appointments?filter=today",
      ariaLabel: "View today's scheduled appointments",
      icon: CalendarDays,
      iconColor: "text-sky-600 dark:text-sky-400",
      iconBg: "bg-sky-50 dark:bg-sky-950/60",
    },
    {
      id: "completed",
      label: "Completed",
      count: completedTodayCount,
      text: "consultations completed",
      href: "/doctor/consultations?status=completed",
      ariaLabel: "View completed consultations",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
    },
    {
      id: "waiting",
      label: "Waiting",
      count: waitingCount,
      text: "patients currently waiting",
      href: "/doctor/queue",
      ariaLabel: "View current waiting queue",
      icon: Clock,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/60",
    },
    {
      id: "followups",
      label: "Follow-ups",
      count: followUpsDueCount > 0 ? followUpsDueCount : 3,
      text: "follow-ups due this week",
      href: "/doctor/follow-ups?filter=today",
      ariaLabel: "View scheduled patient follow-ups",
      icon: RotateCcw,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/60",
    },
  ];

  return (
    <div className="space-y-2.5">
      {/* Small Section Label */}
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
        <span>QUICK INSIGHTS</span>
      </div>

      {/* 4 Compact Informational Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-3.5">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.ariaLabel}
              className="group p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                  {item.label}
                </span>
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  <span
                    suppressHydrationWarning
                    className="font-bold text-slate-900 dark:text-white font-mono text-sm mr-1"
                  >
                    {item.count}
                  </span>
                  <span>{item.text}</span>
                </div>
              </div>

              <div
                className={`p-2 rounded-lg ${item.iconBg} ${item.iconColor} flex-shrink-0 group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

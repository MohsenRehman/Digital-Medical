"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Play,
  XCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";

export function AppointmentPerformanceCard() {
  const { doctor, activeClinic, appointments, waitingQueue, queue } = useDoctor();

  // Filter appointments specifically for the authenticated doctor and clinic
  const clinicDate = "2026-09-24";
  const doctorTodayApts = useMemo(() => {
    return appointments.filter(
      (a) =>
        (!doctor?.id || a.doctorId === doctor.id) &&
        (!activeClinic?.id || a.clinicId === activeClinic.id) &&
        a.scheduledAt === clinicDate
    );
  }, [appointments, doctor, activeClinic]);

  // Aggregate live statuses
  const counts = useMemo(() => {
    let scheduled = 0;
    let completed = 0;
    let waiting = 0;
    let inConsultation = 0;
    let cancelled = 0;
    let noShow = 0;

    doctorTodayApts.forEach((a) => {
      switch (a.status) {
        case "scheduled":
        case "confirmed":
          scheduled++;
          break;
        case "completed":
          completed++;
          break;
        case "waiting":
          waiting++;
          break;
        case "in_progress":
          inConsultation++;
          break;
        case "cancelled":
          cancelled++;
          break;
        case "no_show":
          noShow++;
          break;
        default:
          scheduled++;
          break;
      }
    });

    // In case queue has live changes that should reflect immediately
    if (waitingQueue.length > waiting && waiting === 0) {
      waiting = waitingQueue.length;
    }
    const liveInProgress = queue.filter((q) => q.status === "in_progress").length;
    if (liveInProgress > inConsultation && inConsultation === 0) {
      inConsultation = liveInProgress;
    }

    return {
      scheduled,
      completed,
      waiting,
      inConsultation,
      cancelled,
      noShow,
      total: doctorTodayApts.length,
    };
  }, [doctorTodayApts, waitingQueue, queue]);

  const total = counts.total;
  const isEmpty = total === 0;

  // Completion rate calculation
  const completionPercent = total > 0 ? Math.round((counts.completed / total) * 100) : 0;

  // Visual status categories adhering directly to Digital Medical status color tokens
  const categories = [
    {
      key: "scheduled",
      label: "Scheduled",
      count: counts.scheduled,
      href: "/doctor/appointments?filter=today&status=scheduled",
      color: "bg-sky-500",
      textColor: "text-sky-700 dark:text-sky-300",
      bgColor: "bg-sky-50 dark:bg-sky-950/40",
      borderColor: "border-sky-200 dark:border-sky-800",
      icon: CalendarDays,
    },
    {
      key: "completed",
      label: "Completed",
      count: counts.completed,
      href: "/doctor/consultations?status=completed",
      color: "bg-emerald-500",
      textColor: "text-emerald-700 dark:text-emerald-300",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      icon: CheckCircle2,
    },
    {
      key: "waiting",
      label: "Waiting",
      count: counts.waiting,
      href: "/doctor/queue",
      color: "bg-amber-500",
      textColor: "text-amber-700 dark:text-amber-300",
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
      borderColor: "border-amber-200 dark:border-amber-800",
      icon: AlertCircle,
    },
    {
      key: "in_progress",
      label: "In Consultation",
      count: counts.inConsultation,
      href: "/doctor/consultations?status=in_progress",
      color: "bg-purple-500",
      textColor: "text-purple-700 dark:text-purple-300",
      bgColor: "bg-purple-50 dark:bg-purple-950/40",
      borderColor: "border-purple-200 dark:border-purple-800",
      icon: Play,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: counts.cancelled,
      href: "/doctor/appointments?filter=today&status=cancelled",
      color: "bg-rose-500",
      textColor: "text-rose-700 dark:text-rose-300",
      bgColor: "bg-rose-50 dark:bg-rose-950/40",
      borderColor: "border-rose-200 dark:border-rose-800",
      icon: XCircle,
    },
    {
      key: "no_show",
      label: "No-show",
      count: counts.noShow,
      href: "/doctor/appointments?filter=today&status=no_show",
      color: "bg-slate-500",
      textColor: "text-slate-700 dark:text-slate-300",
      bgColor: "bg-slate-100 dark:bg-slate-800",
      borderColor: "border-slate-200 dark:border-slate-700",
      icon: Clock,
    },
  ];

  return (
    <div
      aria-label="Appointment Performance Card"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 md:p-6 shadow-xs flex flex-col justify-between h-full transition-all"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                APPOINTMENT PERFORMANCE
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Visual breakdown of today&apos;s appointments by clinical status
            </p>
          </div>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Today
          </span>
        </div>

        {/* Content Area or Empty State */}
        {isEmpty ? (
          <div className="h-60 flex flex-col items-center justify-center text-center p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 my-3">
            <CalendarDays className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No appointments recorded today
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs">
              Appointments scheduled for your clinic will populate this breakdown in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-3">
            {/* Segmented Cumulative Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                {categories.map((c) => {
                  if (c.count === 0) return null;
                  const pct = (c.count / total) * 100;
                  return (
                    <div
                      key={c.key}
                      style={{ width: `${pct}%` }}
                      className={`${c.color} h-full transition-all duration-300`}
                      title={`${c.label}: ${c.count} (${Math.round(pct)}%)`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>0</span>
                <span>{total} Total Bookings</span>
              </div>
            </div>

            {/* Category Rows with Clickable Links */}
            <div className="space-y-1.5 pt-1">
              {categories.map((c) => {
                const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
                return (
                  <Link
                    key={c.key}
                    href={c.href}
                    aria-label={`View ${c.label} appointments (${c.count})`}
                    className="group flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-500"
                  >
                    {/* Left: Indicator & Name */}
                    <div className="flex items-center gap-2 min-w-0 w-36">
                      <span className={`w-2 h-2 rounded-full ${c.color} flex-shrink-0`} />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white truncate">
                        {c.label}
                      </span>
                    </div>

                    {/* Middle: Horizontal Bar */}
                    <div className="flex-1 hidden sm:block">
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full ${c.color} transition-all duration-300`}
                        />
                      </div>
                    </div>

                    {/* Right: Value & Pct */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        suppressHydrationWarning
                        className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100"
                      >
                        {c.count}
                      </span>
                      <span
                        suppressHydrationWarning
                        className="text-[10px] text-slate-400 w-8 text-right font-medium"
                      >
                        {pct}%
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-sky-500 transition-colors transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Compact Summary */}
      <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="grid grid-cols-3 gap-2">
          {/* Completion Rate */}
          <Link
            href="/doctor/consultations?status=completed"
            className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 border border-slate-200/60 dark:border-slate-800 transition-colors group"
          >
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider truncate">
              Completion Rate
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                suppressHydrationWarning
                className="text-sm font-bold text-slate-900 dark:text-white font-mono group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
              >
                {counts.completed} / {total}
              </span>
              <span
                suppressHydrationWarning
                className="text-[10px] text-emerald-600 font-semibold"
              >
                ({completionPercent}%)
              </span>
            </div>
          </Link>

          {/* Waiting */}
          <Link
            href="/doctor/queue"
            className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 border border-slate-200/60 dark:border-slate-800 transition-colors group"
          >
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider truncate">
              Waiting
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                suppressHydrationWarning
                className="text-sm font-bold text-slate-900 dark:text-white font-mono group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
              >
                {counts.waiting}
              </span>
              <span
                suppressHydrationWarning
                className="text-[10px] text-slate-500 font-medium truncate"
              >
                {counts.waiting === 1 ? "patient" : "patients"}
              </span>
            </div>
          </Link>

          {/* No-show */}
          <Link
            href="/doctor/appointments?filter=today&status=no_show"
            className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition-colors group"
          >
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider truncate">
              No-show
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                suppressHydrationWarning
                className="text-sm font-bold text-slate-900 dark:text-white font-mono group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
              >
                {counts.noShow}
              </span>
              <span
                suppressHydrationWarning
                className="text-[10px] text-slate-500 font-medium truncate"
              >
                {counts.noShow === 1 ? "patient" : "patients"}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

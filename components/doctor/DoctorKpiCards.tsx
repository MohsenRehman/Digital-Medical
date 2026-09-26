"use client";

import React from "react";
import {
  CalendarDays,
  Users2,
  CheckCircle2,
  Clock,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";

export default function DoctorKpiCards() {
  const { appointments, waitingQueue, followUps } = useDoctor();

  // Compute live aggregates from context state
  const todayApts = appointments.filter((a) => a.scheduledAt === "2026-09-24");
  const completedCount = todayApts.filter((a) => a.status === "completed").length;
  const waitingCount = waitingQueue.length;
  const upcomingCount = todayApts.filter(
    (a) => a.status === "scheduled" || a.status === "confirmed"
  ).length;
  const followUpsDueCount = followUps.filter(
    (f) => f.status === "pending" && f.followUpDate === "2026-09-24"
  ).length;

  const cards = [
    {
      title: "TODAY'S APPOINTMENTS",
      value: todayApts.length,
      caption: "+3 from yesterday",
      subtext: "Total scheduled today",
      icon: CalendarDays,
      accent: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-950/40",
      border: "border-sky-200 dark:border-sky-900/50",
    },
    {
      title: "WAITING PATIENTS",
      value: waitingCount,
      caption: "Avg wait ~18 min",
      subtext: "Currently in clinic lounge",
      icon: Users2,
      accent: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-900/50",
    },
    {
      title: "COMPLETED",
      value: completedCount,
      caption: "58% daily progress",
      subtext: "Consultations finished",
      icon: CheckCircle2,
      accent: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200 dark:border-emerald-900/50",
    },
    {
      title: "UPCOMING",
      value: upcomingCount,
      caption: "Next slot: 11:00 AM",
      subtext: "Remaining afternoon slots",
      icon: Clock,
      accent: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-200 dark:border-indigo-900/50",
    },
    {
      title: "FOLLOW-UPS DUE",
      value: followUpsDueCount,
      caption: "Requires clinical review",
      subtext: "Post-op & chronic reviews",
      icon: RotateCcw,
      accent: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-900/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${card.border} shadow-xs transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <Icon className={`w-4 h-4 ${card.accent}`} />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </span>
            </div>

            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-1 truncate">
              {card.subtext}
            </p>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
              <span>{card.caption}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

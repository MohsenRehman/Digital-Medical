"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users2,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
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
      href: "/doctor/appointments?filter=today",
      label: "View today's appointments",
      icon: CalendarDays,
      accent: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-950/40",
      border: "border-sky-200 dark:border-sky-900/50",
      hoverBorder: "hover:border-sky-300 dark:hover:border-sky-700",
    },
    {
      title: "WAITING PATIENTS",
      value: waitingCount,
      caption: "Avg wait ~18 min",
      subtext: "Currently in clinic lounge",
      href: "/doctor/queue",
      label: "View waiting patients",
      icon: Users2,
      accent: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-900/50",
      hoverBorder: "hover:border-amber-300 dark:hover:border-amber-700",
    },
    {
      title: "COMPLETED",
      value: completedCount,
      caption: "58% daily progress",
      subtext: "Consultations finished",
      href: "/doctor/consultations?status=completed",
      label: "View completed consultations",
      icon: CheckCircle2,
      accent: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200 dark:border-emerald-900/50",
      hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
    },
    {
      title: "UPCOMING",
      value: upcomingCount,
      caption: "Next slot: 11:00 AM",
      subtext: "Remaining afternoon slots",
      href: "/doctor/appointments?filter=upcoming",
      label: "View upcoming appointments",
      icon: Clock,
      accent: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-200 dark:border-indigo-900/50",
      hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700",
    },
    {
      title: "FOLLOW-UPS DUE",
      value: followUpsDueCount,
      caption: "Requires clinical review",
      subtext: "Post-op & chronic reviews",
      href: "/doctor/follow-ups",
      label: "View follow-ups due",
      icon: RotateCcw,
      accent: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-900/50",
      hoverBorder: "hover:border-rose-300 dark:hover:border-rose-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.title}
            href={card.href}
            aria-label={card.label}
            className={`group relative block p-4 rounded-2xl bg-white dark:bg-slate-900 border ${card.border} ${card.hoverBorder} shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase truncate pr-1">
                {card.title}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
                <div className={`p-2 rounded-xl ${card.bg} group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-4 h-4 ${card.accent}`} />
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {card.value}
              </span>
            </div>

            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-1 truncate">
              {card.subtext}
            </p>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="truncate">{card.caption}</span>
              <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-center gap-0.5 flex-shrink-0 pl-1">
                <span>View</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}


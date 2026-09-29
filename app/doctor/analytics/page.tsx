"use client";

import React from "react";
import {
  BarChart3,
  CalendarDays,
  Clock,
  CheckCircle2,
  Users2,
  RotateCcw,
  TrendingUp,
  UserX,
  Activity,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";

export default function DoctorAnalyticsPage() {
  const { analytics, activeClinic, doctor } = useDoctor();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Operational Clinical Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Doctor practice performance, patient wait times, and consultation metrics for {activeClinic.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            Tenant: {activeClinic.tenantId} • Doctor Scope
          </span>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Avg Patient Wait
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {analytics.avgWaitMinutes}
            </span>
            <span className="text-xs text-slate-500 font-medium">Minutes</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium pt-1">
            ✓ 4 min faster than hospital target
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Avg Consultation Time
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {analytics.avgConsultationMinutes}
            </span>
            <span className="text-xs text-slate-500 font-medium">Minutes</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">Target range: 12-15 mins</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Follow-up Compliance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-sky-600 font-mono">
              {analytics.followUpRatePercent}%
            </span>
          </div>
          <p className="text-[11px] text-sky-600 font-medium pt-1">High chronic adherence</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Appointment Utilization
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-600 font-mono">
              {analytics.appointmentUtilizationPercent}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">Booked slot efficiency</p>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Appointments & Completed Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Appointments by Day (Current Week)
              </h2>
              <p className="text-xs text-slate-500">Scheduled vs Completed Consultations</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-sky-600 font-bold">
                <span className="w-2.5 h-2.5 rounded bg-sky-500" /> Scheduled
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Completed
              </span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
            {analytics.weeklyTrend.map((item) => {
              const maxVal = 30;
              const scheduledHeight = Math.round((item.count / maxVal) * 100);
              const completedHeight = Math.round((item.completed / maxVal) * 100);

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-48">
                    {/* Scheduled bar */}
                    <div
                      style={{ height: `${scheduledHeight}%` }}
                      className="w-1/2 max-w-[20px] bg-sky-400 dark:bg-sky-600 rounded-t-lg transition-all hover:opacity-80"
                      title={`${item.count} scheduled`}
                    />
                    {/* Completed bar */}
                    <div
                      style={{ height: `${completedHeight}%` }}
                      className="w-1/2 max-w-[20px] bg-emerald-500 rounded-t-lg transition-all hover:opacity-80"
                      title={`${item.completed} completed`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate text-center">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Today&apos;s Appointment Breakdown
          </h2>
          <p className="text-xs text-slate-500">Distribution across operational states</p>

          <div className="space-y-3 pt-2">
            {analytics.statusDistribution.map((st) => {
              const total = analytics.todayAppointments || 24;
              const pct = Math.round((st.count / total) * 100);

              return (
                <div key={st.status} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{st.label}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {st.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${pct}%`, backgroundColor: st.color }}
                      className="h-full rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 mt-4">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
              Practice Quality Note
            </span>
            Low no-show rate (4%) achieved through automated WhatsApp appointment reminders.
          </div>
        </div>
      </div>

      {/* Hourly Peaks Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Peak Appointment Hours (Today)
        </h2>
        <p className="text-xs text-slate-500">Patient arrival frequency per consultation hour</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
          {analytics.hourlyPeaks.map((h) => (
            <div
              key={h.hour}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center"
            >
              <span className="text-[10px] font-mono font-bold text-slate-400 block">{h.hour}</span>
              <span className="text-xl font-black text-sky-600 dark:text-sky-400 block mt-1">
                {h.count}
              </span>
              <span className="text-[10px] text-slate-500">Patients</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

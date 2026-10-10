"use client";

import React from "react";
import {
  Clock,
  Calendar,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { AppointmentRecord } from "@/lib/types/patient";

interface FollowUpsSectionProps {
  appointments: AppointmentRecord[];
  onOpenBooking: () => void;
}

export default function FollowUpsSection({ appointments, onOpenBooking }: FollowUpsSectionProps) {
  // If there are upcoming appointments, showcase the next follow-up milestone
  const nextVisit = appointments.find((a) => a.status === "confirmed");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 gap-3.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[11px] font-semibold mb-1">
            <Clock className="w-3 h-3 text-sky-600 dark:text-sky-400" />
            <span>Preventive Care &amp; Reviews</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Follow-Up Schedule
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Routine checkups, postoperative assessments, and physician follow-up timelines.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Follow-Up</span>
        </button>
      </div>

      {nextVisit ? (
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Upcoming Recommended Milestone
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Scheduled
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Review with {nextVisit.doctorName}
              </h4>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                {nextVisit.doctorSpecialty}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{nextVisit.clinicName}</span>
                <span>•</span>
                <span>Patient: {nextVisit.patientName}</span>
              </div>
            </div>

            <div className="sm:text-right bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>{nextVisit.date}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{nextVisit.timeSlot}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No pending follow-ups
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your healthcare routine is current. When an attending physician advises a postoperative or chronic disease review, milestone reminders will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

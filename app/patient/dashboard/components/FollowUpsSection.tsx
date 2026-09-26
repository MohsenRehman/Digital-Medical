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
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Preventive Care &amp; Reviews</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Follow-Up Schedule
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Routine checkups, postoperative assessments, and physician follow-up timelines.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Follow-Up</span>
        </button>
      </div>

      {nextVisit ? (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Upcoming Recommended Milestone
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Scheduled
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Review with {nextVisit.doctorName}
              </h4>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                {nextVisit.doctorSpecialty}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{nextVisit.clinicName}</span>
                <span>•</span>
                <span>Patient: {nextVisit.patientName}</span>
              </div>
            </div>

            <div className="sm:text-right bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Calendar className="w-3.5 h-3.5 text-teal-500" />
                <span>{nextVisit.date}</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{nextVisit.timeSlot}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
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

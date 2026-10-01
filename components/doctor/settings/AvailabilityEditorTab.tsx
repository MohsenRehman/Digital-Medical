"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  Building2,
  Save,
  CheckCircle2,
  ExternalLink,
  Copy,
  Coffee,
  Check,
} from "lucide-react";
import { DoctorAvailabilityConfig, ConsultationType } from "@/lib/types/doctor";
import { LoadingSpinner } from "@/components/doctor/loading/LoadingSpinner";
import { useDoctorToast } from "@/components/doctor/loading/DoctorToast";

interface AvailabilityEditorTabProps {
  availability: DoctorAvailabilityConfig;
  activeClinicName: string;
  onUpdateAvailability: (config: DoctorAvailabilityConfig) => void;
}

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export default function AvailabilityEditorTab({
  availability,
  activeClinicName,
  onUpdateAvailability,
}: AvailabilityEditorTabProps) {
  const { showToast } = useDoctorToast();
  const [workingDays, setWorkingDays] = useState<DoctorAvailabilityConfig["workingDays"]>(
    availability.workingDays
  );
  const [startTime, setStartTime] = useState(availability.startTime);
  const [endTime, setEndTime] = useState(availability.endTime);
  const [breakStart, setBreakStart] = useState(availability.breakStartTime);
  const [breakEnd, setBreakEnd] = useState(availability.breakEndTime);
  const [slotDuration, setSlotDuration] = useState(availability.slotDurationMinutes);
  const [bufferMinutes, setBufferMinutes] = useState(availability.bufferMinutes);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleDay = (day: (typeof ALL_DAYS)[number]) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const setAllWeekdays = () => {
    setWorkingDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      onUpdateAvailability({
        ...availability,
        workingDays,
        startTime,
        endTime,
        breakStartTime: breakStart,
        breakEndTime: breakEnd,
        slotDurationMinutes: slotDuration,
        bufferMinutes,
      });
      setSaving(false);
      setSavedSuccess(true);
      showToast("Clinical practice hours saved successfully", "success");
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  };

  return (
    <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Clinical Weekly Practice Hours
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {activeClinicName}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure recurring clinical days, consultation shift timings, and midday clinical break intervals.
          </p>
        </div>

        <Link
          href="/doctor/availability"
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Full Availability Manager →</span>
        </Link>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Clinical availability hours synchronized across patient booking system.</span>
        </div>
      )}

      {/* Days Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
            Active Working Days (Select all applicable)
          </label>
          <button
            type="button"
            onClick={setAllWeekdays}
            className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            <span>Set Standard Mon–Fri</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {ALL_DAYS.map((day) => {
            const isWorking = workingDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isWorking
                    ? "bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                }`}
              >
                <span className="text-xs font-bold block text-slate-900 dark:text-white">
                  {day.slice(0, 3)}
                </span>
                <span
                  className={`text-[10px] font-semibold mt-1 inline-block ${
                    isWorking ? "text-sky-700 dark:text-sky-300" : "text-slate-400"
                  }`}
                >
                  {isWorking ? "ON" : "OFF"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hours Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Clinical Shift Start
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Clinical Shift End
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Midday Break Start
          </label>
          <div className="relative">
            <Coffee className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="time"
              value={breakStart}
              onChange={(e) => setBreakStart(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Midday Break End
          </label>
          <div className="relative">
            <Coffee className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="time"
              value={breakEnd}
              onChange={(e) => setBreakEnd(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          {saving ? (
            <>
              <LoadingSpinner size="xs" color="text-white" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Availability Hours</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

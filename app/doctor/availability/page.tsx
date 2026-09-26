"use client";

import React, { useState } from "react";
import {
  Clock,
  Calendar,
  Building2,
  Video,
  Save,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { ConsultationType, DoctorAvailabilityConfig } from "@/lib/types/doctor";

export default function DoctorAvailabilityPage() {
  const { availability, updateAvailability, doctor, activeClinic } = useDoctor();

  const [workingDays, setWorkingDays] = useState<DoctorAvailabilityConfig["workingDays"]>(
    availability.workingDays
  );
  const [startTime, setStartTime] = useState(availability.startTime);
  const [endTime, setEndTime] = useState(availability.endTime);
  const [slotDuration, setSlotDuration] = useState<DoctorAvailabilityConfig["slotDurationMinutes"]>(
    availability.slotDurationMinutes
  );
  const [bufferMinutes, setBufferMinutes] = useState(availability.bufferMinutes);
  const [breakStart, setBreakStart] = useState(availability.breakStartTime);
  const [breakEnd, setBreakEnd] = useState(availability.breakEndTime);
  const [modes, setModes] = useState<ConsultationType[]>(availability.consultationModes);
  const [room, setRoom] = useState(availability.roomNumber);
  const [maxPatients, setMaxPatients] = useState(availability.maxPatientsPerDay);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ] as const;

  const toggleDay = (day: (typeof daysOfWeek)[number]) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const toggleMode = (mode: ConsultationType) => {
    if (modes.includes(mode)) {
      if (modes.length > 1) {
        setModes(modes.filter((m) => m !== mode));
      }
    } else {
      setModes([...modes, mode]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAvailability({
      ...availability,
      workingDays,
      startTime,
      endTime,
      slotDurationMinutes: slotDuration,
      bufferMinutes,
      breakStartTime: breakStart,
      breakEndTime: breakEnd,
      consultationModes: modes,
      roomNumber: room,
      maxPatientsPerDay: maxPatients,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Availability & Practice Schedule
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure working hours, appointment slot durations, and clinic room assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            Active: {activeClinic.name} ({activeClinic.city})
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Practice schedule updated successfully. Bookable patient slots generated.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Working Days */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                1. Weekly Working Days
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Select days available for clinic consultations</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {daysOfWeek.map((day) => {
              const active = workingDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    active
                      ? "bg-sky-600 text-white font-bold border-sky-600 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                  }`}
                >
                  <span className="text-xs">{day}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Working Hours & Break Time */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Shift Timings & Intermission
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Daily Clinic Operating Hours
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Shift Start</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Shift End</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-mono font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Lunch & Prayer Break
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Break Start</label>
                  <input
                    type="time"
                    value={breakStart}
                    onChange={(e) => setBreakStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Break End</label>
                  <input
                    type="time"
                    value={breakEnd}
                    onChange={(e) => setBreakEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-mono font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slot Duration, Buffer & Mode Configuration */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Slot Duration & Consultation Modes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Slot Duration */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                Appointment Duration
              </label>
              <div className="grid grid-cols-5 gap-1">
                {[15, 20, 30, 45, 60].map((dur) => (
                  <button
                    type="button"
                    key={dur}
                    onClick={() => setSlotDuration(dur as typeof slotDuration)}
                    className={`py-2 rounded-xl border text-center font-bold transition-all ${
                      slotDuration === dur
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {dur}m
                  </button>
                ))}
              </div>
            </div>

            {/* Buffer time */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                Buffer Between Patients (Minutes)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={bufferMinutes}
                onChange={(e) => setBufferMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
              />
            </div>

            {/* Max Patients */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                Max Daily Cap
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={maxPatients}
                onChange={(e) => setMaxPatients(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
              />
            </div>
          </div>

          {/* Consultation Modes & Room */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                Authorized Modes
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleMode("in_clinic")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-semibold ${
                    modes.includes("in_clinic")
                      ? "bg-sky-50 dark:bg-sky-950 border-sky-300 text-sky-700 dark:text-sky-300"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-500"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>In-Clinic OPD</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleMode("video")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-semibold ${
                    modes.includes("video")
                      ? "bg-indigo-50 dark:bg-indigo-950 border-indigo-300 text-indigo-700 dark:text-indigo-300"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-500"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Video Telehealth</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                Assigned Clinic Suite / Room
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Consultation Suite 304"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Availability Schedule</span>
          </button>
        </div>
      </form>
    </div>
  );
}

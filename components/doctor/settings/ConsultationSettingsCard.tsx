"use client";

import React, { useState } from "react";
import {
  Building2,
  Video,
  Clock,
  DollarSign,
  UserCheck,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { DoctorProfile, DoctorConsultationSettings } from "@/lib/types/doctor";

interface ConsultationSettingsCardProps {
  doctor: DoctorProfile;
  onSave: (updates: Partial<DoctorProfile>) => void;
}

export default function ConsultationSettingsCard({
  doctor,
  onSave,
}: ConsultationSettingsCardProps) {
  const currentSettings = doctor.consultationSettings || {
    inClinicEnabled: true,
    videoEnabled: true,
    slotDurationMinutes: 20,
    bufferMinutes: 5,
    allowNewPatients: true,
    allowFollowUpBooking: true,
    bookingNotice: "Same day",
    cancellationWindowHours: 2,
  };

  const [inClinicEnabled, setInClinicEnabled] = useState(currentSettings.inClinicEnabled);
  const [inClinicFee, setInClinicFee] = useState(doctor.consultationFee || 2500);
  const [videoEnabled, setVideoEnabled] = useState(currentSettings.videoEnabled);
  const [videoFee, setVideoFee] = useState(doctor.videoConsultationFee || 2000);

  const [slotDuration, setSlotDuration] = useState<DoctorConsultationSettings["slotDurationMinutes"]>(
    currentSettings.slotDurationMinutes
  );
  const [bufferTime, setBufferTime] = useState<DoctorConsultationSettings["bufferMinutes"]>(
    currentSettings.bufferMinutes
  );
  const [allowNewPatients, setAllowNewPatients] = useState(currentSettings.allowNewPatients);
  const [allowFollowUps, setAllowFollowUps] = useState(currentSettings.allowFollowUpBooking);
  const [bookingNotice, setBookingNotice] = useState<DoctorConsultationSettings["bookingNotice"]>(
    currentSettings.bookingNotice
  );
  const [cancellationWindow, setCancellationWindow] = useState(
    currentSettings.cancellationWindowHours
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (inClinicFee < 0 || videoFee < 0) {
      setErrorMsg("Consultation fees cannot be negative.");
      return;
    }

    if (!inClinicEnabled && !videoEnabled) {
      setErrorMsg("At least one consultation modality (In-Clinic or Video) must be enabled.");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      onSave({
        consultationFee: inClinicFee,
        videoConsultationFee: videoFee,
        consultationSettings: {
          inClinicEnabled,
          videoEnabled,
          slotDurationMinutes: slotDuration,
          bufferMinutes: bufferTime,
          allowNewPatients,
          allowFollowUpBooking: allowFollowUps,
          bookingNotice,
          cancellationWindowHours: cancellationWindow,
        },
      });
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Consultation Modes & Booking Parameters
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure consultation fees, slot lengths, booking advance notice, and cancellation limits.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          PUBLIC DIRECTORY CONFIG
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Consultation and booking parameters updated successfully.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Modality & Fees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* In-Clinic OPD */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">In-Clinic OPD Visits</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inClinicEnabled}
                onChange={(e) => setInClinicEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600" />
            </label>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              In-Clinic Consultation Fee (PKR)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="100"
                disabled={!inClinicEnabled}
                value={inClinicFee}
                onChange={(e) => setInClinicFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white text-xs disabled:opacity-50"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                PKR
              </span>
            </div>
          </div>
        </div>

        {/* Video Telehealth */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Telehealth Video Calls</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={videoEnabled}
                onChange={(e) => setVideoEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Video Telehealth Fee (PKR)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="100"
                disabled={!videoEnabled}
                value={videoFee}
                onChange={(e) => setVideoFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white text-xs disabled:opacity-50"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                PKR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Timing Rules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Slot Duration
          </label>
          <select
            value={slotDuration}
            onChange={(e) => setSlotDuration(Number(e.target.value) as any)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
          >
            <option value={15}>15 Minutes (Brief Check)</option>
            <option value={20}>20 Minutes (Standard)</option>
            <option value={30}>30 Minutes (Detailed)</option>
            <option value={45}>45 Minutes (Extended)</option>
            <option value={60}>60 Minutes (Comprehensive)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Buffer Between Patients
          </label>
          <select
            value={bufferTime}
            onChange={(e) => setBufferTime(Number(e.target.value) as any)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
          >
            <option value={5}>5 Minutes Buffer</option>
            <option value={10}>10 Minutes Buffer</option>
            <option value={15}>15 Minutes Buffer</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Advance Notice Required
          </label>
          <select
            value={bookingNotice}
            onChange={(e) => setBookingNotice(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
          >
            <option value="Same day">Same Day (Instant Booking)</option>
            <option value="1 day">At least 1 day in advance</option>
            <option value="2 days">At least 2 days in advance</option>
            <option value="3 days">At least 3 days in advance</option>
            <option value="7 days">At least 7 days in advance</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Cancellation Window
          </label>
          <select
            value={cancellationWindow}
            onChange={(e) => setCancellationWindow(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
          >
            <option value={2}>Up to 2 hours before slot</option>
            <option value={4}>Up to 4 hours before slot</option>
            <option value={12}>Up to 12 hours before slot</option>
            <option value={24}>Up to 24 hours before slot</option>
          </select>
        </div>
      </div>

      {/* Patient Intake Policies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
        <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Accept New Patient Bookings</p>
            <p className="text-[11px] text-slate-500">Allow first-time consultations through directory</p>
          </div>
          <button
            type="button"
            onClick={() => setAllowNewPatients(!allowNewPatients)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              allowNewPatients ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
            }`}
          >
            {allowNewPatients ? "Yes (Open)" : "No (Closed)"}
          </button>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Follow-up Self Booking</p>
            <p className="text-[11px] text-slate-500">Allow existing patients to book titration reviews</p>
          </div>
          <button
            type="button"
            onClick={() => setAllowFollowUps(!allowFollowUps)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              allowFollowUps ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
            }`}
          >
            {allowFollowUps ? "Yes (Permitted)" : "No (Staff Only)"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "Saving Changes..." : "Save Consultation Rules"}</span>
        </button>
      </div>
    </form>
  );
}

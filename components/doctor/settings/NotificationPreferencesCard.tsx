"use client";

import React, { useState } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  CheckCircle2,
  Lock,
  Calendar,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { DoctorProfile, DoctorNotificationPreferences } from "@/lib/types/doctor";

interface NotificationPreferencesCardProps {
  doctor: DoctorProfile;
  onSave: (updates: Partial<DoctorProfile>) => void;
}

export default function NotificationPreferencesCard({
  doctor,
  onSave,
}: NotificationPreferencesCardProps) {
  const currentPrefs: DoctorNotificationPreferences = doctor.notificationPreferences || {
    newAppointment: true,
    appointmentCancellation: true,
    appointmentReminder: true,
    patientCheckIn: true,
    labResultAvailable: true,
    followUpDue: true,
    systemAnnouncements: true,
    securityAlerts: true,
    channels: {
      email: true,
      sms: true,
      whatsapp: true,
      push: true,
    },
  };

  const [newAppointment, setNewAppointment] = useState(currentPrefs.newAppointment);
  const [cancellation, setCancellation] = useState(currentPrefs.appointmentCancellation);
  const [reminder, setReminder] = useState(currentPrefs.appointmentReminder);
  const [checkIn, setCheckIn] = useState(currentPrefs.patientCheckIn);
  const [labResult, setLabResult] = useState(currentPrefs.labResultAvailable);
  const [followUp, setFollowUp] = useState(currentPrefs.followUpDue);
  const [systemAlerts, setSystemAlerts] = useState(currentPrefs.systemAnnouncements);

  const [channelEmail, setChannelEmail] = useState(currentPrefs.channels.email);
  const [channelSms, setChannelSms] = useState(currentPrefs.channels.sms);
  const [channelWhatsapp, setChannelWhatsapp] = useState(currentPrefs.channels.whatsapp);
  const [channelPush, setChannelPush] = useState(currentPrefs.channels.push);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      onSave({
        notificationPreferences: {
          newAppointment,
          appointmentCancellation: cancellation,
          appointmentReminder: reminder,
          patientCheckIn: checkIn,
          labResultAvailable: labResult,
          followUpDue: followUp,
          systemAnnouncements: systemAlerts,
          securityAlerts: true, // Always mandatory
          channels: {
            email: channelEmail,
            sms: channelSms,
            whatsapp: channelWhatsapp,
            push: channelPush,
          },
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
            Clinical Notification & Alert Channels
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control automated notifications for incoming patient bookings, lab results, and instant mobile alerts.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          ACCOUNT PREFERENCES
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Notification preferences updated successfully across all channels.</span>
        </div>
      )}

      {/* Delivery Channels */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
          1. Active Notification Channels
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <label className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-600" />
              <span className="font-semibold text-slate-900 dark:text-white">Email</span>
            </div>
            <input
              type="checkbox"
              checked={channelEmail}
              onChange={(e) => setChannelEmail(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded"
            />
          </label>

          <label className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-900 dark:text-white">SMS</span>
            </div>
            <input
              type="checkbox"
              checked={channelSms}
              onChange={(e) => setChannelSms(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded"
            />
          </label>

          <label className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-slate-900 dark:text-white">WhatsApp</span>
            </div>
            <input
              type="checkbox"
              checked={channelWhatsapp}
              onChange={(e) => setChannelWhatsapp(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded"
            />
          </label>

          <label className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-900 dark:text-white">Push Alert</span>
            </div>
            <input
              type="checkbox"
              checked={channelPush}
              onChange={(e) => setChannelPush(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* Appointment Notifications */}
      <div className="space-y-3 pt-2">
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
          2. Clinical Appointment Alerts
        </label>
        <div className="space-y-2">
          {[
            {
              title: "New Patient Appointment Booked",
              desc: "Receive an immediate ping when a patient confirms a slot online or via reception desk.",
              checked: newAppointment,
              setter: setNewAppointment,
            },
            {
              title: "Appointment Cancellation or Reschedule",
              desc: "Get informed instantly if a patient cancels or changes their consultation time.",
              checked: cancellation,
              setter: setCancellation,
            },
            {
              title: "Morning Schedule Digest & Reminder",
              desc: "Daily morning briefing sent at 07:30 AM with your patient count and waiting queue overview.",
              checked: reminder,
              setter: setReminder,
            },
            {
              title: "Patient Check-in at Reception Desk",
              desc: "Audio and push chime in consultation room when a patient checks in and receives an OPD token.",
              checked: checkIn,
              setter: setCheckIn,
            },
          ].map((item, i) => (
            <label
              key={i}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-850 flex items-start justify-between gap-3 text-xs cursor-pointer hover:border-slate-300"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.setter(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded mt-0.5"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Diagnostic & Platform Alerts */}
      <div className="space-y-3 pt-2">
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
          3. Diagnostic Results & System Notices
        </label>
        <div className="space-y-2">
          <label className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-850 flex items-start justify-between gap-3 text-xs cursor-pointer hover:border-slate-300">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Diagnostic Laboratory Results Ready</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Notification when pathology or radiology labs finalize test results ordered under your name.
              </p>
            </div>
            <input
              type="checkbox"
              checked={labResult}
              onChange={(e) => setLabResult(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded mt-0.5"
            />
          </label>

          <label className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-850 flex items-start justify-between gap-3 text-xs cursor-pointer hover:border-slate-300">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Chronic Follow-ups Due for Review</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Alerts when patients with hypertension or post-intervention checks reach their follow-up target date.
              </p>
            </div>
            <input
              type="checkbox"
              checked={followUp}
              onChange={(e) => setFollowUp(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded mt-0.5"
            />
          </label>

          {/* Mandatory Security Alerts */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/40 flex items-start justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                <span>Security & Authorization Alerts (Mandatory)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Immediate notification for new device logins, password resets, and PMDC verification status changes.
              </p>
            </div>
            <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
              Required
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "Saving Changes..." : "Save Notification Preferences"}</span>
        </button>
      </div>
    </form>
  );
}

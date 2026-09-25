"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Stethoscope,
  Phone,
  MessageSquare,
  Printer,
  Download,
  Share2,
  User,
  CreditCard,
} from "lucide-react";
import { AppointmentRecord } from "@/lib/types/patient";

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentRecord | null;
  onToggleWhatsApp?: (id: string) => void;
}

export default function AppointmentDetailModal({
  isOpen,
  onClose,
  appointment,
  onToggleWhatsApp,
}: AppointmentDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(appointment.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeInUp">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1424] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Appointment Pass
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Ref: {appointment.bookingRef}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Strip */}
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
              {appointment.status === "confirmed" ? "Confirmed & Scheduled" : appointment.status}
            </span>
          </div>
          <button
            onClick={handleCopyRef}
            className="text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:underline cursor-pointer"
          >
            {copied ? "Copied!" : "Copy Token"}
          </button>
        </div>

        {/* Doctor Card Details */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 relative flex-shrink-0">
              {appointment.doctorImage ? (
                <Image
                  src={appointment.doctorImage}
                  alt={appointment.doctorName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Stethoscope className="w-6 h-6" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {appointment.doctorName}
              </h4>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                {appointment.doctorSpecialty}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{appointment.clinicName}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>{appointment.clinicLocation}</span>
          </div>
        </div>

        {/* Timing & Patient Profile Specs */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Date &amp; Time
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <Calendar className="w-3.5 h-3.5 text-teal-500" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>{appointment.timeSlot}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Patient Profile
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white truncate">
              <User className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
              <span className="truncate">{appointment.patientName}</span>
            </div>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Relation: {appointment.bookedByRelation}
            </span>
          </div>
        </div>

        {/* Fee & Payment Notice */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                PKR {appointment.consultationFee.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Payment Method: Pay at Clinic reception
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Pay at Desk
          </span>
        </div>

        {/* WhatsApp Reminder Toggle */}
        {onToggleWhatsApp && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                WhatsApp 2hr Reminder
              </span>
            </div>
            <button
              onClick={() => onToggleWhatsApp(appointment.id)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                appointment.remindViaWhatsApp
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              {appointment.remindViaWhatsApp ? "Enabled" : "Disabled"}
            </button>
          </div>
        )}

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

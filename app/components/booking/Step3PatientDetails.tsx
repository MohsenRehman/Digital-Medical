"use client";

import React, { useState } from "react";
import { AppointmentRelation, GenderType, BookingDraft } from "@/lib/types/patient";
import { Doctor } from "@/app/components/TopRatedDoctors";
import {
  User,
  Users,
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface Step3PatientDetailsProps {
  doctor: Doctor;
  date: string;
  timeSlot: string;
  verifiedPhone: string;
  defaultPatientName?: string;
  onConfirm: (draft: BookingDraft) => void;
  onBack: () => void;
}

const RELATION_OPTIONS: { id: AppointmentRelation; label: string }[] = [
  { id: "father", label: "Father" },
  { id: "mother", label: "Mother" },
  { id: "son", label: "Son" },
  { id: "daughter", label: "Daughter" },
  { id: "spouse", label: "Spouse" },
  { id: "other", label: "Other / Relative" },
];

export default function Step3PatientDetails({
  doctor,
  date,
  timeSlot,
  verifiedPhone,
  defaultPatientName = "",
  onConfirm,
  onBack,
}: Step3PatientDetailsProps) {
  const [appointmentFor, setAppointmentFor] = useState<"self" | "other">("self");
  const [selectedRelation, setSelectedRelation] = useState<AppointmentRelation>("father");
  const [patientName, setPatientName] = useState(defaultPatientName || (appointmentFor === "self" ? "Muhammad Ali" : ""));
  const [patientAge, setPatientAge] = useState<number | undefined>(32);
  const [patientGender, setPatientGender] = useState<GenderType>("male");
  const [healthConcern, setHealthConcern] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [entitlementError, setEntitlementError] = useState<{
    code: string;
    title: string;
    subMessage: string;
    upgradeRequired: boolean;
  } | null>(null);

  const handleForChange = (type: "self" | "other") => {
    setAppointmentFor(type);
    if (type === "self") {
      setPatientName(defaultPatientName || "Muhammad Ali");
    } else {
      setPatientName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError("Please enter the patient's full name.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setEntitlementError(null);

    const numericFee = typeof doctor.fee === "number"
      ? doctor.fee
      : parseInt(String(doctor.fee || "2000").replace(/[^0-9]/g, ""), 10) || 2000;

    // Doctor identity resolution for entitlement check
    const targetDoctorId =
      doctor.id === "doc-3" || doctor.name.toLowerCase().includes("tariq")
        ? "doc-tariq-01"
        : doctor.id;

    try {
      // BACKEND SOURCE OF TRUTH: Call protected public appointment booking API
      const response = await fetch(`/api/public/doctors/${encodeURIComponent(targetDoctorId)}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: patientName.trim(),
          phone: verifiedPhone,
          date,
          timeSlot,
          fee: numericFee,
          source: "public_online",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setIsSubmitting(false);

        if (data.code === "BOOKING_LIMIT_REACHED") {
          setEntitlementError({
            code: "BOOKING_LIMIT_REACHED",
            title: "Your monthly online booking limit has been reached.",
            subMessage: "50 of 50 online bookings used. Upgrade to Pro to receive unlimited online bookings.",
            upgradeRequired: true,
          });
          return;
        }

        if (data.code === "SUBSCRIPTION_CANCELLED") {
          setEntitlementError({
            code: "SUBSCRIPTION_CANCELLED",
            title: "Doctor subscription is currently cancelled.",
            subMessage: "Online bookings are currently unavailable for this clinic.",
            upgradeRequired: true,
          });
          return;
        }

        if (data.code === "SUBSCRIPTION_EXPIRED") {
          setEntitlementError({
            code: "SUBSCRIPTION_EXPIRED",
            title: "Doctor subscription has expired.",
            subMessage: "Patients cannot book new online appointments until the doctor renews their plan.",
            upgradeRequired: true,
          });
          return;
        }

        setError(data.message || "Failed to schedule appointment. Please try again.");
        return;
      }

      // Entitlement approved and slot consumed!
      const draft: BookingDraft = {
        doctorId: targetDoctorId,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorImage: doctor.image,
        clinicName: doctor.location || "Digital Medical Specialist Clinic",
        clinicLocation: "450 Lexington Ave, New York / Lahore Health Hub",
        consultationFee: numericFee,
        date,
        timeSlot,
        phone: verifiedPhone,
        relation: appointmentFor === "self" ? "self" : selectedRelation,
        patientName: patientName.trim(),
        patientAge: patientAge ? Number(patientAge) : undefined,
        patientGender,
        notes: healthConcern.trim() || undefined,
      };

      onConfirm(draft);
    } catch (err) {
      console.error("Booking API error:", err);
      setError("Network connection issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Verified Phone Badge */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Verified Phone: <strong className="font-mono">{verifiedPhone}</strong></span>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          Account Verified
        </span>
      </div>

      {/* Appointment For Toggle (Diagram: "For Self" vs "Someone else") */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
          Who Is This Appointment For?
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => handleForChange("self")}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              appointmentFor === "self"
                ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>For Self</span>
          </button>
          <button
            type="button"
            onClick={() => handleForChange("other")}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              appointmentFor === "other"
                ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Someone Else</span>
          </button>
        </div>
      </div>

      {/* If "Someone else" selected: Relationship Chips (Father, Mother, Son, Daughter...) */}
      {appointmentFor === "other" && (
        <div className="space-y-2 animate-fadeIn">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Relationship:
          </label>
          <div className="flex flex-wrap gap-2">
            {RELATION_OPTIONS.map((rel) => {
              const isSelected = selectedRelation === rel.id;
              return (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => setSelectedRelation(rel.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "border-sky-500 bg-sky-600 text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-sky-300"
                  }`}
                >
                  {rel.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Patient Name & Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Patient Full Name *
          </label>
          <input
            type="text"
            required
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder={appointmentFor === "self" ? "Enter your full name" : `Enter ${selectedRelation}'s full name`}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
          />
        </div>

        {/* Age & Gender Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Age (Years)
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={patientAge || ""}
              onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g. 45"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Gender
            </label>
            <select
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value as GenderType)}
              className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Symptoms / Health Concern (Optional)
          </label>
          <textarea
            rows={2}
            value={healthConcern}
            onChange={(e) => setHealthConcern(e.target.value)}
            placeholder="Brief reason for appointment (e.g. Chest tightness, Fever, Routine checkup...)"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm resize-none"
          />
        </div>
      </div>

      {error && <p className="text-xs text-rose-500 font-semibold text-center">{error}</p>}

      {/* Subscription Entitlement Limit Error Banner */}
      {entitlementError && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-3 animate-fadeIn shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-xl bg-amber-200 dark:bg-amber-800/80 text-amber-900 dark:text-amber-100 flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-300" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-bold text-sm text-amber-950 dark:text-amber-100">
                {entitlementError.title}
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed font-medium">
                {entitlementError.subMessage}
              </p>
            </div>
          </div>
          <div className="pt-1 flex items-center justify-between border-t border-amber-200/60 dark:border-amber-800/60">
            <span className="text-[11px] text-amber-700 dark:text-amber-400">
              Doctor Practice Tier: <strong>50/50 Limit Reached</strong>
            </span>
            <a
              href="/doctor/subscription"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span>Upgrade Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Appointment Summary Box */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
            Total Payable At Clinic
          </span>
          <span className="font-extrabold text-base text-slate-900 dark:text-white">
            {doctor.fee?.startsWith("Rs") ? doctor.fee : `Rs. ${doctor.fee?.replace("$", "") || "2,000"}`}
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 dark:text-slate-400 block font-medium">
            {date} • {timeSlot}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1 mt-0.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Pay on arrival</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Phone</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-mockup-blue px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 group cursor-pointer shadow-lg shadow-sky-600/25 disabled:opacity-50"
        >
          <span>{isSubmitting ? "Confirming Booking..." : "Confirm Appointment"}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}

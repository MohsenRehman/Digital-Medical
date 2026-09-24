"use client";

import React, { useState } from "react";
import { Phone, MapPin, Building, Stethoscope, ArrowRight, ArrowLeft } from "lucide-react";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";
import { ClinicSpecialityType } from "@/lib/types/clinic";

interface Step2LocationContactProps {
  onNext: () => void;
  onBack: () => void;
}

const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Gujranwala",
  "Sialkot",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
  "Other City",
];

const SPECIALITIES: ClinicSpecialityType[] = [
  "General Medicine",
  "Cardiology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "Gynecology",
  "Dermatology",
  "Dental",
  "ENT",
  "Pulmonology",
  "Other",
];

export default function Step2LocationContact({ onNext, onBack }: Step2LocationContactProps) {
  const { draft, updateContact } = useClinicAuth();
  const [formData, setFormData] = useState({
    mobileNumber: draft.contact.mobileNumber || "",
    physicalAddress: draft.contact.physicalAddress || "",
    city: draft.contact.city || "Lahore",
    speciality: draft.contact.speciality || "General Medicine",
  });

  const [error, setError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 11) val = val.slice(0, 11);

    // Format as 03xx-xxxxxxx
    if (val.length > 4) {
      val = `${val.slice(0, 4)}-${val.slice(4)}`;
    }
    setFormData((prev) => ({ ...prev, mobileNumber: val }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rawDigits = formData.mobileNumber.replace(/[^0-9]/g, "");
    if (rawDigits.length !== 11 || !rawDigits.startsWith("03")) {
      setError("Please enter a valid 11-digit mobile number starting with 03 (e.g. 0300-1234567).");
      return;
    }

    if (!formData.physicalAddress.trim() || formData.physicalAddress.length < 8) {
      setError("Please provide a complete physical address (Street, Block, Plaza, etc.).");
      return;
    }

    updateContact(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center max-w-md mx-auto mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <MapPin className="w-3.5 h-3.5 text-sky-500" />
          Step 2: Location & Contact
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Physical Location & Contact
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Accurate location details help nearby patients discover your facility.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {error}
        </div>
      )}

      {/* Strict Mobile Number */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          Official Mobile Number (Strict Verification) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span>🇵🇰</span>
            <span>+92</span>
          </div>
          <input
            type="tel"
            value={formData.mobileNumber}
            onChange={handlePhoneChange}
            placeholder="0300-1234567"
            className="w-full pl-20 pr-4 py-3 rounded-xl text-sm font-semibold tracking-wider bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm font-mono"
            required
          />
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Must be an active WhatsApp/calling number for patient communications.
        </p>
      </div>

      {/* City Dropdown */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          Operating City <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full pl-10 pr-8 py-3 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm appearance-none cursor-pointer"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clinic Physical Address */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          Clinic Physical Address <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <textarea
            value={formData.physicalAddress}
            onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
            rows={2}
            placeholder="e.g. Suite 402, Al-Latif Center, Main Boulevard, Gulberg III"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm resize-none"
            required
          />
        </div>
      </div>

      {/* Clinic Speciality */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          Primary Clinic Speciality <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={formData.speciality}
            onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
            className="w-full pl-10 pr-8 py-3 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm appearance-none cursor-pointer"
          >
            {SPECIALITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 group transition-all cursor-pointer"
        >
          <span>Continue to Email Verification</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}

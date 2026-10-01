"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { DoctorProfile } from "@/lib/types/doctor";
import { LoadingSpinner } from "@/components/doctor/loading/LoadingSpinner";
import { useDoctorToast } from "@/components/doctor/loading/DoctorToast";

interface PersonalInfoFormProps {
  doctor: DoctorProfile;
  onSave: (updates: Partial<DoctorProfile>) => void;
}

export default function PersonalInfoForm({ doctor, onSave }: PersonalInfoFormProps) {
  const { showToast } = useDoctorToast();
  const [fullName, setFullName] = useState(doctor.name || "");
  const [displayName, setDisplayName] = useState(doctor.displayName || doctor.name || "");
  const [email, setEmail] = useState(doctor.email || "dr.tariq.mahmood@digitalmedical.pk");
  const [phone, setPhone] = useState(doctor.phone || "0300-8591234");
  const [gender, setGender] = useState<"male" | "female" | "other">(doctor.gender || "male");
  const [dob, setDob] = useState(doctor.dateOfBirth || "1978-04-12");
  const [city, setCity] = useState(doctor.city || "Peshawar");
  const [country, setCountry] = useState(doctor.country || "Pakistan");

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required.";
    if (!displayName.trim()) errs.displayName = "Display name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!phone.trim() || phone.length < 10) {
      errs.phone = "Please enter a valid phone number.";
    }
    if (!city.trim()) errs.city = "City is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setTimeout(() => {
      onSave({
        name: fullName,
        displayName,
        email,
        phone,
        gender,
        dateOfBirth: dob,
        city,
        country,
      });
      setSaving(false);
      setSavedSuccess(true);
      showToast("Personal profile details updated", "success");
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Basic Personal Information
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Account identity, contact information, and primary administrative details.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          PRIVATE ACCOUNT DATA
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Personal information saved successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Full Legal Name */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Full Legal Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
              errors.fullName ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
            } text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500`}
            placeholder="Dr. Tariq Mahmood"
          />
          {errors.fullName && <p className="text-[10px] text-rose-500 mt-1">{errors.fullName}</p>}
        </div>

        {/* Professional Display Name */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Professional Display Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
              errors.displayName ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
            } text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500`}
            placeholder="Dr. Tariq Mahmood"
          />
          {errors.displayName && <p className="text-[10px] text-rose-500 mt-1">{errors.displayName}</p>}
        </div>

        {/* Email Address */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              Primary Email Address <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Login Email</span>
            </span>
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                errors.email ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
              } text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500`}
            />
          </div>
          {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Changing primary login email triggers a verification token to your current inbox.
          </span>
        </div>

        {/* Phone Number */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              Mobile Phone Number <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>OTP Verified</span>
            </span>
          </div>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                errors.phone ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
              } text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500`}
              placeholder="0300-1234567"
            />
          </div>
          {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Used for urgent clinical calls and SMS/WhatsApp emergency schedule alerts.
          </span>
        </div>

        {/* Gender */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as "male" | "female" | "other")}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Rather not say</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            City <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
              errors.city ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
            } text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500`}
            placeholder="Peshawar"
          />
          {errors.city && <p className="text-[10px] text-rose-500 mt-1">{errors.city}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Country
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Pakistan"
          />
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
              <span>Save Personal Info</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

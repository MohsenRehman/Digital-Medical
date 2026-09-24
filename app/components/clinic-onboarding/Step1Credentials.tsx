"use client";

import React, { useState } from "react";
import { Building2, User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";

interface Step1CredentialsProps {
  onNext: () => void;
}

export default function Step1Credentials({ onNext }: Step1CredentialsProps) {
  const { draft, updateCredentials } = useClinicAuth();
  const [formData, setFormData] = useState({
    clinicName: draft.credentials.clinicName || "",
    ownerFullName: draft.credentials.ownerFullName || "",
    email: draft.credentials.email || "",
    password: draft.credentials.password || "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clinicName.trim()) {
      setError("Please enter your official Clinic Name.");
      return;
    }
    if (!formData.ownerFullName.trim()) {
      setError("Please enter the Doctor or Clinic Owner's full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid official Email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    updateCredentials(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center max-w-md mx-auto mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
          Step 1: Clinic Credentials
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create Your Clinic Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Set up your primary administrative access and clinic identity.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {error}
        </div>
      )}

      {/* Clinic Name */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          Clinic Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="clinicName"
            value={formData.clinicName}
            onChange={handleChange}
            placeholder="e.g. Al-Shifa Medical Specialist Center"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
            required
          />
        </div>
      </div>

      {/* Full Name (Doctor / Owner) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          Full Name (Doctor / Owner) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="ownerFullName"
            value={formData.ownerFullName}
            onChange={handleChange}
            placeholder="e.g. Dr. Tariq Mahmood"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
            required
          />
        </div>
      </div>

      {/* Email Address */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          Official Email Address <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="clinic@digitalmedical.pk"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
            required
          />
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          A verification OTP will be sent to this email address in Step 3.
        </p>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          Create Administrative Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••••••"
            className="w-full pl-10 pr-11 py-3 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {formData.password && (
          <div className="flex items-center gap-2 pt-1 text-[11px]">
            <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  formData.password.length > 8 ? "bg-emerald-500 w-full" : "bg-amber-500 w-1/2"
                }`}
              />
            </div>
            <span className="text-slate-500 font-medium">
              {formData.password.length > 8 ? "Strong password" : "Good"}
            </span>
          </div>
        )}
      </div>

      {/* Next Step CTA */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 group transition-all cursor-pointer"
        >
          <span>Continue to Location & Contact</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}

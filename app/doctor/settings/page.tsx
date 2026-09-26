"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Building2,
  DollarSign,
  Globe,
  Award,
  Save,
  CheckCircle2,
  ExternalLink,
  Lock,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";

export default function DoctorSettingsPage() {
  const { doctor, updateDoctorProfile, activeClinic } = useDoctor();

  const [name, setName] = useState(doctor.name);
  const [specialty, setSpecialty] = useState(doctor.specialty);
  const [subSpecialty, setSubSpecialty] = useState(doctor.subSpecialty || "");
  const [bio, setBio] = useState(doctor.bio);
  const [consultationFee, setConsultationFee] = useState(doctor.consultationFee);
  const [videoFee, setVideoFee] = useState(doctor.videoConsultationFee);
  const [experienceYears, setExperienceYears] = useState(doctor.experienceYears);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDoctorProfile({
      name,
      specialty,
      subSpecialty,
      bio,
      consultationFee,
      videoConsultationFee: videoFee,
      experienceYears,
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
            Doctor Profile & Clinical Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your PMDC credentials, specialty qualifications, and consultation fee structure.
          </p>
        </div>

        <Link
          href="/doctor/settings/profile"
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-50 self-start md:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Public Profile Preview</span>
        </Link>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Doctor credentials and consultation fees updated successfully.</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-md"
          />
          {doctor.pmdcVerified && (
            <span
              className="absolute -bottom-1 -right-1 p-1 rounded-full bg-sky-600 text-white shadow-xs"
              title="Verified by Pakistan Medical & Dental Council"
            >
              <ShieldCheck className="w-4 h-4" />
            </span>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {doctor.name}
            </h2>
            {doctor.verificationStatus === "verified" ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Doctor</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                Pending Verification
              </span>
            )}
          </div>

          <p className="text-xs text-sky-700 dark:text-sky-300 font-semibold">{doctor.title}</p>
          <div className="text-xs text-slate-500 flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
            <span>PMDC Registration: <strong>{doctor.pmdcRegistration}</strong></span>
            <span>•</span>
            <span>Experience: <strong>{doctor.experienceYears} Years</strong></span>
            <span>•</span>
            <span>Rating: <strong>★ {doctor.rating} ({doctor.reviewCount} reviews)</strong></span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Clinical Information */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Professional Credentials & Identification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                PMDC Registration Number (Protected)
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value={doctor.pmdcRegistration}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-500 cursor-not-allowed"
                />
                <Lock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                PMDC registration is verified with the Pakistan Medical Commission portal.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                Primary Specialty
              </label>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                Sub-Specialty Focus
              </label>
              <input
                type="text"
                value={subSpecialty}
                onChange={(e) => setSubSpecialty(e.target.value)}
                placeholder="e.g. Interventional Cardiology & Hypertension"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
              Professional Biography
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>
        </div>

        {/* Fees and Consultation Structure */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Consultation Fee Structure (PKR)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                In-Clinic OPD Fee (PKR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                  PKR
                </span>
              </div>
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
                  value={videoFee}
                  onChange={(e) => setVideoFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                  PKR
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                Clinical Experience
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  Years
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Qualifications & Affiliations Display */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Accredited Qualifications & Clinic Branches
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Medical Degrees & Fellowships
              </span>
              <ul className="space-y-1.5">
                {doctor.qualifications.map((q, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Multi-Clinic Affiliations
              </span>
              <div className="space-y-2">
                {doctor.affiliatedClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{clinic.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {clinic.city} • {clinic.roomNumber}
                      </p>
                    </div>
                    {clinic.isPrimary && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                        Primary Hub
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

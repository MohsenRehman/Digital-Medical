"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Building2,
  ExternalLink,
  Eye,
  EyeOff,
  Edit3,
  Award,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { DoctorProfile } from "@/lib/types/doctor";

interface DoctorProfileHeaderProps {
  doctor: DoctorProfile;
  activeClinicName: string;
  activeClinicCity: string;
  onSelectTab: (tabId: string) => void;
  onToggleVisibility: (visible: boolean) => void;
}

export default function DoctorProfileHeader({
  doctor,
  activeClinicName,
  activeClinicCity,
  onSelectTab,
  onToggleVisibility,
}: DoctorProfileHeaderProps) {
  const [confirmHideOpen, setConfirmHideOpen] = useState(false);
  const isPublic = doctor.profileVisibility !== "hidden";

  const handleVisibilityClick = () => {
    if (isPublic) {
      setConfirmHideOpen(true);
    } else {
      onToggleVisibility(true);
    }
  };

  const confirmHide = () => {
    onToggleVisibility(false);
    setConfirmHideOpen(false);
  };

  return (
    <>
      <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white shadow-xl border border-sky-900/40 overflow-hidden">
        {/* Background glow and subtle medical watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-80 h-80 rounded-full border-8 border-sky-400 transform translate-x-20" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Doctor Avatar with Verified Badge */}
          <div className="relative flex-shrink-0 group">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="w-28 h-28 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-white/20 dark:border-slate-800 shadow-2xl transition-transform group-hover:scale-102"
            />
            {doctor.pmdcVerified && (
              <div
                className="absolute -bottom-2 -right-2 p-1.5 rounded-2xl bg-emerald-500 text-white shadow-lg ring-4 ring-slate-900 flex items-center justify-center"
                title="Verified by Pakistan Medical & Dental Council (PMDC)"
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-2.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  {doctor.name}
                </h1>
                <img
                  src="/images/varified-badge.png"
                  alt="Verified Doctor"
                  className="w-5 h-5 md:w-6 md:h-6 object-contain inline-block flex-shrink-0"
                />
              </div>

              {doctor.verificationStatus === "verified" ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PMDC Verified Doctor</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Verification Pending
                </span>
              )}

              {/* Profile Directory Visibility Status */}
              <button
                onClick={handleVisibilityClick}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isPublic
                    ? "bg-sky-500/20 text-sky-200 border-sky-400/40 hover:bg-sky-500/30"
                    : "bg-slate-700/60 text-slate-300 border-slate-600 hover:bg-slate-700"
                }`}
                title="Click to change directory visibility"
              >
                {isPublic ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Public in Discovery</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hidden from Directory</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-sm md:text-base font-semibold text-sky-200">
              {doctor.title}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-sky-100/90 font-medium">
              <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                {doctor.qualifications.join(" • ")}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>
                  {doctor.city || "Peshawar"}, {doctor.country || "Pakistan"}
                </span>
              </div>

              <span>•</span>

              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>
                  {activeClinicName} ({activeClinicCity})
                </span>
              </div>

              <span>•</span>

              <div className="flex items-center gap-1.5 font-semibold text-white">
                <Clock className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>{doctor.experienceYears}+ Years Clinical Exp.</span>
              </div>

              <span>•</span>

              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{doctor.rating}</span>
                <span className="text-slate-400 font-normal">
                  ({doctor.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 w-full md:w-auto flex-shrink-0 pt-2 md:pt-0">
            <button
              onClick={() => onSelectTab("profile")}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-sky-700" />
              <span>Edit Profile</span>
            </button>

            <Link
              href="/doctor/settings/profile"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Directory Preview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Confirmation Modal when hiding profile */}
      {confirmHideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hide Profile from Doctor Directory?
                </h3>
                <p className="text-xs text-slate-500">Public visibility setting</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Patients will no longer be able to discover or book you through the
              Digital Medical public doctor directory. You can still access your
              private clinical workspace, patient records, and in-clinic queue.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmHideOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Keep Visible
              </button>
              <button
                onClick={confirmHide}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm & Hide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

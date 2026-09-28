"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  Building2,
  Calendar,
  Clock,
  Video,
  Award,
  Globe,
  MapPin,
  ExternalLink,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { DoctorProfile } from "@/lib/types/doctor";

interface PublicProfilePreviewTabProps {
  doctor: DoctorProfile;
  activeClinicName: string;
  activeClinicCity: string;
  onToggleVisibility: (visible: boolean) => void;
}

export default function PublicProfilePreviewTab({
  doctor,
  activeClinicName,
  activeClinicCity,
  onToggleVisibility,
}: PublicProfilePreviewTabProps) {
  const [confirmHideOpen, setConfirmHideOpen] = useState(false);
  const isPublic = doctor.profileVisibility !== "hidden";

  const handleToggle = () => {
    if (isPublic) {
      setConfirmHideOpen(true);
    } else {
      onToggleVisibility(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visibility Controller Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Directory Discovery Visibility
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isPublic
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              }`}
            >
              {isPublic ? "LIVE ON DIRECTORY" : "HIDDEN FROM SEARCH"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Controls whether patients can discover and book consultations with you on the Digital Medical portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggle}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              isPublic
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100"
                : "bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {isPublic ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
            <span>{isPublic ? "Visible in Directory" : "Hidden from Directory"}</span>
          </button>

          <Link
            href="/doctor/settings/profile"
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Full Profile Page</span>
          </Link>
        </div>
      </div>

      {/* Public vs Private Information Demarcation Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4" />
            <span>Publicly Visible to Patients</span>
          </div>
          <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400 leading-relaxed">
            Name, Professional Photo, Specialty, PMDC Verification Badge, Degrees, Clinical Experience, Bio, Languages Spoken, Clinic Branch & Room, Consultation Fees, and Patient Reviews.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <Lock className="w-4 h-4 text-sky-600" />
            <span>Confidential & Private (Never Exposed)</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Personal mobile phone, private login email, medical degree scan files, bank settlement accounts, security sessions, and administrative clinical logs.
          </p>
        </div>
      </div>

      {/* Directory Search Result Preview Card */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          1. Live Directory Search Card Preview
        </h3>
        <p className="text-[11px] text-slate-500">
          This is exactly how your practitioner card appears when patients search for &quot;{doctor.specialty} in {activeClinicCity}&quot;.
        </p>

        <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-sky-400 dark:border-sky-600 shadow-md space-y-4 max-w-3xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-sm flex-shrink-0"
            />
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {doctor.name}
                </h4>
                {doctor.verificationStatus === "verified" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-sky-600" />
                    <span>PMDC Verified</span>
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                {doctor.title}
              </p>

              <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span>{doctor.qualifications.join(", ")}</span>
                <span>•</span>
                <span>{doctor.experienceYears}+ Years Exp.</span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{doctor.rating}</span>
                  <span className="text-slate-400 font-normal">({doctor.reviewCount} reviews)</span>
                </span>
                <span>•</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-600" />
                  <span>{activeClinicName} ({activeClinicCity})</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2 flex-shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                  Rs. {doctor.consultationFee}
                </span>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-xs hover:bg-sky-700 transition-colors"
              >
                Book Appointment
              </button>
            </div>
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
                onClick={() => {
                  onToggleVisibility(false);
                  setConfirmHideOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm & Hide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

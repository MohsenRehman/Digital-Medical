"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Building2,
  Calendar,
  Clock,
  Video,
  Award,
  Globe,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";

export default function DoctorPublicProfilePreviewPage() {
  const { doctor, activeClinic } = useDoctor();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/doctor/settings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile Settings</span>
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-6 text-center sm:text-left">
          <div className="relative">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="w-28 h-28 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-lg"
            />
            {doctor.pmdcVerified && (
              <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-sky-600 text-white shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {doctor.name}
              </h1>
              {doctor.verificationStatus === "verified" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>PMDC Verified Doctor</span>
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-sky-700 dark:text-sky-400">
              {doctor.title}
            </p>

            <p className="text-xs text-slate-500">
              Specialty: <strong className="text-slate-800 dark:text-slate-200">{doctor.specialty}</strong> • PMDC Reg:{" "}
              <strong className="text-slate-800 dark:text-slate-200 font-mono">{doctor.pmdcRegistration}</strong>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs pt-1 text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{doctor.rating}</span>
                <span className="text-slate-400 font-normal">({doctor.reviewCount} reviews)</span>
              </span>
              <span>•</span>
              <span>{doctor.experienceYears}+ Years Clinical Experience</span>
              <span>•</span>
              <span>{doctor.languages.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            About the Physician
          </h2>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {doctor.bio}
          </p>
        </div>

        {/* Qualifications */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Accredited Credentials & Degrees
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {doctor.qualifications.map((q, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2 font-medium"
              >
                <Award className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clinic Branches & Fees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 text-xs space-y-2">
            <span className="font-bold text-sky-900 dark:text-sky-300 block">
              In-Clinic OPD Consultation
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                Rs. {doctor.consultationFee}
              </span>
              <span className="text-[11px] text-slate-500">/ per visit</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Primary location: {activeClinic.name} ({activeClinic.roomNumber}), {activeClinic.city}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 text-xs space-y-2">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
              Telehealth Video Consultation
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                Rs. {doctor.videoConsultationFee}
              </span>
              <span className="text-[11px] text-slate-500">/ 20 min session</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Encrypted end-to-end video call with instant digital prescription delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

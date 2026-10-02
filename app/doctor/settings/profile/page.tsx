"use client";

import React, { useState } from "react";
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
  Eye,
  EyeOff,
  Stethoscope,
  Phone,
  Mail,
  Lock,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  HeartHandshake,
  Check,
  AlertCircle,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";

export default function DoctorPublicProfilePreviewPage() {
  const { doctor, activeClinic, reviews, updateDoctorProfile } = useDoctor();

  // Booking simulation modal state
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    type: "in-clinic" | "video";
    fee: number;
    clinicName?: string;
  } | null>(null);

  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const isVisible = doctor.profileVisibility !== "hidden";

  const handleMakePublic = () => {
    updateDoctorProfile({ profileVisibility: "public" });
  };

  const handleSimulateBooking = (type: "in-clinic" | "video", fee: number, clinicName?: string) => {
    setBookingConfirmed(false);
    setBookingModal({ isOpen: true, type, fee, clinicName });
  };

  const clinicList = doctor.affiliatedClinics && doctor.affiliatedClinics.length > 0
    ? doctor.affiliatedClinics
    : [activeClinic];

  const inClinicFee = doctor.consultationFee || 2500;
  const videoFee = doctor.videoConsultationFee || 2000;
  const inClinicEnabled = doctor.consultationSettings ? doctor.consultationSettings.inClinicEnabled : true;
  const videoEnabled = doctor.consultationSettings ? doctor.consultationSettings.videoEnabled : true;

  // Star calculation
  const totalReviews = reviews.length > 0 ? reviews.length : doctor.reviewCount || 420;
  const averageRating = doctor.rating || 4.9;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/doctor/settings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Doctor Settings</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Doctor Discovery Profile
          </h1>
          <p className="text-xs text-slate-500">
            Preview of your official public identity as patients see it on the Digital Medical directory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/doctor/settings?tab=profile"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            href="/doctor/settings?tab=availability"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-colors"
          >
            Manage Schedule
          </Link>
        </div>
      </div>

      {/* Profile Visibility Banner */}
      {isVisible ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              <Globe className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-900 dark:text-emerald-200">
                  Publicly Listed in Digital Medical Directory
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                Patients across Peshawar and telehealth users nationwide can find your credentials and book consultations directly.
              </p>
            </div>
          </div>
          <Link
            href="/doctor/settings?tab=public-profile"
            className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 hover:underline flex-shrink-0"
          >
            Change Visibility →
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              <EyeOff className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  Profile Hidden from Doctor Directory
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-[10px] font-bold">
                  Unlisted
                </span>
              </div>
              <p className="text-amber-700 dark:text-amber-400 mt-0.5">
                Your profile is not currently discoverable by new patients on the public search index. Direct clinic appointments remain active.
              </p>
            </div>
          </div>
          <button
            onClick={handleMakePublic}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex-shrink-0"
          >
            Make Profile Public
          </button>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-6 text-center md:text-left">
          {/* Profile Photo */}
          <div className="relative">
            <img
              src={doctor.avatarUrl || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80"}
              alt={doctor.displayName || doctor.name}
              className="w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-md ring-1 ring-slate-200 dark:ring-slate-700"
            />
            {doctor.verificationStatus === "verified" && (
              <span
                title="PMDC Verified Practitioner"
                className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-sky-600 text-white shadow-md ring-2 ring-white dark:ring-slate-900"
              >
                <ShieldCheck className="w-5 h-5" />
              </span>
            )}
          </div>

          {/* Core Info */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {doctor.displayName || doctor.name}
                </h2>
                <img
                  src="/images/varified-badge.png"
                  alt="Verified Doctor"
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain inline-block flex-shrink-0"
                />
              </div>
              {doctor.verificationStatus === "verified" ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>PMDC Verified Doctor</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Verification Pending</span>
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-sky-700 dark:text-sky-400">
              {doctor.title} {doctor.subSpecialty ? `• ${doctor.subSpecialty}` : ""}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>
                Specialty: <strong className="text-slate-800 dark:text-slate-200">{doctor.specialty}</strong>
              </span>
              <span>•</span>
              <span>
                PMDC Reg: <strong className="text-slate-800 dark:text-slate-200 font-mono">{doctor.pmdcRegistration}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{doctor.city || "Peshawar"}, {doctor.country || "Pakistan"}</span>
              </span>
            </div>

            {/* Ratings & Experience */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs pt-2 text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-900">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="text-slate-900 dark:text-white font-extrabold">{averageRating}</span>
                <span className="text-slate-400 font-normal">({totalReviews} reviews)</span>
              </span>

              <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                {doctor.experienceYears}+ Years Clinical Practice
              </span>

              <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                🗣️ {doctor.languages.join(", ")}
              </span>
            </div>
          </div>

          {/* Quick Booking CTAs */}
          <div className="flex flex-col gap-2.5 w-full md:w-auto min-w-[200px]">
            {inClinicEnabled && (
              <button
                onClick={() => handleSimulateBooking("in-clinic", inClinicFee, activeClinic.name)}
                className="w-full py-2.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center justify-between gap-2"
              >
                <span>Book Clinic Visit</span>
                <span className="font-mono text-[11px] bg-sky-700/60 px-2 py-0.5 rounded-lg">
                  Rs. {inClinicFee}
                </span>
              </button>
            )}

            {videoEnabled && (
              <button
                onClick={() => handleSimulateBooking("video", videoFee)}
                className="w-full py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-between gap-2"
              >
                <span className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Consultation</span>
                </span>
                <span className="font-mono text-[11px] bg-indigo-700/60 px-2 py-0.5 rounded-lg">
                  Rs. {videoFee}
                </span>
              </button>
            )}

            <p className="text-[11px] text-center text-slate-400">
              Instant appointment confirmation
            </p>
          </div>
        </div>

        {/* Biography Section */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Professional Biography
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {doctor.bio}
          </p>
        </div>

        {/* Degrees & Qualifications */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Accredited Qualifications & Certifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
            {doctor.qualifications.map((q, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 font-medium text-slate-800 dark:text-slate-200"
              >
                <span className="p-1.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex-shrink-0">
                  <Award className="w-4 h-4" />
                </span>
                <span className="font-semibold">{q}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Locations & Affiliated Clinics */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Practice Locations & Hospital Affiliations
            </h3>
            <span className="text-[11px] text-slate-400">
              {clinicList.length} Active {clinicList.length === 1 ? "Practice" : "Practices"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clinicList.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {c.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {c.city} • Room {c.roomNumber}
                      </p>
                    </div>
                  </div>

                  {c.isPrimary && (
                    <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                      Primary
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Address:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]" title={c.address}>{c.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{c.phone}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">Consultation Fee:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      Rs. {inClinicFee}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => handleSimulateBooking("in-clinic", inClinicFee, c.name)}
                    className="w-full py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-sky-600 dark:text-sky-300 text-xs font-bold transition-colors"
                  >
                    Select this Clinic for OPD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consultation Options Comparison */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Consultation Options & Patient Policies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* In-Clinic Card */}
            <div className="p-5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-900 dark:text-sky-300 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>In-Clinic OPD Consultation</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                  {inClinicEnabled ? "Active" : "Unavailable"}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  Rs. {inClinicFee}
                </span>
                <span className="text-[11px] text-slate-500">/ per visit</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span>Physical clinical examination and vital signs recording</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span>Instant verified digital prescription with QR code</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span>Free follow-up review within 7 days</span>
                </li>
              </ul>
            </div>

            {/* Video Telehealth Card */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 text-sm flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-indigo-600" />
                  <span>Telehealth Video Consultation</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                  {videoEnabled ? "Active" : "Unavailable"}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  Rs. {videoFee}
                </span>
                <span className="text-[11px] text-slate-500">/ 20 min session</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <span>Encrypted end-to-end HD video call from home</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <span>Digital prescription sent directly via SMS & WhatsApp</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <span>Lab investigation orders integrated with local diagnostic centers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Patient Feedback & Verified Reviews */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verified Patient Reviews & Experiences
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic feedback from verified appointments conducted through Digital Medical.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-amber-500 font-extrabold text-base">
                <Star className="w-5 h-5 fill-amber-500" />
                <span>{averageRating}</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">
                ({totalReviews} total reviews)
              </span>
            </div>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 mb-6 text-xs">
            {[
              { stars: 5, pct: "90%", count: 380 },
              { stars: 4, pct: "6%", count: 25 },
              { stars: 3, pct: "2%", count: 8 },
              { stars: 2, pct: "1%", count: 4 },
              { stars: 1, pct: "1%", count: 3 },
            ].map((b) => (
              <div key={b.stars} className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-0.5">
                    {b.stars} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  </span>
                  <span>{b.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: b.pct }} />
                </div>
              </div>
            ))}
          </div>

          {/* Review List */}
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center">
                      {rev.patientName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {rev.patientName}
                        </span>
                        {rev.verifiedVisit && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Verified Visit
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-10">
                  "{rev.comment}"
                </p>

                {rev.response && (
                  <div className="ml-10 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-l-2 border-sky-500 text-xs space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white text-[11px] flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-sky-600" />
                      Physician Response
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                      "{rev.response}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Public vs Private Guarantee */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs text-slate-500">
          <Lock className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Patient-Facing Confidentiality Guarantee
            </span>
            <p>
              Your personal phone number, direct email, PMDC internal registration documents, CNIC number, and banking details are strictly segregated and will NEVER be displayed on this public discovery page.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Simulation Modal */}
      {bookingModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  {bookingModal.type === "in-clinic" ? (
                    <Building2 className="w-4 h-4" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {bookingModal.type === "in-clinic" ? "In-Clinic OPD Booking Preview" : "Video Telehealth Booking Preview"}
                  </h4>
                  <p className="text-[11px] text-slate-500">Patient Discovery Workflow</p>
                </div>
              </div>
              <button
                onClick={() => setBookingModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                  Simulation Successful!
                </h5>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  In live production, the patient's appointment will be synced into your Doctor Dashboard queue, calendar, and appointments table immediately.
                </p>
                <button
                  onClick={() => setBookingModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
                >
                  Close Preview
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consultant:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{doctor.displayName || doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Specialty:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{doctor.specialty}</span>
                  </div>
                  {bookingModal.clinicName && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{bookingModal.clinicName}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Consultation Fee:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      Rs. {bookingModal.fee}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-[11px] text-sky-800 dark:text-sky-300">
                  <p className="font-semibold">Notice for Doctor:</p>
                  <p className="mt-0.5">
                    This confirms your consultation settings, appointment duration ({doctor.consultationSettings?.slotDurationMinutes ?? 20} mins), and working hours are active.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setBookingConfirmed(true)}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors"
                  >
                    Simulate Patient Booking
                  </button>
                  <button
                    onClick={() => setBookingModal(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

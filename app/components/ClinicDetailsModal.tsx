"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Building2,
  Star,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Stethoscope,
  Activity,
  Heart,
  Eye,
  Users,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { DetailedClinic, SpecializedDoctor } from "@/lib/clinicsData";

interface ClinicDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: DetailedClinic | null;
  onBookDoctor: (doctor: SpecializedDoctor) => void;
}

export default function ClinicDetailsModal({
  isOpen,
  onClose,
  clinic,
  onBookDoctor,
}: ClinicDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "doctors" | "services">("overview");

  if (!isOpen || !clinic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeInUp">
      <div className="relative w-full max-w-3xl glass-panel bg-white dark:bg-[#0b1426] rounded-3xl shadow-2xl border border-white/40 dark:border-slate-700 max-h-[92vh] overflow-y-auto flex flex-col">
        
        {/* Sticky Modal Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-[#0b1426]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {clinic.name}
              </h3>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                Department: {clinic.departmentName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close details"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Banner Section */}
        <div className="relative w-full h-52 sm:h-64 flex-shrink-0 bg-slate-900">
          <Image
            src={clinic.image}
            alt={clinic.name}
            fill
            className="object-cover opacity-85"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-600/90 text-white backdrop-blur-md shadow-sm">
              {clinic.type}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{clinic.rating.toFixed(1)}</span>
              <span className="text-slate-300">({clinic.reviews} reviews)</span>
            </div>
          </div>

          {/* Banner Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {clinic.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-200">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {clinic.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {clinic.hours}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/70 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "overview"
                ? "border-sky-600 text-sky-600 dark:text-sky-400"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Overview & Top Doctor
          </button>
          <button
            onClick={() => setActiveTab("doctors")}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "doctors"
                ? "border-sky-600 text-sky-600 dark:text-sky-400"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Available Doctors ({clinic.specializedDoctors.length})
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "services"
                ? "border-sky-600 text-sky-600 dark:text-sky-400"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Services & Facilities
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeInUp">
              {/* Short Overview Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 dark:bg-slate-900/70 border border-sky-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span className="text-xs font-bold tracking-wider uppercase text-sky-700 dark:text-sky-300">
                    Department Overview • {clinic.departmentName}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                  {clinic.overview}
                </p>
              </div>

              {/* ⭐ Top Doctor of the Clinic Card */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold tracking-wide uppercase text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Top Doctor of the Clinic
                  </h4>
                  <button
                    onClick={() => setActiveTab("doctors")}
                    className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    View all doctors →
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm flex flex-col sm:flex-row items-center gap-4 hover:border-sky-400 dark:hover:border-sky-500 transition-colors">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={clinic.topDoctor.image}
                      alt={clinic.topDoctor.name}
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute top-1 right-1 bg-white/90 dark:bg-slate-900/90 p-1 rounded-full shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h5 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {clinic.topDoctor.name}
                      </h5>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        Lead Specialist
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                      {clinic.topDoctor.title}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>• {clinic.topDoctor.experience}</span>
                      <span>• Fee: {clinic.topDoctor.fee}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        • {clinic.topDoctor.availableTime}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                      <button
                        onClick={() => onBookDoctor(clinic.topDoctor)}
                        className="px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider text-white btn-mockup-blue flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Doctor Appointment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours & Location & Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Working Hours Box */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Working Hours
                  </span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{clinic.hours}</span>
                  </div>
                  {clinic.emergencyAvailable && (
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      ✓ 24/7 Emergency Triage Open
                    </span>
                  )}
                </div>

                {/* Location & Contact Information Box */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Location & Contact
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                      <span>{clinic.location}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <a href={`tel:${clinic.phone}`} className="font-semibold text-sky-600 dark:text-sky-400 hover:underline">
                        {clinic.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AVAILABLE SPECIALIZED DOCTORS */}
          {activeTab === "doctors" && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Specialized Attending Doctors ({clinic.specializedDoctors.length})
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Verified Healthcare Professionals
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {clinic.specializedDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-sky-400 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 w-full sm:w-auto">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={doc.image}
                          alt={doc.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {doc.name}
                          </h5>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        </div>
                        <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                          {doc.specialty}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>{doc.experience}</span>
                          <span>• Fee: {doc.fee}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            • {doc.availableTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onBookDoctor(doc)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white btn-mockup-blue flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Appointment</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES & CLINICAL FACILITIES */}
          {activeTab === "services" && (
            <div className="space-y-6 animate-fadeInUp">
              {/* Department Services */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Department Clinical Services
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {clinic.services.map((service, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hospital Key Facilities */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  On-Site Hospital Facilities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {clinic.facilities.map((fac, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-center"
                    >
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        {fac}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span>Emergency / Reception: </span>
            <span className="font-bold text-slate-900 dark:text-white">{clinic.phone}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab(activeTab === "doctors" ? "overview" : "doctors")}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {activeTab === "doctors" ? "View Overview" : "View Doctors"}
            </button>

            <button
              onClick={() => onBookDoctor(clinic.topDoctor)}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white btn-mockup-blue flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Doctor Appointment</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

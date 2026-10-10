"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Stethoscope,
  Building2,
  Star,
  MapPin,
  Calendar,
  Clock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  X,
} from "lucide-react";
import { DOCTORS_DATA, Doctor } from "@/app/components/TopRatedDoctors";
import { ALL_CLINICS_DATA, DetailedClinic } from "@/lib/clinicsData";

interface DoctorsClinicsSectionProps {
  onBookDoctor: (doctor: Doctor) => void;
}

export default function DoctorsClinicsSection({ onBookDoctor }: DoctorsClinicsSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<"doctors" | "clinics">("doctors");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = DOCTORS_DATA.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClinics = ALL_CLINICS_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 gap-3.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[11px] font-semibold mb-1">
            <Stethoscope className="w-3 h-3 text-sky-600 dark:text-sky-400" />
            <span>Healthcare Directory</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Doctors &amp; Clinics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified specialists and accredited clinical departments in the Digital Medical network.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab("doctors")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "doctors"
                ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Specialist Doctors ({DOCTORS_DATA.length})
          </button>
          <button
            onClick={() => setActiveSubTab("clinics")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "clinics"
                ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Partner Clinics ({ALL_CLINICS_DATA.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeSubTab === "doctors"
              ? "Search doctors by name or specialty..."
              : "Search clinics by department or city..."
          }
          className="w-full pl-10 pr-9 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 shadow-2xs transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md cursor-pointer outline-none transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Doctors Grid */}
      {activeSubTab === "doctors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3.5"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative shrink-0 border border-slate-200/60 dark:border-slate-700">
                  <Image src={doc.image} alt={doc.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{doc.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({doc.reviewsCount})</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5 truncate">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold truncate">
                    {doc.specialty}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {doc.experience}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Available Slot</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {doc.availableTime}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {doc.fee}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onBookDoctor(doc)}
                className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Clinics Grid */}
      {activeSubTab === "clinics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3.5"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative shrink-0 border border-slate-200/60 dark:border-slate-700">
                  <Image src={clinic.image} alt={clinic.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{clinic.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({clinic.reviews} reviews)</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5 truncate">
                    {clinic.name}
                  </h3>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold truncate">
                    {clinic.departmentName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {clinic.overview}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{clinic.location}</span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{clinic.hours}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={`/clinics/${clinic.slug}`}
                  className="flex-1 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <button
                  onClick={() => {
                    const mappedDoctor: Doctor = {
                      id: clinic.topDoctor.id,
                      name: clinic.topDoctor.name,
                      specialty: clinic.topDoctor.specialty,
                      category: (clinic.topDoctor.category as any) || "Cardiology",
                      rating: clinic.topDoctor.rating,
                      reviewsCount: 140,
                      location: clinic.topDoctor.location,
                      experience: clinic.topDoctor.experience,
                      availableTime: clinic.topDoctor.availableTime,
                      fee: clinic.topDoctor.fee,
                      image: clinic.topDoctor.image,
                    };
                    onBookDoctor(mappedDoctor);
                  }}
                  className="flex-1 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Quick Book</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

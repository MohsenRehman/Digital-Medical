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
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold mb-1">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Healthcare Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Doctors &amp; Clinics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified specialists and accredited clinical departments in the Digital Medical network.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab("doctors")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "doctors"
                ? "bg-white dark:bg-[#0B1426] text-teal-600 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Specialist Doctors ({DOCTORS_DATA.length})
          </button>
          <button
            onClick={() => setActiveSubTab("clinics")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "clinics"
                ? "bg-white dark:bg-[#0B1426] text-teal-600 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Partner Clinics ({ALL_CLINICS_DATA.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeSubTab === "doctors"
              ? "Search doctors by name or specialty..."
              : "Search clinics by department or city..."
          }
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500"
        />
      </div>

      {/* Doctors Grid */}
      {activeSubTab === "doctors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-400/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 relative flex-shrink-0">
                  <Image src={doc.image} alt={doc.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{doc.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({doc.reviewsCount})</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
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
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {doc.fee}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onBookDoctor(doc)}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-400/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 relative flex-shrink-0">
                  <Image src={clinic.image} alt={clinic.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{clinic.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({clinic.reviews} reviews)</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                    {clinic.name}
                  </h3>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                    {clinic.departmentName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {clinic.overview}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{clinic.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{clinic.hours}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={`/clinics/${clinic.slug}`}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1"
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
                  className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
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

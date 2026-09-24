"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building,
  Star,
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { BorderBeam } from "@/registry/magicui/border-beam";

export interface Clinic {
  id: string;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
  hours: string;
  facilities: string[];
  image: string;
  doctorRoster: string[];
}

const CLINICS_DATA: Clinic[] = [
  {
    id: "clinic-1",
    name: "Apex Heart & Medical Center",
    type: "Cardiovascular & Specialty Care",
    rating: 5.0,
    reviews: 248,
    location: "450 Lexington Ave, New York, NY",
    phone: "+1 (212) 555-0144",
    hours: "Open 24/7 • All Days",
    facilities: ["24/7 Pathology Lab", "In-House Pharmacy", "Emergency Unit", "Echo & Ultrasound"],
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600&auto=format&fit=crop",
    doctorRoster: ["Dr. Esita Jabed (Cardiology)", "Dr. James Wilson (Vascular)"],
  },
  {
    id: "clinic-2",
    name: "Metro Wellness & Pediatric Pavilion",
    type: "Family & Pediatric Center",
    rating: 4.9,
    reviews: 194,
    location: "720 Wilshire Blvd, Los Angeles, CA",
    phone: "+1 (310) 555-0182",
    hours: "Mon - Sat: 08:00 AM - 10:00 PM",
    facilities: ["Child Vaccination", "Pharmacy", "Telehealth Booths", "Dental Suite"],
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop",
    doctorRoster: ["Dr. Marcus Vance (Pediatrics)", "Dr. Elena Rostova (Pulmonology)"],
  },
  {
    id: "clinic-3",
    name: "Mercy Diagnostic & Surgical Suite",
    type: "Multi-Specialty Hospital",
    rating: 5.0,
    reviews: 312,
    location: "110 Michigan Ave, Chicago, IL",
    phone: "+1 (312) 555-0199",
    hours: "Open 24/7 • Emergency Ready",
    facilities: ["24/7 Lab", "Pharmacy", "MRI / CT Scanner", "ICU & Trauma"],
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop",
    doctorRoster: ["Dr. David Chen (Surgery)", "Dr. Tariq Ahmad (Critical Care)"],
  },
];

interface TopRatedClinicsProps {
  onOpenBooking: () => void;
}

export default function TopRatedClinics({ onOpenBooking }: TopRatedClinicsProps) {
  const [expandedClinicId, setExpandedClinicId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedClinicId(expandedClinicId === id ? null : id);
  };

  return (
    <section id="clinics" className="py-16 sm:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Top-Rated Clinics
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Browse our verified healthcare centers equipped with 24/7 diagnostics, emergency triage, and certified pharmacies.
          </p>
          <Link
            href="/clinics"
            className="inline-flex items-center gap-1 mt-4 text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            <span>Explore All Verified Clinics & Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Clinics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {CLINICS_DATA.map((clinic, idx) => {
            const isExpanded = expandedClinicId === clinic.id;

            return (
              <motion.div
                key={clinic.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative h-full glass-panel rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group flex flex-col"
              >
                {/* Clinic Image with Hover Zoom */}
                <div className="relative w-full aspect-[16/10] zoom-container bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <Image
                    src={clinic.image}
                    alt={clinic.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                    <span>{clinic.rating.toFixed(1)}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    {clinic.hours}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Stars bar */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                        ({clinic.reviews} Reviews)
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {clinic.name}
                    </h3>
                    <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                      {clinic.type}
                    </p>

                    {/* Facilities Pills */}
                    <div className="mt-3.5 py-2.5 border-y border-slate-200/60 dark:border-slate-800/80">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        • 24/7 Lab &nbsp; • Pharmacy &nbsp; • Emergency
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{clinic.location}</span>
                      </div>
                    </div>

                    {/* Accordion Expand / Collapse Details */}
                    <div
                      className={`accordion-wrapper transition-all duration-400 ease-in-out ${
                        isExpanded ? "max-h-[350px] opacity-100 mt-4" : "max-h-0 opacity-0 overflow-hidden"
                      }`}
                    >
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block mb-1">
                            Key Clinical Facilities:
                          </span>
                          <div className="grid grid-cols-2 gap-1 text-[11px]">
                            {clinic.facilities.map((fac, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300">{fac}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          <span className="font-bold text-slate-900 dark:text-white block mb-1">
                            Attending Specialists:
                          </span>
                          {clinic.doctorRoster.map((doc, dIdx) => (
                            <p key={dIdx} className="text-[11px] text-slate-500 dark:text-slate-400">
                              • {doc}
                            </p>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Reception Line:</span>
                          <span className="font-semibold text-sky-600 dark:text-sky-400">{clinic.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 flex items-center gap-2">
                    <Link
                      href={`/clinics/${
                        clinic.id === "clinic-1"
                          ? "cardiology-center"
                          : clinic.id === "clinic-2"
                          ? "pediatrics-center"
                          : "neurology-hospital"
                      }`}
                      className="flex-1 py-2.5 px-4 rounded-full font-bold text-xs bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 btn-glow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>VIEW DETAILS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={onOpenBooking}
                      className="p-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Book at this clinic"
                    >
                      <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    </button>
                  </div>
                </div>

                {/* ── Dual Border Beam — matches Featured Clinical Departments ── */}
                <BorderBeam
                  duration={6}
                  size={400}
                  colorFrom="transparent"
                  colorVia="#f43f5e"
                  colorTo="transparent"
                />
                <BorderBeam
                  duration={6}
                  delay={3}
                  size={400}
                  borderWidth={2}
                  colorFrom="transparent"
                  colorVia="#38bdf8"
                  colorTo="transparent"
                />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

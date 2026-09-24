"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BorderBeam } from "@/registry/magicui/border-beam";
import {
  Heart,
  Wind,
  Baby,
  Droplets,
  Stethoscope,
  Brain,
  HeartHandshake,
  Microscope,
  ArrowRight,
  Users,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";

export interface SpecialtyItem {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  doctorsCount: number;
  color: string;
  iconColor: string;
  iconBg: string;
  glowColor: string;
  badge: string;
  badgeColor: string;
  beamColor: string;
}

const SPECIALTIES: SpecialtyItem[] = [
  {
    id: "spec-1",
    name: "Cardiology",
    subtitle: "Cardiovascular health, ECG monitoring & heart failure therapy.",
    icon: Heart,
    doctorsCount: 48,
    color: "from-rose-500 to-red-600",
    iconColor: "text-rose-500",
    iconBg: "bg-gradient-to-br from-rose-500 to-red-600",
    glowColor: "shadow-rose-500/60",
    badge: "Most Visited",
    badgeColor: "bg-rose-100 text-rose-600",
    beamColor: "#f43f5e",
  },
  {
    id: "spec-2",
    name: "Pulmonology",
    subtitle: "Respiratory health, lung function tests & asthma care.",
    icon: Wind,
    doctorsCount: 32,
    color: "from-sky-500 to-blue-600",
    iconColor: "text-sky-500",
    iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
    glowColor: "shadow-sky-500/60",
    badge: "24/7 Lab",
    badgeColor: "bg-sky-100 text-sky-600",
    beamColor: "#38bdf8",
  },
  {
    id: "spec-3",
    name: "Pediatrics",
    subtitle: "Compassionate child healthcare, vaccines & wellness checks.",
    icon: Baby,
    doctorsCount: 64,
    color: "from-amber-500 to-orange-600",
    iconColor: "text-amber-500",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    glowColor: "shadow-amber-500/60",
    badge: "Family Care",
    badgeColor: "bg-amber-100 text-amber-700",
    beamColor: "#f59e0b",
  },
  {
    id: "spec-4",
    name: "Urology & Nephrology",
    subtitle: "Specialist renal care, kidney stone therapy & bladder health.",
    icon: Droplets,
    doctorsCount: 26,
    color: "from-teal-500 to-emerald-600",
    iconColor: "text-teal-500",
    iconBg: "bg-gradient-to-br from-teal-500 to-emerald-600",
    glowColor: "shadow-teal-500/60",
    badge: "Expert Staff",
    badgeColor: "bg-teal-100 text-teal-700",
    beamColor: "#14b8a6",
  },
  {
    id: "spec-5",
    name: "General Medicine",
    subtitle: "Primary physician visits, health screenings & chronic care.",
    icon: Stethoscope,
    doctorsCount: 82,
    color: "from-indigo-500 to-purple-600",
    iconColor: "text-indigo-500",
    iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
    glowColor: "shadow-indigo-500/60",
    badge: "Available Now",
    badgeColor: "bg-indigo-100 text-indigo-700",
    beamColor: "#6366f1",
  },
  {
    id: "spec-6",
    name: "Neurology",
    subtitle: "Brain mapping, migraine clinics & neurological therapies.",
    icon: Brain,
    doctorsCount: 29,
    color: "from-violet-500 to-purple-700",
    iconColor: "text-violet-500",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-700",
    glowColor: "shadow-violet-500/60",
    badge: "Advanced Tech",
    badgeColor: "bg-violet-100 text-violet-700",
    beamColor: "#8b5cf6",
  },
  {
    id: "spec-7",
    name: "Mental Health",
    subtitle: "Confidential psychiatric support, wellness counseling.",
    icon: HeartHandshake,
    doctorsCount: 35,
    color: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-500",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    glowColor: "shadow-emerald-500/60",
    badge: "Telehealth Ready",
    badgeColor: "bg-emerald-100 text-emerald-700",
    beamColor: "#10b981",
  },
  {
    id: "spec-8",
    name: "Diagnostics & Imaging",
    subtitle: "High-resolution MRI, CT scans, digital ultrasound & lab.",
    icon: Microscope,
    doctorsCount: 41,
    color: "from-cyan-500 to-sky-600",
    iconColor: "text-cyan-500",
    iconBg: "bg-gradient-to-br from-cyan-500 to-sky-600",
    glowColor: "shadow-cyan-500/60",
    badge: "Same-Day Results",
    badgeColor: "bg-cyan-100 text-cyan-700",
    beamColor: "#06b6d4",
  },
];



// Department Clinic Highlights
const DEPARTMENT_CARDS = [
  {
    title: "Cardiology Center",
    tagline: "Heart & Vascular Specialty",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop",
    features: ["24/7 Cardiac Lab", "ECG & Angiography", "Pharmacy"],
    rating: 5.0,
  },
  {
    title: "Pulmonology Clinic",
    tagline: "Respiratory Specialists",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop",
    features: ["Oxygen Therapy", "Spirometry Testing", "Pharmacy"],
    rating: 4.9,
  },
  {
    title: "Central Pharmacy & Diagnostic",
    tagline: "Certified Lab & Medicine",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600&auto=format&fit=crop",
    features: ["Rapid Blood Test", "Home Delivery", "Verified Meds"],
    rating: 5.0,
  },
];

interface MedicalSpecialtiesProps {
  onSelectSpecialty: (name: string) => void;
}

export default function MedicalSpecialties({ onSelectSpecialty }: MedicalSpecialtiesProps) {
  const [activeSpecialty, setActiveSpecialty] = useState<string>("Cardiology");

  return (
    <section id="specialties" className="py-16 sm:py-20 relative z-10 bg-slate-50/50 dark:bg-[#070e1b]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-sky-200/60 dark:border-sky-800/60">
            <span>Specialized Healthcare</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Clinics
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Discover our specialized clinics and multi-disciplinary healthcare departments combining top-tier physician expertise with modern digital diagnostics.
          </p>
        </div>

        {/* ─── 8 Medical Specialties — UIverse-style flip cards ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 mb-16">
          {SPECIALTIES.map((spec, idx) => {
            const IconComponent = spec.icon;
            const isSelected = activeSpecialty === spec.name;

            return (
              <div
                key={spec.id}
                onClick={() => {
                  setActiveSpecialty(spec.name);
                  onSelectSpecialty(spec.name);
                }}
                style={{ animationDelay: `${idx * 0.08}s` }}
                /* Card shell — overflow-hidden keeps overlay clipped */
                className={`
                  relative overflow-hidden cursor-pointer
                  rounded-2xl border bg-white dark:bg-slate-900
                  transition-all duration-300 group
                  min-h-[160px]
                  ${isSelected
                    ? "border-sky-500 dark:border-sky-400 ring-2 ring-sky-400/30 shadow-xl -translate-y-1.5"
                    : "border-slate-200 dark:border-slate-800 hover:border-sky-400/60 hover:-translate-y-1.5 hover:shadow-xl shadow-sm"}
                `}
              >
                {/* ── DEFAULT STATE (always visible, slides up on hover) ── */}
                <div className="p-5 flex flex-col items-start gap-3 transition-all duration-300 group-hover:-translate-y-2">

                  {/* Active pulse dot */}
                  {isSelected && (
                    <span className="absolute top-3 right-3 flex h-2.5 w-2.5 z-10">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
                    </span>
                  )}

                  {/* Icon — gradient tile with glow halo */}
                  <div className="relative w-fit mb-1">
                    {/* Glow halo */}
                    <div className={`
                      absolute inset-0 rounded-2xl blur-xl opacity-50
                      group-hover:opacity-80 transition-opacity duration-300
                      bg-gradient-to-br ${spec.color}
                    `} />
                    {/* Gradient icon tile */}
                    <div className={`
                      relative w-14 h-14 rounded-2xl flex items-center justify-center
                      ${spec.iconBg}
                      shadow-lg ${spec.glowColor}
                      transition-all duration-300
                      group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl
                    `}>
                      <IconComponent className="w-7 h-7 text-white drop-shadow-sm" />
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug transition-colors duration-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                    {spec.name}
                  </h3>
                </div>

                {/* ── HOVER OVERLAY — slides up from bottom ── */}
                <div
                  className="
                    absolute inset-x-0 bottom-0
                    translate-y-full group-hover:translate-y-0
                    transition-transform duration-300 ease-out
                    bg-white/95 dark:bg-slate-900/95
                    backdrop-blur-sm
                    border-t border-slate-100 dark:border-slate-800
                    px-4 pt-3 pb-4
                    flex flex-col gap-2.5
                    rounded-b-2xl
                    shadow-[0_-6px_24px_rgba(0,0,0,0.06)]
                  "
                >
                  {/* Doctor count + badge row */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold text-sm">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      {spec.doctorsCount} Doctors
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${spec.badgeColor}`}>
                      {spec.badge}
                    </span>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {spec.subtitle}
                  </p>

                  {/* CTA */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectSpecialty(spec.name); }}
                    className="
                      mt-0.5 w-full flex items-center justify-center gap-1.5
                      py-2 rounded-full
                      bg-sky-600 hover:bg-sky-700
                      text-white text-xs font-bold
                      transition-colors duration-200
                      cursor-pointer shadow-sm
                    "
                  >
                    <span>Explore Clinic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom bar visible at rest (hidden when overlay open) */}
                <div className="px-5 pb-4 pt-0 flex items-center justify-between text-xs font-semibold group-hover:opacity-0 transition-opacity duration-150">
                  <span className="text-sky-600 dark:text-sky-400">{spec.doctorsCount} Doctors</span>
                  <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    {spec.badge}
                  </span>
                </div>

                {/* ── Border Beam — unique accent per specialty ── */}
                <BorderBeam
                  duration={8}
                  size={100}
                  colorFrom="transparent"
                  colorVia={spec.beamColor}
                  colorTo="transparent"
                />
              </div>
            );
          })}
        </div>

        {/* Department / Specialty Facilities Cards */}
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-2xl mx-auto mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Clinical Departments
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
              State-of-the-art facilities equipped with modern equipment and on-site pharmacies.
            </p>
            <Link
              href="/clinics"
              className="inline-flex items-center gap-1 mt-4 text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <span>Explore All Clinics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEPARTMENT_CARDS.map((dept, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative glass-panel rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div className="relative w-full h-48 zoom-container">
                  <Image
                    src={dept.image}
                    alt={dept.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1">
                    <span>★ {dept.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {dept.title}
                    </h4>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold mb-3">
                      {dept.tagline}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      {dept.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                    <button
                      onClick={() => onSelectSpecialty(dept.title)}
                      className="w-full py-2.5 px-4 rounded-full font-bold text-xs text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-slate-800 hover:bg-sky-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5 group-hover:bg-sky-600 group-hover:text-white dark:group-hover:bg-sky-500 cursor-pointer"
                    >
                      <span>VIEW DETAILS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ── Dual Border Beam ── */}
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
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

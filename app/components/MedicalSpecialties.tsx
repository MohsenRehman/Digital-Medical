"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Wind,
  Baby,
  Activity,
  Dna,
  Brain,
  HeartHandshake,
  Stethoscope,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export interface SpecialtyItem {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  doctorsCount: number;
  color: string;
  badge: string;
}

const SPECIALTIES: SpecialtyItem[] = [
  {
    id: "spec-1",
    name: "Cardiology",
    subtitle: "Cardiovascular health, ECG monitoring & heart failure therapy.",
    icon: Heart,
    doctorsCount: 48,
    color: "from-rose-500 to-red-600",
    badge: "Most Visited",
  },
  {
    id: "spec-2",
    name: "Pulmonology",
    subtitle: "Respiratory health, lung function tests & asthma care.",
    icon: Wind,
    doctorsCount: 32,
    color: "from-sky-500 to-blue-600",
    badge: "24/7 Lab",
  },
  {
    id: "spec-3",
    name: "Pediatrics",
    subtitle: "Compassionate child healthcare, vaccines & wellness checks.",
    icon: Baby,
    doctorsCount: 64,
    color: "from-amber-500 to-orange-600",
    badge: "Family Care",
  },
  {
    id: "spec-4",
    name: "Urology & Nephrology",
    subtitle: "Specialist renal care, kidney stone therapy & bladder health.",
    icon: Activity,
    doctorsCount: 26,
    color: "from-teal-500 to-emerald-600",
    badge: "Expert Staff",
  },
  {
    id: "spec-5",
    name: "General Medicine",
    subtitle: "Primary physician visits, health screenings & chronic care.",
    icon: Dna,
    doctorsCount: 82,
    color: "from-indigo-500 to-purple-600",
    badge: "Available Now",
  },
  {
    id: "spec-6",
    name: "Neurology",
    subtitle: "Brain mapping, migraine clinics & neurological therapies.",
    icon: Brain,
    doctorsCount: 29,
    color: "from-violet-500 to-purple-700",
    badge: "Advanced Tech",
  },
  {
    id: "spec-7",
    name: "Mental Health",
    subtitle: "Confidential psychiatric support, wellness counseling.",
    icon: HeartHandshake,
    doctorsCount: 35,
    color: "from-emerald-500 to-teal-600",
    badge: "Telehealth Ready",
  },
  {
    id: "spec-8",
    name: "Diagnostics & Imaging",
    subtitle: "High-resolution MRI, CT scans, digital ultrasound & lab.",
    icon: Stethoscope,
    doctorsCount: 41,
    color: "from-cyan-500 to-sky-600",
    badge: "Same-Day Results",
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3 border border-sky-200 dark:border-sky-800">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>FULL HEALTHCARE COVERAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Medical Specialties
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Our multi-disciplinary departments combine top-tier physician expertise with modern digital diagnostics.
          </p>
        </div>

        {/* 8 Medical Specialties Icon Grid with Pop-in & Hover Animation */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
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
                className={`glass-panel p-5 rounded-2xl cursor-pointer border transition-all duration-300 relative group flex flex-col justify-between ${
                  isSelected
                    ? "border-sky-500 dark:border-sky-400 ring-2 ring-sky-400/30 shadow-xl -translate-y-1.5"
                    : "border-slate-200/80 dark:border-slate-800/80 hover:border-sky-400/60 hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                {/* Active Pulse Ring Indicator on Top Right */}
                {isSelected && (
                  <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
                  </span>
                )}

                <div>
                  {/* Icon with Hover Scale Effect */}
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 border border-sky-100 dark:border-sky-900">
                    <IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {spec.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold">
                  <span className="text-sky-600 dark:text-sky-400">{spec.doctorsCount} Doctors</span>
                  <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    {spec.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Department / Specialty Facilities Cards */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Featured Clinical Departments
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                State-of-the-art facilities equipped with modern equipment and on-site pharmacies.
              </p>
            </div>
            <a
              href="#clinics"
              className="text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Explore All Clinics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEPARTMENT_CARDS.map((dept, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
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
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

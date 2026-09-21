"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Marquee } from "@/registry/magicui/marquee";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  category: "Cardiology" | "Pediatrics" | "Pulmonology" | "Neurology";
  rating: number;
  reviewsCount: number;
  location: string;
  experience: string;
  availableTime: string;
  fee: string;
  image: string;
}

export const DOCTORS_DATA: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Esita Jabed",
    specialty: "Cardiologist",
    category: "Cardiology",
    rating: 5.0,
    reviewsCount: 142,
    location: "United States",
    experience: "12+ Years Exp.",
    availableTime: "Today • 02:00 PM",
    fee: "$50",
    image: "/images/doctor-hd-1.jpg",
  },
  {
    id: "doc-2",
    name: "Dr. Marcus Vance",
    specialty: "Pediatrician",
    category: "Pediatrics",
    rating: 5.0,
    reviewsCount: 118,
    location: "United States",
    experience: "9+ Years Exp.",
    availableTime: "Today • 03:30 PM",
    fee: "$45",
    image: "/images/doctor-hd-2.jpg",
  },
  {
    id: "doc-3",
    name: "Dr. Tariq Ahmad",
    specialty: "Pediatrician",
    category: "Pediatrics",
    rating: 5.0,
    reviewsCount: 96,
    location: "United States",
    experience: "14+ Years Exp.",
    availableTime: "Tomorrow • 10:00 AM",
    fee: "$55",
    image: "/images/doctor-hd-3.jpg",
  },
  {
    id: "doc-4",
    name: "Dr. James Wilson",
    specialty: "Cardiologist",
    category: "Cardiology",
    rating: 5.0,
    reviewsCount: 84,
    location: "United States",
    experience: "10+ Years Exp.",
    availableTime: "Tomorrow • 01:15 PM",
    fee: "$60",
    image: "/images/doctor-hd-4.jpg",
  },
  {
    id: "doc-5",
    name: "Dr. Elena Rostova",
    specialty: "Pediatrician",
    category: "Pediatrics",
    rating: 5.0,
    reviewsCount: 165,
    location: "United States",
    experience: "8+ Years Exp.",
    availableTime: "Today • 05:00 PM",
    fee: "$40",
    image: "/images/doctor-hd-5.jpg",
  },
  {
    id: "doc-6",
    name: "Dr. David Chen",
    specialty: "Cardiologist, Pediatrician",
    category: "Cardiology",
    rating: 5.0,
    reviewsCount: 204,
    location: "United States",
    experience: "16+ Years Exp.",
    availableTime: "Today • 04:30 PM",
    fee: "$65",
    image: "/images/doctor-hd-6.jpg",
  },
];

interface TopRatedDoctorsProps {
  onSelectDoctor: (doctor: Doctor) => void;
  searchFilter?: { doctor: string; specialty: string; location: string };
}

export default function TopRatedDoctors({ onSelectDoctor, searchFilter }: TopRatedDoctorsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Cardiology", "Pediatrics", "Pulmonology", "Neurology"];

  const filteredDoctors = DOCTORS_DATA.filter((doc) => {
    // Filter by category pill
    if (activeCategory !== "All" && doc.category !== activeCategory && !doc.specialty.includes(activeCategory)) {
      return false;
    }
    // Filter by search bar doctor name
    if (searchFilter?.doctor && !doc.name.toLowerCase().includes(searchFilter.doctor.toLowerCase())) {
      return false;
    }
    // Filter by search bar specialty
    if (
      searchFilter?.specialty &&
      searchFilter.specialty !== "All Specialties" &&
      !doc.specialty.toLowerCase().includes(searchFilter.specialty.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <section
      id="doctors"
      aria-label="Top-Rated Doctors"
      className="py-16 sm:py-24 relative z-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Top-Rated Doctors
          </h2>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#0284c7] text-white shadow-md shadow-sky-600/30 scale-105"
                    : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Magic UI Single-Row Marquee with Side Gradient Fades */}
      <div className="relative w-full overflow-hidden py-4">
        {filteredDoctors.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-10 glass-panel rounded-2xl">
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              No doctors found matching your criteria.
            </p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-3 text-sm text-sky-600 dark:text-sky-400 font-semibold underline cursor-pointer"
            >
              View all doctors
            </button>
          </div>
        ) : (
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            {/* Single Row of Cards */}
            <Marquee
              pauseOnHover
              className="[--duration:20s] [--gap:2rem] py-6"
            >
              {filteredDoctors.map((doc, idx) => (
                <article
                  key={`${doc.id}-${idx}`}
                  className="uiverse-card flex-shrink-0 p-5 flex flex-col justify-between group overflow-hidden cursor-pointer"
                >
                  {/* Top: 4K HD Doctor Studio Portrait */}
                  <div className="relative w-full aspect-square rounded-[10px] overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm transition-all duration-500">
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      fill
                      sizes="270px"
                      priority={idx < 4}
                      quality={95}
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-108"
                    />
                    
                    {/* Top verified badge */}
                    <div className="absolute top-2.5 right-2.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm text-[11px] font-bold text-slate-800 dark:text-slate-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Bottom: Doctor Details & Rating */}
                  <div className="pt-4 pb-1 text-center flex-1 flex flex-col justify-between">
                    <div>
                      {/* Doctor Name */}
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                        {doc.name}
                      </h3>

                      {/* 5 Gold Stars Rating */}
                      <div className="flex items-center justify-center gap-1 mt-1.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-current"
                            aria-hidden="true"
                          />
                        ))}
                      </div>

                      {/* Specialty */}
                      <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300 mt-1.5 truncate">
                        {doc.specialty}
                      </p>

                      {/* Location */}
                      <div className="flex items-center justify-center gap-1 text-[12px] text-[#0284c7] dark:text-[#38bdf8] mt-2 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{doc.location}</span>
                      </div>
                    </div>

                    {/* BOOK APPOINTMENT Button */}
                    <div className="mt-4">
                      <button
                        onClick={() => onSelectDoctor(doc)}
                        className="w-full py-2.5 px-4 rounded-full font-bold text-[11px] sm:text-[12px] uppercase tracking-wider text-white btn-mockup-blue flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>BOOK APPOINTMENT</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </Marquee>

            {/* Magic UI Left & Right Side Gradient Fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-36 sm:w-56 bg-gradient-to-r from-[var(--bg)] to-transparent z-20" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-36 sm:w-56 bg-gradient-to-l from-[var(--bg)] to-transparent z-20" />
          </div>
        )}
      </div>

    </section>
  );
}


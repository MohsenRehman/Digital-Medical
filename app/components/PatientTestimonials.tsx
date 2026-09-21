"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote, MessageSquareHeart, Sparkles } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  location: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Tarik Arzan",
    role: "Cardiology Patient",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "The best experience I've had. Fast, simple, and the doctor was excellent! Booking took less than a minute.",
    location: "United States",
  },
  {
    id: "test-2",
    name: "Faris Anana",
    role: "Pediatric Consultation",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "The best experience I've had. Fast, simple, and the doctor was excellent! Dr. Marcus was extremely gentle with my son.",
    location: "United States",
  },
  {
    id: "test-3",
    name: "Sarah Pateer",
    role: "Pulmonology Follow-up",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "The best experience I've had. The video consult had pristine video and audio quality, and my prescription was sent instantly to the pharmacy.",
    location: "United States",
  },
  {
    id: "test-4",
    name: "Michael Chang",
    role: "Routine Wellness Check",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Digital Medical saved me hours of waiting in a clinic lobby. Transparent pricing and top-tier licensed physicians.",
    location: "United States",
  },
];

export default function PatientTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-16 sm:py-24 relative z-10 overflow-hidden bg-slate-50/50 dark:bg-[#070e1b]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3 border border-sky-200 dark:border-sky-800">
            <MessageSquareHeart className="w-3.5 h-3.5 text-rose-500" />
            <span>COMMUNITY FEEDBACK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Patient Testimonials
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Read authentic reviews from thousands of patients who booked their clinic visits through our platform.
          </p>
        </div>

        {/* Testimonials 3-Card Interactive Display with Carousel Controls */}
        <div className="relative">
          {/* Navigation Arrows */}
          <div className="hidden sm:flex justify-between items-center absolute top-1/2 -translate-y-1/2 -left-4 -right-4 pointer-events-none z-20">
            <button
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="pointer-events-auto p-3 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-110 hover:text-sky-600 dark:hover:text-sky-400 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="pointer-events-auto p-3 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-110 hover:text-sky-600 dark:hover:text-sky-400 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {TESTIMONIALS.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Quote & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-slate-300 dark:text-slate-700 group-hover:text-sky-400 transition-colors" />
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    &quot;{item.comment}&quot;
                  </p>
                </div>

                {/* Patient Profile */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-sky-500/50 dark:border-sky-400/50 flex-shrink-0">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === i
                    ? "w-8 bg-sky-600 dark:bg-sky-400"
                    : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Infinite Marquee Strip from PDF (Technique #10) */}
        <div className="mt-16 pt-10 border-t border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
            TRUSTED BY OVER 150+ ACCREDITED CLINICS & HOSPITALS NATIONWIDE
          </p>
          <div className="marquee-track flex gap-8 items-center text-slate-500 dark:text-slate-400 text-sm font-semibold">
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              🏥 Mayo Medical Network
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              ⚕️ Johns Hopkins Care
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              🩺 Cleveland Clinic Partner
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              💉 Cedars-Sinai Health
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              🏨 Stanford Health Care
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              🏥 Mount Sinai Hospital
            </span>
            {/* Duplicate for seamless infinite loop */}
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              🏥 Mayo Medical Network
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              ⚕️ Johns Hopkins Care
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              🩺 Cleveland Clinic Partner
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              💉 Cedars-Sinai Health
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              🏨 Stanford Health Care
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60">
              🏥 Mount Sinai Hospital
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

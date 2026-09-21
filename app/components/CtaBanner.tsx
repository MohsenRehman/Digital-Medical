"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Building2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface CtaBannerProps {
  onOpenBooking: () => void;
}

export default function CtaBanner({ onOpenBooking }: CtaBannerProps) {
  return (
    <section className="py-16 sm:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container with Medical Vibrant Blue Gradient */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-700 via-sky-600 to-sky-500 dark:from-sky-900 dark:via-sky-800 dark:to-sky-700 p-8 sm:p-14 text-center text-white shadow-2xl shadow-sky-600/30">
          
          {/* Subtle geometric circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/10 blur-2xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-6 border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>INSTANT ACCESS TO 500+ DOCTORS</span>
          </div>

          {/* Main Headline from Screenshot */}
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto uppercase">
            Take Charge of Your Health Today!
          </h2>

          <p className="mt-4 text-sm sm:text-base text-sky-100 max-w-xl mx-auto font-medium">
            Book certified clinic consultations in under 2 minutes or register your clinic to connect with patients in your city.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenBooking}
              className="px-8 py-4 rounded-full font-extrabold text-sm text-sky-900 bg-white hover:bg-sky-50 shadow-xl hover:shadow-2xl transition-all duration-200 btn-glow flex items-center gap-2 group cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>BOOK YOUR FIRST APPOINTMENT</span>
              <ArrowRight className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#clinics-join"
              className="px-8 py-4 rounded-full font-bold text-sm text-white bg-sky-950/40 hover:bg-sky-950/60 border border-white/30 backdrop-blur-md transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-sky-300" />
              <span>REGISTER YOUR CLINIC</span>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-6 text-xs text-sky-100">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> HIPAA Compliant
            </span>
            <span>•</span>
            <span>Zero Hidden Booking Fees</span>
            <span>•</span>
            <span>Instant Electronic Prescriptions</span>
          </div>

        </div>

      </div>
    </section>
  );
}

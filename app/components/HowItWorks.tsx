"use client";

import React, { useState } from "react";
import {
  UserSearch,
  CalendarDays,
  CalendarCheck2,
  Video,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";

const STEPS = [
  {
    step: 1,
    title: "Step 1: Search Doctors",
    shortTitle: "Search Doctors",
    desc: "Search by condition, doctor specialty, rating, location, or clinic hospital.",
    icon: UserSearch,
    color: "from-sky-500 to-blue-600",
  },
  {
    step: 2,
    title: "Step 2: Select Date",
    shortTitle: "Select Date",
    desc: "Choose an available calendar day and time slot that fits your schedule.",
    icon: CalendarDays,
    color: "from-teal-500 to-emerald-600",
  },
  {
    step: 3,
    title: "Step 3: Book Appointment",
    shortTitle: "Book Appointment",
    desc: "Verify patient details and confirm your visit with instant real-time confirmation.",
    icon: CalendarCheck2,
    color: "from-indigo-500 to-sky-600",
  },
  {
    step: 4,
    title: "Step 4: Video Consult / Visit",
    shortTitle: "Video Consult / Visit",
    desc: "Attend your high-definition telehealth call or visit the certified clinic in person.",
    icon: Video,
    color: "from-emerald-500 to-teal-600",
  },
];

interface HowItWorksProps {
  onStartBooking: () => void;
}

export default function HowItWorks({ onStartBooking }: HowItWorksProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section id="how-it-works" className="py-16 sm:py-24 relative z-10 bg-slate-50/50 dark:bg-[#070e1b]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3 border border-sky-200 dark:border-sky-800">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>SIMPLE & FAST PROCESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Book certified consultations in four seamless steps with instant digital confirmation.
          </p>
        </div>

        {/* 4 Connected Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = activeStep === item.step;

            return (
              <div
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`glass-panel rounded-2xl p-6 relative cursor-pointer border transition-all duration-300 flex flex-col justify-between group ${
                  isActive
                    ? "border-sky-500 dark:border-sky-400 shadow-xl -translate-y-2 ring-2 ring-sky-400/20"
                    : "border-slate-200/80 dark:border-slate-800/80 hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                {/* Step Pill Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center font-extrabold text-sm text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900">
                    {item.step}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="hidden lg:flex items-center text-slate-300 dark:text-slate-700">
                      <ArrowRight className="w-4 h-4 text-sky-400/60 dark:text-sky-400/60" />
                    </div>
                  )}
                </div>

                {/* Step Icon with Pop-in & Pulse */}
                <div className="mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border border-sky-100 dark:border-sky-900">
                    <IconComponent className="w-7 h-7" />
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Interactive Status */}
                <div className="mt-5 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs font-semibold">
                  <span className="text-sky-600 dark:text-sky-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {isActive ? "Selected Step" : "Click to view"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Prompt */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartBooking}
            className="px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-sky-500 to-sky-700 shadow-lg shadow-sky-600/30 btn-glow inline-flex items-center gap-2 group cursor-pointer"
          >
            <span>START YOUR BOOKING NOW</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import {
  ScanSearch,
  CalendarRange,
  BadgeCheck,
  MonitorPlay,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { BorderBeam } from "@/registry/magicui/border-beam";

const STEPS = [
  {
    step: 1,
    title: "Search Doctors",
    desc: "Find doctors by specialty, condition, rating, location or clinic — instantly filtered for you.",
    icon: ScanSearch,
    gradient: "from-sky-500 to-blue-600",
    glow: "shadow-sky-500/50",
    ring: "ring-sky-400/30",
    border: "border-sky-500 dark:border-sky-400",
    iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
    beamColor: "#38bdf8",
    label: "Smart Search",
  },
  {
    step: 2,
    title: "Select Date & Time",
    desc: "Pick an available calendar slot that perfectly fits your daily schedule in seconds.",
    icon: CalendarRange,
    gradient: "from-teal-500 to-emerald-600",
    glow: "shadow-teal-500/50",
    ring: "ring-teal-400/30",
    border: "border-teal-500 dark:border-teal-400",
    iconBg: "bg-gradient-to-br from-teal-500 to-emerald-600",
    beamColor: "#14b8a6",
    label: "Easy Scheduling",
  },
  {
    step: 3,
    title: "Confirm Booking",
    desc: "Verify your details and receive instant real-time confirmation with a digital receipt.",
    icon: BadgeCheck,
    gradient: "from-indigo-500 to-purple-600",
    glow: "shadow-indigo-500/50",
    ring: "ring-indigo-400/30",
    border: "border-indigo-500 dark:border-indigo-400",
    iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
    beamColor: "#6366f1",
    label: "Instant Confirm",
  },
  {
    step: 4,
    title: "Consult or Visit",
    desc: "Join your HD telehealth video call or walk into the certified clinic — your choice.",
    icon: MonitorPlay,
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/50",
    ring: "ring-emerald-400/30",
    border: "border-emerald-500 dark:border-emerald-400",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    beamColor: "#10b981",
    label: "Telehealth Ready",
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Book certified consultations in four seamless steps with instant digital confirmation.
          </p>
        </div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = activeStep === item.step;

            return (
              <div
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`
                  relative overflow-hidden rounded-2xl p-6 cursor-pointer border
                  bg-white dark:bg-slate-900
                  transition-all duration-300 flex flex-col gap-4 group
                  ${isActive
                    ? `${item.border} shadow-2xl -translate-y-2 ring-2 ${item.ring}`
                    : "border-slate-200 dark:border-slate-800 hover:-translate-y-1.5 hover:shadow-xl shadow-sm"}
                `}
              >
                {/* Step number + connector arrow */}
                <div className="flex items-center justify-between">
                  <span className={`
                    w-8 h-8 rounded-xl flex items-center justify-center
                    text-xs font-black text-white
                    bg-gradient-to-br ${item.gradient}
                    shadow-md ${item.glow}
                  `}>
                    {item.step}
                  </span>

                  {/* Connector arrow — only between cards on desktop */}
                  {idx < STEPS.length - 1 && (
                    <ArrowRight className="hidden lg:block w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-sky-400 transition-colors duration-300" />
                  )}
                </div>

                {/* Glowing Icon */}
                <div className="relative w-fit">
                  {/* Glow halo */}
                  <div className={`
                    absolute inset-0 rounded-2xl blur-xl opacity-40 group-hover:opacity-70
                    transition-opacity duration-300
                    bg-gradient-to-br ${item.gradient}
                  `} />
                  {/* Icon circle */}
                  <div className={`
                    relative w-16 h-16 rounded-2xl flex items-center justify-center
                    ${item.iconBg}
                    shadow-lg ${item.glow}
                    transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
                  `}>
                    <IconComponent className="w-8 h-8 text-white drop-shadow" />
                  </div>
                </div>

                {/* Title & Description */}
                <div className="flex-1">
                  <span className={`
                    text-[10px] font-bold uppercase tracking-widest
                    bg-gradient-to-r ${item.gradient}
                    bg-clip-text text-transparent
                  `}>
                    {item.label}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Footer status */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-semibold">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"}`} />
                  <span className={isActive ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"}>
                    {isActive ? "Active Step" : "Click to explore"}
                  </span>
                </div>

                {/* BorderBeam — unique colour per step, same style as Medical Specialties */}
                <BorderBeam
                  duration={8}
                  size={100}
                  colorFrom="transparent"
                  colorVia={item.beamColor}
                  colorTo="transparent"
                />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartBooking}
            className="px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-sky-500 to-sky-700 shadow-lg shadow-sky-600/30 btn-glow inline-flex items-center gap-2 group cursor-pointer transition-all duration-200 hover:shadow-sky-500/40 hover:scale-105"
          >
            <span>START YOUR BOOKING NOW</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { NumberTicker } from "@/registry/magicui/number-ticker";

interface HeroProps {
  onOpenAppointment: () => void;
}

export default function Hero({ onOpenAppointment }: HeroProps) {
  const [spinning, setSpinning] = useState(false);

  const handleRefreshClick = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 650);
  };

  return (
    <section
      id="hero"
      aria-label="Welcome to Digital Clinic"
      className="relative pt-6 pb-12 lg:pt-14 lg:pb-24 overflow-hidden z-10"
    >
      {/* Decorative background curved lines and soft ambient glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none opacity-40 dark:opacity-20">
        <svg
          className="w-full h-full min-w-[800px]"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-50 480 C 180 430, 320 370, 500 390 C 720 415, 860 300, 960 210 C 1040 130, 1140 180, 1250 140"
            stroke="#0284c7"
            strokeWidth="2.2"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
          <path
            d="M500 390 C 620 400, 680 180, 780 100 C 850 40, 950 80, 1020 180 C 1080 270, 1180 340, 1260 320"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column: Entrance animation from the left slightly */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-6 space-y-6 text-center lg:text-left z-10"
          >
            {/* 24/7 EMERGENCY SERVICE Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold tracking-wide shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
              <span>24/7 EMERGENCY SERVICE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Caring for{" "}
              <span className="text-[#0284c7] dark:text-[#38bdf8] font-black inline-block">
                Health
              </span>
              <br />
              <span className="relative inline-block mt-1">
                Caring for You
                {/* Subtle soft underline wave */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-sky-400/40 dark:text-sky-400/30"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9.5C65 2.5 185 2 298 9.5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Mockup Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              A brief statement describing core purpose and mission of the clinic. This can include the commitment to patient care, community health.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenAppointment}
                className="px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white btn-mockup-blue flex items-center gap-2 group cursor-pointer"
              >
                <span>DISCOVER MORE</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <a
                href="#specialties"
                className="px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white btn-mockup-secondary flex items-center gap-2 group cursor-pointer"
              >
                <span>SEE ALL SERVICES</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              {/* Interactive Status Refresh Tool */}
              <button
                onClick={handleRefreshClick}
                className="p-3.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 shadow-sm"
                title="Refresh Availability"
                aria-label="Refresh doctors availability"
              >
                <RefreshCw className={`w-4 h-4 ${spinning ? "spin-on-trigger" : ""}`} />
              </button>
            </div>

            {/* Quick Trust Indicators with MagicUI NumberTicker */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              {/* Stat 1: 500+ */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[#0284c7] dark:text-[#38bdf8] font-black text-2xl sm:text-3xl">
                  <NumberTicker
                    value={500}
                    startValue={100}
                    className="font-black text-[#0284c7] dark:text-[#38bdf8] tracking-tight"
                  />
                  <span className="text-lg font-bold">+</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Verified Doctors
                </span>
              </div>

              {/* Stat 2: 98.4% */}
              <div className="flex flex-col border-x border-slate-200 dark:border-slate-800 px-3">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black text-2xl sm:text-3xl">
                  <NumberTicker
                    value={98.4}
                    startValue={80}
                    decimalPlaces={1}
                    className="font-black text-emerald-600 dark:text-emerald-400 tracking-tight"
                  />
                  <span className="text-lg font-bold">%</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Recovery Rate
                </span>
              </div>

              {/* Stat 3: 24/7 */}
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5 text-[#0284c7] dark:text-[#38bdf8] font-black text-2xl sm:text-3xl">
                  <NumberTicker
                    value={24}
                    startValue={0}
                    className="font-black text-[#0284c7] dark:text-[#38bdf8] tracking-tight"
                  />
                  <span className="text-xl font-bold opacity-75">/</span>
                  <NumberTicker
                    value={7}
                    startValue={0}
                    className="font-black text-[#0284c7] dark:text-[#38bdf8] tracking-tight"
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Emergency Desk
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Entrance animation smoothly appears from the right slowly */}
          {/* Isolated transparent doctors cutout with soft glowing aura and smooth bottom dissolve */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-6 xl:col-span-6 relative flex justify-center lg:justify-end items-center"
          >
            <div className="relative w-full max-w-[560px] sm:max-w-[620px] lg:max-w-[680px] flex items-center justify-center">

              {/* 1. Deep ambient glow pool — sits behind the image */}
              <div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[85%] h-48 rounded-full bg-sky-400/20 dark:bg-sky-400/18 blur-[60px] pointer-events-none -z-10"
                aria-hidden="true"
              />

              {/* 2. Tighter core glow — glows softly right at the feet */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-20 rounded-full bg-sky-300/30 dark:bg-sky-400/22 blur-[32px] pointer-events-none -z-10"
                aria-hidden="true"
              />

              {/* 3. Doctors image — only the bottom ~14% softly dissolves */}
              <div
                className="relative w-full"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.55) 91%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.55) 91%, transparent 100%)",
                }}
              >
                <Image
                  src="/images/hero-doctors-transparent.png"
                  alt="Expert Medical Doctors"
                  width={1024}
                  height={768}
                  priority
                  quality={100}
                  className="w-full h-auto object-contain select-none pointer-events-none"
                />
              </div>

              {/* 4. Soft horizon glow streak — blends the base into the page */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-gradient-to-r from-transparent via-sky-300/30 dark:via-sky-400/25 to-transparent blur-xl pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

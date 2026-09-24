"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Clock,
  Lock,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { BorderBeam } from "@/registry/magicui/border-beam";

const FEATURES = [
  {
    title: "Verified Doctors",
    desc: "Rigorous credential checks, verified medical licenses, and background screening for all practitioners.",
    icon: ShieldCheck,
    gradient: "from-sky-500 to-blue-600",
    iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
    glowColor: "shadow-sky-500/50",
    beamColor: "#38bdf8",
    label: "Fully Certified",
  },
  {
    title: "Instant Bookings",
    desc: "Real-time calendar synchronization with immediate confirmation and zero waiting room delays.",
    icon: Clock,
    gradient: "from-teal-500 to-emerald-600",
    iconBg: "bg-gradient-to-br from-teal-500 to-emerald-600",
    glowColor: "shadow-teal-500/50",
    beamColor: "#14b8a6",
    label: "Real-Time Sync",
  },
  {
    title: "Secure Records",
    desc: "Bank-grade 256-bit encryption ensuring strict HIPAA compliance for all lab records & e-prescriptions.",
    icon: Lock,
    gradient: "from-indigo-500 to-purple-600",
    iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
    glowColor: "shadow-indigo-500/50",
    beamColor: "#6366f1",
    label: "HIPAA Compliant",
  },
  {
    title: "24/7 Support",
    desc: "Round-the-clock patient assistance, emergency dispatch, and digital consultation coordination.",
    icon: Headphones,
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    glowColor: "shadow-emerald-500/50",
    beamColor: "#10b981",
    label: "Always Available",
  },
];

export default function WhyDigitalMedical() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [stats, setStats] = useState({
    doctors: 0,
    recovery: 0,
    appointments: 0,
    satisfaction: 0,
  });

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 2000;
          const startTime = performance.now();

          const animateCounts = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setStats({
              doctors: Math.floor(easeOut * 500),
              recovery: Number((easeOut * 98.4).toFixed(1)),
              appointments: Math.floor(easeOut * 150),
              satisfaction: Number((easeOut * 99.2).toFixed(1)),
            });

            if (progress < 1) {
              requestAnimationFrame(animateCounts);
            }
          };

          requestAnimationFrame(animateCounts);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Digital Medical
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Engineered to deliver exceptional healthcare quality, guaranteed privacy, and effortless access.
          </p>
        </div>

        {/* 4 Feature Cards — HowItWorks style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col gap-4 group cursor-default"
              >
                {/* Glowing Icon */}
                <div className="relative w-fit">
                  {/* Glow halo */}
                  <div className={`
                    absolute inset-0 rounded-2xl blur-xl opacity-40
                    group-hover:opacity-70 transition-opacity duration-300
                    bg-gradient-to-br ${item.gradient}
                  `} />
                  {/* Gradient icon tile */}
                  <div className={`
                    relative w-16 h-16 rounded-2xl flex items-center justify-center
                    ${item.iconBg}
                    shadow-lg ${item.glowColor}
                    transition-all duration-300
                    group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl
                  `}>
                    <Icon className="w-8 h-8 text-white drop-shadow" />
                  </div>
                </div>

                {/* Text */}
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

                {/* Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Guaranteed Standards
                </div>

                {/* BorderBeam — unique per feature */}
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

        {/* CountUp Statistics Box */}
        <div className="glass-panel bg-gradient-to-r from-sky-950/90 via-slate-900/95 to-sky-900/90 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/15">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-400">
                {stats.doctors}+
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Verified Physicians</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
                {stats.recovery}%
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Patient Recovery Rate</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">
                {stats.appointments}k+
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Appointments Booked</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">
                {stats.satisfaction}%
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Satisfaction Score</p>
            </div>

          </div>

          {/* Progress Bar */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-medium">
              <span>Verified Clinical Network Health &amp; Server Uptime</span>
              <span className="text-emerald-400 font-bold">99.9% Online</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden border border-white/10">
              <div
                className={`h-full bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-1000 ${
                  hasAnimated ? "w-[99.2%]" : "w-0"
                }`}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

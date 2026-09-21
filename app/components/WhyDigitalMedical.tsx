"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Clock,
  Lock,
  Headphones,
  Award,
  Sparkles,
  TrendingUp,
  Heart,
  CheckCircle2
} from "lucide-react";

const FEATURES = [
  {
    title: "Verified Doctors",
    desc: "Rigorous credential checks, verified medical licenses, and background screening for all practitioners.",
    icon: ShieldCheck,
    color: "from-sky-500 to-blue-600",
  },
  {
    title: "Instant Bookings",
    desc: "Real-time calendar synchronization with immediate confirmation and zero waiting room delays.",
    icon: Clock,
    color: "from-teal-500 to-emerald-600",
  },
  {
    title: "Secure Records",
    desc: "Bank-grade 256-bit encryption ensuring strict HIPAA compliance for all lab records & e-prescriptions.",
    icon: Lock,
    color: "from-indigo-500 to-sky-600",
  },
  {
    title: "24/7 Support",
    desc: "Round-the-clock patient assistance, emergency dispatch, and digital consultation coordination.",
    icon: Headphones,
    color: "from-emerald-500 to-teal-600",
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

          // Animate numbers with requestAnimationFrame
          const duration = 2000;
          const startTime = performance.now();

          const animateCounts = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3 border border-sky-200 dark:border-sky-800">
            <Award className="w-3.5 h-3.5 text-sky-500" />
            <span>STANDARDS OF EXCELLENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Digital Medical
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Engineered to deliver exceptional healthcare quality, guaranteed privacy, and effortless access.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 border border-sky-100 dark:border-sky-900">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Guaranteed Standards</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic CountUp Statistics Box with Capacity Progress Bar */}
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

          {/* Progress Bar from Animation Bible (Technique #24) */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-medium">
              <span>Verified Clinical Network Health & Server Uptime</span>
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

"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  doctor: string;
  specialty: string;
  room: string;
  badge: string;
  available: boolean;
}

const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    id: "sch-1",
    time: "09:00 AM - 11:00 AM",
    title: "Comprehensive Cardiac Screening & ECG Diagnostics",
    doctor: "Dr. Esita Jabed",
    specialty: "Cardiology",
    room: "Cardio Wing • Suite 302",
    badge: "Limited Slots",
    available: true,
  },
  {
    id: "sch-2",
    time: "11:30 AM - 01:30 PM",
    title: "Pediatric Immunization & Developmental Health Check",
    doctor: "Dr. Marcus Vance",
    specialty: "Pediatrics",
    room: "Children's Pavilion • Room 104",
    badge: "Walk-in Welcome",
    available: true,
  },
  {
    id: "sch-3",
    time: "02:00 PM - 04:00 PM",
    title: "Asthma Management & Pulmonary Function Testing",
    doctor: "Dr. Elena Rostova",
    specialty: "Pulmonology",
    room: "Respiratory Lab • Suite 205",
    badge: "Specialist Care",
    available: true,
  },
  {
    id: "sch-4",
    time: "04:30 PM - 06:30 PM",
    title: "Neurology Telehealth Hour & Migraine Consultation",
    doctor: "Dr. David Chen",
    specialty: "Neurology",
    room: "Virtual Tele-Suite 02",
    badge: "100% Online",
    available: true,
  },
];

interface DoctorScheduleProps {
  onBookScheduleSlot: (item: ScheduleItem) => void;
}

export default function DoctorSchedule({ onBookScheduleSlot }: DoctorScheduleProps) {
  const [selectedDay, setSelectedDay] = useState("Today");

  const days = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday"];

  return (
    <section id="schedule" className="py-16 sm:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3 border border-sky-200 dark:border-sky-800">
              <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>LIVE CLINIC CALENDAR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Campus Calendar &amp; Schedule
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Real-time daily schedule of attending specialists, clinic walk-in hours, and digital sessions.
            </p>
          </div>

          {/* Days Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full glass-panel self-start md:self-auto max-w-full overflow-x-auto no-scrollbar">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDay === day
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Staggered Event Rows Table (from PDF Section 6S-9S) */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-xl">
          <div className="divide-y divide-slate-200/60 dark:divide-slate-800/80">
            {SCHEDULE_ITEMS.map((item, index) => (
              <div
                key={item.id}
                style={{ animationDelay: `${index * 0.12}s` }}
                className="p-4 sm:p-6 transition-all duration-200 hover:bg-sky-50/60 dark:hover:bg-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer"
                onClick={() => onBookScheduleSlot(item)}
              >
                {/* Left: Time & Badge */}
                <div className="flex items-center gap-4 w-full md:w-auto md:min-w-[200px]">
                  <div className="p-3 rounded-2xl bg-sky-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-bold group-hover:scale-105 transition-transform">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {item.time}
                    </span>
                    <span className="inline-block mt-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Center: Title & Specialist details */}
                <div className="flex-1 space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      {item.doctor} ({item.specialty})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.room}
                    </span>
                  </div>
                </div>

                {/* Right: Quick Action & Arrow Slide Right on Hover */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Open for Booking
                  </span>

                  <button
                    type="button"
                    className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-sky-600 group-hover:text-white dark:group-hover:bg-sky-600 transition-all flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

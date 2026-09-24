"use client";

import React, { useState, useRef } from "react";
import { Doctor } from "@/app/components/TopRatedDoctors";
import {
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CalendarCheck2,
} from "lucide-react";

interface Step1DateTimeProps {
  doctor: Doctor;
  onContinue: (date: string, timeSlot: string) => void;
}

interface CalendarDay {
  weekday: string; // e.g. "Wed"
  dayNum: string; // e.g. "24"
  month: string; // e.g. "Sep"
  fullDate: string; // e.g. "Today, 24 Sep"
  badge?: "Today" | "Tomorrow";
  slotsCount: number;
  isClosed?: boolean;
}

const DAYS_SCHEDULE: CalendarDay[] = [
  { weekday: "Wed", dayNum: "24", month: "Sep", fullDate: "Today, 24 Sep", badge: "Today", slotsCount: 14 },
  { weekday: "Thu", dayNum: "25", month: "Sep", fullDate: "Tomorrow, 25 Sep", badge: "Tomorrow", slotsCount: 10 },
  { weekday: "Fri", dayNum: "26", month: "Sep", fullDate: "Fri, 26 Sep", slotsCount: 12 },
  { weekday: "Sat", dayNum: "27", month: "Sep", fullDate: "Sat, 27 Sep", slotsCount: 8 },
  { weekday: "Sun", dayNum: "28", month: "Sep", fullDate: "Sun, 28 Sep", slotsCount: 0, isClosed: true },
  { weekday: "Mon", dayNum: "29", month: "Sep", fullDate: "Mon, 29 Sep", slotsCount: 15 },
  { weekday: "Tue", dayNum: "30", month: "Sep", fullDate: "Tue, 30 Sep", slotsCount: 11 },
  { weekday: "Wed", dayNum: "01", month: "Oct", fullDate: "Wed, 01 Oct", slotsCount: 9 },
  { weekday: "Thu", dayNum: "02", month: "Oct", fullDate: "Thu, 02 Oct", slotsCount: 14 },
  { weekday: "Fri", dayNum: "03", month: "Oct", fullDate: "Fri, 03 Oct", slotsCount: 8 },
];

const TIME_SLOTS = {
  Morning: ["09:30 AM", "10:15 AM", "11:00 AM", "11:45 AM"],
  Afternoon: ["02:00 PM", "02:45 PM", "03:30 PM", "04:15 PM"],
  Evening: ["05:00 PM", "05:45 PM", "06:30 PM", "07:15 PM", "08:00 PM"],
};

export default function Step1DateTime({ doctor, onContinue }: Step1DateTimeProps) {
  const [selectedDay, setSelectedDay] = useState<string>(DAYS_SCHEDULE[0].fullDate);
  const [selectedSlot, setSelectedSlot] = useState<string>("05:00 PM");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeDayObj = DAYS_SCHEDULE.find((d) => d.fullDate === selectedDay) || DAYS_SCHEDULE[0];

  const handleNext = () => {
    if (activeDayObj.isClosed) return;
    onContinue(selectedDay, selectedSlot);
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Doctor Summary Card (Mobile & Tablet only) */}
      <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 flex items-center gap-4 lg:hidden shadow-xs">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-800">
          <img
            src={doctor.image || "/images/doctor-hd-3.jpg"}
            alt={doctor.name}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/doctor-hd-3.jpg";
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
              {doctor.name}
            </h3>
            <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
          </div>
          <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
            {doctor.specialty} • {doctor.experience || "12+ Yrs Exp"}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-400" />
              {doctor.location || "Main Specialist Clinic"}
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Rs. {doctor.fee || 2000} Fee
            </span>
          </div>
        </div>
      </div>

      {/* Beautiful Interactive Calendar Section */}
      <div className="space-y-3">
        {/* Calendar Header with Month & Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Select Consultation Day
                </span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                September – October 2026
              </span>
            </div>
          </div>

          {/* Quick Carousel Controls */}
          <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Scroll days left"
                className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Scroll days right"
                className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        {/* Calendar Days Strip (Responsive Swipeable Snap Strip on Mobile, Grid/Carousel on Desktop) */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-1 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {DAYS_SCHEDULE.map((d) => {
            const isSelected = selectedDay === d.fullDate;
            const isClosed = d.isClosed;

            return (
              <button
                key={d.fullDate}
                type="button"
                disabled={isClosed}
                onClick={() => !isClosed && setSelectedDay(d.fullDate)}
                className={`flex-shrink-0 snap-start w-22 sm:w-24 p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between select-none relative group ${
                  isSelected
                    ? "bg-gradient-to-b from-sky-500 via-sky-600 to-sky-700 text-white border-sky-400 shadow-lg shadow-sky-600/30 ring-2 ring-sky-400/50 scale-[1.03]"
                    : isClosed
                    ? "bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed"
                    : "bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 shadow-xs"
                }`}
              >
                {/* Badge (Today / Tomorrow) */}
                {d.badge ? (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-1 ${
                      isSelected
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60"
                    }`}
                  >
                    {d.badge}
                  </span>
                ) : (
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                      isSelected ? "text-sky-100" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {d.weekday}
                  </span>
                )}

                {/* Day Number (Large & Clear) */}
                <div className="my-0.5">
                  <span
                    className={`text-2xl sm:text-3xl font-black tracking-tight ${
                      isSelected ? "text-white" : isClosed ? "text-slate-400" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {d.dayNum}
                  </span>
                  <span
                    className={`text-[11px] font-bold uppercase ml-1 ${
                      isSelected ? "text-sky-100" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {d.month}
                  </span>
                </div>

                {/* Bottom Slots Status */}
                <div className="mt-1 pt-1.5 border-t border-slate-100/60 dark:border-slate-800/60 w-full">
                  {isClosed ? (
                    <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 block truncate">
                      Clinic Closed
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-bold flex items-center justify-center gap-1 truncate ${
                        isSelected
                          ? "text-white"
                          : "text-emerald-600 dark:text-emerald-400 group-hover:text-sky-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? "bg-white" : "bg-emerald-500"
                        }`}
                      />
                      <span>{d.slotsCount} Slots</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex sm:hidden items-center justify-between text-[11px] text-slate-400 px-1">
          <span>👈 Swipe for more days</span>
          <span className="text-sky-600 dark:text-sky-400 font-semibold">{DAYS_SCHEDULE.length} days schedule</span>
        </div>
      </div>

      {/* Time Slots Categorized */}
      <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            <Clock className="w-4 h-4 text-sky-500" />
            <span>Available Time Slots ({selectedDay})</span>
          </label>
          <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
            {activeDayObj.slotsCount > 0 ? `${activeDayObj.slotsCount} slots available` : "No slots"}
          </span>
        </div>

        {activeDayObj.isClosed ? (
          <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-center text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <p className="font-bold">Clinic is closed on Sunday.</p>
            <p className="text-slate-500">Please choose another day from the calendar above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(TIME_SLOTS).map(([category, slots]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {category} Slots
                  </span>
                  <div className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          isSelected
                            ? "border-sky-500 bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-300 ring-2 ring-sky-500 shadow-md shadow-sky-500/10 scale-[1.02]"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-sky-300 hover:bg-sky-50/30 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        )}
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Slot Confirmation Bar */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
            Selected Consultation
          </span>
          <span className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {selectedDay} at {selectedSlot}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={activeDayObj.isClosed}
          className="btn-mockup-blue px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-sky-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span>Continue to Verification</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

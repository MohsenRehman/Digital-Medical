"use client";

import React, { useState } from "react";
import { Search, MapPin, Stethoscope, Sparkles, Hospital } from "lucide-react";

interface SearchFilterBarProps {
  onSearch: (doctor: string, specialty: string, location: string) => void;
}

export default function SearchFilterBar({ onSearch }: SearchFilterBarProps) {
  const [doctorQuery, setDoctorQuery] = useState("");
  const [specialtyQuery, setSpecialtyQuery] = useState("All Specialties");
  const [locationQuery, setLocationQuery] = useState("All Locations");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(doctorQuery, specialtyQuery, locationQuery);
  };

  return (
    <section id="search-filter-section" className="relative -mt-6 sm:-mt-8 z-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-2.5 sm:p-3 rounded-3xl sm:rounded-full shadow-2xl shadow-sky-950/15 border border-sky-100 dark:border-slate-800 transition-all duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            
            {/* Field 1: Doctor / Specialist Keyword */}
            <div className="md:col-span-4 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="For Doctor, Specialist..."
                value={doctorQuery}
                onChange={(e) => setDoctorQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-full bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 border border-transparent dark:border-slate-700/50 transition-all"
              />
            </div>

            {/* Field 2: Hospital / Clinic / Specialty */}
            <div className="md:col-span-4 relative flex items-center">
              <Hospital className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
              <select
                value={specialtyQuery}
                onChange={(e) => setSpecialtyQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-3 rounded-full bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40 border border-transparent dark:border-slate-700/50 appearance-none cursor-pointer transition-all"
              >
                <option value="All Specialties">For Surgeon, Hospital, Specialty</option>
                <option value="Cardiologist">Cardiology</option>
                <option value="Pediatrician">Pediatrics</option>
                <option value="Pulmonologist">Pulmonology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedic">Orthopedics</option>
              </select>
            </div>

            {/* Field 3: Location Dropdown */}
            <div className="md:col-span-2 relative flex items-center">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
              <select
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full pl-10 pr-6 py-3 rounded-full bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40 border border-transparent dark:border-slate-700/50 appearance-none cursor-pointer transition-all"
              >
                <option value="All Locations">United States</option>
                <option value="New York">New York</option>
                <option value="California">California</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
              </select>
            </div>

            {/* Submit Pill Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3 px-5 rounded-full font-bold text-xs uppercase tracking-wider text-white btn-mockup-blue flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

          </div>
        </form>

        {/* Popular Category Shortcuts */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs flex-wrap text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick tags:
          </span>
          {["Cardiologist", "Pediatrician", "Dr. Esita Jabed", "Pulmonologist"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                if (tag.startsWith("Dr.")) {
                  setDoctorQuery(tag);
                  onSearch(tag, specialtyQuery, locationQuery);
                } else {
                  setSpecialtyQuery(tag);
                  onSearch("", tag, locationQuery);
                }
              }}
              className="px-3 py-0.5 rounded-full bg-white/70 dark:bg-slate-800/70 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

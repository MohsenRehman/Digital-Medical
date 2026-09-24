"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Hospital,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react";
import { BorderBeam } from "@/registry/magicui/border-beam";


// ─── Data ────────────────────────────────────────────────────────────────────

const SPECIALTIES = [
  { value: "All Specialties", label: "For Surgeon, Hospital, Specialty" },
  { value: "Cardiology",      label: "Cardiology" },
  { value: "Pediatrics",      label: "Pediatrics" },
  { value: "Pulmonology",     label: "Pulmonology" },
  { value: "Neurology",       label: "Neurology" },
  { value: "Orthopedics",     label: "Orthopedics" },
  { value: "Dermatology",     label: "Dermatology" },
  { value: "Oncology",        label: "Oncology" },
];

const LOCATIONS = [
  { value: "All Locations",  label: "United States" },
  { value: "New York",       label: "New York" },
  { value: "California",     label: "California" },
  { value: "Texas",          label: "Texas" },
  { value: "Florida",        label: "Florida" },
  { value: "Illinois",       label: "Illinois" },
];

// ─── Reusable Custom Dropdown ─────────────────────────────────────────────────

interface DropdownOption { value: string; label: string; }

interface CustomDropdownProps {
  icon: React.ReactNode;
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function CustomDropdown({ icon, options, value, onChange }: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value) ?? options[0];
  const displayLabel =
    selected.value === options[0].value ? options[0].label : selected.label;

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`
          w-full flex items-center gap-2 pl-10 pr-4 py-3 rounded-full
          bg-slate-50 dark:bg-slate-800/80 border
          text-xs sm:text-sm text-left cursor-pointer
          transition-all duration-200 select-none
          ${open
            ? "border-sky-400 ring-2 ring-sky-500/30 text-slate-800 dark:text-slate-100"
            : "border-transparent dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:border-sky-300 hover:text-slate-700 dark:hover:text-slate-200"
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* Leading icon */}
        <span className="absolute left-4 text-slate-400 pointer-events-none">
          {icon}
        </span>

        <span className="flex-1 truncate">{displayLabel}</span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-sky-500" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="
            absolute top-[calc(100%+8px)] left-0 w-full z-50
            bg-white dark:bg-slate-900
            border border-slate-100 dark:border-slate-700/60
            rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-slate-900/40
            overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-150
          "
          role="listbox"
        >
          {/* Header hint */}
          <div className="px-4 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Select an option
            </p>
          </div>

          <ul className="py-1.5 max-h-60 overflow-y-auto">
            {options.map((opt) => {
              const isActive = opt.value === value;
              const isPlaceholder = opt.value === options[0].value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`
                    flex items-center justify-between gap-3
                    px-4 py-2.5 mx-1.5 rounded-xl cursor-pointer
                    text-sm transition-colors duration-100
                    ${isActive
                      ? "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-semibold"
                      : isPlaceholder
                        ? "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }
                  `}
                >
                  <span>{opt.label}</span>
                  {isActive && !isPlaceholder && (
                    <Check className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface SearchFilterBarProps {
  onSearch: (doctor: string, specialty: string, location: string) => void;
}

export default function SearchFilterBar({ onSearch }: SearchFilterBarProps) {
  const [doctorQuery,   setDoctorQuery]   = useState("");
  const [specialtyQuery, setSpecialtyQuery] = useState("All Specialties");
  const [locationQuery,  setLocationQuery]  = useState("All Locations");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(doctorQuery, specialtyQuery, locationQuery);
  };

  return (
    <section id="search-filter-section" className="relative -mt-6 sm:-mt-8 z-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <form
          onSubmit={handleSearchSubmit}
          className="relative bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-2.5 sm:p-3 rounded-3xl sm:rounded-full shadow-2xl shadow-sky-950/15 border border-sky-100 dark:border-slate-800 transition-all duration-300"
        >
          {/* ── Beam clip layer — isolated so it never clips the dropdowns ── */}
          <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
            <BorderBeam
              duration={7}
              delay={0}
              borderWidth={1.5}
              colorFrom="transparent"
              colorVia="#38bdf8"
              colorTo="transparent"
            />
            <BorderBeam
              duration={7}
              delay={3.5}
              borderWidth={1.5}
              colorFrom="transparent"
              colorVia="#0284c7"
              colorTo="transparent"
            />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-2 items-center">

            {/* Field 1: Doctor keyword input */}
            <div className="md:col-span-4 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="For Doctor, Specialist..."
                value={doctorQuery}
                onChange={(e) => setDoctorQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-full bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 border border-transparent dark:border-slate-700/50 hover:border-sky-300 transition-all"
              />
            </div>

            {/* Field 2: Specialty custom dropdown */}
            <div className="md:col-span-4 relative flex items-center">
              <CustomDropdown
                icon={<Hospital className="w-4 h-4" />}
                options={SPECIALTIES}
                value={specialtyQuery}
                onChange={setSpecialtyQuery}
              />
            </div>

            {/* Field 3: Location custom dropdown */}
            <div className="md:col-span-2 relative flex items-center">
              <CustomDropdown
                icon={<MapPin className="w-4 h-4" />}
                options={LOCATIONS}
                value={locationQuery}
                onChange={setLocationQuery}
              />
            </div>

            {/* Submit Button */}
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

        {/* Quick tags */}
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

"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  FileText,
  Search,
  Plus,
  Info,
  X,
  ChevronDown,
  Building2,
  User,
  Calendar,
  Pill,
  Activity,
  Clock,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { FamilyMemberRecord, PatientUser } from "@/lib/types/patient";
import { MedicalRecord } from "./types";
import CustomSelect from "./CustomSelect";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface MedicalRecordsSectionProps {
  patientUser: PatientUser | null;
  familyMembers: FamilyMemberRecord[];
  onOpenBooking: () => void;
  /** Injected by the Doctor module once it is live. Keep [] until then. */
  medicalRecords?: MedicalRecord[];
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
/** Extract a 4-digit year from an ISO visitDate string */
function getYear(isoDate: string): string {
  return isoDate.slice(0, 4);
}

/** Format "2025-03-14" → "14 Mar 2025" */
function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

// ---------------------------------------------------------------------------
// Custom compact select component (matches existing dashboard style)
// ---------------------------------------------------------------------------
interface SelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}
function DashSelect({ value, onChange, options, className = "" }: SelectProps) {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={options}
      className={`w-full ${className}`}
    />
  );
}

// ---------------------------------------------------------------------------
// Filter chip
// ---------------------------------------------------------------------------
interface ChipProps {
  label: string;
  onRemove: () => void;
}
function FilterChip({ label, onRemove }: ChipProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold
      bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300
      border border-sky-200 dark:border-sky-800">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 text-sky-500 hover:text-sky-700 dark:hover:text-sky-200 cursor-pointer"
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Record card (rendered when records are present)
// ---------------------------------------------------------------------------
interface RecordCardProps {
  record: MedicalRecord;
}
function RecordCard({ record }: RecordCardProps) {
  const [expanded, setExpanded] = useState(false);
  const visitLabel = record.visitDateLabel || formatDate(record.visitDate);

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-sky-400/60 dark:hover:border-sky-600/60 transition-all overflow-hidden">
      {/* Card header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4">
        {/* Left: Doctor + Clinic */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <FileText className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{record.doctorName}</h3>
              {record.doctorSpecialty && (
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-full">
                  {record.doctorSpecialty}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              <span className="truncate">{record.clinicName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <User className="w-3.5 h-3.5 flex-shrink-0 text-purple-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">{record.patientName}</span>
              <span className="capitalize text-purple-600 dark:text-purple-400">({record.relation})</span>
            </div>
          </div>
        </div>

        {/* Right: Date + badges */}
        <div className="flex flex-col items-start sm:items-end gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{visitLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {record.hasPrescription && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                <Pill className="w-2.5 h-2.5" />
                Rx
              </span>
            )}
            {record.hasLabReport && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <Activity className="w-2.5 h-2.5" />
                Lab
              </span>
            )}
            {record.followUpAdvised && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Clock className="w-2.5 h-2.5" />
                Follow-up
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Symptoms / Diagnosis summary strip */}
      {(record.symptoms || record.diagnosis) && (
        <div className="mx-3.5 sm:mx-4 mb-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
          {record.symptoms && (
            <div className="flex gap-2 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 w-20 flex-shrink-0">Symptoms</span>
              <span className="text-slate-700 dark:text-slate-300">{record.symptoms}</span>
            </div>
          )}
          {record.diagnosis && (
            <div className="flex gap-2 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 w-20 flex-shrink-0">Diagnosis</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{record.diagnosis}</span>
            </div>
          )}
        </div>
      )}

      {/* Expand / collapse for notes */}
      {record.notes && (
        <div className="border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setExpanded((p) => !p)}
            className="w-full flex items-center justify-between px-4 py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
          >
            <span>Clinical Notes</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          {expanded && (
            <div className="px-4 pb-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {record.notes}
            </div>
          )}
        </div>
      )}

      {/* View full record CTA */}
      <div className="px-4 pb-3 flex justify-end">
        <button className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
          View Full Record →
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------
export default function MedicalRecordsSection({
  patientUser,
  familyMembers,
  onOpenBooking,
  medicalRecords = [],
}: MedicalRecordsSectionProps) {
  const primaryName = patientUser?.name || "Muhammad Ahmed";

  // ── Filter state ──────────────────────────────────────────────────────────
  const [profileFilter, setProfileFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [clinicFilter, setClinicFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // Custom date range (reserved for future date-picker integration)
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const showCustomRange = yearFilter === "custom";

  // ── Derived option lists (computed from actual record data) ───────────────

  // Patient profile options
  const profileOptions = useMemo(() => [
    { value: "all", label: "All Patient Records" },
    { value: "self", label: `${primaryName} — Self` },
    ...familyMembers.map((m) => ({
      value: m.id,
      label: `${m.name} — ${m.relation.charAt(0).toUpperCase() + m.relation.slice(1)}`,
    })),
  ], [primaryName, familyMembers]);

  // Years present in actual records
  const yearOptions = useMemo(() => {
    const years = Array.from(new Set(medicalRecords.map((r) => getYear(r.visitDate)))).sort(
      (a, b) => Number(b) - Number(a),
    );
    return [
      { value: "all", label: "All Time" },
      ...years.map((y) => ({ value: y, label: y })),
      { value: "custom", label: "Custom Range" },
    ];
  }, [medicalRecords]);

  // Clinics present in records (filtered by current profile selection)
  const profileFilteredRecords = useMemo(() => {
    if (profileFilter === "all") return medicalRecords;
    if (profileFilter === "self") {
      return medicalRecords.filter(
        (r) => !r.familyMemberId || r.relation === "self"
      );
    }
    const member = familyMembers.find((m) => m.id === profileFilter);
    if (!member) return medicalRecords;
    return medicalRecords.filter(
      (r) => r.familyMemberId === member.id
    );
  }, [medicalRecords, profileFilter, familyMembers]);

  const clinicOptions = useMemo(() => {
    const clinics = Array.from(new Set(profileFilteredRecords.map((r) => r.clinicName))).sort();
    return [
      { value: "all", label: "All Clinics" },
      ...clinics.map((c) => ({ value: c, label: c })),
    ];
  }, [profileFilteredRecords]);

  // Doctors filtered by currently selected clinic
  const doctorOptions = useMemo(() => {
    const base =
      clinicFilter === "all"
        ? profileFilteredRecords
        : profileFilteredRecords.filter((r) => r.clinicName === clinicFilter);
    const doctors = Array.from(new Set(base.map((r) => r.doctorName))).sort();
    return [
      { value: "all", label: "All Doctors" },
      ...doctors.map((d) => ({ value: d, label: d })),
    ];
  }, [profileFilteredRecords, clinicFilter]);

  // ── Dependent filter reset (clinic→doctor) ────────────────────────────────
  const handleClinicChange = useCallback(
    (val: string) => {
      setClinicFilter(val);
      // Reset doctor if it no longer belongs to the newly selected clinic
      if (val !== "all" && doctorFilter !== "all") {
        const doctorStillValid = profileFilteredRecords.some(
          (r) => r.clinicName === val && r.doctorName === doctorFilter,
        );
        if (!doctorStillValid) setDoctorFilter("all");
      }
    },
    [doctorFilter, profileFilteredRecords],
  );

  // ── Final filtered records ────────────────────────────────────────────────
  const filteredRecords = useMemo(() => {
    return profileFilteredRecords.filter((r) => {
      // Year filter
      if (yearFilter !== "all" && yearFilter !== "custom") {
        if (getYear(r.visitDate) !== yearFilter) return false;
      }
      if (yearFilter === "custom") {
        if (customFrom && r.visitDate < customFrom) return false;
        if (customTo && r.visitDate > customTo) return false;
      }

      // Clinic filter
      if (clinicFilter !== "all" && r.clinicName !== clinicFilter) return false;

      // Doctor filter
      if (doctorFilter !== "all" && r.doctorName !== doctorFilter) return false;

      // Full-text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = [
          r.symptoms,
          r.diagnosis,
          r.notes,
          r.doctorName,
          r.clinicName,
          r.patientName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
    // Sort most-recent first
  }, [profileFilteredRecords, yearFilter, clinicFilter, doctorFilter, searchQuery, customFrom, customTo])
    .slice()
    .sort((a, b) => b.visitDate.localeCompare(a.visitDate));

  // ── Active chips ──────────────────────────────────────────────────────────
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];

  if (yearFilter !== "all") {
    activeChips.push({
      key: "year",
      label: yearFilter === "custom" ? "Custom Range" : yearFilter,
      onRemove: () => { setYearFilter("all"); setCustomFrom(""); setCustomTo(""); },
    });
  }
  if (clinicFilter !== "all") {
    activeChips.push({
      key: "clinic",
      label: clinicFilter,
      onRemove: () => { setClinicFilter("all"); setDoctorFilter("all"); },
    });
  }
  if (doctorFilter !== "all") {
    activeChips.push({
      key: "doctor",
      label: doctorFilter,
      onRemove: () => setDoctorFilter("all"),
    });
  }
  if (searchQuery.trim()) {
    activeChips.push({
      key: "search",
      label: `"${searchQuery.trim()}"`,
      onRemove: () => setSearchQuery(""),
    });
  }

  const hasActiveFilters = activeChips.length > 0;

  const clearAllFilters = () => {
    setYearFilter("all");
    setClinicFilter("all");
    setDoctorFilter("all");
    setSearchQuery("");
    setCustomFrom("");
    setCustomTo("");
  };

  // ── Empty-state logic ─────────────────────────────────────────────────────
  const totalRecords = medicalRecords.length;
  const noRecordsAtAll = totalRecords === 0;
  const hasRecordsButNoMatch = !noRecordsAtAll && filteredRecords.length === 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 sm:space-y-5 animate-fadeInUp">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Clinical History</span>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Medical Records &amp; Clinical Notes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified physician consultation summaries, diagnoses, and treatment plans.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Checkup</span>
        </button>
      </div>

      {/* ── Filter Panel ── */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
        {/* Row 1: Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Patient Profile */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              Patient Profile
            </label>
            <DashSelect
              value={profileFilter}
              onChange={(val) => {
                setProfileFilter(val);
                // Reset downstream filters when profile changes
                setClinicFilter("all");
                setDoctorFilter("all");
              }}
              options={profileOptions}
            />
          </div>

          {/* Year / Date */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              Year / Date
            </label>
            <DashSelect
              value={yearFilter}
              onChange={setYearFilter}
              options={yearOptions}
            />
          </div>

          {/* Clinic */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              Clinic
            </label>
            <DashSelect
              value={clinicFilter}
              onChange={handleClinicChange}
              options={clinicOptions}
            />
          </div>

          {/* Doctor */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              Doctor
            </label>
            <DashSelect
              value={doctorFilter}
              onChange={setDoctorFilter}
              options={doctorOptions}
            />
          </div>
        </div>

        {/* Custom date range row (only when "Custom Range" is selected) */}
        {showCustomRange && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Date Range
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-xs text-slate-400 font-semibold">to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        )}

        {/* Row 2: Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, diagnosis, medicines, doctor, clinic..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl
              bg-slate-50 dark:bg-slate-800/50
              border border-slate-200 dark:border-slate-700
              text-slate-900 dark:text-white placeholder:text-slate-400
              focus:outline-none focus:ring-1 focus:ring-sky-500
              transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {activeChips.map((chip) => (
              <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
            ))}
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 underline underline-offset-2 cursor-pointer ml-1"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* ── Results area ── */}
      {noRecordsAtAll ? (
        /* Empty state A — no records exist yet */
        <div className="p-8 sm:p-12 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            No medical records available yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your clinical history, physician notes, and laboratory findings will appear here in
            real-time as attending doctors complete your clinic visits.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 text-left max-w-md">
            <Info className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <span>
              <strong>Ready for Doctor Module:</strong> After attending appointments at Digital
              Medical clinics, your certified doctor will electronically sign clinical charts
              directly to this tab.
            </span>
          </div>
        </div>
      ) : hasRecordsButNoMatch ? (
        /* Empty state B — records exist but current filters match nothing */
        <div className="p-8 sm:p-10 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No records found for these filters
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Try changing the year, clinic, doctor, or search term.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-3.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Records list */
        <>
          {/* Result count */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-slate-800 dark:text-white font-bold">{filteredRecords.length}</span>
              {" "}
              {filteredRecords.length === 1 ? "record" : "records"} found
            </p>
          </div>

          {/* Record cards */}
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

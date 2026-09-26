"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Calendar,
  Stethoscope,
  Building2,
  ShieldCheck,
  User,
  Search,
  Download,
  Eye,
  Activity,
  Plus,
  Info,
} from "lucide-react";
import { FamilyMemberRecord, PatientUser } from "@/lib/types/patient";

interface MedicalRecordsSectionProps {
  patientUser: PatientUser | null;
  familyMembers: FamilyMemberRecord[];
  onOpenBooking: () => void;
}

export default function MedicalRecordsSection({
  patientUser,
  familyMembers,
  onOpenBooking,
}: MedicalRecordsSectionProps) {
  const primaryName = patientUser?.name || "Muhammad Ahmed";
  const [selectedProfile, setSelectedProfile] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const profileOptions = useMemo(() => {
    return [
      { id: "all", name: "All Patient Records" },
      { id: primaryName.toLowerCase(), name: `${primaryName} (Self)` },
      ...familyMembers.map((m) => ({
        id: m.name.toLowerCase(),
        name: `${m.name} (${m.relation})`,
      })),
    ];
  }, [primaryName, familyMembers]);

  // Future-ready medical records structure (Empty in current stage until Doctor module integrates)
  const medicalRecords: any[] = [];

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Clinical History</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Medical Records &amp; Clinical Notes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified physician consultation summaries, diagnoses, and treatment plans.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Checkup</span>
        </button>
      </div>

      {/* Filter and Profile Selection */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Patient Profile:
          </span>
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            {profileOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, doctor, diagnosis..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Future-Ready Integration Clean State */}
      {medicalRecords.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No medical records available yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your clinical history, physician notes, and laboratory findings will appear here in real-time as attending doctors complete your clinic visits.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 text-left max-w-md">
            <Info className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <span>
              <strong>Ready for Doctor Module:</strong> After attending appointments at Digital Medical clinics, your certified doctor will electronically sign clinical charts directly to this tab.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

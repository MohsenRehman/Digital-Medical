"use client";

import React, { useState, useMemo } from "react";
import {
  Activity,
  Calendar,
  Building2,
  Stethoscope,
  Info,
  Search,
  Download,
  Eye,
  FileCheck,
  Plus,
} from "lucide-react";
import { FamilyMemberRecord, PatientUser } from "@/lib/types/patient";

interface LabReportsSectionProps {
  patientUser: PatientUser | null;
  familyMembers: FamilyMemberRecord[];
  onOpenBooking: () => void;
}

export default function LabReportsSection({
  patientUser,
  familyMembers,
  onOpenBooking,
}: LabReportsSectionProps) {
  const primaryName = patientUser?.name || "Muhammad Ahmed";
  const [selectedProfile, setSelectedProfile] = useState("all");

  const profileOptions = useMemo(() => {
    return [
      { id: "all", name: "All Diagnostic Reports" },
      { id: primaryName.toLowerCase(), name: `${primaryName} (Self)` },
      ...familyMembers.map((m) => ({
        id: m.name.toLowerCase(),
        name: `${m.name} (${m.relation})`,
      })),
    ];
  }, [primaryName, familyMembers]);

  const labReports: any[] = [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 gap-3.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[11px] font-semibold mb-1">
            <Activity className="w-3 h-3 text-sky-600 dark:text-sky-400" />
            <span>Diagnostic Pathology &amp; Imaging</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Lab Reports &amp; Scans
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pathology tests, echocardiograms, blood work, and radiology diagnostic imaging results.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book Diagnostic Consultation</span>
        </button>
      </div>

      {/* Filter */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Profile:
          </span>
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-sky-500 transition-colors"
          >
            {profileOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">0 pending lab orders</span>
      </div>

      {/* Empty State */}
      {labReports.length === 0 && (
        <div className="p-10 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No lab reports available yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Diagnostic tests ordered by your clinic physicians (e.g. ECG, blood analysis, imaging) will be digitally delivered to this section upon laboratory verification.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 text-left max-w-md">
            <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>
              <strong className="font-semibold text-slate-900 dark:text-white">Verified Laboratories:</strong> Reports are authenticated with digital signatures directly from participating Digital Medical pathology centers.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

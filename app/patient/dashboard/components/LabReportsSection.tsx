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
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Diagnostic Pathology &amp; Imaging</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Lab Reports &amp; Scans
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pathology tests, echocardiograms, blood work, and radiology diagnostic imaging results.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Diagnostic Consultation</span>
        </button>
      </div>

      {/* Filter */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Profile:
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

        <span className="text-xs text-slate-400 font-mono">0 pending lab orders</span>
      </div>

      {/* Empty State */}
      {labReports.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Activity className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No lab reports available yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Diagnostic tests ordered by your clinic physicians (e.g. ECG, blood analysis, imaging) will be digitally delivered to this section upon laboratory verification.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 text-left max-w-md">
            <Info className="w-4 h-4 text-cyan-500 flex-shrink-0" />
            <span>
              <strong>Verified Laboratories:</strong> Reports are authenticated with digital signatures directly from participating Digital Medical pathology centers.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  AlertCircle,
  FileText,
  Calendar,
  Phone,
  ShieldCheck,
  Building2,
  ArrowRight,
  Eye,
  Plus,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { PatientProfile } from "@/lib/types/doctor";

export default function DoctorPatientsPage() {
  const { patients, activeClinic } = useDoctor();
  const [searchQuery, setSearchQuery] = useState("");
  const [allergyFilter, setAllergyFilter] = useState("all");

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Search
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const mName = patient.name.toLowerCase().includes(q);
        const mPhone = patient.phone.includes(q);
        const mId = patient.id.toLowerCase().includes(q);
        const mCondition = patient.chronicConditions.some((c) => c.toLowerCase().includes(q));
        if (!mName && !mPhone && !mId && !mCondition) return false;
      }
      // Allergy filter
      if (allergyFilter === "allergies_only" && patient.allergies.length === 0) {
        return false;
      }
      return true;
    });
  }, [patients, searchQuery, allergyFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Patient Registry & Records
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Authorized clinical records for patients registered at {activeClinic.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            {patients.length} Registered Patients
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone (03XX), ID (PAT-000123)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={allergyFilter}
            onChange={(e) => setAllergyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Patients</option>
            <option value="allergies_only">Patients with Documented Allergies</option>
          </select>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {patient.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>
                      {patient.age} Years • {patient.gender}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold">
                      {patient.id}
                    </span>
                  </div>
                </div>

                {patient.guardianName && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Dependent Child
                  </span>
                )}
              </div>

              {/* Guardian Info if child */}
              {patient.guardianName && (
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300">
                  Guardian: <strong>{patient.guardianName}</strong> ({patient.guardianRelation})
                </div>
              )}

              {/* Clinical summary bullets */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{patient.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Visit: {patient.lastVisitDate || "New Patient"}</span>
                </div>

                {patient.allergies.length > 0 ? (
                  <div className="flex items-start gap-2 text-rose-700 dark:text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span className="font-medium truncate">
                      Allergies: {patient.allergies.join(", ")}
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    ✓ No known drug allergies (NKDA)
                  </div>
                )}

                {patient.chronicConditions.length > 0 && (
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                    Conditions: {patient.chronicConditions.join(", ")}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Blood: {patient.bloodGroup || "Unknown"}</span>
              <Link
                href={`/doctor/patients/${patient.id}`}
                className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-700 dark:text-sky-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Open Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

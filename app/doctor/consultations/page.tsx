"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Stethoscope,
  Search,
  Calendar,
  User,
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  FileText,
  Eye,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import PrescriptionPreviewModal from "@/components/doctor/PrescriptionPreviewModal";
import { DigitalPrescription } from "@/lib/types/doctor";

function DoctorConsultationsContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const { consultations, appointments, prescriptions, activeClinic } = useDoctor();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(() => {
    if (statusParam && ["all", "in_progress", "draft", "completed"].includes(statusParam)) {
      return statusParam;
    }
    return "all";
  });
  const [selectedPrescription, setSelectedPrescription] = useState<DigitalPrescription | null>(null);

  // Sync statusFilter if URL search params change
  useEffect(() => {
    if (statusParam && ["all", "in_progress", "draft", "completed"].includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  }, [statusParam]);

  const filteredConsultations = consultations.filter((enc) => {
    if (statusFilter !== "all" && enc.status !== statusFilter) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        enc.patientName.toLowerCase().includes(q) ||
        enc.diagnosis.toLowerCase().includes(q) ||
        enc.chiefComplaint.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Clinical Consultations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active encounters, clinical notes, and finalized diagnoses at {activeClinic.name}.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          {consultations.length} Consultations Recorded
        </span>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient, diagnosis, symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="all">All Encounter Statuses</option>
          <option value="in_progress">In Progress (Active)</option>
          <option value="draft">Drafts Saved</option>
          <option value="completed">Completed / Signed</option>
        </select>
      </div>

      {/* Consultations List */}
      <div className="space-y-4">
        {filteredConsultations.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No consultations found. Start a consultation from the live queue or appointments list.
          </div>
        ) : (
          filteredConsultations.map((enc) => {
            const rx = prescriptions.find((p) => p.consultationId === enc.id);

            return (
              <div
                key={enc.id}
                className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-300 dark:hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {enc.patientName}
                        </h3>
                        <span className="font-mono text-xs text-sky-600 dark:text-sky-400 font-semibold">
                          {enc.patientProfileId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Date: {enc.date} • Attending: {enc.doctorName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                        enc.status === "completed"
                          ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200"
                          : "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200"
                      }`}
                    >
                      {enc.status.replace("_", " ")}
                    </span>
                    <Link
                      href={`/doctor/consultations/${enc.appointmentId}`}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <span>{enc.status === "completed" ? "View Encounter" : "Resume Workspace"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Chief Complaint</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                      {enc.chiefComplaint || "Routine follow-up"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Diagnosis & ICD-10</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {enc.diagnosis || "Under Evaluation"} {enc.icd10Code && `(${enc.icd10Code})`}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Vitals Recorded</span>
                    <p className="font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                      BP: {enc.vitals.bpSystolic || "-"}/{enc.vitals.bpDiastolic || "-"} mmHg • HR:{" "}
                      {enc.vitals.heartRate || "-"} bpm
                    </p>
                  </div>
                </div>

                {rx && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-sky-600" />
                      <span>Prescription {rx.prescriptionNumber} generated</span>
                    </span>
                    <button
                      onClick={() => setSelectedPrescription(rx)}
                      className="text-sky-600 hover:underline font-semibold"
                    >
                      Preview Rx Document →
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <PrescriptionPreviewModal
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
}

export default function DoctorConsultationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading consultations...</div>}>
      <DoctorConsultationsContent />
    </Suspense>
  );
}


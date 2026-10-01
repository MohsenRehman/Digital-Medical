"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Building2,
  Printer,
  Download,
  Eye,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import DoctorKpiCards from "@/components/doctor/DoctorKpiCards";
import AppointmentTable from "@/components/doctor/AppointmentTable";
import LiveQueueCard from "@/components/doctor/LiveQueueCard";
import RecentClinicalActivity from "@/components/doctor/RecentClinicalActivity";
import PrescriptionPreviewModal from "@/components/doctor/PrescriptionPreviewModal";
import { DocumentType } from "@/lib/doctor/medicalDocumentTemplates";

export default function DoctorDashboardOverview() {
  const { doctor, activeClinic, prescriptions, consultations } = useDoctor();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeDocType, setActiveDocType] = useState<DocumentType>("prescription");

  const latestPrescription = prescriptions[0] || null;
  const latestEncounter = consultations[0] || null;

  const handleOpenDocument = (type: DocumentType) => {
    setActiveDocType(type);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Compact Doctor Identity Header with Print / PDF Quick Actions */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 md:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Doctor Dashboard
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                <span>{doctor.name || "Dr. Tariq Mahmood"}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {doctor.specialty || "Cardiologist"}
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{activeClinic.name || "City Medical Center"}</span>
              </span>
            </div>
          </div>

          {/* Right: Quick PDF Actions & Doctor Profile Avatar */}
          <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0 flex-wrap">
            {/* Direct PDF / Print Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenDocument("prescription")}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-xs"
                title="Preview printable prescription PDF"
              >
                <Eye className="w-3.5 h-3.5 text-sky-600" />
                <span>Preview PDF</span>
              </button>

              <button
                onClick={() => handleOpenDocument("prescription")}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:flex items-center gap-1.5 transition-colors shadow-xs"
                title="Download official A4 PDF document"
              >
                <Download className="w-3.5 h-3.5 text-sky-600" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => handleOpenDocument("prescription")}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Print prescription directly"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Prescription</span>
              </button>
            </div>

            {/* Avatar */}
            <div className="relative pl-1">
              <img
                src={
                  doctor.avatarUrl ||
                  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop"
                }
                alt={doctor.name || "Dr. Tariq Mahmood"}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
                title="Online"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. KPI Cards (Primary Visual Element) */}
      <section>
        <DoctorKpiCards />
      </section>

      {/* 3. Today's Appointments */}
      <section>
        <AppointmentTable limit={6} />
      </section>

      {/* 4. Waiting Queue / Current Patients */}
      <section>
        <LiveQueueCard />
      </section>

      {/* 5. Recent Clinical Activity */}
      <section>
        <RecentClinicalActivity />
      </section>

      {/* Medical Document Print / Preview Modal */}
      {modalOpen && (
        <PrescriptionPreviewModal
          prescription={latestPrescription}
          encounter={latestEncounter}
          initialDocType={activeDocType}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
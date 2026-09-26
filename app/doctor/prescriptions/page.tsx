"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Printer,
  Download,
  Send,
  Eye,
  Calendar,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import PrescriptionPreviewModal from "@/components/doctor/PrescriptionPreviewModal";
import { DigitalPrescription } from "@/lib/types/doctor";

export default function DoctorPrescriptionsPage() {
  const { prescriptions, activeClinic } = useDoctor();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<DigitalPrescription | null>(null);

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        rx.patientName.toLowerCase().includes(q) ||
        rx.prescriptionNumber.toLowerCase().includes(q) ||
        rx.diagnosis.toLowerCase().includes(q)
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
            Digital Prescriptions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Authorized electronic prescriptions, Rx formulations, and pharmacy dispatch history.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          {prescriptions.length} Issued Prescriptions
        </span>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Rx number (e.g. RX-2026), patient name, or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Rx Number</th>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Diagnosis</th>
                <th className="py-3.5 px-4">Medications</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No prescriptions found matching your query.
                  </td>
                </tr>
              ) : (
                filteredPrescriptions.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                      {rx.prescriptionNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <Link
                        href={`/doctor/patients/${rx.patientProfileId}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-sky-600"
                      >
                        {rx.patientName}
                      </Link>
                      <p className="text-[11px] text-slate-500">
                        {rx.patientAge} yrs • {rx.patientGender} • {rx.patientPhone}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {rx.date}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {rx.diagnosis}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                        {rx.medicines.length} Medicines
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedPrescription(rx)}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview & Print</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PrescriptionPreviewModal
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
}

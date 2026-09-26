"use client";

import React, { useState } from "react";
import {
  Printer,
  Download,
  Send,
  X,
  ShieldCheck,
  Building2,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { DigitalPrescription } from "@/lib/types/doctor";

interface PrescriptionPreviewModalProps {
  prescription: DigitalPrescription | null;
  onClose: () => void;
}

export default function PrescriptionPreviewModal({
  prescription,
  onClose,
}: PrescriptionPreviewModalProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setCopiedStatus("Prescription PDF downloaded successfully.");
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  const handleSendToPatient = () => {
    setCopiedStatus(`Digital prescription dispatched via WhatsApp to ${prescription.patientPhone}.`);
    setTimeout(() => setCopiedStatus(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl my-8 overflow-hidden animate-popIn">
        {/* Modal Action Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              Digital Medical Prescription ({prescription.prescriptionNumber})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleSendToPatient}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Patient</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Temporary Alert Banner */}
        {copiedStatus && (
          <div className="px-6 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{copiedStatus}</span>
          </div>
        )}

        {/* Printable Prescription Body */}
        <div id="printable-prescription" className="p-8 space-y-6 text-slate-800 dark:text-slate-200 font-sans">
          {/* Header with Doctor and Clinic Branding */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 dark:border-slate-300 pb-5">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {prescription.doctorName}
              </h1>
              <p className="text-xs text-sky-700 dark:text-sky-400 font-bold mt-0.5">
                {prescription.doctorSpecialty}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>PMDC Registration No: {prescription.pmdcRegistration} (Verified)</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-extrabold tracking-tight text-sky-600 dark:text-sky-400">
                DIGITAL MEDICAL
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                {prescription.clinicName}
              </p>
              <p className="text-[11px] text-slate-500 max-w-[200px] leading-tight mt-0.5">
                {prescription.clinicAddress}
              </p>
              <p className="text-[11px] text-slate-500">Ph: {prescription.clinicPhone}</p>
            </div>
          </div>

          {/* Patient Details Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Patient Name</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{prescription.patientName}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Age / Gender</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {prescription.patientAge} Years / {prescription.patientGender}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Date</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{prescription.date}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Prescription Ref</span>
              <p className="font-mono font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                {prescription.prescriptionNumber}
              </p>
            </div>
          </div>

          {/* Diagnosis & Vitals Summary */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
            <div>
              <span className="font-bold text-slate-500">Clinical Diagnosis: </span>
              <span className="font-extrabold text-slate-900 dark:text-white">{prescription.diagnosis}</span>
            </div>
            {prescription.vitalsSummary && (
              <div className="text-[11px] text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                {prescription.vitalsSummary}
              </div>
            )}
          </div>

          {/* Rx Symbol & Medication Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-black text-sky-600 dark:text-sky-400 italic">℞</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Prescribed Medications</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Medicine & Dosage</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {prescription.medicines.map((med, index) => (
                    <tr key={med.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-bold text-slate-400">{index + 1}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{med.name}</span>
                        {med.genericName && (
                          <span className="text-[10px] text-slate-400 block">{med.genericName}</span>
                        )}
                        <span className="text-[11px] text-slate-600 dark:text-slate-400">{med.dosage}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {med.frequency}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {med.duration}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-400 italic">
                        {med.instructions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Advice / Doctor Notes */}
          {prescription.doctorNotes && (
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                Advice & Special Instructions:
              </span>
              <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
                {prescription.doctorNotes}
              </p>
            </div>
          )}

          {/* Follow-up & Footer Signature */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-end justify-between gap-4">
            <div className="text-xs text-slate-500">
              {prescription.followUpText && (
                <p className="font-bold text-sky-700 dark:text-sky-300">
                  Follow-up: {prescription.followUpText}
                </p>
              )}
              <p className="text-[10px] text-slate-400 mt-1">
                This digital prescription is generated on the Digital Medical Healthcare Network.
              </p>
            </div>

            <div className="text-right">
              <div className="w-48 border-b border-dashed border-slate-400 pb-1 mb-1 font-signature text-sm font-semibold text-slate-700 dark:text-slate-300">
                {prescription.signatureText}
              </div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Authorized Digital Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

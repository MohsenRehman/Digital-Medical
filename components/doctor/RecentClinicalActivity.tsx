"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  FlaskConical,
  UserCheck,
  FileText,
  Clock,
  ArrowRight,
  Printer,
  Download,
  Eye,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import PrescriptionPreviewModal from "@/components/doctor/PrescriptionPreviewModal";
import { DocumentType } from "@/lib/doctor/medicalDocumentTemplates";

interface ClinicalActivityItem {
  id: string;
  type: "consultation" | "lab" | "checkin" | "prescription";
  docType: DocumentType;
  title: string;
  patientName: string;
  patientId: string;
  patientMeta: string;
  details: string;
  timestamp: string;
  badgeLabel: string;
  badgeClass: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  actionText: string;
}

export default function RecentClinicalActivity() {
  const { consultations, prescriptions } = useDoctor();
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Curate realistic clinical activity items backed by active mock context
  const activities: ClinicalActivityItem[] = [
    {
      id: "act-01",
      type: "consultation",
      docType: "consultation",
      title: "Consultation Concluded & Notes Filed",
      patientName: "Kalsoom Akhtar",
      patientId: "PAT-000124",
      patientMeta: "61 yrs • Female",
      details: "Primary Essential Hypertension & Dyslipidemia • Tab. Rosuvastatin titrated to 10mg HS",
      timestamp: "15 mins ago (08:55 AM)",
      badgeLabel: "Completed Encounter",
      badgeClass: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      actionText: "Preview Clinical Summary",
    },
    {
      id: "act-02",
      type: "lab",
      docType: "lab_report",
      title: "Biochemistry Lab Result Available",
      patientName: "Ahmed Khan",
      patientId: "PAT-000123",
      patientMeta: "34 yrs • Male",
      details: "Fasting Lipid Profile • LDL: 142 mg/dL (Abnormal Flag) • Total Chol: 218 mg/dL",
      timestamp: "28 mins ago (09:15 AM)",
      badgeLabel: "Abnormal Result",
      badgeClass: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
      icon: FlaskConical,
      iconBg: "bg-amber-50 dark:bg-amber-950/50",
      iconColor: "text-amber-600 dark:text-amber-400",
      actionText: "Preview Lab Report",
    },
    {
      id: "act-03",
      type: "checkin",
      docType: "visit_summary",
      title: "Patient Checked In at Reception Desk",
      patientName: "Fatima Bibi",
      patientId: "PAT-000124",
      patientMeta: "68 yrs • Female",
      details: "Token A-20 seated in Waiting Area • Priority: Urgent (Bilateral ankle swelling & SOB)",
      timestamp: "35 mins ago (09:18 AM)",
      badgeLabel: "Queued in Lounge",
      badgeClass: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/60",
      icon: UserCheck,
      iconBg: "bg-sky-50 dark:bg-sky-950/50",
      iconColor: "text-sky-600 dark:text-sky-400",
      actionText: "Preview Visit Summary",
    },
    {
      id: "act-04",
      type: "prescription",
      docType: "prescription",
      title: "Digital Prescription Issued & Signed",
      patientName: "Rashid Minhas",
      patientId: "PAT-000123",
      patientMeta: "52 yrs • Male",
      details: "Rx #DM-9088 • Tab. Amlodipine 5mg + Tab. Valsartan 80mg OD • Signed by Dr. Tariq Mahmood",
      timestamp: "1 hour ago (08:25 AM)",
      badgeLabel: "Digital Rx Ready",
      badgeClass: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/60",
      icon: FileText,
      iconBg: "bg-indigo-50 dark:bg-indigo-950/50",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      actionText: "Preview & Print Rx",
    },
  ];

  const handleOpenDoc = (type: DocumentType) => {
    setSelectedDocType(type);
    setModalOpen(true);
  };

  const activePrescription = prescriptions[0] || null;
  const activeEncounter = consultations[0] || null;

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Clinical Activity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live updates on encounters, issued prescriptions, and diagnostic reports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => handleOpenDoc("prescription")}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-xs"
              title="Open Printable Medical Document System"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600" />
              <span>Print Center</span>
            </button>
            <Link
              href="/doctor/consultations"
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 group ml-1"
            >
              <span>All Encounters</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Activity Timeline List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-4 md:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`p-2.5 rounded-2xl ${item.iconBg} ${item.iconColor} flex-shrink-0 mt-0.5 shadow-xs`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">
                        {item.patientName}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        ({item.patientId})
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        • {item.patientMeta}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeClass}`}
                      >
                        {item.badgeLabel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {item.details}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Right: PDF Preview & Print Action */}
                <div className="self-end md:self-center flex-shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDoc(item.docType)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>{item.actionText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Medical Document Viewer Modal */}
      {modalOpen && (
        <PrescriptionPreviewModal
          prescription={activePrescription}
          encounter={activeEncounter}
          initialDocType={selectedDocType || "prescription"}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

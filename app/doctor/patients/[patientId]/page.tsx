"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  ArrowLeft,
  AlertCircle,
  Pill,
  Activity,
  FileText,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Clock,
  FlaskConical,
  RotateCcw,
  CheckCircle2,
  Lock,
  Plus,
  Play,
  Printer,
  Eye,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import PrescriptionPreviewModal from "@/components/doctor/PrescriptionPreviewModal";
import { DigitalPrescription } from "@/lib/types/doctor";

export default function DoctorPatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.patientId as string;

  const {
    getPatientById,
    consultations,
    prescriptions,
    labOrders,
    followUps,
    appointments,
    activeClinic,
  } = useDoctor();

  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "consultations" | "prescriptions" | "labs" | "followups" | "timeline"
  >("overview");

  const [consentRequested, setConsentRequested] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<DigitalPrescription | null>(null);

  const patient = getPatientById(patientId);

  if (!patient) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Patient Record Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No patient record matching ID &quot;{patientId}&quot; was found within this clinic&apos;s authorized tenant scope.
        </p>
        <Link
          href="/doctor/patients"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Patients Registry</span>
        </Link>
      </div>
    );
  }

  // Related patient records
  const patientConsultations = consultations.filter((c) => c.patientProfileId === patient.id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientProfileId === patient.id);
  const patientLabs = labOrders;
  const patientFollowUps = followUps.filter((f) => f.patientProfileId === patient.id);
  const patientAppointments = appointments.filter((a) => a.patientProfileId === patient.id);

  // Latest encounter info
  const latestConsultation = patientConsultations[0];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/doctor/patients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Patient Registry</span>
        </Link>
      </div>

      {/* Patient Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-sky-500/20">
            {patient.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {patient.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {patient.id}
              </span>
              {patient.guardianName && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  Child Dependent
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
              <span>{patient.age} Years</span>
              <span>•</span>
              <span className="capitalize">{patient.gender}</span>
              <span>•</span>
              <span>Blood: {patient.bloodGroup || "O+"}</span>
              <span>•</span>
              <span>Phone: {patient.phone}</span>
            </p>

            {patient.guardianName && (
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                Guardian: <strong>{patient.guardianName}</strong> ({patient.guardianRelation}) • Contact: {patient.phone}
              </p>
            )}
          </div>
        </div>

        {/* Quick Encounter Action */}
        <div className="flex items-center gap-2">
          {patientAppointments.length > 0 && (
            <Link
              href={`/doctor/consultations/${patientAppointments[0].id}`}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Encounter</span>
            </Link>
          )}
        </div>
      </div>

      {/* Tenant Privacy / Cross-Clinic Records Banner (Section 24) */}
      {patient.crossClinicRecordsAvailable && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3 text-indigo-900 dark:text-indigo-200">
            <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Additional Cross-Clinic Medical Records Available</p>
              <p className="text-indigo-700 dark:text-indigo-300 text-[11px]">
                External clinical visits found at {patient.externalClinicName}. Under Digital Medical privacy regulations, access requires patient OTP or explicit consent.
              </p>
            </div>
          </div>

          <button
            onClick={() => setConsentRequested(true)}
            disabled={consentRequested}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-emerald-600 text-white font-semibold text-xs transition-colors whitespace-nowrap"
          >
            {consentRequested ? "✓ Consent Verification Sent" : "Request Patient Permission"}
          </button>
        </div>
      )}

      {/* CRITICAL CLINICAL SUMMARY BAR (Section 12) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Allergies */}
        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs mb-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Documented Allergies</span>
          </div>
          {patient.allergies.length > 0 ? (
            <ul className="text-xs text-rose-700 dark:text-rose-400 font-medium space-y-0.5">
              {patient.allergies.map((a, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              No known drug allergies (NKDA)
            </p>
          )}
        </div>

        {/* Current Medications */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs mb-1.5">
            <Pill className="w-4 h-4 text-amber-600" />
            <span>Current Medications</span>
          </div>
          {patient.currentMedications.length > 0 ? (
            <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-0.5 font-medium">
              {patient.currentMedications.map((m, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">No active chronic prescriptions</p>
          )}
        </div>

        {/* Known Conditions & Latest Diagnosis */}
        <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50">
          <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-xs mb-1.5">
            <Activity className="w-4 h-4 text-sky-600" />
            <span>Chronic Conditions & Diagnosis</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {patient.chronicConditions.join(", ") || "None documented"}
          </p>
          <div className="text-[11px] text-slate-500 mt-1 pt-1 border-t border-sky-200/40">
            Latest Diagnosis: <strong>{latestConsultation?.diagnosis || "Pending Evaluation"}</strong>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-2 md:space-x-4 overflow-x-auto pb-1">
          {[
            { id: "overview", label: "Overview" },
            { id: "timeline", label: "Clinical Timeline" },
            { id: "consultations", label: `Consultations (${patientConsultations.length})` },
            { id: "prescriptions", label: `Prescriptions (${patientPrescriptions.length})` },
            { id: "labs", label: `Lab Reports (${patientLabs.length})` },
            { id: "followups", label: `Follow-ups (${patientFollowUps.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* TAB CONTENT PANELS */}
      {/* 1. OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Patient Demographic & Clinical Summary
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Registered Phone</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{patient.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Blood Group</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{patient.bloodGroup || "Not Tested"}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Primary Clinic</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{activeClinic.name}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Emergency Contact</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {patient.emergencyContact
                    ? `${patient.emergencyContact.name} (${patient.emergencyContact.relation}) - ${patient.emergencyContact.phone}`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Consultations & Clinical Notes
            </h3>
            {latestConsultation ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>Encounter Date: {latestConsultation.date}</span>
                  <span className="text-sky-600 font-mono text-[11px]">{latestConsultation.icd10Code}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {latestConsultation.clinicalNotes}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No previous consultations recorded at this clinic.</p>
            )}
          </div>
        </div>
      )}

      {/* 2. CLINICAL TIMELINE */}
      {activeTab === "timeline" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Chronological Medical Event History
          </h3>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {/* Event 1 */}
            <div className="relative">
              <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-sky-600 ring-4 ring-white dark:ring-slate-900" />
              <div className="text-xs">
                <span className="text-sky-600 font-bold">24 Sep 2026</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                  Cardiology Consultation (In-Progress) — Dr. Tariq Mahmood
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Encounter initiated. BP: 138/86 mmHg, Review of 24hr Holter monitor findings.
                </p>
              </div>
            </div>

            {/* Event 2 */}
            <div className="relative">
              <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
              <div className="text-xs">
                <span className="text-slate-400 font-semibold">22 Sep 2026</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                  Lab Report: Fasting Lipid Profile Available
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Total Cholesterol: 218 mg/dL (High), LDL: 142 mg/dL. Reviewed by cardiology desk.
                </p>
              </div>
            </div>

            {/* Event 3 */}
            <div className="relative">
              <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900" />
              <div className="text-xs">
                <span className="text-slate-400 font-semibold">18 Sep 2026</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                  Prescription Issued (RX-2026-0918-01)
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Tab. Amlodipine 5mg OD + Tab. Rosuvastatin 10mg HS.
                </p>
              </div>
            </div>

            {/* Event 4 */}
            <div className="relative">
              <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-400 ring-4 ring-white dark:ring-slate-900" />
              <div className="text-xs">
                <span className="text-slate-400 font-semibold">05 Sep 2026</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                  Initial OPD Visit & Electrocardiogram
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  12-Lead ECG showed Sinus Rhythm, Voltage criteria for mild LVH.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONSULTATIONS */}
      {activeTab === "consultations" && (
        <div className="space-y-4">
          {patientConsultations.map((enc) => (
            <div
              key={enc.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-sky-600">{enc.date}</span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {enc.diagnosis}
                  </h4>
                </div>
                <Link
                  href={`/doctor/consultations/${enc.appointmentId}`}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold text-xs"
                >
                  Open Encounter
                </Link>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{enc.clinicalNotes}</p>
            </div>
          ))}
        </div>
      )}

      {/* 4. PRESCRIPTIONS */}
      {activeTab === "prescriptions" && (
        <div className="space-y-4">
          {patientPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4"
            >
              <div>
                <span className="font-mono text-xs font-bold text-sky-600">{rx.prescriptionNumber}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{rx.diagnosis}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Issued on {rx.date} • {rx.medicines.length} Medicines Prescribed
                </p>
              </div>

              <button
                onClick={() => setSelectedPrescription(rx)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View & Print</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5. LAB REPORTS */}
      {activeTab === "labs" && (
        <div className="space-y-3">
          {patientLabs.map((lab) => (
            <div
              key={lab.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{lab.testName}</span>
                  {lab.abnormalFlag && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                      Abnormal Flag
                    </span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{lab.resultSummary || "Awaiting analyzer result"}</p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Ordered: {lab.orderedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. FOLLOW-UPS */}
      {activeTab === "followups" && (
        <div className="space-y-3">
          {patientFollowUps.map((fup) => (
            <div
              key={fup.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Due Date: {fup.followUpDate}</span>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">{fup.reason}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 capitalize">
                {fup.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Prescription Preview Modal */}
      <PrescriptionPreviewModal
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
}

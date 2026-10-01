"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Printer,
  Download,
  Share2,
  X,
  ShieldCheck,
  Building2,
  CheckCircle2,
  FileText,
  Stethoscope,
  FlaskConical,
  Receipt,
  HeartPulse,
  User,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  DigitalPrescription,
  ClinicalEncounter,
  LabOrder,
  PrescriptionMedicine,
} from "@/lib/types/doctor";
import {
  DocumentType,
  parseMedicineForPatient,
  generateVerificationQrSvg,
} from "@/lib/doctor/medicalDocumentTemplates";

export interface MedicalDocumentViewerProps {
  prescription?: DigitalPrescription | null;
  encounter?: ClinicalEncounter | null;
  initialDocType?: DocumentType;
  onClose: () => void;
}

export default function MedicalDocumentViewer({
  prescription,
  encounter,
  initialDocType = "prescription",
  onClose,
}: MedicalDocumentViewerProps) {
  const [docType, setDocType] = useState<DocumentType>(initialDocType);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const printContainerRef = useRef<HTMLDivElement>(null);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Derive consolidated clinical data from actual context
  const patientName = prescription?.patientName || encounter?.patientName || "Ahmed Khan";
  const patientAge = prescription?.patientAge || (encounter ? 42 : 34);
  const patientGender = prescription?.patientGender || "Male";
  const patientPhone = prescription?.patientPhone || "0300-1234567";
  const patientId = prescription?.patientProfileId || encounter?.patientProfileId || "PAT-000123";
  const visitDate = prescription?.date || encounter?.date || "30 September 2026";
  const prescriptionId = prescription?.prescriptionNumber || (encounter ? `RX-2026-${encounter.id.slice(-4)}` : "RX-2026-0007");

  const doctorName = prescription?.doctorName || encounter?.doctorName || "Dr. Tariq Mahmood";
  const doctorSpecialty = prescription?.doctorSpecialty || "Consultant Cardiologist & Electrophysiologist";
  const pmdcNumber = prescription?.pmdcRegistration || "48291-P";
  const clinicName = prescription?.clinicName || "City Medical Center";
  const clinicAddress = prescription?.clinicAddress || "University Road, Peshawar";
  const clinicPhone = prescription?.clinicPhone || "091-5843210";

  const diagnosis = prescription?.diagnosis || encounter?.diagnosis || "Essential (primary) hypertension, Stage 1; Dyslipidemia";
  const chiefComplaint = encounter?.chiefComplaint || "";
  const symptoms = encounter?.symptoms || [];

  // Vitals
  const vitals = encounter?.vitals || {
    bpSystolic: 138,
    bpDiastolic: 86,
    heartRate: 74,
    temperature: 98.4,
    spo2: 98,
    weightKg: 78,
  };

  const hasVitals = vitals && (vitals.bpSystolic || vitals.heartRate || vitals.temperature || vitals.spo2 || vitals.weightKg);

  // Medicines
  const rawMedicines: PrescriptionMedicine[] = prescription?.medicines || encounter?.medications || [
    {
      id: "med-1",
      name: "Tab. Amlodipine 5mg",
      genericName: "Amlodipine Besylate",
      dosage: "5 mg",
      frequency: "OD (1-0-0) Once Daily",
      duration: "30 Days",
      instructions: "Take in morning after breakfast",
      route: "oral",
    },
    {
      id: "med-2",
      name: "Tab. Rosuvastatin 10mg",
      genericName: "Rosuvastatin Calcium",
      dosage: "10 mg",
      frequency: "OD (0-0-1) Once Daily at Night",
      duration: "30 Days",
      instructions: "Take at bedtime with water",
      route: "oral",
    },
    {
      id: "med-3",
      name: "Tab. Valsartan 80mg",
      genericName: "Valsartan",
      dosage: "80 mg",
      frequency: "OD (1-0-0) Morning",
      duration: "30 Days",
      instructions: "Combine with morning dose for blood pressure control",
      route: "oral",
    },
  ];

  const parsedMedicines = rawMedicines.map(parseMedicineForPatient);

  // Investigations
  const labOrders: LabOrder[] = encounter?.labOrders || [
    {
      id: "lab-01",
      testName: "Lipid Profile",
      category: "Biochemistry",
      priority: "routine",
      status: "ordered",
      notes: "Follow laboratory preparation instructions (10-12 hours overnight fasting).",
      orderedAt: "2026-09-30",
    },
  ];

  // Doctor's Instructions
  const doctorInstructions = prescription?.doctorNotes || encounter?.clinicalNotes ||
    "Low sodium diet (< 5g salt daily). Brisk walking for 30 minutes daily. Maintain a daily morning home blood pressure log. Avoid NSAID painkillers without consultation.";

  // Follow-up
  const followUpDate = encounter?.followUpDate || "15 October 2026";
  const followUpReason = encounter?.followUpReason || "Review blood pressure response and medication tolerance";

  // Secure verification QR code URL (no sensitive patient data inside QR)
  const verificationUrl = `https://verify.digitalmedical.pk/rx/${encodeURIComponent(prescriptionId)}?auth=${encodeURIComponent(pmdcNumber)}`;
  const qrSvg = generateVerificationQrSvg(verificationUrl, 88);

  // Print execution: renders exclusively the clean A4 document in an isolated frame
  const handlePrint = () => {
    const printContent = document.getElementById("a4-medical-document");
    if (!printContent) {
      window.print();
      return;
    }

    const printIframe = document.createElement("iframe");
    printIframe.style.position = "fixed";
    printIframe.style.right = "0";
    printIframe.style.bottom = "0";
    printIframe.style.width = "0";
    printIframe.style.height = "0";
    printIframe.style.border = "none";
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${docType.toUpperCase()} - ${patientName} (${prescriptionId})</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              margin: 0;
              padding: 0;
              font-size: 10.5pt;
              line-height: 1.45;
            }
            .page-container {
              width: 100%;
              max-width: 100%;
              margin: 0 auto;
            }
            .break-avoid {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border-bottom: 1px solid #e2e8f0;
              padding: 8px 10px;
              text-align: left;
            }
            th {
              background-color: #f8fafc;
              font-weight: 700;
              font-size: 9pt;
              text-transform: uppercase;
              color: #475569;
            }
          </style>
        </head>
        <body>
          <div class="page-container">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      printIframe.contentWindow?.focus();
      printIframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(printIframe);
      }, 2000);
    }, 400);
  };

  const handleDownloadPdf = () => {
    setActionNotice("Opening print dialog. Select 'Save as PDF' to download your official A4 medical document.");
    setTimeout(() => {
      handlePrint();
      setTimeout(() => setActionNotice(null), 4000);
    }, 500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${patientName}, your official Digital Medical ${docType.replace("_", " ")} (${prescriptionId}) from ${doctorName} at ${clinicName} is available: ${verificationUrl}`
    );
    window.open(`https://api.whatsapp.com/send?phone=${patientPhone.replace(/[^0-9]/g, "")}&text=${text}`, "_blank");
    setActionNotice(`Prescription link prepared for WhatsApp delivery to ${patientPhone}.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        // Close modal if clicking on the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="document-preview-title"
    >
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl my-4 sm:my-6 flex flex-col max-h-[95vh] overflow-hidden animate-popIn">
        
        {/* ============================================================== */}
        {/* TOP MODAL HEADER WITH PROMINENT [ X ] CLOSE BUTTON */}
        {/* ============================================================== */}
        <div className="p-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-shrink-0 z-20">
          
          {/* Left: Branding & Modal Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block leading-none">
                Digital Medical
              </span>
              <h2
                id="document-preview-title"
                className="text-base font-bold text-slate-900 dark:text-white leading-tight mt-0.5"
              >
                Document Preview
              </h2>
            </div>
          </div>

          {/* Right Action Bar: Print, Download PDF, WhatsApp, and PROMINENT Close [ X ] */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Secondary Action: Print */}
            <button
              onClick={handlePrint}
              aria-label="Print prescription"
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Primary Action: Download PDF */}
            <button
              onClick={handleDownloadPdf}
              aria-label="Download prescription PDF"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            {/* Secondary Action: WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              aria-label="Share prescription on WhatsApp"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs hidden sm:flex items-center gap-1.5 transition-colors shadow-xs"
              title="Share digital copy via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

            {/* PROMINENT CLOSE BUTTON: Min 40x40px, High Visibility, Accessible */}
            <button
              onClick={onClose}
              aria-label="Close document preview"
              title="Close (Esc)"
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 active:scale-95 shadow-xs"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Secondary Sub-Bar: Document Type Navigation Tabs (English Only) */}
        <div className="px-4 sm:px-6 py-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none flex-shrink-0">
          <div className="flex items-center gap-1.5">
            {[
              { type: "prescription", label: "Prescription", icon: Stethoscope },
              { type: "consultation", label: "Consultation Summary", icon: FileText },
              { type: "lab_referral", label: "Lab Referral", icon: FlaskConical },
              { type: "lab_report", label: "Lab Report", icon: HeartPulse },
              { type: "invoice", label: "Invoice / Receipt", icon: Receipt },
              { type: "visit_summary", label: "Visit Summary", icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = docType === tab.type;
              return (
                <button
                  key={tab.type}
                  onClick={() => setDocType(tab.type as DocumentType)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isSelected
                      ? "bg-sky-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden lg:block whitespace-nowrap">
            {docType === "prescription" && `Official Digital Prescription • ${prescriptionId}`}
            {docType === "consultation" && "Clinical Encounter Record"}
            {docType === "lab_referral" && "Investigation Requisition"}
            {docType === "lab_report" && "Diagnostic Pathology Report"}
            {docType === "invoice" && "Clinical Billing Receipt"}
            {docType === "visit_summary" && "Patient Discharge Summary"}
          </div>
        </div>

        {/* Temporary Alert Banner */}
        {actionNotice && (
          <div className="px-5 py-2.5 bg-sky-50 dark:bg-sky-950/80 border-b border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* DOCUMENT PREVIEW AREA: Centered, A4 proportions, Neutral BG */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-100 dark:bg-slate-950 scrollbar-thin">
          
          {/* Printable A4 Paper Document */}
          <div
            id="a4-medical-document"
            ref={printContainerRef}
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-12 shadow-xl rounded-sm border border-slate-200 relative flex flex-col justify-between"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            }}
          >
            <div>
              {/* ============================================================== */}
              {/* 5. HEADER (Doctor Credentials on Left, Clinic on Right) */}
              {/* ============================================================== */}
              <div className="border-b-2 border-slate-900 pb-5">
                <div className="flex justify-between items-start gap-4">
                  
                  {/* Left: Doctor Information */}
                  <div className="space-y-1">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {doctorName}
                    </h1>
                    <p className="text-xs font-bold text-sky-800 uppercase tracking-wide">
                      {doctorSpecialty}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium">
                      MBBS (KMC) • FCPS (Cardiology) • Fellowship NICVD • MRCP (UK)
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-800 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
                      <span>PMDC Registration No: {pmdcNumber} • Verified Practitioner</span>
                    </div>
                  </div>

                  {/* Right: Clinic Information */}
                  <div className="text-right space-y-0.5">
                    <div className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
                      DIGITAL MEDICAL
                    </div>
                    <h2 className="text-xs font-bold text-slate-800">
                      {clinicName}
                    </h2>
                    <p className="text-[11px] text-slate-600 max-w-[220px] leading-tight">
                      {clinicAddress}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-700">
                      Phone: {clinicPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* 6. PRESCRIPTION TITLE & COMPACT METADATA */}
              {/* ============================================================== */}
              <div className="mt-4 pb-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <span className="font-black text-slate-900 uppercase tracking-wider text-xs sm:text-sm">
                  {docType === "prescription" && "OFFICIAL DIGITAL PRESCRIPTION"}
                  {docType === "consultation" && "CLINICAL CONSULTATION ENCOUNTER SUMMARY"}
                  {docType === "lab_referral" && "LABORATORY INVESTIGATION REQUISITION"}
                  {docType === "lab_report" && "DIAGNOSTIC PATHOLOGY REPORT"}
                  {docType === "invoice" && "CLINICAL SERVICES OFFICIAL INVOICE & RECEIPT"}
                  {docType === "visit_summary" && "PATIENT VISIT SUMMARY & DISCHARGE GUIDELINES"}
                </span>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-700">
                  <span>Prescription ID: <strong className="text-slate-900">{prescriptionId}</strong></span>
                  <span>•</span>
                  <span>Date: <strong className="text-slate-900">{visitDate}</strong></span>
                </div>
              </div>

              {/* ============================================================== */}
              {/* 7. PATIENT INFORMATION SECTION (Clean 2-column/grid) */}
              {/* ============================================================== */}
              <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200/80 pb-1.5 mb-3">
                  PATIENT INFORMATION
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Patient Name
                    </span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                      {patientName}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Patient ID
                    </span>
                    <p className="font-bold font-mono text-slate-900 mt-0.5">
                      {patientId}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Age / Gender
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {patientAge} years / {patientGender}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Phone
                    </span>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {patientPhone}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Consultation Room
                    </span>
                    <p className="font-medium text-slate-800 mt-0.5">
                      Suite 304
                    </p>
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* DOCUMENT CONTENT ACCORDING TO TYPE */}
              {/* ============================================================== */}

              {/* 1. PRESCRIPTION */}
              {docType === "prescription" && (
                <div className="space-y-6">
                  {/* 8. CLINICAL SUMMARY */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      CLINICAL SUMMARY
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="md:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Diagnosis / Assessment:
                        </span>
                        <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                          {diagnosis}
                        </p>
                      </div>

                      {hasVitals && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">
                            Recorded Vitals:
                          </span>
                          <p className="text-[11px] font-mono font-medium text-slate-700 mt-0.5">
                            BP: {vitals.bpSystolic}/{vitals.bpDiastolic} mmHg • HR: {vitals.heartRate} bpm • SpO2: {vitals.spo2}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 9 & 10. PRESCRIBED MEDICINES (MOST IMPORTANT SECTION - Professional Table) */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 border-b-2 border-slate-800 pb-1.5">
                      <span className="text-2xl font-serif font-black text-slate-900 italic">℞</span>
                      <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-xs sm:text-sm">
                        PRESCRIBED MEDICINES
                      </h3>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                          <tr>
                            <th className="py-2.5 px-3 w-8">#</th>
                            <th className="py-2.5 px-3">Medicine</th>
                            <th className="py-2.5 px-3">Strength</th>
                            <th className="py-2.5 px-3">Dose</th>
                            <th className="py-2.5 px-3">Frequency</th>
                            <th className="py-2.5 px-3">Duration</th>
                            <th className="py-2.5 px-3">Instructions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {parsedMedicines.map((med, index) => (
                            <tr key={index} className="break-avoid hover:bg-slate-50/50">
                              <td className="py-3 px-3 font-bold text-slate-400">{index + 1}</td>
                              <td className="py-3 px-3">
                                <span className="font-extrabold text-slate-900 block">{med.medicineName}</span>
                                {med.genericName && (
                                  <span className="text-[10px] text-slate-500 italic block">{med.genericName}</span>
                                )}
                              </td>
                              <td className="py-3 px-3 font-semibold text-slate-800">{med.strength}</td>
                              <td className="py-3 px-3 font-medium text-slate-700">{med.dose}</td>
                              <td className="py-3 px-3">
                                <span className="font-bold text-slate-900 block">{med.frequency}</span>
                                <span className="text-[10px] font-mono text-slate-400">{med.shorthandDoc}</span>
                              </td>
                              <td className="py-3 px-3 font-semibold text-slate-800">{med.duration}</td>
                              <td className="py-3 px-3 font-medium text-slate-700 leading-tight">
                                {med.timing}
                                {med.instructions && med.instructions !== med.timing && (
                                  <span className="block text-[11px] text-slate-500 italic mt-0.5">{med.instructions}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 11. INVESTIGATIONS (Only show when investigations exist) */}
                  {labOrders && labOrders.length > 0 && (
                    <div className="break-avoid p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-sky-700" />
                        <span>INVESTIGATIONS</span>
                      </h3>
                      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                            <tr>
                              <th className="py-2 px-3">Test</th>
                              <th className="py-2 px-3">Instructions / Reason</th>
                              <th className="py-2 px-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {labOrders.map((test, i) => (
                              <tr key={i}>
                                <td className="py-2.5 px-3 font-bold text-slate-900">{test.testName}</td>
                                <td className="py-2.5 px-3 text-slate-600">{test.notes || "Follow laboratory preparation instructions."}</td>
                                <td className="py-2.5 px-3 text-right">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                                    {test.status.replace("_", " ")}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 12. DOCTOR'S INSTRUCTIONS (Only show when instructions exist) */}
                  {doctorInstructions && (
                    <div className="break-avoid p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-1.5">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-600" />
                        <span>DOCTOR&apos;S INSTRUCTIONS</span>
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {doctorInstructions}
                      </p>
                    </div>
                  )}

                  {/* 13. FOLLOW-UP (Only show when follow-up exists) */}
                  {followUpDate && (
                    <div className="break-avoid p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                          FOLLOW-UP
                        </span>
                        <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                          Next Visit: {followUpDate}
                        </p>
                        {followUpReason && (
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Reason: {followUpReason}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. CONSULTATION SUMMARY */}
              {docType === "consultation" && (
                <div className="space-y-5 text-xs">
                  {chiefComplaint && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                        Chief Complaint & Presenting Illness
                      </h3>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {chiefComplaint}
                      </p>
                      {symptoms.length > 0 && (
                        <p className="text-[11px] text-slate-500 mt-2">
                          <strong>Associated Symptoms:</strong> {symptoms.join(", ")}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="p-4 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                      Clinical Physical & Vitals Examination
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Blood Pressure</span>
                        <span className="font-extrabold text-sm text-slate-900">{vitals.bpSystolic}/{vitals.bpDiastolic} mmHg</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Heart Rate</span>
                        <span className="font-extrabold text-sm text-slate-900">{vitals.heartRate} bpm</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Temperature</span>
                        <span className="font-extrabold text-sm text-slate-900">{vitals.temperature} °F</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">SpO2</span>
                        <span className="font-extrabold text-sm text-slate-900">{vitals.spo2} %</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                      Clinical Assessment & Treatment Plan
                    </h3>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {diagnosis}. Patient evaluated for cardiac risk factors. Medical therapy adjusted as indicated with follow-up scheduled.
                    </p>
                  </div>
                </div>
              )}

              {/* 3. LAB REFERRAL */}
              {docType === "lab_referral" && (
                <div className="space-y-5 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                      Clinical Indication for Investigation
                    </h3>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      Evaluation of cardiovascular risk profile and therapeutic drug monitoring.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">Test Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Priority</th>
                          <th className="p-3">Preparation Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {labOrders.map((test, i) => (
                          <tr key={i}>
                            <td className="p-3 font-bold text-slate-400">{i + 1}</td>
                            <td className="p-3 font-extrabold text-slate-900">{test.testName}</td>
                            <td className="p-3 text-slate-600">{test.category}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px] uppercase">
                                {test.priority}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600">
                              {test.category === "Biochemistry" ? "10-12 hours overnight fasting" : "Routine preparation"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. LAB REPORT */}
              {docType === "lab_report" && (
                <div className="space-y-5 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">Laboratory Order Reference: LAB-2026-9901</p>
                      <p className="text-[11px] text-slate-500">Specimen Collected: 30 September 2026 07:45 AM • Reported: 30 September 2026 09:15 AM</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-slate-200 text-slate-800 font-bold text-xs uppercase">
                      Verified
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                        <tr>
                          <th className="p-3">Parameter / Test</th>
                          <th className="p-3">Result Value</th>
                          <th className="p-3">Units</th>
                          <th className="p-3">Biological Reference Range</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-3 font-bold text-slate-900">Total Serum Cholesterol</td>
                          <td className="p-3 font-black text-slate-900 text-sm">218</td>
                          <td className="p-3 text-slate-600">mg/dL</td>
                          <td className="p-3 text-slate-600">&lt; 200 mg/dL</td>
                          <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-900 font-bold">HIGH</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-900">LDL Cholesterol (Direct)</td>
                          <td className="p-3 font-black text-slate-900 text-sm">142</td>
                          <td className="p-3 text-slate-600">mg/dL</td>
                          <td className="p-3 text-slate-600">&lt; 100 mg/dL</td>
                          <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-900 font-bold">HIGH</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-900">HDL Cholesterol</td>
                          <td className="p-3 font-black text-slate-900 text-sm">44</td>
                          <td className="p-3 text-slate-600">mg/dL</td>
                          <td className="p-3 text-slate-600">&gt; 40 mg/dL</td>
                          <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">NORMAL</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-900">Serum Triglycerides</td>
                          <td className="p-3 font-black text-slate-900 text-sm">160</td>
                          <td className="p-3 text-slate-600">mg/dL</td>
                          <td className="p-3 text-slate-600">&lt; 150 mg/dL</td>
                          <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-900 font-bold">BORDERLINE</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. INVOICE / RECEIPT */}
              {docType === "invoice" && (
                <div className="space-y-5 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">Invoice Reference: INV-2026-0924-019</p>
                      <p className="text-[11px] text-slate-500">Transaction Date: 30 September 2026 09:05 AM</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-black text-xs uppercase">
                      PAID
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">Clinical Service Description</th>
                          <th className="p-3 text-right">Unit Fee</th>
                          <th className="p-3 text-right">Qty</th>
                          <th className="p-3 text-right">Total (PKR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-3 font-bold text-slate-400">1</td>
                          <td className="p-3 font-bold text-slate-900">Consultant Cardiologist Clinical Consultation Fee</td>
                          <td className="p-3 text-right font-mono">2,500</td>
                          <td className="p-3 text-right">1</td>
                          <td className="p-3 text-right font-bold font-mono">2,500</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-400">2</td>
                          <td className="p-3 font-bold text-slate-900">12-Lead Diagnostic ECG with Report Interpretation</td>
                          <td className="p-3 text-right font-mono">1,000</td>
                          <td className="p-3 text-right">1</td>
                          <td className="p-3 text-right font-bold font-mono">1,000</td>
                        </tr>
                      </tbody>
                      <tfoot className="border-t-2 border-slate-900 bg-slate-50 font-bold">
                        <tr>
                          <td colSpan={4} className="p-3 text-right uppercase">Total Amount Paid (PKR)</td>
                          <td className="p-3 text-right text-base text-slate-900 font-black font-mono">PKR 3,500</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* 6. PATIENT VISIT SUMMARY */}
              {docType === "visit_summary" && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="font-bold text-slate-900 uppercase text-[11px] mb-1">
                      Reason for Today&apos;s Visit
                    </h3>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      Routine clinical review for blood pressure control and assessment of medication tolerance. Diagnosis confirmed as Essential Hypertension Stage 1.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h3 className="font-bold text-slate-900 uppercase text-[11px] mb-2">
                      Key Takeaways & Home Care
                    </h3>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-700 leading-relaxed">
                      <li>Take blood pressure medication every morning after breakfast.</li>
                      <li>Take cholesterol medication once daily in the evening at bedtime.</li>
                      <li>Reduce sodium intake: avoid processed foods, pickles, and salty snacks.</li>
                      <li>Engage in 30 minutes of moderate aerobic exercise (brisk walk) daily.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-300 bg-slate-50">
                    <h3 className="font-bold uppercase text-[11px] mb-1 text-slate-900">
                      Emergency Warning Signs
                    </h3>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      Seek immediate emergency medical care if you experience sudden severe chest pressure radiating to the arm or jaw, severe acute breathlessness, or dizziness.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================== */}
            {/* 14. SIGNATURE / VERIFICATION & 15. FOOTER */}
            {/* ============================================================== */}
            <div className="break-avoid pt-6 mt-8 border-t-2 border-slate-900">
              <div className="flex flex-col sm:flex-row items-end justify-between gap-6">
                
                {/* Left: Verification QR Code & URL */}
                <div className="flex items-center gap-3">
                  <div
                    className="p-1 rounded-lg border border-slate-300 bg-white flex-shrink-0"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                  <div className="space-y-0.5 text-[10px] text-slate-500">
                    <p className="font-bold text-slate-800 uppercase tracking-wide">
                      Scan to Verify Document
                    </p>
                    <p className="font-mono text-[9px] text-slate-600 break-all max-w-[220px]">
                      verify.digitalmedical.pk/rx/{prescriptionId}
                    </p>
                    <p className="text-[9px] text-slate-400">
                      Official Medical Document • PMDC #{pmdcNumber}
                    </p>
                  </div>
                </div>

                {/* Right: Doctor Authentication & Signature */}
                <div className="text-right space-y-1">
                  <div className="font-serif italic text-lg sm:text-xl font-bold text-slate-900 border-b border-dashed border-slate-400 pb-1 px-4 inline-block">
                    {doctorName}
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {doctorName}
                  </p>
                  <p className="text-[10px] text-slate-600 font-medium">
                    {doctorSpecialty}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    PMDC Registration No: {pmdcNumber}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Generated: {visitDate} at 09:30 AM
                  </p>
                </div>
              </div>

              {/* 15. FOOTER: Professional Clean Metadata */}
              <div className="mt-5 pt-2.5 border-t border-slate-200 text-center text-[10px] text-slate-500 flex flex-wrap justify-between items-center gap-2">
                <span>Digital Medical • Official Digital Prescription</span>
                <span className="font-mono font-semibold">Prescription ID: {prescriptionId}</span>
                <span>Page 1 of 1</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

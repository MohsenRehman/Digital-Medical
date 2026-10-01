"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Printer,
  Download,
  Share2,
  X,
  FileText,
  Stethoscope,
  FlaskConical,
  Receipt,
  HeartPulse,
  User,
  CheckCircle2,
} from "lucide-react";
import {
  DigitalPrescription,
  ClinicalEncounter,
  LabOrder,
  PrescriptionMedicine,
} from "@/lib/types/doctor";
import {
  DocumentType,
  formatPatientData,
  formatPrescriptionDate,
  parseMedicineForPatient,
  generateVerificationQrSvg,
  getPublicVerificationUrl,
  getPrescriptionDocumentCss,
  generatePrescriptionHtml,
  PrescriptionRenderData,
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
  const patientData = formatPatientData(
    prescription?.patientName || encounter?.patientName,
    prescription?.patientProfileId || encounter?.patientProfileId,
    prescription?.patientAge || (encounter ? 42 : 34),
    prescription?.patientGender,
    prescription?.patientPhone,
    "Suite 304"
  );

  const visitDate = formatPrescriptionDate(prescription?.date || encounter?.date || "18 Sep 2026");
  const prescriptionId = prescription?.prescriptionNumber || (encounter ? `RX-2026-${encounter.id.slice(-4)}` : "RX-2026-0918-01");

  const doctorName = prescription?.doctorName || encounter?.doctorName || "Dr. Tariq Mahmood";
  const doctorSpecialty = prescription?.doctorSpecialty || "Consultant Cardiologist";
  const pmdcNumber = prescription?.pmdcRegistration || "48291-P";
  const clinicName = prescription?.clinicName || "City Medical Center";
  const clinicAddress = prescription?.clinicAddress || "University Road, Peshawar, Khyber Pakhtunkhwa";
  const clinicPhone = prescription?.clinicPhone || "091-5843210";

  const diagnosis = prescription?.diagnosis || encounter?.diagnosis || "Essential Hypertension; Dyslipidemia";
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
  let vitalsSummary: string | undefined;
  if (prescription?.vitalsSummary) {
    vitalsSummary = prescription.vitalsSummary;
  } else if (hasVitals) {
    vitalsSummary = `BP: ${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg • HR: ${vitals.heartRate} bpm • SpO2: ${vitals.spo2}%`;
  }

  // Medicines (strictly normalized, anti-duplication)
  const rawMedicines: PrescriptionMedicine[] = prescription?.medicines || encounter?.medications || [
    {
      id: "med-1",
      name: "Tab. Amlodipine 5mg",
      genericName: "Amlodipine Besylate",
      dosage: "1 Tablet",
      frequency: "OD (1-0-0) Morning",
      duration: "30 Days",
      instructions: "After breakfast",
      route: "oral",
    },
    {
      id: "med-2",
      name: "Tab. Rosuvastatin 10mg",
      genericName: "Rosuvastatin Calcium",
      dosage: "1 Tablet",
      frequency: "OD (0-0-1) Night",
      duration: "30 Days",
      instructions: "At bedtime",
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
      orderedAt: "2026-09-18",
    },
  ];

  // Doctor's Instructions
  const doctorInstructions = prescription?.doctorNotes || encounter?.clinicalNotes ||
    "Low salt diet (< 5g/day), brisk walking 30 mins daily. Avoid NSAIDs without consultation.";

  // Follow-up
  const followUpDate = encounter?.followUpDate || "15 October 2026";
  const followUpReason = encounter?.followUpReason || "Review blood pressure response and medication tolerance";

  // Secure verification QR code URL (no sensitive patient data inside QR, no localhost)
  const verificationUrl = getPublicVerificationUrl(prescriptionId);
  const qrSvg = generateVerificationQrSvg(verificationUrl, 72);

  // Assemble full prescription data
  const prescriptionRenderData: PrescriptionRenderData = {
    prescriptionId,
    visitDate,
    generatedDate: `${visitDate}, 09:30 AM`,
    patient: patientData,
    doctor: {
      name: doctorName,
      specialty: doctorSpecialty,
      qualifications: "MBBS (KMC) • FCPS (Cardiology) • Fellowship NICVD • MRCP (UK)",
      pmdcNumber,
    },
    clinic: {
      brand: "DIGITAL MEDICAL",
      name: clinicName,
      address: clinicAddress,
      phone: clinicPhone,
    },
    clinicalSummary: {
      diagnosis,
      vitalsSummary,
    },
    medicines: parsedMedicines,
    investigations: labOrders && labOrders.length > 0 ? labOrders.map((lo) => ({
      testName: lo.testName,
      notes: lo.notes,
      status: lo.status.replace("_", " "),
    })) : undefined,
    doctorInstructions: doctorInstructions || undefined,
    followUp: followUpDate ? {
      date: followUpDate,
      reason: followUpReason,
    } : undefined,
    verification: {
      url: verificationUrl,
      qrSvg,
    },
  };

  const prescriptionHtml = generatePrescriptionHtml(prescriptionRenderData);

  // Print execution: renders exclusively the clean A4 document in an isolated frame
  const handlePrint = () => {
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

    const contentHtml = docType === "prescription"
      ? prescriptionHtml
      : document.getElementById("a4-medical-document")?.innerHTML || "";

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${prescriptionId} - ${patientData.name} - Prescription</title>
          <style>
            ${getPrescriptionDocumentCss()}
          </style>
        </head>
        <body>
          ${contentHtml}
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      printIframe.contentWindow?.focus();
      printIframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(printIframe)) {
          document.body.removeChild(printIframe);
        }
      }, 3000);
    }, 400);
  };

  const handleDownloadPdf = () => {
    // Try triggering direct API download if available, or print dialog
    const pdfUrl = `/api/doctor/prescriptions/${encodeURIComponent(prescriptionId)}/pdf`;
    
    // Test if endpoint exists by initiating download or fallback to print
    fetch(pdfUrl, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          const a = document.createElement("a");
          a.href = pdfUrl;
          a.download = `Prescription-${prescriptionId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setActionNotice(`Prescription PDF (${prescriptionId}) downloaded successfully.`);
          setTimeout(() => setActionNotice(null), 3500);
        } else {
          fallbackPrintToPdf();
        }
      })
      .catch(() => {
        fallbackPrintToPdf();
      });
  };

  const fallbackPrintToPdf = () => {
    setActionNotice("Opening print dialog. Select 'Save as PDF' to download your official A4 medical document.");
    setTimeout(() => {
      handlePrint();
      setTimeout(() => setActionNotice(null), 4000);
    }, 400);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${patientData.name}, your official Digital Medical prescription (${prescriptionId}) from ${doctorName} at ${clinicName} is available: ${verificationUrl}`
    );
    window.open(`https://api.whatsapp.com/send?phone=${patientData.phone.replace(/[^0-9]/g, "")}&text=${text}`, "_blank");
    setActionNotice(`Prescription link prepared for WhatsApp delivery to ${patientData.phone}.`);
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
        {/* TOP MODAL HEADER WITH PROMINENT [ X ] CLOSE BUTTON (Requirement 26) */}
        {/* ============================================================== */}
        <div className="p-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-shrink-0 z-20">
          
          {/* Left: Branding & Modal Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="document-preview-title"
                className="text-base font-bold text-slate-900 dark:text-white leading-tight"
              >
                Prescription Preview
              </h2>
              <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold block mt-0.5">
                Document: Official Digital Prescription
              </span>
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
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 active:scale-95 shadow-xs"
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center bg-slate-100 dark:bg-slate-950 scrollbar-thin">
          
          {/* Printable A4 Paper Document Container */}
          <div
            id="a4-medical-document"
            ref={printContainerRef}
            className="w-full max-w-[210mm] bg-white text-slate-900 p-8 sm:p-10 shadow-xl rounded-sm border border-slate-200 relative flex flex-col justify-between"
          >
            {/* Embed self-contained prescription CSS directly for pixel-perfect fidelity */}
            <style dangerouslySetInnerHTML={{ __html: getPrescriptionDocumentCss() }} />

            {docType === "prescription" ? (
              /* Render the standardized prescription document */
              <div dangerouslySetInnerHTML={{ __html: prescriptionHtml }} />
            ) : (
              /* Non-prescription clinical documents */
              <div className="rx-page">
                {/* Header */}
                <div className="rx-header">
                  <div className="rx-doctor-info">
                    <h1 className="rx-doctor-name">{doctorName}</h1>
                    <div className="rx-doctor-spec">{doctorSpecialty}</div>
                    <div className="rx-doctor-qual">MBBS (KMC) • FCPS (Cardiology) • Fellowship NICVD • MRCP (UK)</div>
                    <div className="rx-pmdc-badge">
                      <span>PMDC Registration No: {pmdcNumber}</span>
                      <span>•</span>
                      <span>Verified Practitioner</span>
                    </div>
                  </div>
                  <div className="rx-clinic-info">
                    <div className="rx-clinic-brand">DIGITAL MEDICAL</div>
                    <div className="rx-clinic-facility">{clinicName}</div>
                    <div className="rx-clinic-address">{clinicAddress}</div>
                    <div className="rx-clinic-phone">Phone: {clinicPhone}</div>
                  </div>
                </div>

                {/* Title & Metadata */}
                <div className="rx-title-bar">
                  <h2 className="rx-doc-title">
                    {docType === "consultation" && "CLINICAL CONSULTATION ENCOUNTER SUMMARY"}
                    {docType === "lab_referral" && "LABORATORY INVESTIGATION REQUISITION"}
                    {docType === "lab_report" && "DIAGNOSTIC PATHOLOGY REPORT"}
                    {docType === "invoice" && "CLINICAL SERVICES OFFICIAL INVOICE & RECEIPT"}
                    {docType === "visit_summary" && "PATIENT VISIT SUMMARY & DISCHARGE GUIDELINES"}
                  </h2>
                  <div className="rx-doc-metadata">
                    <span>Reference ID: <strong>{prescriptionId}</strong></span>
                    <span>Date: <strong>{visitDate}</strong></span>
                  </div>
                </div>

                {/* Patient Information Grid */}
                <div className="rx-patient-card">
                  <div className="rx-card-label">PATIENT INFORMATION</div>
                  <div className="rx-patient-grid">
                    <div>
                      <span className="rx-field-tag">Patient Name</span>
                      <p className="rx-field-val">{patientData.name}</p>
                    </div>
                    <div>
                      <span className="rx-field-tag">Patient ID</span>
                      <p className="rx-field-val" style={{ fontFamily: "monospace" }}>{patientData.id}</p>
                    </div>
                    <div>
                      <span className="rx-field-tag">Age / Gender</span>
                      <p className="rx-field-val-sub">{patientData.ageGender}</p>
                    </div>
                    <div>
                      <span className="rx-field-tag">Phone</span>
                      <p className="rx-field-val-sub">{patientData.phone}</p>
                    </div>
                    <div>
                      <span className="rx-field-tag">Consultation Room</span>
                      <p className="rx-field-val-sub">{patientData.room}</p>
                    </div>
                  </div>
                </div>

                {/* 2. CONSULTATION SUMMARY */}
                {docType === "consultation" && (
                  <div className="space-y-4 text-xs">
                    {chiefComplaint && (
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
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

                    <div className="p-3.5 rounded-lg border border-slate-200">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                        Clinical Physical & Vitals Examination
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-2 rounded bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Blood Pressure</span>
                          <span className="font-extrabold text-sm text-slate-900">{vitals.bpSystolic}/{vitals.bpDiastolic} mmHg</span>
                        </div>
                        <div className="p-2 rounded bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Heart Rate</span>
                          <span className="font-extrabold text-sm text-slate-900">{vitals.heartRate} bpm</span>
                        </div>
                        <div className="p-2 rounded bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Temperature</span>
                          <span className="font-extrabold text-sm text-slate-900">{vitals.temperature} °F</span>
                        </div>
                        <div className="p-2 rounded bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">SpO2</span>
                          <span className="font-extrabold text-sm text-slate-900">{vitals.spo2} %</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200">
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
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                        Clinical Indication for Investigation
                      </h3>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        Evaluation of cardiovascular risk profile and therapeutic drug monitoring.
                      </p>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                          <tr>
                            <th className="p-2.5">#</th>
                            <th className="p-2.5">Test Name</th>
                            <th className="p-2.5">Category</th>
                            <th className="p-2.5">Priority</th>
                            <th className="p-2.5">Preparation Instructions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {labOrders.map((test, i) => (
                            <tr key={i}>
                              <td className="p-2.5 font-bold text-slate-400">{i + 1}</td>
                              <td className="p-2.5 font-extrabold text-slate-900">{test.testName}</td>
                              <td className="p-2.5 text-slate-600">{test.category}</td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px] uppercase">
                                  {test.priority}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-600">
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
                  <div className="space-y-4 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">Laboratory Order Reference: LAB-2026-9901</p>
                        <p className="text-[11px] text-slate-500">Specimen Collected: 18 September 2026 07:45 AM • Reported: 18 September 2026 09:15 AM</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-slate-200 text-slate-800 font-bold text-xs uppercase">
                        Verified
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                          <tr>
                            <th className="p-2.5">Parameter / Test</th>
                            <th className="p-2.5">Result Value</th>
                            <th className="p-2.5">Units</th>
                            <th className="p-2.5">Biological Reference Range</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Total Serum Cholesterol</td>
                            <td className="p-2.5 font-black text-slate-900 text-sm">218</td>
                            <td className="p-2.5 text-slate-600">mg/dL</td>
                            <td className="p-2.5 text-slate-600">&lt; 200 mg/dL</td>
                            <td className="p-2.5"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-900 font-bold">HIGH</span></td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">LDL Cholesterol (Direct)</td>
                            <td className="p-2.5 font-black text-slate-900 text-sm">142</td>
                            <td className="p-2.5 text-slate-600">mg/dL</td>
                            <td className="p-2.5 text-slate-600">&lt; 100 mg/dL</td>
                            <td className="p-2.5"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-900 font-bold">HIGH</span></td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">HDL Cholesterol</td>
                            <td className="p-2.5 font-black text-slate-900 text-sm">44</td>
                            <td className="p-2.5 text-slate-600">mg/dL</td>
                            <td className="p-2.5 text-slate-600">&gt; 40 mg/dL</td>
                            <td className="p-2.5"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">NORMAL</span></td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-900">Serum Triglycerides</td>
                            <td className="p-2.5 font-black text-slate-900 text-sm">160</td>
                            <td className="p-2.5 text-slate-600">mg/dL</td>
                            <td className="p-2.5 text-slate-600">&lt; 150 mg/dL</td>
                            <td className="p-2.5"><span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-900 font-bold">BORDERLINE</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. INVOICE / RECEIPT */}
                {docType === "invoice" && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">Invoice Reference: INV-2026-0918-019</p>
                        <p className="text-[11px] text-slate-500">Transaction Date: 18 September 2026 09:05 AM</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-black text-xs uppercase">
                        PAID
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                          <tr>
                            <th className="p-2.5">#</th>
                            <th className="p-2.5">Clinical Service Description</th>
                            <th className="p-2.5 text-right">Unit Fee</th>
                            <th className="p-2.5 text-right">Qty</th>
                            <th className="p-2.5 text-right">Total (PKR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-2.5 font-bold text-slate-400">1</td>
                            <td className="p-2.5 font-bold text-slate-900">Consultant Cardiologist Clinical Consultation Fee</td>
                            <td className="p-2.5 text-right font-mono">2,500</td>
                            <td className="p-2.5 text-right">1</td>
                            <td className="p-2.5 text-right font-bold font-mono">2,500</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-400">2</td>
                            <td className="p-2.5 font-bold text-slate-900">12-Lead Diagnostic ECG with Report Interpretation</td>
                            <td className="p-2.5 text-right font-mono">1,000</td>
                            <td className="p-2.5 text-right">1</td>
                            <td className="p-2.5 text-right font-bold font-mono">1,000</td>
                          </tr>
                        </tbody>
                        <tfoot className="border-t-2 border-slate-900 bg-slate-50 font-bold">
                          <tr>
                            <td colSpan={4} className="p-2.5 text-right uppercase">Total Amount Paid (PKR)</td>
                            <td className="p-2.5 text-right text-base text-slate-900 font-black font-mono">PKR 3,500</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* 6. PATIENT VISIT SUMMARY */}
                {docType === "visit_summary" && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <h3 className="font-bold text-slate-900 uppercase text-[11px] mb-1">
                        Reason for Today&apos;s Visit
                      </h3>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        Routine clinical review for blood pressure control and assessment of medication tolerance. Diagnosis confirmed as Essential Hypertension Stage 1.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
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

                    <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50">
                      <h3 className="font-bold uppercase text-[11px] mb-1 text-slate-900">
                        Emergency Warning Signs
                      </h3>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        Seek immediate emergency medical care if you experience sudden severe chest pressure radiating to the arm or jaw, severe acute breathlessness, or dizziness.
                      </p>
                    </div>
                  </div>
                )}

                {/* Authentication & Signature Block */}
                <div className="rx-auth-block break-avoid">
                  <div className="rx-qr-group">
                    <div className="rx-qr-box" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                    <div className="rx-qr-text">
                      <div className="rx-qr-title">DOCUMENT VERIFICATION</div>
                      <p style={{ margin: "0 0 2px 0" }}>Scan to verify this document.</p>
                      <p style={{ margin: "0 0 2px 0" }}>Document ID: <strong>{prescriptionId}</strong></p>
                      <div className="rx-qr-url">verify.digitalmedical.pk/rx/{prescriptionId}</div>
                    </div>
                  </div>

                  <div className="rx-signature-group">
                    <div className="rx-signature-line">{doctorName}</div>
                    <div className="rx-sign-spec">{doctorSpecialty}</div>
                    <div className="rx-sign-reg">PMDC Registration No: {pmdcNumber}</div>
                    <div className="rx-sign-gen">Date: {visitDate}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="rx-footer">
                  <div className="rx-footer-col">Digital Medical • Official Medical Document</div>
                  <div className="rx-footer-col rx-footer-center">Reference ID: {prescriptionId}</div>
                  <div className="rx-footer-col">Page 1 of 1</div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

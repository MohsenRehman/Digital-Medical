import fs from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import {
  formatPatientData,
  formatPrescriptionDate,
  parseMedicineForPatient,
  generateVerificationQrSvg,
  getPublicVerificationUrl,
  getPrescriptionDocumentCss,
  generatePrescriptionHtml,
} from "../lib/doctor/medicalDocumentTemplates.js";

const execFileAsync = promisify(execFile);

function findBrowserExecutable() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function main() {
  const patientData = formatPatientData("Ahmed Khan", "PAT-000123", 34, "male", "0300-1234567", "Suite 304");
  const prescriptionId = "RX-2026-0918-01";
  const visitDate = "18 Sep 2026";
  const verificationUrl = getPublicVerificationUrl(prescriptionId);
  const qrSvg = generateVerificationQrSvg(verificationUrl, 72);

  // 6 medicines to test multi-page continuation
  const medicines = [
    {
      name: "Tab. Amlodipine 5mg",
      genericName: "Amlodipine Besylate",
      dosage: "1 Tablet",
      frequency: "OD (1-0-0) Morning",
      duration: "30 Days",
      instructions: "After breakfast",
    },
    {
      name: "Tab. Rosuvastatin 10mg",
      genericName: "Rosuvastatin Calcium",
      dosage: "1 Tablet",
      frequency: "OD (0-0-1) Night",
      duration: "30 Days",
      instructions: "At bedtime",
    },
    {
      name: "Tab. Valsartan 80mg",
      genericName: "Valsartan",
      dosage: "1 Tablet",
      frequency: "OD (1-0-0) Morning",
      duration: "30 Days",
      instructions: "Take with water",
    },
    {
      name: "Tab. Metformin 500mg",
      genericName: "Metformin Hydrochloride",
      dosage: "1 Tablet",
      frequency: "BD (1-0-1)",
      duration: "60 Days",
      instructions: "With morning and evening meals",
    },
    {
      name: "Tab. Aspirin 75mg",
      genericName: "Acetylsalicylic Acid",
      dosage: "1 Tablet",
      frequency: "OD (0-1-0) Noon",
      duration: "30 Days",
      instructions: "After lunch with a full glass of water",
    },
    {
      name: "Cap. Omeprazole 20mg",
      genericName: "Omeprazole",
      dosage: "1 Capsule",
      frequency: "OD (1-0-0) Morning",
      duration: "14 Days",
      instructions: "30 minutes before breakfast",
    },
  ].map(parseMedicineForPatient);

  const renderData = {
    prescriptionId,
    visitDate,
    generatedDate: `${visitDate}, 09:30 AM`,
    patient: patientData,
    doctor: {
      name: "Dr. Tariq Mahmood",
      specialty: "Consultant Cardiologist",
      qualifications: "MBBS (KMC) • FCPS (Cardiology) • Fellowship NICVD • MRCP (UK)",
      pmdcNumber: "48291-P",
    },
    clinic: {
      brand: "DIGITAL MEDICAL",
      name: "City Medical Center",
      address: "University Road, Peshawar, Khyber Pakhtunkhwa",
      phone: "091-5843210",
    },
    clinicalSummary: {
      diagnosis: "Essential Hypertension; Dyslipidemia; Type 2 Diabetes Mellitus",
      vitalsSummary: "BP: 142/90 mmHg | HR: 76 bpm | SpO2: 98% | Wt: 78 kg",
    },
    medicines,
    investigations: [
      {
        testName: "Lipid Profile",
        notes: "10-12 hours overnight fasting required.",
        status: "Ordered",
      },
      {
        testName: "HbA1c & Fasting Blood Glucose",
        notes: "Morning fasting specimen before medications.",
        status: "Ordered",
      },
    ],
    doctorInstructions: "Low salt diet (< 5g/day), brisk walking 30 mins daily. Avoid NSAIDs without consultation.",
    followUp: {
      date: "15 October 2026",
      reason: "Review blood pressure response, glucose logs, and medication tolerance",
    },
    verification: {
      url: verificationUrl,
      qrSvg,
    },
  };

  const docHtml = generatePrescriptionHtml(renderData);

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Prescription-${prescriptionId}</title>
        <style>
          ${getPrescriptionDocumentCss()}
        </style>
      </head>
      <body>
        ${docHtml}
      </body>
    </html>
  `;

  const tmpHtml = path.resolve("temp_multipage.html");
  const tmpPdf = path.resolve("generated_multipage_sample.pdf");
  fs.writeFileSync(tmpHtml, fullHtml, "utf8");

  const browser = findBrowserExecutable();
  await execFileAsync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--run-all-compositor-stages-before-draw",
    `--print-to-pdf=${tmpPdf}`,
    "--no-pdf-header-footer",
    tmpHtml,
  ]);

  console.log("Multi-page PDF generated successfully:", tmpPdf);
  fs.unlinkSync(tmpHtml);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

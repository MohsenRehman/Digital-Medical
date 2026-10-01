import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";
import { MOCK_PRESCRIPTIONS } from "@/lib/doctor/mockData";
import {
  formatPatientData,
  formatPrescriptionDate,
  parseMedicineForPatient,
  generateVerificationQrSvg,
  getPublicVerificationUrl,
  getPrescriptionDocumentCss,
  generatePrescriptionHtml,
  PrescriptionRenderData,
} from "@/lib/doctor/medicalDocumentTemplates";

const execFileAsync = promisify(execFile);

// Look for installed Chrome or Edge executable on Windows
function findBrowserExecutable(): string | null {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { prescriptionId: string } }
) {
  try {
    const rxId = decodeURIComponent(params.prescriptionId);
    
    // Find prescription or fallback to standard sample
    const rx = MOCK_PRESCRIPTIONS.find(
      (p) => p.prescriptionNumber === rxId || p.id === rxId
    ) || MOCK_PRESCRIPTIONS[0];

    const patientData = formatPatientData(
      rx.patientName,
      rx.patientProfileId,
      rx.patientAge,
      rx.patientGender,
      rx.patientPhone,
      "Suite 304"
    );

    const visitDate = formatPrescriptionDate(rx.date || "18 Sep 2026");
    const prescriptionId = rx.prescriptionNumber || rxId;
    const verificationUrl = getPublicVerificationUrl(prescriptionId);
    const qrSvg = generateVerificationQrSvg(verificationUrl, 72);
    const isMultipageTest = request.nextUrl.searchParams.get("multipage") === "true";
    let medicinesList = rx.medicines || [];
    if (isMultipageTest) {
      medicinesList = [
        ...medicinesList,
        {
          id: "med-3",
          name: "Tab. Valsartan 80mg",
          genericName: "Valsartan",
          dosage: "1 Tablet",
          frequency: "OD (1-0-0) Morning",
          duration: "30 Days",
          instructions: "Take with water",
          route: "oral",
        },
        {
          id: "med-4",
          name: "Tab. Metformin 500mg",
          genericName: "Metformin Hydrochloride",
          dosage: "1 Tablet",
          frequency: "BD (1-0-1)",
          duration: "60 Days",
          instructions: "With morning and evening meals",
          route: "oral",
        },
        {
          id: "med-5",
          name: "Tab. Aspirin 75mg",
          genericName: "Acetylsalicylic Acid",
          dosage: "1 Tablet",
          frequency: "OD (0-1-0) Noon",
          duration: "30 Days",
          instructions: "After lunch with water",
          route: "oral",
        },
      ];
    }
    const parsedMedicines = medicinesList.map(parseMedicineForPatient);

    const renderData: PrescriptionRenderData = {
      prescriptionId,
      visitDate,
      generatedDate: `${visitDate}, 09:30 AM`,
      patient: patientData,
      doctor: {
        name: rx.doctorName || "Dr. Tariq Mahmood",
        specialty: rx.doctorSpecialty || "Consultant Cardiologist",
        qualifications: "MBBS (KMC) • FCPS (Cardiology) • Fellowship NICVD • MRCP (UK)",
        pmdcNumber: rx.pmdcRegistration || "48291-P",
      },
      clinic: {
        brand: "DIGITAL MEDICAL",
        name: rx.clinicName || "City Medical Center",
        address: rx.clinicAddress || "University Road, Peshawar, Khyber Pakhtunkhwa",
        phone: rx.clinicPhone || "091-5843210",
      },
      clinicalSummary: {
        diagnosis: rx.diagnosis || "Essential Hypertension; Dyslipidemia",
        vitalsSummary: rx.vitalsSummary || "BP: 138/86 mmHg • HR: 74 bpm • SpO2: 98%",
      },
      medicines: parsedMedicines,
      investigations: isMultipageTest ? [
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
      ] : undefined,
      doctorInstructions: rx.doctorNotes || undefined,
      followUp: rx.followUpText ? {
        date: "15 October 2026",
        reason: rx.followUpText,
      } : undefined,
      verification: {
        url: verificationUrl,
        qrSvg,
      },
    };

    const docBodyHtml = generatePrescriptionHtml(renderData);

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${prescriptionId} - ${patientData.name} - Official Prescription</title>
          <style>
            ${getPrescriptionDocumentCss()}
          </style>
        </head>
        <body>
          ${docBodyHtml}
        </body>
      </html>
    `;

    const browserExe = findBrowserExecutable();
    if (!browserExe) {
      return new NextResponse(
        "PDF Engine is not configured on this host. Use browser print preview instead.",
        { status: 500 }
      );
    }

    const tmpDir = os.tmpdir();
    const uniqueId = `rx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const tmpHtmlPath = path.join(tmpDir, `${uniqueId}.html`);
    const tmpPdfPath = path.join(tmpDir, `${uniqueId}.pdf`);

    await fs.promises.writeFile(tmpHtmlPath, fullHtml, "utf8");

    try {
      await execFileAsync(browserExe, [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--run-all-compositor-stages-before-draw",
        `--print-to-pdf=${tmpPdfPath}`,
        "--no-pdf-header-footer",
        tmpHtmlPath,
      ]);

      const pdfBuffer = await fs.promises.readFile(tmpPdfPath);

      // Cleanup
      fs.promises.unlink(tmpHtmlPath).catch(() => {});
      fs.promises.unlink(tmpPdfPath).catch(() => {});

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="Prescription-${prescriptionId}.pdf"`,
          "Cache-Control": "no-cache",
        },
      });
    } catch (cmdError) {
      fs.promises.unlink(tmpHtmlPath).catch(() => {});
      fs.promises.unlink(tmpPdfPath).catch(() => {});
      throw cmdError;
    }
  } catch (error: any) {
    console.error("PDF generation failed:", error);
    return new NextResponse(`PDF generation failed: ${error.message}`, { status: 500 });
  }
}

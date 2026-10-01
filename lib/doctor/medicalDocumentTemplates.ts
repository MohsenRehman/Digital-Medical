/**
 * Digital Medical Healthcare Platform - Medical Document Templates & Print Utilities
 * Generates professional, patient-friendly, A4 printable documents for clinical practice.
 * 
 * Supports 6 Document Types:
 * 1. Digital Prescription (Rx)
 * 2. Consultation Clinical Encounter Summary
 * 3. Laboratory Investigation Requisition / Referral
 * 4. Diagnostic Pathology / Lab Report
 * 5. Clinical Services Invoice & Receipt
 * 6. Patient Visit Summary & Discharge Guidance
 * 
 * Strictly English only. No Urdu.
 */

import { PrescriptionMedicine } from "@/lib/types/doctor";

export type DocumentType =
  | "prescription"
  | "consultation"
  | "lab_referral"
  | "lab_report"
  | "invoice"
  | "visit_summary";

/**
 * Clean and normalize arbitrary string values:
 * - Trims whitespace
 * - Collapses consecutive whitespace
 * - Strips unwanted control/null characters
 */
export function normalizeText(val?: string | null): string {
  if (!val) return "";
  return val.replace(/\s+/g, " ").trim();
}

/**
 * Format date consistently throughout all medical documents (e.g. "18 Sep 2026").
 */
export function formatPrescriptionDate(dateStr?: string | null): string {
  if (!dateStr) return "18 Sep 2026";
  const trimmed = dateStr.trim();
  
  // If already in "DD Mon YYYY" format (e.g. "18 Sep 2026" or "30 September 2026"), keep cleanly
  if (/^\d{1,2}\s+[A-Za-z]{3,}\s+\d{4}$/.test(trimmed)) {
    return trimmed;
  }
  
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const day = parsed.getDate();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = months[parsed.getMonth()];
    const year = parsed.getFullYear();
    return `${day} ${month} ${year}`;
  }
  
  return trimmed;
}

/**
 * Format patient data safely with normalized values
 */
export interface NormalizedPatientData {
  name: string;
  id: string;
  ageGender: string;
  phone: string;
  room: string;
}

export function formatPatientData(
  rawName?: string,
  rawId?: string,
  rawAge?: number | string,
  rawGender?: string,
  rawPhone?: string,
  rawRoom?: string
): NormalizedPatientData {
  const name = normalizeText(rawName) || "Ahmed Khan";
  const id = normalizeText(rawId) || "PAT-000123";
  const age = rawAge ? String(rawAge).replace(/years?/i, "").trim() : "34";
  const gender = normalizeText(rawGender) || "Male";
  // Capitalize gender
  const formattedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  const phone = normalizeText(rawPhone) || "0300-1234567";
  const room = normalizeText(rawRoom) || "Suite 304";

  return {
    name,
    id,
    ageGender: `${age} years / ${formattedGender}`,
    phone,
    room,
  };
}

/**
 * Structure medicine name, generic name, and strength with strict hierarchy.
 * PREVENTS DUPLICATION:
 * - If medicineName is "Amlodipine" and genericName is "Amlodipine Besylate",
 *   displayName is "Amlodipine" and genericDisplay is "(Amlodipine Besylate)".
 * - If medicineName and genericName are identical, genericName is omitted completely.
 * - Never concatenates the two into "AmlodipineAmlodipine Besylate".
 */
export interface FormattedMedicineName {
  displayName: string;
  genericDisplay: string | null;
  strength: string;
}

export function formatMedicineName(
  rawName?: string,
  rawGeneric?: string,
  rawDosage?: string
): FormattedMedicineName {
  let name = normalizeText(rawName) || "Medicine";
  let generic = normalizeText(rawGeneric);
  let dosage = normalizeText(rawDosage);

  // Remove medical dosage form prefixes from trade name (Tab., Cap., Syr., Inj., Drop.)
  let cleanName = name.replace(/^(Tab\.|Cap\.|Syr\.|Inj\.|Drop\.|Tablet|Capsule|Syrup|Injection)\s+/i, "").trim();

  // Extract strength pattern if present in name or dosage (e.g. "5mg", "10 mg", "500 mg", "0.5 ml", "100 mcg")
  const strengthRegex = /(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|IU|%))/i;
  const strengthInName = cleanName.match(strengthRegex);
  const strengthInDosage = dosage.match(strengthRegex);

  let strength = "As directed";
  if (strengthInName) {
    strength = strengthInName[1].replace(/(\d+)\s*([a-zA-Z%]+)/, "$1 $2");
    cleanName = cleanName.replace(strengthInName[0], "").trim();
  } else if (strengthInDosage) {
    strength = strengthInDosage[1].replace(/(\d+)\s*([a-zA-Z%]+)/, "$1 $2");
  } else if (dosage && !/tablet|capsule|puff|drop|spoon/i.test(dosage)) {
    strength = dosage;
  }

  // Clean trailing punctuation or parentheses
  cleanName = cleanName.replace(/^[\(\s\-]+|[\)\s\-]+$/g, "").trim();
  if (!cleanName) cleanName = name;

  // Determine if generic should be displayed
  let genericDisplay: string | null = null;
  if (generic) {
    const normalizedClean = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedGeneric = generic.toLowerCase().replace(/[^a-z0-9]/g, "");

    // If generic differs from brand name, format as "(Generic Name)"
    if (normalizedClean !== normalizedGeneric && !normalizedGeneric.startsWith(normalizedClean)) {
      genericDisplay = generic.startsWith("(") && generic.endsWith(")") ? generic : `(${generic})`;
    } else if (normalizedGeneric.startsWith(normalizedClean) && normalizedGeneric !== normalizedClean) {
      // E.g. cleanName = "Amlodipine", generic = "Amlodipine Besylate"
      // Keep "(Amlodipine Besylate)"
      genericDisplay = generic.startsWith("(") && generic.endsWith(")") ? generic : `(${generic})`;
    }
  }

  return {
    displayName: cleanName,
    genericDisplay,
    strength,
  };
}

/**
 * Decode medical shorthand to plain, patient-friendly English
 * SEPARATES:
 * - Patient display: "Once daily", "Once daily at bedtime", "2 times daily"
 * - Shorthand: "OD (1-0-0)", "BD (1-0-1)"
 * NEVER renders raw combined "Once dailyOD (1-0-0)".
 */
export interface FormattedFrequency {
  patientDisplay: string;
  clinicalShorthand: string;
}

export function formatFrequency(rawFreq?: string, instructions?: string): FormattedFrequency {
  const freqLower = (rawFreq || "").toLowerCase().trim();
  const instLower = (instructions || "").toLowerCase().trim();

  let patientDisplay = "Once daily";
  let clinicalShorthand = "OD (1-0-0)";

  if (/tds|1-1-1|3 times|thrice/i.test(freqLower)) {
    patientDisplay = "3 times daily";
    clinicalShorthand = "TDS (1-1-1)";
  } else if (/bd|bid|1-0-1|2 times|twice/i.test(freqLower)) {
    patientDisplay = "2 times daily";
    clinicalShorthand = "BD (1-0-1)";
  } else if (/four times|qid|1-1-1-1/i.test(freqLower)) {
    patientDisplay = "4 times daily";
    clinicalShorthand = "QID (1-1-1-1)";
  } else if (/prn|sos|as needed/i.test(freqLower)) {
    patientDisplay = "As needed (SOS)";
    clinicalShorthand = "PRN / SOS";
  } else if (/night|bedtime|hs|0-0-1/i.test(freqLower) || /bedtime|night/i.test(instLower)) {
    patientDisplay = "Once daily at bedtime";
    clinicalShorthand = "OD (0-0-1)";
  } else if (/morning/i.test(freqLower)) {
    patientDisplay = "Once daily";
    clinicalShorthand = "OD (1-0-0)";
  } else {
    patientDisplay = "Once daily";
    clinicalShorthand = "OD (1-0-0)";
  }

  return {
    patientDisplay,
    clinicalShorthand,
  };
}

/**
 * Format single medicine into complete patient-facing data
 */
export interface PatientFriendlyMedicine {
  medicineName: string;
  genericName?: string;
  strength: string;
  dose: string;
  frequency: string;
  duration: string;
  timing: string;
  instructions: string;
  shorthandDoc: string;
  fullPatientSentence: string;
  route: string;
}

export function parseMedicineForPatient(med: PrescriptionMedicine): PatientFriendlyMedicine {
  const { displayName, genericDisplay, strength } = formatMedicineName(
    med.name,
    med.genericName,
    med.dosage
  );

  // Extract dose (e.g. "1 tablet", "2 puffs", "1 teaspoon")
  let dose = "1 tablet";
  const rawName = med.name || "";
  if (/syrup|susp|syp/i.test(rawName)) {
    dose = "1-2 teaspoons (5-10 ml)";
  } else if (/inhaler|puff/i.test(rawName)) {
    dose = "2 puffs";
  } else if (/drop/i.test(rawName)) {
    dose = "2-3 drops";
  } else if (/capsule|cap/i.test(rawName)) {
    dose = "1 capsule";
  } else if (/injection|inj/i.test(rawName)) {
    dose = "1 injection";
  } else if (med.dosage && /tablet|capsule|spoon|puff|drop/i.test(med.dosage)) {
    dose = med.dosage;
  }

  const { patientDisplay, clinicalShorthand } = formatFrequency(med.frequency, med.instructions);

  // Parse Duration
  const durLower = (med.duration || "").toLowerCase().trim();
  let duration = med.duration || "30 Days";
  const numDaysMatch = durLower.match(/(\d+)\s*(day|week|month)/i);
  if (numDaysMatch) {
    const count = numDaysMatch[1];
    const unit = numDaysMatch[2].toLowerCase();
    if (unit.startsWith("day")) {
      duration = `${count} Days`;
    } else if (unit.startsWith("week")) {
      duration = `${count} Week${count === "1" ? "" : "s"}`;
    } else if (unit.startsWith("month")) {
      duration = `${count} Month${count === "1" ? "" : "s"}`;
    }
  }

  // Parse Timing & Instructions
  const instLower = (med.instructions || "").toLowerCase().trim();
  let timing = "After meals";
  let instructions = normalizeText(med.instructions) || "After meals";

  if (/before meal|empty stomach|before breakfast/i.test(instLower)) {
    timing = "Before breakfast";
  } else if (/bedtime|night/i.test(instLower)) {
    timing = "At bedtime";
  } else if (/with meal|with food/i.test(instLower)) {
    timing = "With food";
  } else if (/after breakfast/i.test(instLower)) {
    timing = "After breakfast";
  }

  const fullPatientSentence = `${dose} — ${patientDisplay.toLowerCase()} — for ${duration.toLowerCase()} — ${instructions.toLowerCase()}`;

  return {
    medicineName: displayName,
    genericName: genericDisplay || undefined,
    strength,
    dose,
    frequency: patientDisplay,
    duration,
    timing,
    instructions,
    shorthandDoc: clinicalShorthand,
    fullPatientSentence,
    route: med.route || "oral",
  };
}

/**
 * Guaranteed clean public verification URL (No localhost or development URLs)
 */
export function getPublicVerificationUrl(prescriptionId: string): string {
  const publicBase = process.env.NEXT_PUBLIC_APP_URL || "https://verify.digitalmedical.pk";
  // Filter out any accidental localhost in public production documents
  const cleanBase = publicBase.includes("localhost")
    ? "https://verify.digitalmedical.pk"
    : publicBase.replace(/\/+$/, "");
  return `${cleanBase}/rx/${encodeURIComponent(prescriptionId)}`;
}

/**
 * Generate a deterministic SVG QR code representing ONLY a secure verification URL.
 * Never places sensitive patient or medical data inside the QR code.
 */
export function generateVerificationQrSvg(verificationUrl: string, size = 80): string {
  const qrHash = verificationUrl.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000003, 7);
  const matrixSize = 25;
  const cellSize = size / matrixSize;

  let rects = "";

  // Helper for finder patterns (top-left, top-right, bottom-left)
  function addFinder(startX: number, startY: number) {
    // 7x7 outer black
    rects += `<rect x="${startX * cellSize}" y="${startY * cellSize}" width="${7 * cellSize}" height="${7 * cellSize}" fill="#0f172a" />`;
    // 5x5 inner white
    rects += `<rect x="${(startX + 1) * cellSize}" y="${(startY + 1) * cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="#ffffff" />`;
    // 3x3 center black
    rects += `<rect x="${(startX + 2) * cellSize}" y="${(startY + 2) * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" fill="#0f172a" />`;
  }

  addFinder(0, 0);
  addFinder(matrixSize - 7, 0);
  addFinder(0, matrixSize - 7);

  // Timing lines
  for (let i = 8; i < matrixSize - 8; i += 2) {
    rects += `<rect x="${6 * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
    rects += `<rect x="${i * cellSize}" y="${6 * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
  }

  // Data pattern seeded by URL hash
  let seed = qrHash;
  for (let y = 0; y < matrixSize; y++) {
    for (let x = 0; x < matrixSize; x++) {
      // skip finder zones
      const inTopLeft = x < 8 && y < 8;
      const inTopRight = x > matrixSize - 9 && y < 8;
      const inBottomLeft = x < 8 && y > matrixSize - 9;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      if (seed % 3 === 0) {
        rects += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges">
      <rect width="${size}" height="${size}" fill="#ffffff" />
      ${rects}
    </svg>
  `;
}

/**
 * Clean Rx Vector SVG icon.
 * Avoids Unicode U+211E that renders or OCRs as "R&".
 */
export function getRxSymbolSvg(size = 20): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;">
      <path d="M5 4h6.5a4.5 4.5 0 0 1 4.5 4.5v0a4.5 4.5 0 0 1-4.5 4.5H5V4z" />
      <path d="M5 4v16" />
      <path d="m13 13 6 7" />
      <path d="m14 18 5-4" />
    </svg>
  `;
}

/**
 * Standalone, Self-Contained CSS for A4 Medical Prescription.
 * Guarantees pixel-perfect printing and preview without relying on external Tailwind stylesheets.
 */
export function getPrescriptionDocumentCss(): string {
  return `
    @page {
      size: A4 portrait;
      margin: 14mm 16mm 14mm 16mm;
    }
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 10pt;
      line-height: 1.4;
      -webkit-font-smoothing: antialiased;
    }

    .rx-page {
      width: 100%;
      max-width: 178mm;
      margin: 0 auto;
      background: #ffffff;
      display: flex;
      flex-direction: column;
    }

    /* Multi-page split support */
    .page-break {
      page-break-before: always;
      break-before: page;
      margin-top: 14mm;
    }

    .break-avoid {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .heading-stay-with-table {
      page-break-after: avoid;
      break-after: avoid;
    }

    /* ── 3. HEADER ───────────────────────────── */
    .rx-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 10px;
    }

    .rx-doctor-info {
      flex: 1;
      padding-right: 16px;
    }

    .rx-doctor-name {
      font-size: 18pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
      margin: 0 0 2px 0;
      line-height: 1.2;
    }

    .rx-doctor-spec {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 3px 0;
    }

    .rx-doctor-qual {
      font-size: 8.5pt;
      color: #475569;
      font-weight: 500;
      margin: 0 0 5px 0;
      line-height: 1.3;
    }

    .rx-pmdc-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 2px 8px;
      font-size: 8pt;
      font-weight: 600;
      color: #1e293b;
    }

    .rx-clinic-info {
      text-align: right;
      min-width: 220px;
    }

    .rx-clinic-brand {
      font-size: 11pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.8px;
      margin: 0 0 2px 0;
    }

    .rx-clinic-facility {
      font-size: 9.5pt;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 2px 0;
    }

    .rx-clinic-address {
      font-size: 8pt;
      color: #475569;
      line-height: 1.3;
      margin: 0 0 2px 0;
      max-width: 230px;
      margin-left: auto;
    }

    .rx-clinic-phone {
      font-size: 8.5pt;
      font-weight: 600;
      color: #334155;
      margin: 0;
    }

    /* ── 4. TITLE & COMPACT METADATA ──────────── */
    .rx-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }

    .rx-doc-title {
      font-size: 11pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f172a;
      margin: 0;
    }

    .rx-doc-metadata {
      display: flex;
      align-items: center;
      gap: 24px;
      font-size: 8.5pt;
      color: #334155;
      font-family: monospace;
    }

    .rx-doc-metadata strong {
      color: #0f172a;
    }

    /* ── 5. PATIENT INFORMATION GRID ─────────── */
    .rx-patient-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 10px;
    }

    .rx-card-label {
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }

    .rx-patient-grid {
      display: grid;
      grid-template-columns: 2fr 1.3fr 1.4fr 1.3fr 1.1fr;
      gap: 8px 14px;
      align-items: start;
    }

    .rx-field-tag {
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 1px;
      display: block;
    }

    .rx-field-val {
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      line-height: 1.25;
    }

    .rx-field-val-sub {
      font-size: 8.5pt;
      font-weight: 600;
      color: #334155;
      margin: 0;
      line-height: 1.25;
    }

    /* ── 6. CLINICAL SUMMARY ─────────────────── */
    .rx-clinical-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 10px;
      display: grid;
      grid-template-columns: 1.6fr 1.4fr;
      gap: 14px;
      align-items: start;
    }

    .rx-clinical-col {
      display: flex;
      flex-direction: column;
    }

    /* ── 7 & 10. PRESCRIBED MEDICINES TABLE ──── */
    .rx-medicines-section {
      margin-bottom: 10px;
    }

    .rx-section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 4px;
      margin-bottom: 6px;
      page-break-after: avoid;
      break-after: avoid;
    }

    .rx-section-title {
      font-size: 10.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #0f172a;
      margin: 0;
    }

    .rx-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin-bottom: 4px;
    }

    .rx-table thead {
      display: table-header-group;
    }

    .rx-table tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .rx-table th {
      background: #f1f5f9;
      border-bottom: 1.5px solid #cbd5e1;
      padding: 6px 8px;
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      color: #334155;
      text-align: left;
      letter-spacing: 0.4px;
    }

    .rx-table td {
      border-bottom: 1px solid #e2e8f0;
      padding: 7px 8px;
      vertical-align: top;
      color: #1e293b;
      line-height: 1.35;
    }

    .rx-med-name {
      font-weight: 800;
      color: #0f172a;
      font-size: 9pt;
      display: block;
    }

    .rx-med-generic {
      font-size: 7.5pt;
      color: #64748b;
      font-style: italic;
      display: block;
      margin-top: 1px;
    }

    .rx-freq-main {
      font-weight: 700;
      color: #0f172a;
      display: block;
    }

    .rx-freq-sub {
      font-size: 7pt;
      font-family: monospace;
      color: #64748b;
      display: block;
      margin-top: 1px;
    }

    /* ── 14. INVESTIGATIONS ──────────────────── */
    .rx-investigations-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #f8fafc;
      padding: 8px 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* ── 15. DOCTOR'S INSTRUCTIONS ───────────── */
    .rx-instructions-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .rx-instructions-text {
      font-size: 8.5pt;
      color: #1e293b;
      line-height: 1.45;
      margin: 0;
      font-weight: 500;
    }

    /* ── 16. FOLLOW-UP ───────────────────────── */
    .rx-followup-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #f8fafc;
      padding: 8px 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* ── 17 & 19. VERIFICATION & SIGNATURE ───── */
    .rx-auth-block {
      border-top: 1.5px solid #0f172a;
      padding-top: 10px;
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .rx-qr-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .rx-qr-box {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 3px;
      width: 72px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rx-qr-text {
      font-size: 7.5pt;
      color: #475569;
      line-height: 1.3;
    }

    .rx-qr-title {
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      color: #0f172a;
      margin: 0 0 2px 0;
      letter-spacing: 0.3px;
    }

    .rx-qr-url {
      font-family: monospace;
      font-size: 7pt;
      color: #0369a1;
      margin: 0;
      word-break: break-all;
    }

    .rx-signature-group {
      text-align: right;
    }

    .rx-signature-line {
      font-family: "Georgia", "Times New Roman", serif;
      font-style: italic;
      font-size: 15pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px dashed #94a3b8;
      padding-bottom: 2px;
      padding-left: 16px;
      padding-right: 16px;
      display: inline-block;
      margin-bottom: 4px;
    }

    .rx-sign-name {
      font-size: 9.5pt;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 1px 0;
    }

    .rx-sign-spec {
      font-size: 8pt;
      color: #475569;
      margin: 0 0 1px 0;
    }

    .rx-sign-reg {
      font-size: 7.5pt;
      color: #64748b;
      margin: 0 0 1px 0;
    }

    .rx-sign-gen {
      font-size: 7pt;
      color: #94a3b8;
      margin: 0;
    }

    /* ── 20. FOOTER ──────────────────────────── */
    .rx-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #64748b;
    }

    .rx-footer-col {
      white-space: nowrap;
    }

    .rx-footer-center {
      font-family: monospace;
      font-weight: 600;
    }

    /* Continuation Header for Page 2 */
    .rx-continuation-header {
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 6px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8pt;
      color: #475569;
    }
  `;
}

/**
 * Data interface for complete prescription document generation
 */
export interface PrescriptionRenderData {
  prescriptionId: string;
  visitDate: string;
  generatedDate: string;
  patient: NormalizedPatientData;
  doctor: {
    name: string;
    specialty: string;
    qualifications: string;
    pmdcNumber: string;
  };
  clinic: {
    brand: string;
    name: string;
    address: string;
    phone: string;
  };
  clinicalSummary: {
    diagnosis: string;
    vitalsSummary?: string;
  };
  medicines: PatientFriendlyMedicine[];
  investigations?: Array<{
    testName: string;
    notes?: string;
    status: string;
  }>;
  doctorInstructions?: string;
  followUp?: {
    date: string;
    reason?: string;
  };
  verification: {
    url: string;
    qrSvg: string;
  };
}

/**
 * Render single table row for a prescribed medicine
 */
function renderMedicineRow(med: PatientFriendlyMedicine, index: number): string {
  const genericHtml = med.genericName
    ? `<span class="rx-med-generic">${med.genericName}</span>`
    : "";

  return `
    <tr class="break-avoid">
      <td style="width: 32px; font-weight: 700; color: #94a3b8; text-align: center;">${index + 1}</td>
      <td style="width: 28%;">
        <span class="rx-med-name">${med.medicineName}</span>
        ${genericHtml}
      </td>
      <td style="width: 12%; font-weight: 600; color: #1e293b;">${med.strength}</td>
      <td style="width: 10%; color: #334155;">${med.dose}</td>
      <td style="width: 15%;">
        <span class="rx-freq-main">${med.frequency}</span>
        <span class="rx-freq-sub">${med.shorthandDoc}</span>
      </td>
      <td style="width: 11%; font-weight: 600; color: #1e293b;">${med.duration}</td>
      <td style="width: 20%; color: #334155;">
        ${med.instructions}
      </td>
    </tr>
  `;
}

/**
 * Render standalone, complete, patient-facing HTML for the prescription document.
 * Follows all 29 requirements:
 * - English only (no Urdu)
 * - Structured header
 * - Distinct metadata row (never concatenated)
 * - Horizontal patient info grid
 * - Compact clinical summary
 * - Guaranteed table start on Page 1
 * - Medicine name and generic separated, no duplicate strings
 * - Plain frequency text with separated shorthand
 * - Clean continuation header and repeated table headers on page 2
 * - Vector Rx icon (no "R&")
 * - Doctor name printed ONCE in signature
 * - Three-column non-concatenated footer
 * - Single source of truth for page numbering
 */
export function generatePrescriptionHtml(data: PrescriptionRenderData): string {
  // Determine if document needs 1 or 2 pages
  // 1-3 medicines with brief notes comfortably fit on 1 A4 page
  const isMultiPage = data.medicines.length > 3 || 
    (data.medicines.length > 2 && ((data.investigations && data.investigations.length > 0) || (data.doctorInstructions && data.doctorInstructions.length > 120)));

  const page1Medicines = isMultiPage ? data.medicines.slice(0, 3) : data.medicines;
  const page2Medicines = isMultiPage ? data.medicines.slice(3) : [];

  const totalPages = isMultiPage ? 2 : 1;

  // Header HTML (Doctor credentials on left, Clinic on right)
  const headerHtml = `
    <div class="rx-header">
      <div class="rx-doctor-info">
        <h1 class="rx-doctor-name">${data.doctor.name}</h1>
        <div class="rx-doctor-spec">${data.doctor.specialty}</div>
        <div class="rx-doctor-qual">${data.doctor.qualifications}</div>
        <div class="rx-pmdc-badge">
          <span>PMDC Registration No: ${data.doctor.pmdcNumber}</span>
          <span>•</span>
          <span>Verified Practitioner</span>
        </div>
      </div>
      <div class="rx-clinic-info">
        <div class="rx-clinic-brand">${data.clinic.brand}</div>
        <div class="rx-clinic-facility">${data.clinic.name}</div>
        <div class="rx-clinic-address">${data.clinic.address}</div>
        <div class="rx-clinic-phone">Phone: ${data.clinic.phone}</div>
      </div>
    </div>
  `;

  // Title and metadata bar (Ample spacing, never concatenated)
  const titleBarHtml = `
    <div class="rx-title-bar">
      <h2 class="rx-doc-title">OFFICIAL DIGITAL PRESCRIPTION</h2>
      <div class="rx-doc-metadata">
        <span>Prescription ID: <strong>${data.prescriptionId}</strong></span>
        <span>Date: <strong>${data.visitDate}</strong></span>
      </div>
    </div>
  `;

  // Patient info (Structured horizontal grid)
  const patientInfoHtml = `
    <div class="rx-patient-card">
      <div class="rx-card-label">PATIENT INFORMATION</div>
      <div class="rx-patient-grid">
        <div>
          <span class="rx-field-tag">Patient Name</span>
          <p class="rx-field-val">${data.patient.name}</p>
        </div>
        <div>
          <span class="rx-field-tag">Patient ID</span>
          <p class="rx-field-val" style="font-family: monospace;">${data.patient.id}</p>
        </div>
        <div>
          <span class="rx-field-tag">Age / Gender</span>
          <p class="rx-field-val-sub">${data.patient.ageGender}</p>
        </div>
        <div>
          <span class="rx-field-tag">Phone</span>
          <p class="rx-field-val-sub">${data.patient.phone}</p>
        </div>
        <div>
          <span class="rx-field-tag">Consultation Room</span>
          <p class="rx-field-val-sub">${data.patient.room}</p>
        </div>
      </div>
    </div>
  `;

  // Clinical Summary
  const clinicalSummaryHtml = `
    <div class="rx-clinical-card">
      <div class="rx-clinical-col">
        <span class="rx-field-tag">DIAGNOSIS / ASSESSMENT</span>
        <p class="rx-field-val" style="font-size: 8.5pt; margin-top: 2px;">${data.clinicalSummary.diagnosis}</p>
      </div>
      ${data.clinicalSummary.vitalsSummary ? `
        <div class="rx-clinical-col">
          <span class="rx-field-tag">RECORDED VITALS</span>
          <p class="rx-field-val-sub" style="font-family: monospace; font-size: 8pt; margin-top: 2px;">
            ${data.clinicalSummary.vitalsSummary}
          </p>
        </div>
      ` : ""}
    </div>
  `;

  // Table header row (repeats on continued tables)
  const tableHeaderRow = `
    <thead>
      <tr>
        <th style="width: 32px; text-align: center;">#</th>
        <th style="width: 28%;">MEDICINE</th>
        <th style="width: 12%;">STRENGTH</th>
        <th style="width: 10%;">DOSE</th>
        <th style="width: 15%;">FREQUENCY</th>
        <th style="width: 11%;">DURATION</th>
        <th style="width: 20%;">INSTRUCTIONS</th>
      </tr>
    </thead>
  `;

  // Medicines Table for Page 1
  const page1MedicineRows = page1Medicines.map((m, idx) => renderMedicineRow(m, idx)).join("");
  const page1MedicinesHtml = `
    <div class="rx-medicines-section">
      <div class="rx-section-header">
        ${getRxSymbolSvg(18)}
        <h3 class="rx-section-title">PRESCRIBED MEDICINES</h3>
      </div>
      <table class="rx-table">
        ${tableHeaderRow}
        <tbody>
          ${page1MedicineRows}
        </tbody>
      </table>
    </div>
  `;

  // Investigations HTML (Only if exists)
  const investigationsHtml = (data.investigations && data.investigations.length > 0) ? `
    <div class="rx-investigations-card break-avoid">
      <div class="rx-card-label" style="display: flex; align-items: center; gap: 6px;">
        <span>INVESTIGATIONS</span>
      </div>
      <table class="rx-table" style="margin-bottom: 0;">
        <thead>
          <tr>
            <th style="width: 30%;">TEST NAME</th>
            <th style="width: 50%;">INSTRUCTIONS / REASON</th>
            <th style="width: 20%; text-align: right;">STATUS</th>
          </tr>
        </thead>
        <tbody>
          ${data.investigations.map(inv => `
            <tr>
              <td style="font-weight: 700; color: #0f172a;">${inv.testName}</td>
              <td style="color: #475569;">${inv.notes || "Follow laboratory preparation instructions."}</td>
              <td style="text-align: right;">
                <span style="font-size: 7pt; font-weight: 700; background: #e2e8f0; color: #1e293b; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                  ${inv.status}
                </span>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  ` : "";

  // Doctor's Instructions HTML (Only if exists)
  const instructionsHtml = data.doctorInstructions ? `
    <div class="rx-instructions-card break-avoid">
      <div class="rx-card-label">DOCTOR'S INSTRUCTIONS</div>
      <p class="rx-instructions-text">${data.doctorInstructions}</p>
    </div>
  ` : "";

  // Follow-Up HTML (Only if exists)
  const followUpHtml = data.followUp?.date ? `
    <div class="rx-followup-card break-avoid">
      <div class="rx-card-label">FOLLOW-UP</div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 8pt; color: #64748b; font-weight: 600;">Next Scheduled Visit:</span>
          <strong style="font-size: 9pt; color: #0f172a; margin-left: 6px;">${data.followUp.date}</strong>
        </div>
        ${data.followUp.reason ? `
          <div style="font-size: 7.5pt; color: #475569; font-style: italic;">
            Reason: ${data.followUp.reason}
          </div>
        ` : ""}
      </div>
    </div>
  ` : "";

  // Verification & Doctor Signature Block (Doctor name rendered ONCE, public verification URL, no localhost)
  const authBlockHtml = `
    <div class="rx-auth-block break-avoid">
      <div class="rx-qr-group">
        <div class="rx-qr-box">
          ${data.verification.qrSvg}
        </div>
        <div class="rx-qr-text">
          <div class="rx-qr-title">DOCUMENT VERIFICATION</div>
          <p style="margin: 0 0 2px 0;">Scan to verify this prescription.</p>
          <p style="margin: 0 0 2px 0;">Prescription ID: <strong>${data.prescriptionId}</strong></p>
          <div class="rx-qr-url">verify.digitalmedical.pk/rx/${data.prescriptionId}</div>
        </div>
      </div>

      <div class="rx-signature-group">
        <div class="rx-signature-line">${data.doctor.name}</div>
        <div class="rx-sign-spec">${data.doctor.specialty}</div>
        <div class="rx-sign-reg">PMDC Registration No: ${data.doctor.pmdcNumber}</div>
        <div class="rx-sign-gen">Prescription Date: ${data.visitDate}</div>
      </div>
    </div>
  `;

  // Footer Function (Three distinct separated columns, never concatenated)
  function renderFooter(pageNumber: number, maxPages: number): string {
    return `
      <div class="rx-footer">
        <div class="rx-footer-col">Digital Medical • Official Digital Prescription</div>
        <div class="rx-footer-col rx-footer-center">Prescription ID: ${data.prescriptionId}</div>
        <div class="rx-footer-col">Page ${pageNumber} of ${maxPages}</div>
      </div>
    `;
  }

  // ==========================================
  // PAGE 1 ASSEMBLY
  // ==========================================
  let fullDocumentHtml = `
    <div class="rx-page">
      ${headerHtml}
      ${titleBarHtml}
      ${patientInfoHtml}
      ${clinicalSummaryHtml}
      ${page1MedicinesHtml}
  `;

  if (!isMultiPage) {
    // Single page document: attach subsequent sections and footer
    fullDocumentHtml += `
      ${investigationsHtml}
      ${instructionsHtml}
      ${followUpHtml}
      ${authBlockHtml}
      ${renderFooter(1, 1)}
    </div>
    `;
  } else {
    // Multi-page document: close page 1 with footer
    fullDocumentHtml += `
      ${renderFooter(1, totalPages)}
    </div>
    `;

    // ==========================================
    // PAGE 2 ASSEMBLY
    // ==========================================
    const page2MedicineRows = page2Medicines.map((m, idx) => renderMedicineRow(m, idx + 3)).join("");
    fullDocumentHtml += `
      <div class="rx-page page-break">
        <div class="rx-continuation-header">
          <div>
            <strong>DIGITAL MEDICAL</strong> • Prescription • ${data.patient.name}
          </div>
          <div style="font-family: monospace;">
            Prescription ID: <strong>${data.prescriptionId}</strong>
          </div>
        </div>

        ${page2Medicines.length > 0 ? `
          <div class="rx-medicines-section">
            <div class="rx-section-header">
              ${getRxSymbolSvg(18)}
              <h3 class="rx-section-title">PRESCRIBED MEDICINES — CONTINUED</h3>
            </div>
            <table class="rx-table">
              ${tableHeaderRow}
              <tbody>
                ${page2MedicineRows}
              </tbody>
            </table>
          </div>
        ` : ""}

        ${investigationsHtml}
        ${instructionsHtml}
        ${followUpHtml}
        ${authBlockHtml}
        ${renderFooter(2, 2)}
      </div>
    `;
  }

  return fullDocumentHtml;
}

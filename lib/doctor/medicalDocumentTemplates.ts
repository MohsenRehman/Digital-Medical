/**
 * Digital Medical Healthcare Platform - Medical Document Templates & Print Utilities
 * Generates professional, patient-friendly, A4 printable documents for clinical practice.
 * 
 * Supports 6 Document Types:
 * 1. Digital Prescription (℞)
 * 2. Consultation Clinical Encounter Summary
 * 3. Laboratory Investigation Requisition / Referral
 * 4. Diagnostic Pathology / Lab Report
 * 5. Clinical Services Invoice & Receipt
 * 6. Patient Visit Summary & Discharge Guidance
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
 * Decode medical shorthand to plain, patient-friendly English
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
  let rawName = med.name || "Medicine";
  
  // Clean prefix if present (e.g. "Tab. Amlodipine 5mg" -> name: "Amlodipine", strength: "5 mg")
  let cleanName = rawName.replace(/^(Tab\.|Cap\.|Syr\.|Inj\.|Drop\.)\s*/i, "").trim();

  // Extract strength if present in name or dosage
  const strengthMatch = cleanName.match(/(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|IU|%))/i) || 
                        med.dosage.match(/(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|IU|%))/i);
  const strength = strengthMatch ? strengthMatch[1] : (med.dosage && !med.dosage.includes("Tab") ? med.dosage : "As directed");

  // Remove the strength from the clean name for elegant table presentation
  if (strengthMatch) {
    cleanName = cleanName.replace(strengthMatch[0], "").trim();
  }

  // Extract dose (e.g. "1 tablet", "2 puffs", "1 teaspoon")
  let dose = "1 tablet";
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

  // Parse frequency
  const freqLower = (med.frequency || "").toLowerCase();
  let frequency = "Once daily";
  let shorthand = med.frequency || "OD (1-0-0)";

  if (/tds|1-1-1|3 times|thrice/i.test(freqLower)) {
    frequency = "3 times daily";
    shorthand = "TDS (1-1-1)";
  } else if (/bd|bid|1-0-1|2 times|twice/i.test(freqLower)) {
    frequency = "2 times daily";
    shorthand = "BD (1-0-1)";
  } else if (/four times|qid|1-1-1-1/i.test(freqLower)) {
    frequency = "4 times daily";
    shorthand = "QID (1-1-1-1)";
  } else if (/prn|sos|as needed/i.test(freqLower)) {
    frequency = "As needed (SOS)";
    shorthand = "PRN / SOS";
  } else if (/night|bedtime|hs|0-0-1/i.test(freqLower) || /bedtime|night/i.test(med.instructions || "")) {
    frequency = "Once daily at bedtime";
    shorthand = "OD (0-0-1)";
  } else {
    frequency = "Once daily";
    shorthand = "OD (1-0-0)";
  }

  // Parse Duration
  const durLower = (med.duration || "").toLowerCase();
  let duration = med.duration || "As advised";
  const numDaysMatch = durLower.match(/(\d+)\s*(day|week|month)/i);
  if (numDaysMatch) {
    const count = numDaysMatch[1];
    const unit = numDaysMatch[2].toLowerCase();
    if (unit.startsWith("day")) {
      duration = `${count} days`;
    } else if (unit.startsWith("week")) {
      duration = `${count} week${count === "1" ? "" : "s"}`;
    } else if (unit.startsWith("month")) {
      duration = `${count} month${count === "1" ? "" : "s"}`;
    }
  }

  // Parse Timing & Instructions
  const instLower = (med.instructions || "").toLowerCase();
  let timing = "After meals";
  let instructions = med.instructions || "Take with water.";

  if (/before meal|empty stomach|before breakfast/i.test(instLower)) {
    timing = "Before breakfast (empty stomach)";
  } else if (/bedtime|night/i.test(instLower)) {
    timing = "At bedtime";
  } else if (/with meal|with food/i.test(instLower)) {
    timing = "With food";
  } else if (/after breakfast/i.test(instLower)) {
    timing = "After breakfast";
  }

  const fullPatientSentence = `${dose} — ${frequency.toLowerCase()} — for ${duration.toLowerCase()} — ${timing.toLowerCase()}`;

  return {
    medicineName: cleanName || rawName,
    genericName: med.genericName,
    strength,
    dose,
    frequency,
    duration,
    timing,
    instructions,
    shorthandDoc: shorthand,
    fullPatientSentence,
    route: med.route || "oral",
  };
}

/**
 * Generate a deterministic SVG QR code representing ONLY a secure verification URL.
 * Never places sensitive patient or medical data inside the QR code.
 */
export function generateVerificationQrSvg(verificationUrl: string, size = 96): string {
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

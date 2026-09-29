export type DashboardTab =
  | "dashboard"
  | "appointments"
  | "medical-records"
  | "prescriptions"
  | "lab-reports"
  | "family"
  | "doctors-clinics"
  | "follow-ups"
  | "notifications"
  | "settings";

export interface ActivityItem {
  id: string;
  type: "appointment" | "prescription" | "record" | "reminder" | "profile";
  title: string;
  description: string;
  time: string;
  patientName: string;
  relation: string;
}

/**
 * MedicalRecord — forward-compatible shape for Doctor-module integration.
 * All fields are optional where they may not yet exist in the backend response.
 * The patient dashboard renders only fields that are present.
 */
export interface MedicalRecord {
  id: string;
  /** ISO date string, e.g. "2025-03-14" */
  visitDate: string;
  /** Display label derived from visitDate, e.g. "14 Mar 2025" */
  visitDateLabel?: string;
  /** Name of the patient this record belongs to */
  patientName: string;
  /** Relation to primary account holder */
  relation: string;
  doctorId?: string;
  doctorName: string;
  doctorSpecialty?: string;
  doctorImage?: string;
  clinicName: string;
  clinicLocation?: string;
  /** Presenting complaint / symptoms */
  symptoms?: string;
  /** Confirmed diagnosis */
  diagnosis?: string;
  /** Free-text clinical notes */
  notes?: string;
  /** Whether a prescription was issued during this visit */
  hasPrescription?: boolean;
  /** Whether lab reports are attached */
  hasLabReport?: boolean;
  /** Whether a follow-up was advised */
  followUpAdvised?: boolean;
  /** ISO date string for advised follow-up */
  followUpDate?: string;
}

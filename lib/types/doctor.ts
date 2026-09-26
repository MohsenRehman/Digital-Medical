/**
 * Doctor Dashboard & Clinical Workspace Types
 * Digital Medical Healthcare Platform (Pakistan)
 */

export type DoctorVerificationStatus = "verified" | "pending" | "unverified";

export type ConsultationType = "in_clinic" | "video";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type QueueStatus = "waiting" | "in_progress" | "completed" | "skipped" | "no_show";

export type QueuePriority = "normal" | "urgent" | "follow_up";

export type LabOrderStatus = "ordered" | "sample_collected" | "results_available" | "reviewed";

export type LabPriority = "routine" | "urgent" | "stat";

export type DoctorAvailabilityStatus = "available" | "in_consultation" | "on_break" | "offline";

export interface ClinicAffiliation {
  id: string;
  name: string;
  city: string;
  address: string;
  tenantId: string;
  roomNumber: string;
  isPrimary: boolean;
  isActive: boolean;
  phone: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  specialty: string;
  subSpecialty?: string;
  pmdcRegistration: string; // e.g. "48291-P"
  pmdcVerified: boolean;
  qualifications: string[]; // e.g. ["MBBS (KMC)", "FCPS (Cardiology)", "MRCP (UK)"]
  experienceYears: number;
  languages: string[];
  avatarUrl: string;
  verificationStatus: DoctorVerificationStatus;
  bio: string;
  consultationFee: number; // in PKR e.g. 2500
  videoConsultationFee: number; // in PKR e.g. 2000
  rating: number;
  reviewCount: number;
  affiliatedClinics: ClinicAffiliation[];
  activeClinicId: string;
}

export interface PatientProfile {
  id: string; // e.g. "PAT-000123"
  patientUserId: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string; // e.g. "0300-1234567"
  guardianName?: string;
  guardianRelation?: string;
  bloodGroup?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  lastVisitDate?: string;
  tenantId: string;
  clinicId: string;
  crossClinicRecordsAvailable?: boolean;
  externalClinicName?: string;
}

export interface DoctorAppointment {
  id: string;
  bookingRef: string; // e.g. "DM-8942"
  tenantId: string;
  clinicId: string;
  clinicName: string;
  doctorId: string;
  doctorName: string;
  patientProfileId: string;
  patientName: string;
  patientAge: number;
  patientGender: "male" | "female" | "other";
  patientPhone: string;
  scheduledAt: string; // ISO string or readable format e.g. "2026-09-24"
  timeSlot: string; // e.g. "09:30 AM"
  consultationType: ConsultationType;
  status: AppointmentStatus;
  tokenNumber: string; // e.g. "A-20"
  paymentStatus: "paid" | "pay_at_clinic";
  fee: number;
  reasonForVisit: string;
  notes?: string;
}

export interface QueueEntry {
  id: string;
  appointmentId: string;
  patientProfileId: string;
  patientName: string;
  age: number;
  gender: "male" | "female" | "other";
  tokenNumber: string; // e.g. "A-19"
  consultationType: ConsultationType;
  priority: QueuePriority;
  waitingSinceMinutes: number;
  status: QueueStatus;
  estimatedWaitMinutes: number;
  appointmentTime: string;
  reason: string;
}

export interface ClinicalVitals {
  bpSystolic?: number; // mmHg
  bpDiastolic?: number; // mmHg
  heartRate?: number; // bpm
  temperature?: number; // °F
  spo2?: number; // %
  weightKg?: number; // kg
  heightCm?: number; // cm
  bmi?: number;
}

export interface PrescriptionMedicine {
  id: string;
  name: string; // e.g. "Tab. Panadol 500mg" or "Cap. Omeprazole 20mg"
  genericName?: string;
  dosage: string; // e.g. "1 Tablet"
  frequency: string; // e.g. "TDS (1-1-1)" or "BD (1-0-1)" or "OD (1-0-0)"
  duration: string; // e.g. "5 Days" or "2 Weeks"
  instructions: string; // e.g. "After meals" or "Before breakfast"
  route: "oral" | "topical" | "injection" | "inhalation" | "drops";
}

export interface LabOrder {
  id: string;
  testName: string; // e.g. "Complete Blood Picture (CP)", "Lipid Profile", "ECG 12-Lead"
  category: string; // e.g. "Hematology", "Cardiology", "Biochemistry"
  priority: LabPriority;
  notes?: string;
  status: LabOrderStatus;
  resultSummary?: string;
  referenceRange?: string;
  abnormalFlag?: boolean;
  orderedAt: string;
  completedAt?: string;
}

export interface ClinicalEncounter {
  id: string;
  appointmentId: string;
  patientProfileId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  tenantId: string;
  date: string;
  chiefComplaint: string;
  symptoms: string[];
  vitals: ClinicalVitals;
  clinicalNotes: string;
  assessment: string;
  diagnosis: string;
  treatmentPlan?: string;
  icd10Code?: string; // Architecture ready for ICD-10 integration
  medications: PrescriptionMedicine[];
  labOrders: LabOrder[];
  followUpRequired: boolean;
  followUpDate?: string;
  followUpReason?: string;
  status: "draft" | "in_progress" | "completed";
  completedAt?: string;
}

export interface DigitalPrescription {
  id: string;
  prescriptionNumber: string; // e.g. "RX-2026-0924-01"
  consultationId: string;
  appointmentId: string;
  patientProfileId: string;
  patientName: string;
  patientAge: number;
  patientGender: "male" | "female" | "other";
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  pmdcRegistration: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  date: string;
  diagnosis: string;
  vitalsSummary?: string;
  medicines: PrescriptionMedicine[];
  doctorNotes?: string;
  followUpText?: string;
  signatureText: string;
  issuedAt: string;
}

export interface FollowUpRecord {
  id: string;
  patientProfileId: string;
  patientName: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  doctorId: string;
  clinicId: string;
  previousVisitDate: string;
  followUpDate: string; // e.g. "2026-09-24"
  reason: string;
  status: "pending" | "completed" | "overdue";
  notes?: string;
}

export interface DoctorAvailabilityConfig {
  doctorId: string;
  clinicId: string;
  workingDays: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "17:00"
  slotDurationMinutes: 15 | 20 | 30 | 45 | 60;
  bufferMinutes: number;
  breakStartTime: string; // e.g. "13:00"
  breakEndTime: string; // e.g. "14:00"
  consultationModes: ConsultationType[];
  roomNumber: string;
  maxPatientsPerDay: number;
}

export interface DoctorNotificationItem {
  id: string;
  type: "check_in" | "lab_result" | "follow_up" | "reminder" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "normal" | "high";
  link?: string;
}

export interface DoctorAnalyticsSummary {
  todayAppointments: number;
  waitingCount: number;
  completedCount: number;
  upcomingCount: number;
  followUpsDueCount: number;
  noShowCount: number;
  avgWaitMinutes: number;
  avgConsultationMinutes: number;
  followUpRatePercent: number;
  appointmentUtilizationPercent: number;
  weeklyTrend: { day: string; count: number; completed: number }[];
  hourlyPeaks: { hour: string; count: number }[];
  statusDistribution: { status: string; label: string; count: number; color: string }[];
}

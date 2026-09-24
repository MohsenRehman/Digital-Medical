export type ClinicPlanTier = "basic" | "pro" | "professional";

export type ClinicSpecialityType =
  | "General Medicine"
  | "Cardiology"
  | "Pediatrics"
  | "Neurology"
  | "Orthopedics"
  | "Gynecology"
  | "Dermatology"
  | "Dental"
  | "ENT"
  | "Pulmonology"
  | "Other";

export type ClinicApplicationStatus =
  | "draft"
  | "pending_admin_verification"
  | "approved"
  | "rejected";

export interface ClinicCredentials {
  clinicName: string;
  ownerFullName: string;
  email: string;
  password: string;
}

export interface ClinicContactDetails {
  mobileNumber: string; // strict formatted e.g. 0300-1234567
  physicalAddress: string;
  city: string;
  speciality: ClinicSpecialityType | string;
}

export interface PharmacyAddon {
  isAdded: boolean;
  monthlyFee: number; // e.g. 3500
}

export interface PaymentProof {
  bankName: string; // e.g. "Meezan Bank" or "Raast ID"
  accountTitle: string;
  transactionId: string;
  paymentReceiptName?: string;
  paymentReceiptPreview?: string;
  paymentDate: string;
  amountPaid: number;
}

export interface ClinicRegistrationDraft {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  credentials: ClinicCredentials;
  contact: ClinicContactDetails;
  isEmailVerified: boolean;
  emailOtpCode?: string;
  pharmacyAddon: PharmacyAddon;
  selectedPlan: ClinicPlanTier;
  paymentProof?: PaymentProof;
}

export interface ClinicApplicationRecord {
  id: string;
  referenceNo: string; // e.g. "CLN-82914"
  clinicName: string;
  ownerFullName: string;
  email: string;
  mobileNumber: string;
  physicalAddress: string;
  city: string;
  speciality: string;
  pharmacyIncluded: boolean;
  plan: ClinicPlanTier;
  totalMonthlyAmount: number;
  paymentProof: PaymentProof;
  status: ClinicApplicationStatus;
  adminNotes?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface ClinicUser {
  id: string;
  clinicId: string;
  clinicName: string;
  ownerFullName: string;
  email: string;
  role: "clinic_admin";
  isActive: boolean;
  pharmacyEnabled: boolean;
  plan: ClinicPlanTier;
}

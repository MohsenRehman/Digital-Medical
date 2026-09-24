export type AppointmentRelation =
  | "self"
  | "father"
  | "mother"
  | "son"
  | "daughter"
  | "spouse"
  | "other";

export type GenderType = "male" | "female" | "other";

export interface PatientUser {
  id: string;
  phone: string; // e.g. "+923001234567" or "03001234567"
  isPhoneVerified: boolean;
  name: string;
  gender?: GenderType;
  age?: number;
  password?: string; // Optional password set in Section 3
  profileCompleted: boolean;
  createdAt: string;
}

export interface FamilyMemberRecord {
  id: string;
  relation: AppointmentRelation;
  name: string;
  age?: number;
  gender?: GenderType;
  addedAt: string;
}

export interface AppointmentRecord {
  id: string;
  bookingRef: string; // e.g. "DM-8942"
  patientUserId: string;
  patientPhone: string;
  bookedByRelation: AppointmentRelation;
  patientName: string;
  patientAge?: number;
  patientGender?: GenderType;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage?: string;
  clinicName: string;
  clinicLocation: string;
  date: string; // e.g. "Today, 24 Sep"
  timeSlot: string; // e.g. "05:30 PM"
  consultationFee: number; // e.g. 2000
  paymentMethod: "pay_at_clinic" | "online_paid";
  remindViaWhatsApp: boolean;
  status: "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface BookingDraft {
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage?: string;
  clinicName: string;
  clinicLocation: string;
  consultationFee: number;
  date: string;
  timeSlot: string;
  phone: string;
  relation: AppointmentRelation;
  patientName: string;
  patientAge?: number;
  patientGender?: GenderType;
  notes?: string;
}

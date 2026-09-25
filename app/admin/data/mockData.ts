export type ClinicStatus = "Active" | "Pending" | "Suspended";
export type SubscriptionPlan = "Basic" | "Professional" | "Enterprise" | "Trial";

export interface Clinic {
  id: string;
  clinic: string;
  location: string;
  status: ClinicStatus;
  doctors: number;
  staff: number;
  patients: number;
  plan: SubscriptionPlan;
  submitted?: string;
  contact?: string;
  email?: string;
  billingStatus?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  clinic: string;
  experience: string;
  patients: number;
  status: "Active" | "On Leave" | "Inactive";
  joinedDate: string;
}

export interface Patient {
  id: string;
  name: string;
  gender: string;
  age: number;
  clinic: string;
  doctor: string;
  lastVisit: string;
  status: "Active" | "Recovered" | "In Treatment";
}

export interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  clinic: string;
  date: string;
  time: string;
  type: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface Payment {
  id: string;
  invoiceId: string;
  clinic: string;
  plan: SubscriptionPlan;
  amount: number;
  date: string;
  method: string;
  status: "Paid" | "Pending" | "Failed";
}

export const clinicGrowthData = [
  { month: "Apr", clinics: 72 },
  { month: "May", clinics: 81 },
  { month: "Jun", clinics: 89 },
  { month: "Jul", clinics: 101 },
  { month: "Aug", clinics: 116 },
  { month: "Sep", clinics: 128 },
];

export const clinics: Clinic[] = [
  { id: "c1", clinic: "City Medical", location: "Peshawar", status: "Active", doctors: 18, staff: 12, patients: 4820, plan: "Professional", contact: "+92 300 1234567", email: "contact@citymedical.com", billingStatus: "Paid", submitted: "10 Jan 2024" },
  { id: "c2", clinic: "Al-Shifa Clinic", location: "Lahore", status: "Active", doctors: 9, staff: 7, patients: 2140, plan: "Basic", contact: "+92 300 7654321", email: "info@alshifa.com", billingStatus: "Paid", submitted: "15 Feb 2024" },
  { id: "c3", clinic: "Life Care Clinic", location: "Islamabad", status: "Pending", doctors: 5, staff: 4, patients: 680, plan: "Professional", contact: "+92 321 9876543", email: "admin@lifecare.com", billingStatus: "Pending", submitted: "23 Sep 2024" },
  { id: "c4", clinic: "Medix Clinic", location: "Karachi", status: "Active", doctors: 14, staff: 10, patients: 3210, plan: "Enterprise", contact: "+92 333 1122334", email: "hello@medix.com", billingStatus: "Paid", submitted: "05 Mar 2024" },
  { id: "c5", clinic: "Health Plus Clinic", location: "Multan", status: "Suspended", doctors: 3, staff: 2, patients: 150, plan: "Basic", contact: "+92 345 5566778", email: "support@healthplus.com", billingStatus: "Failed", submitted: "12 May 2024" },
];

export const pendingRegistrations = clinics.filter(c => c.status === "Pending");

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Ahmed Khan", specialization: "Cardiologist", clinic: "City Medical", experience: "12 Years", patients: 1200, status: "Active", joinedDate: "12 Feb 2024" },
  { id: "d2", name: "Dr. Sara Ali", specialization: "Pediatrician", clinic: "Al-Shifa Clinic", experience: "8 Years", patients: 850, status: "Active", joinedDate: "20 Mar 2024" },
  { id: "d3", name: "Dr. Raza Syed", specialization: "Neurologist", clinic: "City Medical", experience: "15 Years", patients: 940, status: "On Leave", joinedDate: "05 Jan 2024" },
  { id: "d4", name: "Dr. Fatima Noor", specialization: "Dermatologist", clinic: "Medix Clinic", experience: "5 Years", patients: 400, status: "Active", joinedDate: "10 Apr 2024" },
];

export const patients: Patient[] = [
  { id: "pt1", name: "Ali Usman", gender: "Male", age: 45, clinic: "City Medical", doctor: "Dr. Ahmed Khan", lastVisit: "24 Sep 2024", status: "In Treatment" },
  { id: "pt2", name: "Ayesha Bibi", gender: "Female", age: 32, clinic: "Al-Shifa Clinic", doctor: "Dr. Sara Ali", lastVisit: "20 Sep 2024", status: "Recovered" },
  { id: "pt3", name: "Zainab Tariq", gender: "Female", age: 28, clinic: "Medix Clinic", doctor: "Dr. Fatima Noor", lastVisit: "25 Sep 2024", status: "Active" },
  { id: "pt4", name: "Omer Farooq", gender: "Male", age: 50, clinic: "City Medical", doctor: "Dr. Raza Syed", lastVisit: "15 Sep 2024", status: "Active" },
];

export const appointments: Appointment[] = [
  { id: "apt1", patient: "Ali Usman", doctor: "Dr. Ahmed Khan", clinic: "City Medical", date: "26 Sep 2024", time: "10:00 AM", type: "Checkup", status: "Scheduled" },
  { id: "apt2", patient: "Zainab Tariq", doctor: "Dr. Fatima Noor", clinic: "Medix Clinic", date: "26 Sep 2024", time: "11:30 AM", type: "Consultation", status: "Scheduled" },
  { id: "apt3", patient: "Ayesha Bibi", doctor: "Dr. Sara Ali", clinic: "Al-Shifa Clinic", date: "25 Sep 2024", time: "09:00 AM", type: "Follow-up", status: "Completed" },
  { id: "apt4", patient: "Omer Farooq", doctor: "Dr. Raza Syed", clinic: "City Medical", date: "27 Sep 2024", time: "02:00 PM", type: "Checkup", status: "Cancelled" },
];

export const payments: Payment[] = [
  { id: "pay1", invoiceId: "INV-2024-001", clinic: "City Medical", plan: "Professional", amount: 15000, date: "01 Sep 2024", method: "Credit Card", status: "Paid" },
  { id: "pay2", invoiceId: "INV-2024-002", clinic: "Al-Shifa Clinic", plan: "Basic", amount: 5000, date: "05 Sep 2024", method: "Bank Transfer", status: "Paid" },
  { id: "pay3", invoiceId: "INV-2024-003", clinic: "Life Care Clinic", plan: "Professional", amount: 15000, date: "23 Sep 2024", method: "Credit Card", status: "Pending" },
  { id: "pay4", invoiceId: "INV-2024-004", clinic: "Health Plus Clinic", plan: "Basic", amount: 5000, date: "12 Sep 2024", method: "Credit Card", status: "Failed" },
];

export const subscriptionOverview = {
  distribution: [
    { plan: "Basic", count: 42, percentage: 33 },
    { plan: "Professional", count: 48, percentage: 42 },
    { plan: "Enterprise", count: 14, percentage: 17 },
    { plan: "Trial", count: 4, percentage: 8 },
  ],
  status: { active: 96, expiringSoon: 8 }
};

export const billingSummary = { paidPayments: 96, pendingPayments: 12, failedPayments: 4, outstanding: "Rs. 245,000" };

export const recentActivity = [
  { id: "a1", title: "City Medical Clinic approved", type: "approval", time: "10 minutes ago" },
  { id: "a2", title: "Al-Shifa Clinic registered", type: "registration", time: "25 minutes ago" },
  { id: "a3", title: "Medix Clinic subscription renewed", type: "subscription", time: "1 hour ago" },
  { id: "a4", title: "Life Care Clinic payment received", type: "payment", time: "2 hours ago" },
];

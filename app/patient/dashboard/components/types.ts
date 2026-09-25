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

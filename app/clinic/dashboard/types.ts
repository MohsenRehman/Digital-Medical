export type DashboardNavModule =
  | "overview"
  | "appointments"
  | "queue"
  | "patients"
  | "doctors"
  | "staff"
  | "clinical"
  | "pharmacy"
  | "laboratory"
  | "billing"
  | "inventory"
  | "reports"
  | "subscription"
  | "settings"
  | "notifications"
  | "support"
  | "activity";

export type AppointmentStatus =
  | "scheduled"
  | "arrived"
  | "in-consultation"
  | "completed"
  | "cancelled"
  | "no-show";

export type QueueTokenStatus =
  | "waiting"
  | "called"
  | "in-consultation"
  | "completed"
  | "no-show";

export interface DashboardPatient {
  id: string;
  mrn: string; // Medical Record Number
  name: string;
  phone: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  city: string;
  registeredDate: string;
  lastVisit: string;
  totalVisits: number;
  status: "Active" | "Follow-up" | "Discharged";
  assignedDoctor?: string;
  notes?: string;
  allergies?: string[];
  recentVitals?: {
    bp: string;
    pulse: string;
    temp: string;
    weight: string;
  };
}

export interface DashboardAppointment {
  id: string;
  bookingRef: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  timeSlot: string;
  type: "Online Booking" | "Walk-in" | "Follow-up" | "Emergency";
  status: AppointmentStatus;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  fee: number;
  tokenNo?: number;
  room?: string;
  notes?: string;
}

export interface DashboardQueueItem {
  id: string;
  tokenNo: number;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  room: string;
  department: string;
  checkInTime: string;
  estimatedWaitMins: number;
  status: QueueTokenStatus;
  priority: "Normal" | "Urgent" | "Elderly";
}

export interface DashboardDoctor {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  licenseNo: string;
  room: string;
  department: string;
  shifts: string;
  workingDays: string[];
  consultationFee: number;
  avatar?: string;
  status: "Available" | "In Consultation" | "Off Duty" | "On Break";
  todayAppointmentsCount: number;
  waitingCount: number;
  completedTodayCount: number;
  monthlyPatients: number;
  rating: number;
}

export interface DashboardStaff {
  id: string;
  employeeId: string;
  name: string;
  role: "Receptionist" | "Cashier" | "Nurse" | "Pharmacist" | "Lab Technician" | "Admin Staff";
  phone: string;
  email: string;
  shift: "Morning (08 AM - 04 PM)" | "Evening (02 PM - 10 PM)" | "Night (10 PM - 08 AM)";
  status: "Active" | "On Leave" | "Suspended";
  joiningDate: string;
  department: string;
}

export interface DashboardMedicine {
  id: string;
  name: string;
  generic: string;
  category: "Tablet" | "Syrup" | "Injection" | "Capsule" | "Drops" | "Ointment";
  strength: string;
  batchNo: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  purchasePrice: number;
  salePrice: number;
  expiryDate: string;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock" | "expiring_soon";
  supplier: string;
}

export interface DashboardLabOrder {
  id: string;
  orderNo: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  testName: string;
  category: "Hematology" | "Biochemistry" | "Microbiology" | "Radiology" | "Pathology";
  orderDate: string;
  sampleStatus: "Sample Needed" | "Collected" | "Processing" | "Completed";
  resultStatus: "Pending" | "Draft" | "Verified" | "Delivered";
  fee: number;
  assignedTechnician: string;
  resultSummary?: string;
}

export interface DashboardInvoice {
  id: string;
  invoiceNo: string;
  patientId: string;
  patientName: string;
  service: "OPD Consultation" | "Pharmacy Bill" | "Laboratory Test" | "Procedure";
  date: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod: "Cash" | "Credit/Debit Card" | "Online Bank Transfer" | "JazzCash/EasyPaisa";
  status: "Paid" | "Partial" | "Unpaid" | "Refunded";
  doctorName?: string;
}

export interface DashboardInventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: "Consumable" | "Surgical" | "Diagnostic" | "PPE / Hygiene" | "Stationery";
  quantity: number;
  unit: string;
  reorderLevel: number;
  supplier: string;
  lastRestocked: string;
  status: "In Stock" | "Low Stock" | "Critical";
  location: string;
}

export interface DashboardActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
  module: string;
  type: "info" | "success" | "warning" | "error";
}

export interface DashboardSupportTicket {
  id: string;
  ticketNo: string;
  subject: string;
  category: "Billing" | "Technical" | "Feature Request" | "Hardware/Printer" | "Other";
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  lastReply: string;
}

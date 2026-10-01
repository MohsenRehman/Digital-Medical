/**
 * Doctor Service Layer
 * Abstracts clinical data interactions, queue management, consultations,
 * prescriptions, labs, and analytics. Enables easy swap from mock to real REST/GraphQL APIs.
 */

import {
  DoctorProfile,
  PatientProfile,
  DoctorAppointment,
  QueueEntry,
  ClinicalEncounter,
  DigitalPrescription,
  FollowUpRecord,
  LabOrder,
  DoctorAvailabilityConfig,
  DoctorNotificationItem,
  DoctorAnalyticsSummary,
  DoctorReview,
} from "@/lib/types/doctor";
import {
  MOCK_DOCTOR_PROFILE,
  MOCK_PATIENT_PROFILES,
  MOCK_APPOINTMENTS,
  MOCK_QUEUE,
  MOCK_CONSULTATIONS,
  MOCK_PRESCRIPTIONS,
  MOCK_FOLLOW_UPS,
  MOCK_LAB_ORDERS,
  MOCK_AVAILABILITY,
  MOCK_NOTIFICATIONS,
  MOCK_ANALYTICS,
  MOCK_DOCTOR_REVIEWS,
} from "@/lib/doctor/mockData";

export interface DoctorServiceState {
  doctor: DoctorProfile;
  patients: PatientProfile[];
  appointments: DoctorAppointment[];
  queue: QueueEntry[];
  consultations: ClinicalEncounter[];
  prescriptions: DigitalPrescription[];
  followUps: FollowUpRecord[];
  labOrders: LabOrder[];
  availability: DoctorAvailabilityConfig;
  notifications: DoctorNotificationItem[];
  analytics: DoctorAnalyticsSummary;
}

const STORAGE_KEY = "dm_doctor_workspace_v1";

export class DoctorService {
  static getBaseState(): DoctorServiceState {
    return {
      doctor: MOCK_DOCTOR_PROFILE,
      patients: MOCK_PATIENT_PROFILES,
      appointments: MOCK_APPOINTMENTS,
      queue: MOCK_QUEUE,
      consultations: MOCK_CONSULTATIONS,
      prescriptions: MOCK_PRESCRIPTIONS,
      followUps: MOCK_FOLLOW_UPS,
      labOrders: MOCK_LAB_ORDERS,
      availability: MOCK_AVAILABILITY,
      notifications: MOCK_NOTIFICATIONS,
      analytics: MOCK_ANALYTICS,
    };
  }

  private static loadState(): DoctorServiceState {
    if (typeof window === "undefined") {
      return {
        doctor: MOCK_DOCTOR_PROFILE,
        patients: MOCK_PATIENT_PROFILES,
        appointments: MOCK_APPOINTMENTS,
        queue: MOCK_QUEUE,
        consultations: MOCK_CONSULTATIONS,
        prescriptions: MOCK_PRESCRIPTIONS,
        followUps: MOCK_FOLLOW_UPS,
        labOrders: MOCK_LAB_ORDERS,
        availability: MOCK_AVAILABILITY,
        notifications: MOCK_NOTIFICATIONS,
        analytics: MOCK_ANALYTICS,
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.doctor = { ...MOCK_DOCTOR_PROFILE, ...parsed.doctor };
        return parsed;
      }
    } catch {
      // ignore
    }

    const initialState: DoctorServiceState = {
      doctor: MOCK_DOCTOR_PROFILE,
      patients: MOCK_PATIENT_PROFILES,
      appointments: MOCK_APPOINTMENTS,
      queue: MOCK_QUEUE,
      consultations: MOCK_CONSULTATIONS,
      prescriptions: MOCK_PRESCRIPTIONS,
      followUps: MOCK_FOLLOW_UPS,
      labOrders: MOCK_LAB_ORDERS,
      availability: MOCK_AVAILABILITY,
      notifications: MOCK_NOTIFICATIONS,
      analytics: MOCK_ANALYTICS,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    } catch {
      // ignore
    }
    return initialState;
  }

  private static saveState(state: DoctorServiceState): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.error("Failed to save doctor service state to localStorage", err);
      }
    }
  }

  // --- Doctor & Clinic Profile ---
  static getProfile(): DoctorProfile {
    return this.loadState().doctor;
  }

  static switchActiveClinic(clinicId: string): DoctorProfile {
    const state = this.loadState();
    const target = state.doctor.affiliatedClinics.find((c) => c.id === clinicId);
    if (target) {
      state.doctor.activeClinicId = clinicId;
      this.saveState(state);
    }
    return state.doctor;
  }

  static updateDoctorProfile(updates: Partial<DoctorProfile>): DoctorProfile {
    const state = this.loadState();
    state.doctor = { ...state.doctor, ...updates };
    this.saveState(state);
    return state.doctor;
  }

  static getReviews(): DoctorReview[] {
    return MOCK_DOCTOR_REVIEWS;
  }

  // --- Appointments ---
  static getAppointments(): DoctorAppointment[] {
    return this.loadState().appointments;
  }

  static getAppointmentById(id: string): DoctorAppointment | undefined {
    return this.loadState().appointments.find((a) => a.id === id);
  }

  static updateAppointmentStatus(
    id: string,
    status: DoctorAppointment["status"]
  ): DoctorAppointment | undefined {
    const state = this.loadState();
    const apt = state.appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = status;
      this.saveState(state);
    }
    return apt;
  }

  // --- Live Queue ---
  static getQueue(): QueueEntry[] {
    return this.loadState().queue;
  }

  static callNextPatient(): { current?: QueueEntry; next?: QueueEntry } {
    const state = this.loadState();
    // mark current in_progress as completed if exists
    const current = state.queue.find((q) => q.status === "in_progress");
    if (current) {
      current.status = "completed";
      const apt = state.appointments.find((a) => a.id === current.appointmentId);
      if (apt) apt.status = "completed";
    }

    // find first waiting
    const nextWaiting = state.queue.find((q) => q.status === "waiting");
    if (nextWaiting) {
      nextWaiting.status = "in_progress";
      const apt = state.appointments.find((a) => a.id === nextWaiting.appointmentId);
      if (apt) apt.status = "in_progress";
    }

    this.saveState(state);
    return {
      current: nextWaiting,
      next: state.queue.find((q) => q.status === "waiting"),
    };
  }

  static startConsultationFromQueue(queueId: string): QueueEntry | undefined {
    const state = this.loadState();
    const entry = state.queue.find((q) => q.id === queueId);
    if (entry) {
      // if another is in progress, mark completed
      state.queue.forEach((q) => {
        if (q.status === "in_progress" && q.id !== queueId) {
          q.status = "completed";
          const apt = state.appointments.find((a) => a.id === q.appointmentId);
          if (apt) apt.status = "completed";
        }
      });
      entry.status = "in_progress";
      const apt = state.appointments.find((a) => a.id === entry.appointmentId);
      if (apt) apt.status = "in_progress";
      this.saveState(state);
    }
    return entry;
  }

  static skipQueuePatient(queueId: string): void {
    const state = this.loadState();
    const entry = state.queue.find((q) => q.id === queueId);
    if (entry) {
      entry.status = "skipped";
      this.saveState(state);
    }
  }

  static markQueueNoShow(queueId: string): void {
    const state = this.loadState();
    const entry = state.queue.find((q) => q.id === queueId);
    if (entry) {
      entry.status = "no_show";
      const apt = state.appointments.find((a) => a.id === entry.appointmentId);
      if (apt) apt.status = "no_show";
      this.saveState(state);
    }
  }

  // --- Patients & Global Search ---
  static getPatients(): PatientProfile[] {
    return this.loadState().patients;
  }

  static getPatientById(id: string): PatientProfile | undefined {
    return this.loadState().patients.find(
      (p) => p.id.toLowerCase() === id.toLowerCase() || p.patientUserId === id
    );
  }

  static searchPatients(query: string): PatientProfile[] {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();
    const state = this.loadState();
    return state.patients.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchPhone = p.phone.replace(/[^0-9]/g, "").includes(q.replace(/[^0-9]/g, ""));
      const matchId = p.id.toLowerCase().includes(q);
      return matchName || matchPhone || matchId;
    });
  }

  // --- Consultations / Clinical Encounters ---
  static getConsultations(): ClinicalEncounter[] {
    return this.loadState().consultations;
  }

  static getConsultationByAppointmentId(appointmentId: string): ClinicalEncounter | undefined {
    const state = this.loadState();
    return state.consultations.find((c) => c.appointmentId === appointmentId);
  }

  static saveConsultationDraft(data: Partial<ClinicalEncounter> & { appointmentId: string; patientProfileId: string }): ClinicalEncounter {
    const state = this.loadState();
    const existingIndex = state.consultations.findIndex((c) => c.appointmentId === data.appointmentId);

    const activeClinic = state.doctor.affiliatedClinics.find((c) => c.id === state.doctor.activeClinicId) || state.doctor.affiliatedClinics[0];

    const encounter: ClinicalEncounter = {
      id: existingIndex >= 0 ? state.consultations[existingIndex].id : `enc-${Date.now()}`,
      appointmentId: data.appointmentId,
      patientProfileId: data.patientProfileId,
      patientName: data.patientName || "Patient",
      doctorId: state.doctor.id,
      doctorName: state.doctor.name,
      clinicId: activeClinic.id,
      tenantId: activeClinic.tenantId,
      date: data.date || new Date().toISOString().split("T")[0],
      chiefComplaint: data.chiefComplaint || "",
      symptoms: data.symptoms || [],
      vitals: data.vitals || {},
      clinicalNotes: data.clinicalNotes || "",
      assessment: data.assessment || "",
      diagnosis: data.diagnosis || "",
      treatmentPlan: data.treatmentPlan || "",
      icd10Code: data.icd10Code,
      medications: data.medications || [],
      labOrders: data.labOrders || [],
      followUpRequired: !!data.followUpRequired,
      followUpDate: data.followUpDate,
      followUpReason: data.followUpReason,
      status: "draft",
    };

    if (existingIndex >= 0) {
      state.consultations[existingIndex] = encounter;
    } else {
      state.consultations.push(encounter);
    }

    this.saveState(state);
    return encounter;
  }

  static completeConsultation(encounterId: string): { encounter: ClinicalEncounter; prescription: DigitalPrescription } {
    const state = this.loadState();
    const enc = state.consultations.find((c) => c.id === encounterId);
    if (!enc) {
      throw new Error("Consultation not found");
    }

    enc.status = "completed";
    enc.completedAt = new Date().toISOString();

    // Mark appointment as completed
    const apt = state.appointments.find((a) => a.id === enc.appointmentId);
    if (apt) {
      apt.status = "completed";
    }

    // Mark queue as completed
    const q = state.queue.find((item) => item.appointmentId === enc.appointmentId);
    if (q) {
      q.status = "completed";
    }

    // If follow-up required, record follow-up
    if (enc.followUpRequired && enc.followUpDate) {
      const patient = state.patients.find((p) => p.id === enc.patientProfileId);
      state.followUps.push({
        id: `fup-${Date.now()}`,
        patientProfileId: enc.patientProfileId,
        patientName: enc.patientName,
        age: patient ? patient.age : 30,
        gender: patient ? patient.gender : "male",
        phone: patient ? patient.phone : "0300-0000000",
        doctorId: state.doctor.id,
        clinicId: enc.clinicId,
        previousVisitDate: enc.date,
        followUpDate: enc.followUpDate,
        reason: enc.followUpReason || "Clinical review after treatment course",
        status: "pending",
      });
    }

    // If lab orders added, push to labOrders list
    if (enc.labOrders && enc.labOrders.length > 0) {
      enc.labOrders.forEach((order) => {
        state.labOrders.unshift(order);
      });
    }

    // Generate Digital Prescription
    const patient = state.patients.find((p) => p.id === enc.patientProfileId);
    const activeClinic = state.doctor.affiliatedClinics.find((c) => c.id === enc.clinicId) || state.doctor.affiliatedClinics[0];

    const rxNumber = `RX-${new Date().getFullYear()}-${String(state.prescriptions.length + 1).padStart(4, "0")}`;
    const prescription: DigitalPrescription = {
      id: `rx-${Date.now()}`,
      prescriptionNumber: rxNumber,
      consultationId: enc.id,
      appointmentId: enc.appointmentId,
      patientProfileId: enc.patientProfileId,
      patientName: enc.patientName,
      patientAge: patient?.age || 30,
      patientGender: patient?.gender || "male",
      patientPhone: patient?.phone || "0300-1234567",
      doctorId: state.doctor.id,
      doctorName: state.doctor.name,
      doctorSpecialty: state.doctor.title,
      pmdcRegistration: state.doctor.pmdcRegistration,
      clinicName: activeClinic.name,
      clinicAddress: activeClinic.address,
      clinicPhone: activeClinic.phone,
      date: enc.date,
      diagnosis: enc.diagnosis || "Clinical evaluation complete",
      vitalsSummary: enc.vitals
        ? `BP: ${enc.vitals.bpSystolic || "-"}/${enc.vitals.bpDiastolic || "-"} mmHg | HR: ${enc.vitals.heartRate || "-"} bpm | SpO2: ${enc.vitals.spo2 || "-"}%`
        : undefined,
      medicines: enc.medications,
      doctorNotes: enc.clinicalNotes || enc.treatmentPlan,
      followUpText: enc.followUpRequired && enc.followUpDate ? `Review on ${enc.followUpDate}` : undefined,
      signatureText: `Electronically Signed by ${state.doctor.name} (PMDC: ${state.doctor.pmdcRegistration})`,
      issuedAt: new Date().toISOString(),
    };

    state.prescriptions.unshift(prescription);
    this.saveState(state);

    return { encounter: enc, prescription };
  }

  // --- Prescriptions ---
  static getPrescriptions(): DigitalPrescription[] {
    return this.loadState().prescriptions;
  }

  static getPrescriptionById(id: string): DigitalPrescription | undefined {
    return this.loadState().prescriptions.find((p) => p.id === id || p.prescriptionNumber === id);
  }

  // --- Labs / Investigations ---
  static getLabOrders(): LabOrder[] {
    return this.loadState().labOrders;
  }

  static createLabOrder(order: Omit<LabOrder, "id" | "orderedAt">): LabOrder {
    const state = this.loadState();
    const newOrder: LabOrder = {
      ...order,
      id: `lab-${Date.now()}`,
      orderedAt: new Date().toISOString().split("T")[0],
    };
    state.labOrders.unshift(newOrder);
    this.saveState(state);
    return newOrder;
  }

  // --- Follow-ups ---
  static getFollowUps(): FollowUpRecord[] {
    return this.loadState().followUps;
  }

  static markFollowUpCompleted(id: string): void {
    const state = this.loadState();
    const fup = state.followUps.find((f) => f.id === id);
    if (fup) {
      fup.status = "completed";
      this.saveState(state);
    }
  }

  // --- Availability ---
  static getAvailability(): DoctorAvailabilityConfig {
    return this.loadState().availability;
  }

  static saveAvailability(config: DoctorAvailabilityConfig): DoctorAvailabilityConfig {
    const state = this.loadState();
    state.availability = config;
    this.saveState(state);
    return config;
  }

  // --- Notifications ---
  static getNotifications(): DoctorNotificationItem[] {
    return this.loadState().notifications;
  }

  static markNotificationRead(id: string): void {
    const state = this.loadState();
    const notif = state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveState(state);
    }
  }

  static markAllNotificationsRead(): void {
    const state = this.loadState();
    state.notifications.forEach((n) => (n.isRead = true));
    this.saveState(state);
  }

  // --- Analytics ---
  static getAnalytics(): DoctorAnalyticsSummary {
    const state = this.loadState();
    // Calculate live aggregates
    const today = state.appointments.filter((a) => a.scheduledAt === "2026-09-24");
    const completed = today.filter((a) => a.status === "completed").length;
    const waiting = state.queue.filter((q) => q.status === "waiting").length;
    const upcoming = today.filter((a) => a.status === "scheduled" || a.status === "confirmed").length;
    const followUpsToday = state.followUps.filter((f) => f.followUpDate === "2026-09-24" && f.status !== "completed").length;

    return {
      ...state.analytics,
      todayAppointments: today.length,
      completedCount: completed,
      waitingCount: waiting,
      upcomingCount: upcoming,
      followUpsDueCount: followUpsToday,
    };
  }

  // Reset demo state back to default
  static resetDemoData(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }
}

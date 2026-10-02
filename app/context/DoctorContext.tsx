"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  DoctorProfile,
  ClinicAffiliation,
  DoctorAppointment,
  QueueEntry,
  PatientProfile,
  ClinicalEncounter,
  DigitalPrescription,
  FollowUpRecord,
  LabOrder,
  DoctorAvailabilityConfig,
  DoctorNotificationItem,
  DoctorAnalyticsSummary,
  DoctorAvailabilityStatus,
  DoctorReview,
} from "@/lib/types/doctor";
import { DoctorService } from "@/lib/doctor/doctorService";

interface DoctorContextType {
  isLoaded: boolean;
  doctor: DoctorProfile;
  activeClinic: ClinicAffiliation;
  doctorStatus: DoctorAvailabilityStatus;
  setDoctorStatus: (status: DoctorAvailabilityStatus) => void;
  switchClinic: (clinicId: string) => void;
  updateDoctorProfile: (updates: Partial<DoctorProfile>) => void;

  // Reviews
  reviews: DoctorReview[];

  // Appointments
  appointments: DoctorAppointment[];
  refreshAppointments: () => void;
  updateAppointmentStatus: (id: string, status: DoctorAppointment["status"]) => void;

  // Live Queue
  queue: QueueEntry[];
  currentQueuePatient?: QueueEntry;
  waitingQueue: QueueEntry[];
  callNextPatient: () => void;
  startConsultationFromQueue: (queueId: string) => void;
  skipQueuePatient: (queueId: string) => void;
  markQueueNoShow: (queueId: string) => void;

  // Patients & Global Search
  patients: PatientProfile[];
  searchPatients: (query: string) => PatientProfile[];
  getPatientById: (id: string) => PatientProfile | undefined;

  // Consultations & Encounters
  consultations: ClinicalEncounter[];
  saveConsultationDraft: (data: Partial<ClinicalEncounter> & { appointmentId: string; patientProfileId: string }) => ClinicalEncounter;
  completeConsultation: (encounterId: string) => { encounter: ClinicalEncounter; prescription: DigitalPrescription };

  // Prescriptions
  prescriptions: DigitalPrescription[];
  getPrescriptionById: (id: string) => DigitalPrescription | undefined;

  // Labs
  labOrders: LabOrder[];
  createLabOrder: (order: Omit<LabOrder, "id" | "orderedAt">) => LabOrder;

  // Follow-ups
  followUps: FollowUpRecord[];
  markFollowUpCompleted: (id: string) => void;

  // Availability
  availability: DoctorAvailabilityConfig;
  updateAvailability: (config: DoctorAvailabilityConfig) => void;

  // Notifications
  notifications: DoctorNotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Analytics
  analytics: DoctorAnalyticsSummary;

  // Sidebar Layout State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebarCollapsed: () => void;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export function DoctorProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const base = useMemo(() => DoctorService.getBaseState(), []);
  const [doctor, setDoctor] = useState<DoctorProfile>(base.doctor);
  const [doctorStatus, setDoctorStatus] = useState<DoctorAvailabilityStatus>("available");
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(base.appointments);
  const [queue, setQueue] = useState<QueueEntry[]>(base.queue);
  const [patients, setPatients] = useState<PatientProfile[]>(base.patients);
  const [consultations, setConsultations] = useState<ClinicalEncounter[]>(base.consultations);
  const [prescriptions, setPrescriptions] = useState<DigitalPrescription[]>(base.prescriptions);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(base.labOrders);
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(base.followUps);
  const [availability, setAvailability] = useState<DoctorAvailabilityConfig>(base.availability);
  const [notifications, setNotifications] = useState<DoctorNotificationItem[]>(base.notifications);
  const [analytics, setAnalytics] = useState<DoctorAnalyticsSummary>(base.analytics);
  const [reviews, setReviews] = useState<DoctorReview[]>(() => DoctorService.getReviews());

  // Persistent Doctor Sidebar state (desktop collapsed / expanded)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dm_doctor_sidebar_collapsed");
      if (saved === "true") {
        setSidebarCollapsed(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("dm_doctor_sidebar_collapsed", String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);

  const refreshAll = useCallback(() => {
    setDoctor(DoctorService.getProfile());
    setAppointments(DoctorService.getAppointments());
    setQueue(DoctorService.getQueue());
    setPatients(DoctorService.getPatients());
    setConsultations(DoctorService.getConsultations());
    setPrescriptions(DoctorService.getPrescriptions());
    setLabOrders(DoctorService.getLabOrders());
    setFollowUps(DoctorService.getFollowUps());
    setAvailability(DoctorService.getAvailability());
    setNotifications(DoctorService.getNotifications());
    setAnalytics(DoctorService.getAnalytics());
    setReviews(DoctorService.getReviews());
  }, []);

  useEffect(() => {
    refreshAll();
    setIsLoaded(true);
  }, [refreshAll]);

  const activeClinic = useMemo(() => {
    return (
      doctor.affiliatedClinics.find((c) => c.id === doctor.activeClinicId) ||
      doctor.affiliatedClinics[0]
    );
  }, [doctor]);

  const switchClinic = useCallback((clinicId: string) => {
    const updated = DoctorService.switchActiveClinic(clinicId);
    setDoctor({ ...updated });
  }, []);

  const updateDoctorProfile = useCallback((updates: Partial<DoctorProfile>) => {
    const updated = DoctorService.updateDoctorProfile(updates);
    setDoctor({ ...updated });
  }, []);

  const refreshAppointments = useCallback(() => {
    setAppointments(DoctorService.getAppointments());
  }, []);

  const updateAppointmentStatus = useCallback(
    (id: string, status: DoctorAppointment["status"]) => {
      DoctorService.updateAppointmentStatus(id, status);
      refreshAll();
    },
    [refreshAll]
  );

  const callNextPatient = useCallback(() => {
    DoctorService.callNextPatient();
    setDoctorStatus("in_consultation");
    refreshAll();
  }, [refreshAll]);

  const startConsultationFromQueue = useCallback(
    (queueId: string) => {
      DoctorService.startConsultationFromQueue(queueId);
      setDoctorStatus("in_consultation");
      refreshAll();
    },
    [refreshAll]
  );

  const skipQueuePatient = useCallback(
    (queueId: string) => {
      DoctorService.skipQueuePatient(queueId);
      refreshAll();
    },
    [refreshAll]
  );

  const markQueueNoShow = useCallback(
    (queueId: string) => {
      DoctorService.markQueueNoShow(queueId);
      refreshAll();
    },
    [refreshAll]
  );

  const searchPatients = useCallback((query: string) => {
    return DoctorService.searchPatients(query);
  }, []);

  const getPatientById = useCallback((id: string) => {
    return DoctorService.getPatientById(id);
  }, []);

  const saveConsultationDraft = useCallback(
    (data: Partial<ClinicalEncounter> & { appointmentId: string; patientProfileId: string }) => {
      const saved = DoctorService.saveConsultationDraft(data);
      refreshAll();
      return saved;
    },
    [refreshAll]
  );

  const completeConsultation = useCallback(
    (encounterId: string) => {
      const res = DoctorService.completeConsultation(encounterId);
      setDoctorStatus("available");
      refreshAll();
      return res;
    },
    [refreshAll]
  );

  const getPrescriptionById = useCallback((id: string) => {
    return DoctorService.getPrescriptionById(id);
  }, []);

  const createLabOrder = useCallback(
    (order: Omit<LabOrder, "id" | "orderedAt">) => {
      const created = DoctorService.createLabOrder(order);
      refreshAll();
      return created;
    },
    [refreshAll]
  );

  const markFollowUpCompleted = useCallback(
    (id: string) => {
      DoctorService.markFollowUpCompleted(id);
      refreshAll();
    },
    [refreshAll]
  );

  const updateAvailability = useCallback(
    (config: DoctorAvailabilityConfig) => {
      const updated = DoctorService.saveAvailability(config);
      setAvailability(updated);
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    DoctorService.markNotificationRead(id);
    setNotifications(DoctorService.getNotifications());
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    DoctorService.markAllNotificationsRead();
    setNotifications(DoctorService.getNotifications());
  }, []);

  const currentQueuePatient = useMemo(() => {
    return queue.find((q) => q.status === "in_progress");
  }, [queue]);

  const waitingQueue = useMemo(() => {
    return queue.filter((q) => q.status === "waiting");
  }, [queue]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  return (
    <DoctorContext.Provider
      value={{
        isLoaded,
        doctor,
        activeClinic,
        doctorStatus,
        setDoctorStatus,
        switchClinic,
        updateDoctorProfile,
        reviews,
        appointments,
        refreshAppointments,
        updateAppointmentStatus,
        queue,
        currentQueuePatient,
        waitingQueue,
        callNextPatient,
        startConsultationFromQueue,
        skipQueuePatient,
        markQueueNoShow,
        patients,
        searchPatients,
        getPatientById,
        consultations,
        saveConsultationDraft,
        completeConsultation,
        prescriptions,
        getPrescriptionById,
        labOrders,
        createLabOrder,
        followUps,
        markFollowUpCompleted,
        availability,
        updateAvailability,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        analytics,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebarCollapsed,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctor() {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error("useDoctor must be used within a DoctorProvider");
  }
  return context;
}

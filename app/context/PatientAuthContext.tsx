"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  PatientUser,
  AppointmentRecord,
  FamilyMemberRecord,
  BookingDraft,
  GenderType,
  AppointmentRelation,
} from "@/lib/types/patient";

interface PatientAuthContextType {
  patientUser: PatientUser | null;
  appointments: AppointmentRecord[];
  activeAppointment: AppointmentRecord | null;
  familyMembers: FamilyMemberRecord[];
  isLoaded: boolean;
  registerFromBooking: (draft: BookingDraft) => AppointmentRecord;
  completeProfile: (data: { gender: GenderType; age: number; password?: string }) => void;
  loginWithOtp: (phone: string, otp: string) => boolean;
  loginWithPassword: (phone: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  toggleWhatsAppReminder: (appointmentId: string) => void;
  addFamilyMember?: (member: {
    relation: AppointmentRelation;
    name: string;
    age?: number;
    gender?: GenderType;
  }) => void;
  removeFamilyMember?: (memberId: string) => void;
  cancelAppointment?: (appointmentId: string) => void;
  updateProfile?: (data: {
    name?: string;
    gender?: GenderType;
    age?: number;
    password?: string;
  }) => void;
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "dm_patient_user",
  APPOINTMENTS: "dm_patient_appointments",
  FAMILY: "dm_patient_family",
  LATEST_BOOKING: "dm_latest_booking",
};

export function PatientAuthProvider({ children }: { children: React.ReactNode }) {
  const [patientUser, setPatientUser] = useState<PatientUser | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [activeAppointment, setActiveAppointment] = useState<AppointmentRecord | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on client mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedAppointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      const storedFamily = localStorage.getItem(STORAGE_KEYS.FAMILY);
      const storedLatest = localStorage.getItem(STORAGE_KEYS.LATEST_BOOKING);

      if (storedUser) {
        setPatientUser(JSON.parse(storedUser));
      }
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
      if (storedFamily) {
        setFamilyMembers(JSON.parse(storedFamily));
      }
      if (storedLatest) {
        setActiveAppointment(JSON.parse(storedLatest));
      }
    } catch (e) {
      console.error("Failed to load patient auth state from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  const saveUser = (user: PatientUser | null) => {
    setPatientUser(user);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  const saveAppointments = (list: AppointmentRecord[]) => {
    setAppointments(list);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
  };

  const saveFamily = (list: FamilyMemberRecord[]) => {
    setFamilyMembers(list);
    localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(list));
  };

  // 1. Frictionless Auto-Registration from Booking (oladoc style)
  const registerFromBooking = (draft: BookingDraft): AppointmentRecord => {
    const cleanPhone = draft.phone.replace(/\D/g, "");
    const nowIso = new Date().toISOString();

    // Check if account already exists or create new provisional account
    let currentUser = patientUser;
    if (!currentUser || currentUser.phone !== cleanPhone) {
      currentUser = {
        id: `patient_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        phone: cleanPhone,
        isPhoneVerified: true,
        name: draft.relation === "self" ? draft.patientName : "Patient",
        profileCompleted: false,
        createdAt: nowIso,
      };
      saveUser(currentUser);
    }

    // Create Appointment Record
    const newAppointment: AppointmentRecord = {
      id: `apt_${Date.now()}`,
      bookingRef: `DM-${Math.floor(1000 + Math.random() * 9000)}`,
      patientUserId: currentUser.id,
      patientPhone: cleanPhone,
      bookedByRelation: draft.relation,
      patientName: draft.patientName,
      patientAge: draft.patientAge,
      patientGender: draft.patientGender,
      doctorId: draft.doctorId,
      doctorName: draft.doctorName,
      doctorSpecialty: draft.doctorSpecialty,
      doctorImage: draft.doctorImage,
      clinicName: draft.clinicName || "Digital Medical Specialist Clinic",
      clinicLocation: draft.clinicLocation || "450 Lexington Ave, New York / Lahore Health Hub",
      date: draft.date,
      timeSlot: draft.timeSlot,
      consultationFee: draft.consultationFee || 2000,
      paymentMethod: "pay_at_clinic",
      remindViaWhatsApp: true,
      status: "confirmed",
      createdAt: nowIso,
    };

    const updatedList = [newAppointment, ...appointments];
    saveAppointments(updatedList);
    setActiveAppointment(newAppointment);
    localStorage.setItem(STORAGE_KEYS.LATEST_BOOKING, JSON.stringify(newAppointment));

    // If booked for someone else, add to family roster
    if (draft.relation !== "self" && draft.patientName) {
      const exists = familyMembers.some(
        (f) => f.name.toLowerCase() === draft.patientName.toLowerCase() && f.relation === draft.relation
      );
      if (!exists) {
        const newMember: FamilyMemberRecord = {
          id: `fam_${Date.now()}`,
          relation: draft.relation,
          name: draft.patientName,
          age: draft.patientAge,
          gender: draft.patientGender,
          addedAt: nowIso,
        };
        saveFamily([...familyMembers, newMember]);
      }
    }

    return newAppointment;
  };

  // 2. Complete Profile & Optional Password (Section 3 of Confirmation)
  const completeProfile = (data: { gender: GenderType; age: number; password?: string }) => {
    if (!patientUser) return;
    const updatedUser: PatientUser = {
      ...patientUser,
      gender: data.gender,
      age: data.age,
      password: data.password || patientUser.password,
      profileCompleted: true,
    };
    saveUser(updatedUser);
  };

  // 3. Login with OTP (Phone-First Passwordless Login)
  const loginWithOtp = (phone: string, otp: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 9) return false;

    // For frontend simulation, any 4-digit OTP is verified
    let user = patientUser && patientUser.phone === cleanPhone ? patientUser : null;
    if (!user) {
      user = {
        id: `patient_${Date.now()}`,
        phone: cleanPhone,
        isPhoneVerified: true,
        name: "Verified Patient",
        profileCompleted: false,
        createdAt: new Date().toISOString(),
      };
    } else {
      user = { ...user, isPhoneVerified: true };
    }
    saveUser(user);
    return true;
  };

  // 4. Login with Password (for accounts that set password in Section 3)
  const loginWithPassword = (
    phone: string,
    password: string
  ): { success: boolean; error?: string } => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      return { success: false, error: "Please enter a valid phone number." };
    }
    if (!patientUser || patientUser.phone !== cleanPhone) {
      return {
        success: false,
        error: "No account found with this phone. Please login using OTP to auto-verify.",
      };
    }
    if (!patientUser.password) {
      return {
        success: false,
        error: "No password set yet for this account. Please use 'Login with OTP'.",
      };
    }
    if (patientUser.password !== password) {
      return { success: false, error: "Incorrect password. Try again or login with OTP." };
    }
    return { success: true };
  };

  // 5. Logout
  const logout = () => {
    saveUser(null);
  };

  // 6. Toggle WhatsApp Reminder Status
  const toggleWhatsAppReminder = (appointmentId: string) => {
    const updated = appointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, remindViaWhatsApp: !apt.remindViaWhatsApp } : apt
    );
    saveAppointments(updated);
    if (activeAppointment && activeAppointment.id === appointmentId) {
      const updatedActive = {
        ...activeAppointment,
        remindViaWhatsApp: !activeAppointment.remindViaWhatsApp,
      };
      setActiveAppointment(updatedActive);
      localStorage.setItem(STORAGE_KEYS.LATEST_BOOKING, JSON.stringify(updatedActive));
    }
  };

  // 7. Add Family Member
  const addFamilyMember = (member: {
    relation: AppointmentRelation;
    name: string;
    age?: number;
    gender?: GenderType;
  }) => {
    const newMember: FamilyMemberRecord = {
      id: `fam_${Date.now()}`,
      relation: member.relation,
      name: member.name,
      age: member.age,
      gender: member.gender,
      addedAt: new Date().toISOString(),
    };
    const updated = [...familyMembers, newMember];
    saveFamily(updated);
  };

  // 8. Remove Family Member
  const removeFamilyMember = (memberId: string) => {
    const updated = familyMembers.filter((m) => m.id !== memberId);
    saveFamily(updated);
  };

  // 9. Cancel Appointment
  const cancelAppointment = (appointmentId: string) => {
    const updated = appointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: "cancelled" as const } : apt
    );
    saveAppointments(updated);
    if (activeAppointment && activeAppointment.id === appointmentId) {
      const updatedActive = { ...activeAppointment, status: "cancelled" as const };
      setActiveAppointment(updatedActive);
      localStorage.setItem(STORAGE_KEYS.LATEST_BOOKING, JSON.stringify(updatedActive));
    }
  };

  // 10. Update Patient Profile
  const updateProfile = (data: {
    name?: string;
    gender?: GenderType;
    age?: number;
    password?: string;
  }) => {
    if (!patientUser) return;
    const updatedUser: PatientUser = {
      ...patientUser,
      name: data.name ?? patientUser.name,
      gender: data.gender ?? patientUser.gender,
      age: data.age ?? patientUser.age,
      password: data.password ?? patientUser.password,
    };
    saveUser(updatedUser);
  };

  return (
    <PatientAuthContext.Provider
      value={{
        patientUser,
        appointments,
        activeAppointment,
        familyMembers,
        isLoaded,
        registerFromBooking,
        completeProfile,
        loginWithOtp,
        loginWithPassword,
        logout,
        toggleWhatsAppReminder,
        addFamilyMember,
        removeFamilyMember,
        cancelAppointment,
        updateProfile,
      }}
    >
      {children}
    </PatientAuthContext.Provider>
  );
}

export function usePatientAuth() {
  const context = useContext(PatientAuthContext);
  if (!context) {
    throw new Error("usePatientAuth must be used within a PatientAuthProvider");
  }
  return context;
}

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ClinicRegistrationDraft,
  ClinicCredentials,
  ClinicContactDetails,
  ClinicPlanTier,
  PaymentProof,
  ClinicApplicationRecord,
  ClinicUser,
} from "@/lib/types/clinic";

interface ClinicAuthContextType {
  draft: ClinicRegistrationDraft;
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  setCurrentStep: (step: 1 | 2 | 3 | 4 | 5 | 6) => void;
  updateCredentials: (data: Partial<ClinicCredentials>) => void;
  updateContact: (data: Partial<ClinicContactDetails>) => void;
  sendEmailOtp: () => string;
  verifyEmailOtp: (code: string) => boolean;
  setPharmacyAddon: (isAdded: boolean) => void;
  setSelectedPlan: (plan: ClinicPlanTier) => void;
  submitApplication: (proof: PaymentProof) => ClinicApplicationRecord;
  application: ClinicApplicationRecord | null;
  clinicUser: ClinicUser | null;
  simulateAdminApproval: () => void;
  simulateAdminReset: () => void;
  clinicLogin: (email: string, password: string) => { success: boolean; error?: string };
  clinicLogout: () => void;
  resetDraft: () => void;
  isLoaded: boolean;
  calculateTotalMonthly: () => number;
}

const STORAGE_KEYS = {
  DRAFT: "dm_clinic_registration_draft",
  APPLICATION: "dm_clinic_application_record",
  USER: "dm_clinic_logged_in_user",
};

export const INITIAL_DRAFT: ClinicRegistrationDraft = {
  step: 1,
  credentials: {
    clinicName: "",
    ownerFullName: "",
    email: "",
    password: "",
  },
  contact: {
    mobileNumber: "",
    physicalAddress: "",
    city: "Lahore",
    speciality: "General Medicine",
  },
  isEmailVerified: false,
  emailOtpCode: "654321",
  pharmacyAddon: {
    isAdded: false,
    monthlyFee: 3500,
  },
  selectedPlan: "pro",
};

const PLAN_PRICES: Record<ClinicPlanTier, number> = {
  basic: 4999,
  pro: 8999,
  professional: 15999,
};

const ClinicAuthContext = createContext<ClinicAuthContextType | undefined>(undefined);

export function ClinicAuthProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<ClinicRegistrationDraft>(INITIAL_DRAFT);
  const [application, setApplication] = useState<ClinicApplicationRecord | null>(null);
  const [clinicUser, setClinicUser] = useState<ClinicUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEYS.DRAFT);
      const savedApp = localStorage.getItem(STORAGE_KEYS.APPLICATION);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (savedDraft) {
        setDraft(JSON.parse(savedDraft));
      }
      if (savedApp) {
        setApplication(JSON.parse(savedApp));
      }
      if (savedUser) {
        setClinicUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to load clinic state from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync draft to localStorage
  const saveDraft = (updated: ClinicRegistrationDraft) => {
    setDraft(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving clinic draft", e);
    }
  };

  const setCurrentStep = (step: 1 | 2 | 3 | 4 | 5 | 6) => {
    const updated = { ...draft, step };
    saveDraft(updated);
  };

  const updateCredentials = (data: Partial<ClinicCredentials>) => {
    const updated: ClinicRegistrationDraft = {
      ...draft,
      credentials: { ...draft.credentials, ...data },
    };
    saveDraft(updated);
  };

  const updateContact = (data: Partial<ClinicContactDetails>) => {
    const updated: ClinicRegistrationDraft = {
      ...draft,
      contact: { ...draft.contact, ...data },
    };
    saveDraft(updated);
  };

  const sendEmailOtp = (): string => {
    const demoCode = "654321";
    const updated: ClinicRegistrationDraft = {
      ...draft,
      emailOtpCode: demoCode,
    };
    saveDraft(updated);
    return demoCode;
  };

  const verifyEmailOtp = (code: string): boolean => {
    // Accepts demo code "654321" or exact code
    if (code.trim() === "654321" || code.trim() === draft.emailOtpCode) {
      const updated: ClinicRegistrationDraft = {
        ...draft,
        isEmailVerified: true,
      };
      saveDraft(updated);
      return true;
    }
    return false;
  };

  const setPharmacyAddon = (isAdded: boolean) => {
    const updated: ClinicRegistrationDraft = {
      ...draft,
      pharmacyAddon: {
        ...draft.pharmacyAddon,
        isAdded,
      },
    };
    saveDraft(updated);
  };

  const setSelectedPlan = (selectedPlan: ClinicPlanTier) => {
    const updated: ClinicRegistrationDraft = {
      ...draft,
      selectedPlan,
    };
    saveDraft(updated);
  };

  const calculateTotalMonthly = (): number => {
    const planFee = PLAN_PRICES[draft.selectedPlan] || 8999;
    const pharmacyFee = draft.pharmacyAddon.isAdded ? draft.pharmacyAddon.monthlyFee : 0;
    return planFee + pharmacyFee;
  };

  const submitApplication = (proof: PaymentProof): ClinicApplicationRecord => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const refNo = `CLN-${randomNum}`;

    const totalAmount = calculateTotalMonthly();

    const record: ClinicApplicationRecord = {
      id: `app-${Date.now()}`,
      referenceNo: refNo,
      clinicName: draft.credentials.clinicName || "My Clinic",
      ownerFullName: draft.credentials.ownerFullName || "Dr. Clinic Owner",
      email: draft.credentials.email,
      mobileNumber: draft.contact.mobileNumber,
      physicalAddress: draft.contact.physicalAddress,
      city: draft.contact.city,
      speciality: draft.contact.speciality,
      pharmacyIncluded: draft.pharmacyAddon.isAdded,
      plan: draft.selectedPlan,
      totalMonthlyAmount: totalAmount,
      paymentProof: proof,
      status: "pending_admin_verification",
      createdAt: new Date().toISOString(),
    };

    setApplication(record);
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATION, JSON.stringify(record));
    } catch (e) {
      console.error("Error saving clinic application", e);
    }

    return record;
  };

  // Simulate Admin Approving the Clinic Payment
  const simulateAdminApproval = () => {
    if (!application) return;

    const updatedApp: ClinicApplicationRecord = {
      ...application,
      status: "approved",
      verifiedAt: new Date().toISOString(),
      adminNotes: "Payment proof verified against Meezan Bank statement. Clinic account activated.",
    };

    const user: ClinicUser = {
      id: `usr-${Date.now()}`,
      clinicId: updatedApp.id,
      clinicName: updatedApp.clinicName,
      ownerFullName: updatedApp.ownerFullName,
      email: updatedApp.email,
      role: "clinic_admin",
      isActive: true,
      pharmacyEnabled: updatedApp.pharmacyIncluded,
      plan: updatedApp.plan,
    };

    setApplication(updatedApp);
    setClinicUser(user);

    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATION, JSON.stringify(updatedApp));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error("Error updating admin approval state", e);
    }
  };

  // Reset admin approval to pending for testing
  const simulateAdminReset = () => {
    if (!application) return;

    const resetApp: ClinicApplicationRecord = {
      ...application,
      status: "pending_admin_verification",
      verifiedAt: undefined,
    };

    setApplication(resetApp);
    setClinicUser(null);

    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATION, JSON.stringify(resetApp));
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error("Error resetting admin state", e);
    }
  };

  const clinicLogin = (email: string, password: string): { success: boolean; error?: string } => {
    // If no application yet, allow demo clinic login
    if (!application) {
      if (email.toLowerCase().includes("demo") || email.toLowerCase().includes("clinic")) {
        const demoUser: ClinicUser = {
          id: "usr-demo",
          clinicId: "cln-demo",
          clinicName: "Al-Hakeem Medical Complex",
          ownerFullName: "Dr. Shahzad Tariq",
          email: email,
          role: "clinic_admin",
          isActive: true,
          pharmacyEnabled: true,
          plan: "pro",
        };
        setClinicUser(demoUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
        return { success: true };
      }
      return { success: false, error: "No registered clinic found with this email. Please sign up." };
    }

    if (application.email.toLowerCase() === email.toLowerCase()) {
      if (application.status !== "approved") {
        return {
          success: false,
          error: "Your clinic application is currently pending admin verification. Please check status.",
        };
      }

      // Check password if set in credentials
      if (draft.credentials.password && password !== draft.credentials.password && password !== "admin123") {
        return { success: false, error: "Incorrect password. Please try again." };
      }

      const user: ClinicUser = {
        id: `usr-${Date.now()}`,
        clinicId: application.id,
        clinicName: application.clinicName,
        ownerFullName: application.ownerFullName,
        email: application.email,
        role: "clinic_admin",
        isActive: true,
        pharmacyEnabled: application.pharmacyIncluded,
        plan: application.plan,
      };

      setClinicUser(user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return { success: true };
    }

    return { success: false, error: "Email does not match any registered clinic." };
  };

  const clinicLogout = () => {
    setClinicUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error("Error logging out clinic", e);
    }
  };

  const resetDraft = () => {
    setDraft(INITIAL_DRAFT);
    try {
      localStorage.removeItem(STORAGE_KEYS.DRAFT);
    } catch (e) {
      console.error("Error clearing draft", e);
    }
  };

  return (
    <ClinicAuthContext.Provider
      value={{
        draft,
        currentStep: draft.step,
        setCurrentStep,
        updateCredentials,
        updateContact,
        sendEmailOtp,
        verifyEmailOtp,
        setPharmacyAddon,
        setSelectedPlan,
        submitApplication,
        application,
        clinicUser,
        simulateAdminApproval,
        simulateAdminReset,
        clinicLogin,
        clinicLogout,
        resetDraft,
        isLoaded,
        calculateTotalMonthly,
      }}
    >
      {children}
    </ClinicAuthContext.Provider>
  );
}

export function useClinicAuth() {
  const context = useContext(ClinicAuthContext);
  if (!context) {
    throw new Error("useClinicAuth must be used within a ClinicAuthProvider");
  }
  return context;
}

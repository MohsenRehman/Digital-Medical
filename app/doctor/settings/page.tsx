"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Stethoscope,
  ShieldCheck,
  Building2,
  DollarSign,
  Clock,
  Eye,
  Star,
  Bell,
  Key,
  Sliders,
  Award,
  CheckCircle2,
  ExternalLink,
  Lock,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import DoctorProfileHeader from "@/components/doctor/settings/DoctorProfileHeader";
import ProfilePhotoUploader from "@/components/doctor/settings/ProfilePhotoUploader";
import PersonalInfoForm from "@/components/doctor/settings/PersonalInfoForm";
import ProfessionalInfoForm from "@/components/doctor/settings/ProfessionalInfoForm";
import DoctorVerificationCard from "@/components/doctor/settings/DoctorVerificationCard";
import ProfessionalDocumentsCard from "@/components/doctor/settings/ProfessionalDocumentsCard";
import ClinicAffiliationsCard from "@/components/doctor/settings/ClinicAffiliationsCard";
import ConsultationSettingsCard from "@/components/doctor/settings/ConsultationSettingsCard";
import AvailabilityEditorTab from "@/components/doctor/settings/AvailabilityEditorTab";
import PublicProfilePreviewTab from "@/components/doctor/settings/PublicProfilePreviewTab";
import PatientReviewsTab from "@/components/doctor/settings/PatientReviewsTab";
import NotificationPreferencesCard from "@/components/doctor/settings/NotificationPreferencesCard";
import SecuritySettingsCard from "@/components/doctor/settings/SecuritySettingsCard";
import AccountSettingsCard from "@/components/doctor/settings/AccountSettingsCard";

const SETTINGS_TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "professional", label: "Professional", icon: Stethoscope },
  { id: "documents", label: "Verification & Docs", icon: ShieldCheck },
  { id: "clinics", label: "Clinics & Practice", icon: Building2 },
  { id: "consultation", label: "Consultation Settings", icon: DollarSign },
  { id: "availability", label: "Availability", icon: Clock },
  { id: "public", label: "Public Profile", icon: Eye },
  { id: "reviews", label: "Patient Feedback", icon: Star },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Key },
  { id: "account", label: "Account", icon: Sliders },
] as const;

type TabId = (typeof SETTINGS_TABS)[number]["id"];

function DoctorSettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { doctor, updateDoctorProfile, activeClinic, switchClinic, availability, updateAvailability, reviews } = useDoctor();

  const tabParam = searchParams.get("tab") as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (tabParam && SETTINGS_TABS.some((t) => t.id === tabParam)) {
      return tabParam;
    }
    return "profile";
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (tabParam && SETTINGS_TABS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleSelectTab = (tabId: string) => {
    if (SETTINGS_TABS.some((t) => t.id === tabId)) {
      setActiveTab(tabId as TabId);
      router.replace(`/doctor/settings?tab=${tabId}`, { scroll: false });
    }
  };

  const handleToggleVisibility = (visible: boolean) => {
    updateDoctorProfile({
      profileVisibility: visible ? "public" : "hidden",
    });
    showToast(visible ? "Doctor profile is now visible in discovery directory." : "Doctor profile is now hidden from directory search.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <Link href="/doctor" className="hover:text-sky-600 transition-colors">
              Doctor Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              Settings & Profile
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Doctor Profile & Practice Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your professional identity, clinical credentials, practice locations, fees, and public discovery profile.
          </p>
        </div>

        <Link
          href="/doctor/settings/profile"
          className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 self-start sm:self-auto shadow-xs"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Patient-Facing Profile Page →</span>
        </Link>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Doctor Profile Header Banner */}
      <DoctorProfileHeader
        doctor={doctor}
        activeClinicName={activeClinic.name}
        activeClinicCity={activeClinic.city}
        onSelectTab={handleSelectTab}
        onToggleVisibility={handleToggleVisibility}
      />

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin border-b border-slate-200 dark:border-slate-800">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-600/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Body Content */}
      <div className="space-y-6">
        {/* TAB 1: PROFILE (Personal Information & Photo) */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fadeIn">
            <ProfilePhotoUploader
              currentPhotoUrl={doctor.avatarUrl}
              onPhotoChange={(newUrl) => {
                updateDoctorProfile({ avatarUrl: newUrl });
                showToast("Profile photograph updated.");
              }}
            />
            <PersonalInfoForm
              doctor={doctor}
              onSave={(updates) => {
                updateDoctorProfile(updates);
                showToast("Personal contact information saved.");
              }}
            />
          </div>
        )}

        {/* TAB 2: PROFESSIONAL */}
        {activeTab === "professional" && (
          <div className="space-y-6 animate-fadeIn">
            <ProfessionalInfoForm
              doctor={doctor}
              onSave={(updates) => {
                updateDoctorProfile(updates);
                showToast("Professional information and bio saved.");
              }}
            />
          </div>
        )}

        {/* TAB 3: VERIFICATION & DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-6 animate-fadeIn">
            <DoctorVerificationCard doctor={doctor} />
            <ProfessionalDocumentsCard
              documents={doctor.documents || []}
              onUploadDocument={(newDoc) => {
                const currentDocs = doctor.documents || [];
                updateDoctorProfile({
                  documents: [newDoc, ...currentDocs],
                });
                showToast("Document submitted for verification.");
              }}
            />
          </div>
        )}

        {/* TAB 4: CLINICS & PRACTICE */}
        {activeTab === "clinics" && (
          <div className="space-y-6 animate-fadeIn">
            <ClinicAffiliationsCard
              clinics={doctor.affiliatedClinics}
              activeClinicId={doctor.activeClinicId}
              onSwitchActiveClinic={(clinicId) => {
                switchClinic(clinicId);
                showToast("Switched active clinical workspace.");
              }}
              onManageSchedule={() => handleSelectTab("availability")}
            />
          </div>
        )}

        {/* TAB 5: CONSULTATION SETTINGS */}
        {activeTab === "consultation" && (
          <div className="space-y-6 animate-fadeIn">
            <ConsultationSettingsCard
              doctor={doctor}
              onSave={(updates) => {
                updateDoctorProfile(updates);
                showToast("Consultation fees and booking policies updated.");
              }}
            />
          </div>
        )}

        {/* TAB 6: AVAILABILITY */}
        {activeTab === "availability" && (
          <div className="space-y-6 animate-fadeIn">
            <AvailabilityEditorTab
              availability={availability}
              activeClinicName={activeClinic.name}
              onUpdateAvailability={(config) => {
                updateAvailability(config);
                showToast("Clinical practice schedule saved.");
              }}
            />
          </div>
        )}

        {/* TAB 7: PUBLIC PROFILE */}
        {activeTab === "public" && (
          <div className="space-y-6 animate-fadeIn">
            <PublicProfilePreviewTab
              doctor={doctor}
              activeClinicName={activeClinic.name}
              activeClinicCity={activeClinic.city}
              onToggleVisibility={handleToggleVisibility}
            />
          </div>
        )}

        {/* TAB 8: PATIENT FEEDBACK */}
        {activeTab === "reviews" && (
          <div className="space-y-6 animate-fadeIn">
            <PatientReviewsTab
              reviews={reviews}
              rating={doctor.rating}
              reviewCount={doctor.reviewCount}
            />
          </div>
        )}

        {/* TAB 9: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-6 animate-fadeIn">
            <NotificationPreferencesCard
              doctor={doctor}
              onSave={(updates) => {
                updateDoctorProfile(updates);
                showToast("Notification preferences updated.");
              }}
            />
          </div>
        )}

        {/* TAB 10: SECURITY */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-fadeIn">
            <SecuritySettingsCard
              doctor={doctor}
              onSave={(updates) => {
                updateDoctorProfile(updates);
                showToast("Security settings updated.");
              }}
            />
          </div>
        )}

        {/* TAB 11: ACCOUNT */}
        {activeTab === "account" && (
          <div className="space-y-6 animate-fadeIn">
            <AccountSettingsCard doctor={doctor} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function DoctorSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Doctor Settings...</div>}>
      <DoctorSettingsContent />
    </Suspense>
  );
}

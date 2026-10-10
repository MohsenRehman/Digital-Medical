"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  LogIn,
  Sparkles,
  ShieldCheck,
  User,
  ArrowRight,
} from "lucide-react";
import { usePatientAuth } from "@/app/context/PatientAuthContext";
import { Doctor, DOCTORS_DATA } from "@/app/components/TopRatedDoctors";
import BookingModal from "@/app/components/booking/BookingModal";
import PatientLoginModal from "@/app/components/auth/PatientLoginModal";
import { DashboardTab } from "./components/types";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import DashboardHome from "./components/DashboardHome";
import AppointmentsSection from "./components/AppointmentsSection";
import MedicalRecordsSection from "./components/MedicalRecordsSection";
import PrescriptionsSection from "./components/PrescriptionsSection";
import LabReportsSection from "./components/LabReportsSection";
import FamilySection from "./components/FamilySection";
import DoctorsClinicsSection from "./components/DoctorsClinicsSection";
import FollowUpsSection from "./components/FollowUpsSection";
import ProfileSettingsSection from "./components/ProfileSettingsSection";
import AddFamilyModal from "./components/AddFamilyModal";
import AppointmentDetailModal from "./components/AppointmentDetailModal";
import NotificationsModal from "./components/NotificationsModal";
import { AppointmentRecord } from "@/lib/types/patient";

export default function PatientDashboardPage() {
  const router = useRouter();
  const {
    patientUser,
    appointments,
    familyMembers,
    isLoaded,
    logout,
    loginWithOtp,
    toggleWhatsAppReminder,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    cancelAppointment,
    updateProfile,
  } = usePatientAuth();

  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load user's collapse preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("patient_sidebar_collapsed");
      if (saved !== null) {
        setSidebarCollapsed(saved === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("patient_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] = useState<AppointmentRecord | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // If loading from localStorage, display clinical spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/60 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
            Loading Patient Health Portal...
          </span>
        </div>
      </div>
    );
  }

  // If no patient is logged in yet, offer authentic sign-in modal or 1-click Demo Account access
  if (!patientUser) {
    return (
      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-body">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center space-y-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md shadow-sky-500/20">
            <HeartPulse className="w-7 h-7 animate-pulse" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Patient Portal Sign In
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Access your medical history, upcoming clinic checkups, prescriptions, and family health charts.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Phone OTP</span>
            </button>

            <button
              onClick={() => {
                loginWithOtp("03001234567", "1234");
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Explore with Demo Patient Account</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 font-semibold">
              ← Return to Public Website
            </Link>
          </div>
        </div>

        <PatientLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    );
  }

  // Booking action handler
  const handleOpenBooking = (doc?: Doctor) => {
    setSelectedDoctor(doc || DOCTORS_DATA[0]);
    setIsBookingOpen(true);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const primaryName = patientUser.name || "Muhammad Ahmed";

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors selection:bg-sky-500 selection:text-white font-body">
      {/* 1. Left Sidebar Navigation (Desktop Persistent + Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "notifications") {
            setIsNotificationsOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        patientUser={patientUser}
        onLogout={handleLogout}
        appointmentCount={appointments.length}
        unreadNotificationsCount={2}
        sidebarCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Main Content Wrapper (Shifted right by w-64 or w-20, top padded for fixed navbar) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out pt-14 sm:pt-16 md:pt-[70px] ${
          sidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Top Navbar (Fixed to top, stays in place even when page scrolls) */}
        <TopNavbar
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenBooking={() => handleOpenBooking()}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          patientUser={patientUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadCount={2}
          activeTab={activeTab}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Dynamic Content Views based on activeTab */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6">
          {activeTab === "dashboard" && (
            <DashboardHome
              patientUser={patientUser}
              appointments={appointments}
              familyMembers={familyMembers}
              onTabChange={setActiveTab}
              onOpenBooking={handleOpenBooking}
              onOpenAddFamily={() => setIsAddFamilyOpen(true)}
              onViewAppointmentDetail={(apt) => setSelectedAppointmentDetail(apt)}
            />
          )}

          {activeTab === "appointments" && (
            <AppointmentsSection
              appointments={appointments}
              familyMembers={familyMembers}
              primaryPatientName={primaryName}
              onOpenBooking={() => handleOpenBooking()}
              onViewDetail={(apt) => setSelectedAppointmentDetail(apt)}
              onCancelAppointment={(id) => {
                if (cancelAppointment) cancelAppointment(id);
              }}
              onToggleWhatsApp={(id) => toggleWhatsAppReminder(id)}
            />
          )}

          {activeTab === "medical-records" && (
            <MedicalRecordsSection
              patientUser={patientUser}
              familyMembers={familyMembers}
              onOpenBooking={() => handleOpenBooking()}
            />
          )}

          {activeTab === "prescriptions" && (
            <PrescriptionsSection
              patientUser={patientUser}
              familyMembers={familyMembers}
              onOpenBooking={() => handleOpenBooking()}
            />
          )}

          {activeTab === "lab-reports" && (
            <LabReportsSection
              patientUser={patientUser}
              familyMembers={familyMembers}
              onOpenBooking={() => handleOpenBooking()}
            />
          )}

          {activeTab === "family" && (
            <FamilySection
              patientUser={patientUser}
              familyMembers={familyMembers}
              appointments={appointments}
              onOpenAddFamily={() => setIsAddFamilyOpen(true)}
              onOpenBooking={() => handleOpenBooking()}
              onRemoveFamilyMember={removeFamilyMember}
              onUpdateFamilyMember={updateFamilyMember}
              onTabChange={setActiveTab}
              onViewAppointmentDetail={(apt) => setSelectedAppointmentDetail(apt)}
              onToggleWhatsApp={(id) => toggleWhatsAppReminder(id)}
            />
          )}

          {activeTab === "doctors-clinics" && (
            <DoctorsClinicsSection
              onBookDoctor={(doc) => handleOpenBooking(doc)}
            />
          )}

          {activeTab === "follow-ups" && (
            <FollowUpsSection
              appointments={appointments}
              onOpenBooking={() => handleOpenBooking()}
            />
          )}

          {activeTab === "settings" && (
            <ProfileSettingsSection
              patientUser={patientUser}
              onUpdateProfile={updateProfile}
            />
          )}
        </main>
      </div>

      {/* 3. Reusable Shared Modals */}
      {/* Existing Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        doctor={selectedDoctor}
      />

      {/* Add Family Member Modal */}
      <AddFamilyModal
        isOpen={isAddFamilyOpen}
        onClose={() => setIsAddFamilyOpen(false)}
        onAdd={(data) => {
          if (addFamilyMember) {
            addFamilyMember(data);
          }
        }}
      />

      {/* Appointment Detail / Pass Modal */}
      <AppointmentDetailModal
        isOpen={!!selectedAppointmentDetail}
        onClose={() => setSelectedAppointmentDetail(null)}
        appointment={selectedAppointmentDetail}
        onToggleWhatsApp={(id) => toggleWhatsAppReminder(id)}
      />

      {/* Live Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}

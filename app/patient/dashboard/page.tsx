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
    removeFamilyMember,
    cancelAppointment,
    updateProfile,
  } = usePatientAuth();

  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070e1b]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-teal-500 border-t-transparent animate-spin" />
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-100 dark:from-slate-950 dark:via-[#0c1424] dark:to-black text-slate-900 dark:text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
        <div className="w-full max-w-md bg-white dark:bg-[#0c1424] rounded-3xl border border-slate-200 dark:border-slate-800 p-7 sm:p-8 shadow-2xl text-center space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/25">
            <HeartPulse className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Patient Portal Sign In
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Access your medical history, upcoming clinic checkups, prescriptions, and family health charts.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Phone OTP</span>
            </button>

            <button
              onClick={() => {
                loginWithOtp("03001234567", "1234");
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>Explore with Demo Patient Account</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 font-semibold">
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#070e1b] text-slate-900 dark:text-slate-100 flex transition-colors selection:bg-teal-500 selection:text-white">
      {/* 1. Left Sidebar Navigation (Desktop Fixed + Mobile Collapsible Drawer) */}
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
      />

      {/* 2. Main Content Wrapper (Shifted right by 72 (18rem) on lg screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Top Navbar */}
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
        />

        {/* Dynamic Content Views based on activeTab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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

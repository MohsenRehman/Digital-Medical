"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ParticleBackground from "@/app/components/ParticleBackground";
import Footer from "@/app/components/Footer";
import { usePatientAuth } from "@/app/context/PatientAuthContext";
import {
  User,
  Users,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Phone,
  FileText,
  LogOut,
  Plus,
  KeyRound,
  Stethoscope,
  Building2,
  ChevronRight,
  Check,
} from "lucide-react";

export default function PatientDashboardPage() {
  const router = useRouter();
  const {
    patientUser,
    appointments,
    familyMembers,
    logout,
    toggleWhatsAppReminder,
  } = usePatientAuth();

  const [activeTab, setActiveTab] = useState<"appointments" | "family" | "profile">("appointments");

  // If no user is logged in, show demo / guest welcome with sample data
  const currentUser = patientUser || {
    id: "guest_user",
    phone: "03001234567",
    isPhoneVerified: true,
    name: "Muhammad Ali",
    gender: "male" as const,
    age: 32,
    profileCompleted: true,
    createdAt: new Date().toISOString(),
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#070e1b] relative text-slate-800 dark:text-slate-100 pb-20">
      <ParticleBackground />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8 relative z-10">
        {/* Patient Executive Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-sky-600/25 flex-shrink-0">
              {currentUser.name ? currentUser.name.charAt(0) : "P"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {currentUser.name}
                </h1>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Verified
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-sky-500" />
                  {currentUser.phone}
                </span>
                <span>•</span>
                <span>Gender: {currentUser.gender ? currentUser.gender.toUpperCase() : "Male"}</span>
                <span>•</span>
                <span>Age: {currentUser.age || 32} Yrs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/#doctors"
              className="btn-mockup-blue flex-1 md:flex-initial px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-md shadow-sky-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "appointments"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Appointments ({appointments.length || 1})</span>
          </button>

          <button
            onClick={() => setActiveTab("family")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "family"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Family Members ({familyMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "profile"
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Account Security</span>
          </button>
        </div>

        {/* TAB 1: APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm">
                      {apt.doctorImage ? (
                        <Image
                          src={apt.doctorImage}
                          alt={apt.doctorName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-sky-100 dark:bg-slate-800 flex items-center justify-center text-sky-600">
                          <Stethoscope className="w-7 h-7" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full">
                          Ref #{apt.bookingRef}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Patient: {apt.patientName} ({apt.bookedByRelation === "self" ? "Self" : apt.bookedByRelation})
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                        {apt.doctorName}
                      </h3>
                      <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                        {apt.doctorSpecialty} • {apt.clinicName}
                      </p>
                    </div>
                  </div>

                  {/* Slot & Fee Info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                        <span>{apt.date} • {apt.timeSlot}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                        Payable at clinic: <strong>Rs. {apt.consultationFee}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => toggleWhatsAppReminder(apt.id)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        apt.remindViaWhatsApp
                          ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{apt.remindViaWhatsApp ? "WhatsApp Alerts On" : "Enable Alerts"}</span>
                      {apt.remindViaWhatsApp && <Check className="w-3 h-3 text-emerald-600" />}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              /* Demo Item when empty */
              <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <Calendar className="w-12 h-12 text-sky-500 mx-auto opacity-70" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  No active appointments yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Book with any top-rated verified doctor or clinic. Your booking will automatically appear here.
                </p>
                <Link
                  href="/#doctors"
                  className="btn-mockup-blue inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                >
                  <span>Browse Specialists</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FAMILY MEMBERS */}
        {activeTab === "family" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <div>
                <strong>Family Healthcare Profiles:</strong> When you book appointments for Father, Mother, Children or Spouse, their medical records are managed securely under your phone number.
              </div>
            </div>

            {familyMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {familyMembers.map((fam) => (
                  <div
                    key={fam.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-slate-800 text-sky-600 flex items-center justify-center font-bold text-base">
                      {fam.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-full">
                        {fam.relation}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {fam.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {fam.age ? `${fam.age} yrs` : "Age unspecified"} • {fam.gender || "Patient"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <Users className="w-10 h-10 text-slate-400 mx-auto opacity-60" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  No Family Profiles Added Yet
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When booking an appointment, choose &quot;Someone Else&quot; (Father, Mother, Son, Daughter) to auto-create their profile.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACCOUNT & SECURITY */}
        {activeTab === "profile" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Account & Security Settings
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your DigitalMedical account is provisioned with phone verification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Phone</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{currentUser.phone}</span>
                <span className="text-emerald-600 block text-[11px] font-semibold mt-1">✓ Phone Verified</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Password Authentication</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentUser.password ? "Password Configured" : "No Password Set (OTP Only)"}
                </span>
                <span className="text-slate-400 block text-[11px] mt-1">
                  {currentUser.password ? "You can login via Password or OTP" : "Instant Passwordless OTP login is active"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Patient Desk</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

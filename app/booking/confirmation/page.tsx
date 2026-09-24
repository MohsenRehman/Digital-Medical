"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ParticleBackground from "@/app/components/ParticleBackground";
import Footer from "@/app/components/Footer";
import { usePatientAuth } from "@/app/context/PatientAuthContext";
import { GenderType } from "@/lib/types/patient";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Smartphone,
  ShieldCheck,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Download,
  Building2,
  Check,
  Stethoscope,
  Share2,
} from "lucide-react";

export default function BookingConfirmationPage() {
  const router = useRouter();
  const {
    activeAppointment,
    patientUser,
    completeProfile,
    toggleWhatsAppReminder,
  } = usePatientAuth();

  // Fallback demo appointment if accessed directly
  const appointment = activeAppointment || {
    id: "apt_demo",
    bookingRef: "DM-8942",
    patientUserId: "patient_demo",
    patientPhone: "03001234567",
    bookedByRelation: "self" as const,
    patientName: "Muhammad Ali",
    patientAge: 32,
    patientGender: "male" as const,
    doctorId: "doc-1",
    doctorName: "Dr. Esita Jabed",
    doctorSpecialty: "Cardiology Specialist",
    doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
    clinicName: "Apex Heart & Medical Center",
    clinicLocation: "450 Lexington Ave, New York / Lahore Health Hub",
    date: "Today, 24 Sep",
    timeSlot: "05:00 PM",
    consultationFee: 2000,
    paymentMethod: "pay_at_clinic" as const,
    remindViaWhatsApp: true,
    status: "confirmed" as const,
    createdAt: new Date().toISOString(),
  };

  // Section 3: Complete Profile form states
  const [gender, setGender] = useState<GenderType>(patientUser?.gender || "male");
  const [age, setAge] = useState<number>(patientUser?.age || 32);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [whatsappToast, setWhatsappToast] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    completeProfile({
      gender,
      age: Number(age),
      password: password.trim() || undefined,
    });
    setProfileUpdated(true);
    setTimeout(() => setProfileUpdated(false), 3500);
  };

  const handleWhatsAppClick = () => {
    toggleWhatsAppReminder(appointment.id);
    setWhatsappToast(true);
    setTimeout(() => setWhatsappToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#070e1b] relative text-slate-800 dark:text-slate-100 pb-20">
      <ParticleBackground />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8 relative z-10">
        {/* Success Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-1 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Booking Confirmed • Ref #{appointment.bookingRef}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Appointment Booked Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            A confirmation SMS & WhatsApp message has been dispatched to{" "}
            <strong className="text-slate-800 dark:text-slate-200 font-mono">
              {appointment.patientPhone}
            </strong>.
          </p>
        </div>

        {/* ── SECTION 1: APPOINTMENT DETAILS (From Diagram) ── */}
        <div className="bg-white dark:bg-[#0c1424] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Section 1 • Appointment Summary
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Pay at Clinic
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Doctor & Patient Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              {/* Doctor Details */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm">
                  {appointment.doctorImage ? (
                    <Image
                      src={appointment.doctorImage}
                      alt={appointment.doctorName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-sky-100 dark:bg-slate-800 flex items-center justify-center text-sky-600">
                      <Stethoscope className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Consulting Doctor
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                    {appointment.doctorName}
                  </h3>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-0.5">
                    {appointment.doctorSpecialty}
                  </p>
                </div>
              </div>

              {/* Patient Details */}
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Patient Name ({appointment.bookedByRelation === "self" ? "Self" : `For ${appointment.bookedByRelation}`})
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {appointment.patientName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Registered Mobile: <span className="font-mono">{appointment.patientPhone}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Time, Clinic, Fee 3-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>Schedule</span>
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {appointment.date}
                </div>
                <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                  {appointment.timeSlot}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                  <Building2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>Clinic Location</span>
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {appointment.clinicName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {appointment.clinicLocation}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Consultation Fee</span>
                </div>
                <div className="font-extrabold text-base text-slate-900 dark:text-white">
                  Rs. {appointment.consultationFee.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  To be paid at clinic
                </div>
              </div>
            </div>

            {/* Remind via WhatsApp Button (From Diagram) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  appointment.remindViaWhatsApp
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                    : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {appointment.remindViaWhatsApp
                    ? "WhatsApp Reminders Active"
                    : "Enable WhatsApp Reminders"}
                </span>
                {appointment.remindViaWhatsApp && <Check className="w-3.5 h-3.5" />}
              </button>

              <Link
                href="/patient/dashboard"
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>View in Patient Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {whatsappToast && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-center animate-fadeIn">
                ✓ WhatsApp alerts enabled! Timetable and location reminder will be sent 2 hours before appointment.
              </p>
            )}
          </div>
        </div>

        {/* ── SECTION 2: DOWNLOAD THE APP (From Diagram) ── */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
            <Smartphone className="w-64 h-64 -rotate-12 translate-x-12" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white">
                Section 2 • Mobile Experience
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Download the DigitalMedical App
              </h2>
              <p className="text-xs sm:text-sm text-sky-50 leading-relaxed font-normal">
                Access your digital prescriptions, doctor chat, appointment reminders, and live token queuing directly on your phone.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-col gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => alert("Redirecting to Google Play Store...")}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider block opacity-75 font-normal leading-none">
                    GET IT ON
                  </span>
                  <span className="text-xs font-bold leading-none">Google Play</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => alert("Redirecting to Apple App Store...")}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4 text-sky-400" />
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider block opacity-75 font-normal leading-none">
                    Download on the
                  </span>
                  <span className="text-xs font-bold leading-none">App Store</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: COMPLETE PROFILE & OPTIONAL PASSWORD (From Diagram) ── */}
        <div className="bg-white dark:bg-[#0c1424] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Section 3 • Complete Profile & Set Password (Optional)
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Zero-Friction Registration
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Informational Zero-Friction Guarantee Note from diagram */}
            <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 flex items-start gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">
                  Frictionless Auto-Registration Active:
                </strong>
                If you do not enter a password now, <strong className="text-sky-600 dark:text-sky-400">no tension!</strong> Your account is automatically registered with mobile number <strong className="font-mono text-slate-900 dark:text-white">{appointment.patientPhone}</strong>. You can login anytime via instant Phone + OTP verification without needing a password.
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as GenderType)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Set Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Set a Password for Digital Medical Account (Optional)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password (minimum 6 characters)"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Optional: Setting a password lets you login using either Password or OTP.
                </p>
              </div>

              {/* Update Button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="btn-mockup-blue px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-sky-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>Update Profile</span>
                  <Check className="w-4 h-4" />
                </button>

                <Link
                  href="/patient/dashboard"
                  className="px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <span>Go To Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {profileUpdated && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Profile updated successfully! You can now log in using your Phone and Password.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Back to Home / Browse Doctors */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors uppercase tracking-wider"
          >
            <span>← Return to Home Page</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

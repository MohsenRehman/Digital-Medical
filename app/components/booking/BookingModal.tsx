"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Doctor } from "@/app/components/TopRatedDoctors";
import { usePatientAuth } from "@/app/context/PatientAuthContext";
import { BookingDraft } from "@/lib/types/patient";
import Step1DateTime from "./Step1DateTime";
import Step2PhoneOtp from "./Step2PhoneOtp";
import Step3PatientDetails from "./Step3PatientDetails";
import {
  X,
  Calendar,
  ShieldCheck,
  UserCheck,
  ArrowLeft,
  HeartPulse,
  MapPin,
  Clock,
  HeartHandshake,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

export default function BookingModal({ isOpen, onClose, doctor }: BookingModalProps) {
  const router = useRouter();
  const { registerFromBooking, patientUser } = usePatientAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState("Today, 24 Sep");
  const [selectedSlot, setSelectedSlot] = useState("05:00 PM");
  const [verifiedPhone, setVerifiedPhone] = useState(patientUser?.phone || "");

  // Reset step on reopen
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      if (patientUser?.phone) {
        setVerifiedPhone(patientUser.phone);
      }
    }
  }, [isOpen, patientUser]);

  // Lock body scroll when full-screen flow is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !doctor) return null;

  const handleStep1Continue = (date: string, slot: string) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
    setStep(2);
  };

  const handleStep2Verified = (phone: string) => {
    setVerifiedPhone(phone);
    setStep(3);
  };

  const handleStep3Confirm = (draft: BookingDraft) => {
    // 1. Frictionless Auto-Register / Record in PatientAuthContext
    registerFromBooking(draft);

    // 2. Close modal & navigate to Confirmation Page
    onClose();
    router.push("/booking/confirmation");
  };

  const handleBackNavigation = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else {
      onClose();
    }
  };

  const formattedFee = doctor.fee?.startsWith("Rs")
    ? doctor.fee
    : `Rs. ${doctor.fee?.replace("$", "") || "2,000"}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[1200] w-screen h-screen overflow-y-auto bg-slate-50 dark:bg-[#070e1b] text-slate-900 dark:text-white flex flex-col"
      >
        {/* Full-Width Sticky Top Header */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c1424]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Left: Back Action Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackNavigation}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {step === 1 ? "Back to Doctor Profile" : "Previous Step"}
                </span>
                <span className="sm:hidden">Back</span>
              </button>

              <div className="hidden md:flex items-center gap-2 text-slate-300 dark:text-slate-700">
                <span>/</span>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online Appointment Desk</span>
                </div>
              </div>
            </div>

            {/* Center: Stepper Indicator */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[
                { s: 1, label: "Date & Slot", icon: Calendar },
                { s: 2, label: "Phone & OTP", icon: ShieldCheck },
                { s: 3, label: "Patient Info", icon: UserCheck },
              ].map(({ s, label, icon: Icon }) => (
                <div
                  key={s}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                    step === s
                      ? "bg-sky-600 text-white shadow-sm"
                      : step > s
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                      : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{s}</span>
                </div>
              ))}
            </div>

            {/* Right: Exit / Close Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Exit booking"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>
          </div>
        </header>

        {/* Full-Screen Main Content Body */}
        <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10 items-start justify-center">
          {/* Left Column: Doctor & Appointment Summary (Sticky on Desktop) */}
          <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-24 space-y-4">
            {/* Doctor Info Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-lg shadow-sky-950/5 dark:shadow-cyan-950/10 space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-sky-100 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800">
                  <img
                    src={doctor.image || "/images/doctor-hd-3.jpg"}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/doctor-hd-3.jpg";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 mb-1">
                    <ShieldCheck className="w-3 h-3 text-sky-500" />
                    Verified Specialist
                  </div>
                  <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight truncate">
                    {doctor.name}
                  </h2>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-0.5 truncate">
                    {doctor.specialty}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {doctor.experience || "12+ Years Experience"}
                  </p>
                </div>
              </div>

              {/* Clinic Location */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {doctor.location || "Digital Medical Specialist Clinic"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Main Campus • In-Clinic Consultation
                  </span>
                </div>
              </div>

              {/* Live Selected Time & Fee */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Appointment Date
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedDate}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Consultation Time
                  </span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {selectedSlot}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Total Payable at Clinic
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {formattedFee}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Points */}
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>100% Free Booking (No Advance Payment)</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-sky-500 flex-shrink-0" />
                <span>Pay directly at clinic reception on arrival</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span>Instant SMS & WhatsApp appointment slip</span>
              </div>
            </div>
          </aside>

          {/* Right Column: Step Workspace */}
          <section className="flex-1 w-full bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-sky-950/5 dark:shadow-cyan-950/15 p-6 sm:p-10 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="full-step-1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <Step1DateTime doctor={doctor} onContinue={handleStep1Continue} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="full-step-2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <Step2PhoneOtp
                    initialPhone={verifiedPhone}
                    onVerified={handleStep2Verified}
                    onBack={() => setStep(1)}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="full-step-3"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <Step3PatientDetails
                    doctor={doctor}
                    date={selectedDate}
                    timeSlot={selectedSlot}
                    verifiedPhone={verifiedPhone}
                    defaultPatientName={patientUser?.name}
                    onConfirm={handleStep3Confirm}
                    onBack={() => setStep(2)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>
      </motion.div>
    </AnimatePresence>
  );
}

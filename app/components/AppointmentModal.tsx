"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Video,
  Building,
  CheckCircle2,
  ShieldCheck,
  Star
} from "lucide-react";
import { Doctor } from "./TopRatedDoctors";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  doctor,
}: AppointmentModalProps) {
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [visitType, setVisitType] = useState<"clinic" | "video">("clinic");
  const [selectedSlot, setSelectedSlot] = useState("02:30 PM");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmed(true);
    }, 1000);
  };

  const handleClose = () => {
    setBookingConfirmed(false);
    onClose();
  };

  const timeSlots = ["09:30 AM", "11:00 AM", "02:30 PM", "04:15 PM", "05:45 PM"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeInUp">
      <div className="relative w-full max-w-xl glass-panel bg-white dark:bg-[#0b1426] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/40 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close booking modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {bookingConfirmed ? (
          <div className="py-8 text-center space-y-4 animate-fadeInUp">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Appointment Confirmed!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              Your consultation with{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {doctor?.name || "our Medical Board"}
              </span>{" "}
              is booked for <span className="font-semibold text-sky-600 dark:text-sky-400">Today at {selectedSlot}</span>.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-500 space-y-1 text-left max-w-sm mx-auto">
              <p>• Patient: <strong className="text-slate-800 dark:text-white">{patientName || "Guest Patient"}</strong></p>
              <p>• Mode: <strong className="text-slate-800 dark:text-white">{visitType === "clinic" ? "In-Person Clinic Visit" : "HD Video Telehealth"}</strong></p>
              <p>• A confirmation code has been sent to {patientEmail || "your email"}.</p>
            </div>
            <div className="pt-4">
              <button
                onClick={handleClose}
                className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-600 to-teal-500 shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Digital Reservation
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Book an Appointment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Confirm your doctor consultation with real-time digital sync.
              </p>
            </div>

            {/* Doctor Info Card */}
            {doctor && (
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-sky-50/80 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/60 mb-6">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    {doctor.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </h4>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                    {doctor.specialty}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" /> {doctor.rating}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Fee: {doctor.fee}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Visit Type Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVisitType("clinic")}
                    className={`py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      visitType === "clinic"
                        ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent"
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>In-Clinic Visit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisitType("video")}
                    className={`py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      visitType === "video"
                        ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video Telehealth</span>
                  </button>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Available Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-full text-xs font-semibold border text-center transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? "bg-sky-600 dark:bg-sky-600 text-white border-transparent shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Fields */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Patient Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="patient@email.com"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 123-4567"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 shadow-md shadow-sky-600/30 btn-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Confirming Slot...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>CONFIRM APPOINTMENT NOW</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}


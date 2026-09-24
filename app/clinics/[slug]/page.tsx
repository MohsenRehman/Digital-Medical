"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  Building2,
  Star,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Activity,
  Heart,
  Share2,
  Compass,
} from "lucide-react";
import { ALL_CLINICS_DATA, DetailedClinic, SpecializedDoctor } from "@/lib/clinicsData";
import BookingModal from "@/app/components/booking/BookingModal";
import ParticleBackground from "@/app/components/ParticleBackground";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ClinicDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Find clinic by slug OR id
  const clinic = ALL_CLINICS_DATA.find(
    (c) => c.slug === slug || c.id === slug
  );

  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (!clinic) {
    return notFound();
  }

  const handleBookDoctor = (doctor: SpecializedDoctor) => {
    setSelectedDoctorForBooking({
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      category: doctor.category as any,
      rating: doctor.rating,
      reviewsCount: 160,
      location: doctor.location,
      experience: doctor.experience,
      availableTime: doctor.availableTime,
      fee: doctor.fee,
      image: doctor.image,
    });
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen relative bg-[var(--bg)] text-[var(--text)] flex flex-col selection:bg-teal-500 selection:text-white">
      {/* 1. Ambient Starfield Particle Background */}
      <ParticleBackground />

      {/* Top Navbar */}
      <Navbar onOpenAppointment={() => handleBookDoctor(clinic.topDoctor)} />

      {/* Main Full-Page Clinic Section */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/clinics" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            Clinics
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900 dark:text-white truncate">
            {clinic.name}
          </span>
        </div>

        {/* 1. Full-Width Clinic Hero Banner (Not a popup, Full Page Layout) */}
        <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-900 mb-8 sm:mb-12">
          <div className="relative w-full h-72 sm:h-96">
            <Image
              src={clinic.image}
              alt={clinic.name}
              fill
              priority
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-sky-600/90 text-white backdrop-blur-md shadow-md uppercase tracking-wider">
                {clinic.type}
              </span>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 text-white backdrop-blur-md text-xs font-bold shadow-md">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{clinic.rating.toFixed(1)}</span>
                <span className="text-slate-300 font-normal">({clinic.reviews} Reviews)</span>
              </div>
            </div>

            {/* Bottom Header Info */}
            <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>Department: {clinic.departmentName}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {clinic.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-slate-200">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  {clinic.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  {clinic.hours}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-sky-400" />
                  {clinic.phone}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Main Two-Column Page Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Department Info, Top Doctor, Doctors Roster, Services */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Department Overview */}
            <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0d1726]/80 shadow-md">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">
                    Department Overview
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {clinic.departmentName}
                  </h2>
                </div>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-200 mt-3 font-medium">
                {clinic.overview}
              </p>
            </section>

            {/* ⭐ Top Doctor of the Clinic Spotlight */}
            <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0d1726]/80 shadow-md">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Top Doctor of the Clinic</span>
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  Chief Specialist
                </span>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 shadow-md">
                  <Image
                    src={clinic.topDoctor.image}
                    alt={clinic.topDoctor.name}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 p-1.5 rounded-full shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    {clinic.topDoctor.name}
                  </h4>
                  <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                    {clinic.topDoctor.title} • {clinic.topDoctor.specialty}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>• Experience: {clinic.topDoctor.experience}</span>
                    <span>• Consultation Fee: {clinic.topDoctor.fee}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      • {clinic.topDoctor.availableTime}
                    </span>
                  </div>

                  <div className="pt-3 flex items-center justify-center sm:justify-start gap-3">
                    <button
                      onClick={() => handleBookDoctor(clinic.topDoctor)}
                      className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white btn-mockup-blue flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Doctor Appointment</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 👨‍⚕️ Available Specialized Doctors Roster */}
            <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0d1726]/80 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-sky-500" />
                    <span>Available Specialized Doctors</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Eye doctors, Cardiologists, Pediatricians, and Surgeons available at this clinic
                  </p>
                </div>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-3 py-1 rounded-full">
                  {clinic.specializedDoctors.length} Specialists
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {clinic.specializedDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-sky-400 transition-colors"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 shadow-sm">
                        <Image
                          src={doc.image}
                          alt={doc.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            {doc.name}
                          </h4>
                          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400">
                          {doc.specialty}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span>{doc.experience}</span>
                          <span>• Fee: {doc.fee}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            • {doc.availableTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookDoctor(doc)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white btn-mockup-blue flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0 shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Appointment</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* 🛠️ Clinical Services & Procedures */}
            <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0d1726]/80 shadow-md">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-4">
                Clinical Services & Diagnostic Procedures
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clinic.services.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (4 cols): Sticky Sidebar with Hours, Contact, Facilities & Direct Booking */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* Quick Action Card */}
            <div className="glass-panel p-6 rounded-3xl border border-sky-200/80 dark:border-sky-900/60 bg-gradient-to-br from-sky-50/90 to-white dark:from-[#0d1d36]/90 dark:to-[#0b1426] shadow-xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-sky-600/30">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Book a Consultation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Instant confirmation with verified specialists at {clinic.name}.
              </p>
              
              <button
                onClick={() => handleBookDoctor(clinic.topDoctor)}
                className="w-full mt-5 py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider text-white btn-mockup-blue flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/30 hover:scale-102 transition-transform"
              >
                <Calendar className="w-4 h-4" />
                <span>Doctor Appointment</span>
              </button>
            </div>

            {/* Operating Hours Card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0d1726]/80 shadow-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Working Hours</span>
              </h4>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {clinic.hours}
              </p>
              {clinic.emergencyAvailable && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>24/7 Emergency Triage & ICU Active</span>
                </div>
              )}
            </div>

            {/* Location & Contact Information */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0d1726]/80 shadow-md space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-500" />
                <span>Location & Contact Information</span>
              </h4>
              
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Street Address</span>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {clinic.location}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Reception Telephone Line</span>
                  <a
                    href={`tel:${clinic.phone}`}
                    className="font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{clinic.phone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* On-Site Hospital Facilities */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0d1726]/80 shadow-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Key Hospital Facilities
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {clinic.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center"
                  >
                    {fac}
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </main>

      {/* Appointment Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        doctor={selectedDoctorForBooking}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

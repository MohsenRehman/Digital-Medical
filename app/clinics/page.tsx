"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Star,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Calendar,
  Search,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { ALL_CLINICS_DATA, DetailedClinic, SpecializedDoctor } from "@/lib/clinicsData";
import BookingModal from "../components/booking/BookingModal";
import ParticleBackground from "../components/ParticleBackground";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function ClinicsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeClinic, setActiveClinic] = useState<DetailedClinic | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const categories = [
    "All",
    "Cardiology",
    "Ophthalmology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
  ];

  // Filtering clinics
  const filteredClinics = ALL_CLINICS_DATA.filter((clinic) => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      clinic.departmentName.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      clinic.type.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleOpenDetails = (clinic: DetailedClinic) => {
    setActiveClinic(clinic);
    setIsDetailsOpen(true);
  };

  const handleBookFromDoctor = (doctor: SpecializedDoctor) => {
    // Map to Doctor shape expected by AppointmentModal
    const mappedDoc = {
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      category: doctor.category as any,
      rating: doctor.rating,
      reviewsCount: 150,
      location: doctor.location,
      experience: doctor.experience,
      availableTime: doctor.availableTime,
      fee: doctor.fee,
      image: doctor.image,
    };
    setSelectedDoctorForBooking(mappedDoc);
    setIsDetailsOpen(false);
    setIsBookingOpen(true);
  };

  const handleQuickBook = (clinic: DetailedClinic) => {
    handleBookFromDoctor(clinic.topDoctor);
  };

  return (
    <div className="min-h-screen relative bg-[var(--bg)] text-[var(--text)] flex flex-col selection:bg-teal-500 selection:text-white">
      {/* 1. Ambient Starfield Particle Background */}
      <ParticleBackground />

      {/* Top Navbar */}
      <Navbar onOpenAppointment={() => handleQuickBook(ALL_CLINICS_DATA[0])} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900 dark:text-white">
            Explore All Clinics
          </span>
        </div>

        {/* Hero Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-bold mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>Verified Healthcare Network</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Explore Top Clinics & Hospitals
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Find certified clinics, explore clinical departments, view specialized doctors (Cardiology, Eye Specialists, Pediatrics, etc.), and schedule instant appointments.
          </p>
        </div>

        {/* Search & Category Filter Section */}
        <div className="mb-10 space-y-4">
          {/* Live Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clinic by name, specialty (e.g. Eye, Cardiology), or location..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm transition-all"
            />
          </div>

          {/* Department / Specialty Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0284c7] text-white shadow-md shadow-sky-600/30 scale-105"
                    : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {cat === "All" ? "All Departments" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clinics Grid */}
        {filteredClinics.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl max-w-md mx-auto p-8">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No clinics found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or department filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-sky-600 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredClinics.map((clinic) => (
              <article
                key={clinic.id}
                className="glass-panel rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group bg-white/70 dark:bg-[#0d1726]/80"
              >
                {/* Top Image Banner with Rating & Hours */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <Image
                    src={clinic.image}
                    alt={clinic.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-amber-500/95 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                    <span>{clinic.rating.toFixed(1)}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[11px] px-2.5 py-1 rounded-lg backdrop-blur-md font-medium">
                    {clinic.hours}
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 mb-2">
                      {clinic.departmentName}
                    </span>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {clinic.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {clinic.overview}
                    </p>

                    {/* Top Doctor Snapshot Preview */}
                    <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-800">
                        <Image
                          src={clinic.topDoctor.image}
                          alt={clinic.topDoctor.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {clinic.topDoctor.name}
                          </span>
                          <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        </div>
                        <p className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold truncate">
                          Top Doctor: {clinic.topDoctor.specialty}
                        </p>
                      </div>
                    </div>

                    {/* Location Info */}
                    <div className="flex items-center gap-1.5 mt-3.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{clinic.location}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2.5">
                    <Link
                      href={`/clinics/${clinic.slug}`}
                      className="flex-1 py-2.5 px-4 rounded-full font-bold text-xs bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>VIEW DETAILS</span>
                    </Link>

                    <button
                      onClick={() => handleQuickBook(clinic)}
                      className="p-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Quick Appointment"
                    >
                      <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </main>

      {/* Direct Booking Modal */}
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

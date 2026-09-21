"use client";

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ParticleBackground from "./components/ParticleBackground";
import Hero from "./components/Hero";
import SearchFilterBar from "./components/SearchFilterBar";
import TopRatedDoctors, { Doctor, DOCTORS_DATA } from "./components/TopRatedDoctors";
import MedicalSpecialties from "./components/MedicalSpecialties";
import ClinicsJoinUs from "./components/ClinicsJoinUs";
import TopRatedClinics from "./components/TopRatedClinics";
import HowItWorks from "./components/HowItWorks";
import WhyDigitalMedical from "./components/WhyDigitalMedical";
import PatientTestimonials from "./components/PatientTestimonials";
import DoctorSchedule from "./components/DoctorSchedule";
import HealthArticles from "./components/HealthArticles";
import CtaBanner from "./components/CtaBanner";
import Footer from "./components/Footer";
import AppointmentModal from "./components/AppointmentModal";
import ScrollToTop from "./components/ScrollToTop";

export default function HomePage() {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchFilter, setSearchFilter] = useState({
    doctor: "",
    specialty: "All Specialties",
    location: "All Locations",
  });

  const handleOpenAppointment = (doctor?: Doctor) => {
    if (doctor) {
      setSelectedDoctor(doctor);
    } else {
      setSelectedDoctor(DOCTORS_DATA[0]);
    }
    setIsAppointmentOpen(true);
  };

  const handleSearch = (doctor: string, specialty: string, location: string) => {
    setSearchFilter({ doctor, specialty, location });
    const el = document.getElementById("doctors");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectSpecialty = (specialtyName: string) => {
    setSearchFilter((prev) => ({ ...prev, specialty: specialtyName }));
    const el = document.getElementById("doctors");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBookScheduleSlot = (item: any) => {
    const matchedDoc = DOCTORS_DATA.find((d) => d.name === item.doctor) || DOCTORS_DATA[0];
    setSelectedDoctor(matchedDoc);
    setIsAppointmentOpen(true);
  };

  return (
    <main className="min-h-screen relative selection:bg-teal-500 selection:text-white pb-20 md:pb-0">
      {/* 1. Ambient Starfield Particle Background (Technique #25, #28) */}
      <ParticleBackground />

      {/* 2. Sticky Glassmorphism Header (Technique #11, #21, #22) */}
      <Navbar onOpenAppointment={() => handleOpenAppointment()} />

      {/* 3. Hero Section with Fan Deck & Float Animations (Technique #04, #05, #18, #19) */}
      <Hero onOpenAppointment={() => handleOpenAppointment()} />

      {/* 4. Search Filter Bar */}
      <SearchFilterBar onSearch={handleSearch} />

      {/* 5. Section 3: Top-Rated Doctors (Technique #03, #07, #16) */}
      <TopRatedDoctors
        onSelectDoctor={(doc) => handleOpenAppointment(doc)}
        searchFilter={searchFilter}
      />

      {/* 6. Section 4: Medical Specialties (Technique #02, #07, #12, #14) */}
      <MedicalSpecialties onSelectSpecialty={handleSelectSpecialty} />

      {/* 7. Section: Clinics - Join Us (Multi-Step Form Wizard) */}
      <ClinicsJoinUs />

      {/* 8. Section 6: Top-Rated Clinics (Technique #04, #17) */}
      <TopRatedClinics onOpenBooking={() => handleOpenAppointment()} />

      {/* 9. Section 7: How It Works */}
      <HowItWorks onStartBooking={() => handleOpenAppointment()} />

      {/* 10. Section 8: Why Digital Medical (Technique #24, #26) */}
      <WhyDigitalMedical />

      {/* 11. Section: Campus Calendar / Doctor Schedule (Technique #06, #09) */}
      <DoctorSchedule onBookScheduleSlot={handleBookScheduleSlot} />

      {/* 12. Section 9: Patient Testimonials & Marquee Strip (Technique #06, #10) */}
      <PatientTestimonials />

      {/* 13. Section 10: Health Articles (Technique #07, #16) */}
      <HealthArticles />

      {/* 14. CTA Banner: Take Charge of Your Health Today! */}
      <CtaBanner onOpenBooking={() => handleOpenAppointment()} />

      {/* 15. Footer with Fluid Watermark Typography (Technique #27) */}
      <Footer />

      {/* Interactive Booking Modal */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        doctor={selectedDoctor}
      />

      {/* Scroll-to-Top Button (Technique #08, #20) */}
      <ScrollToTop />
    </main>
  );
}

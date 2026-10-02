"use client";

import React from "react";
import DoctorKpiCards from "@/components/doctor/DoctorKpiCards";
import DoctorAnalysisSection from "@/components/doctor/analysis/DoctorAnalysisSection";
import AppointmentTable from "@/components/doctor/AppointmentTable";
import LiveQueueCard from "@/components/doctor/LiveQueueCard";

export default function DoctorDashboardOverview() {
  return (
    <div className="space-y-6 pb-10">
      {/* ────────────────────────────────────────
          KPI CARDS
      ──────────────────────────────────────── */}
      <section aria-label="KPI Cards" className="pb-6 border-b border-slate-200/90 dark:border-slate-800/90">
        <DoctorKpiCards />
      </section>

      {/* ────────────────────────────────────────
          ANALYSIS
          (Patient Activity, Appointment Performance, Quick Insights)
      ──────────────────────────────────────── */}
      <section aria-label="Clinical Analysis" className="pb-6 border-b border-slate-200/90 dark:border-slate-800/90">
        <DoctorAnalysisSection />
      </section>

      {/* ────────────────────────────────────────
          TODAY'S APPOINTMENTS
      ──────────────────────────────────────── */}
      <section aria-label="Today's Appointments" className="pb-6 border-b border-slate-200/90 dark:border-slate-800/90">
        <AppointmentTable limit={6} />
      </section>

      {/* ────────────────────────────────────────
          WAITING QUEUE / CURRENT PATIENTS
      ──────────────────────────────────────── */}
      <section aria-label="Waiting Queue and Current Patients">
        <LiveQueueCard />
      </section>
    </div>
  );
}
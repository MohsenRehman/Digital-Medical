"use client";

import React from "react";
import { useDoctor } from "@/app/context/DoctorContext";
import { PatientActivityCard } from "./PatientActivityCard";
import { AppointmentPerformanceCard } from "./AppointmentPerformanceCard";
import { QuickClinicalInsights } from "./QuickClinicalInsights";
import { AnalysisSkeleton } from "./AnalysisSkeleton";
import { AnalysisErrorBoundary } from "./AnalysisErrorBoundary";

function AnalysisContent() {
  const { isLoaded, appointments } = useDoctor();

  // Show skeleton loader if context is still loading and no data is loaded yet
  if (!isLoaded && (!appointments || appointments.length === 0)) {
    return <AnalysisSkeleton />;
  }

  return (
    <div className="space-y-3 md:space-y-3.5">
      {/* 2-Column Responsive Layout: Patient Activity (Left) & Appointment Performance (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-3.5 items-stretch">
        <div className="h-full">
          <PatientActivityCard />
        </div>
        <div className="h-full">
          <AppointmentPerformanceCard />
        </div>
      </div>

      {/* Quick Clinical Insights (Below the charts) */}
      <QuickClinicalInsights />
    </div>
  );
}

export default function DoctorAnalysisSection() {
  const { refreshAppointments } = useDoctor();

  return (
    <section aria-label="Clinical Analysis">
      {/* Error Boundary Protected Content */}
      <AnalysisErrorBoundary onReset={refreshAppointments}>
        <AnalysisContent />
      </AnalysisErrorBoundary>
    </section>
  );
}

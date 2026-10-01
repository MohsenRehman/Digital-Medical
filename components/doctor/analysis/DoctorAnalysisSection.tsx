"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
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
    <div className="space-y-4 md:space-y-5">
      {/* 2-Column Responsive Layout: Patient Activity (Left) & Appointment Performance (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
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
    <section aria-labelledby="doctor-analysis-heading" className="space-y-3.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="doctor-analysis-heading"
              className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your recent patient and consultation activity
          </p>
        </div>
      </div>

      {/* Error Boundary Protected Content */}
      <AnalysisErrorBoundary onReset={refreshAppointments}>
        <AnalysisContent />
      </AnalysisErrorBoundary>
    </section>
  );
}

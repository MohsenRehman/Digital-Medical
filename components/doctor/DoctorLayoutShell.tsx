"use client";

import React from "react";
import { useDoctor } from "@/app/context/DoctorContext";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorHeader from "@/components/doctor/DoctorHeader";

export default function DoctorLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useDoctor();

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-body">
      {/* Persistent Doctor Navigation Sidebar */}
      <DoctorSidebar />

      {/* Main Content Area - dynamically adjusts padding when sidebar collapses */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Header */}
        <DoctorHeader />

        {/* Page Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

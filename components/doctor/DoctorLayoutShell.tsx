"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useDoctor } from "@/app/context/DoctorContext";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorHeader from "@/components/doctor/DoctorHeader";

export default function DoctorLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { sidebarCollapsed } = useDoctor();
  const isDoctorDashboard = pathname === "/doctor" || pathname === "/doctor/";

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
        <main
          className={`flex-1 w-full mx-auto transition-all ${
            isDoctorDashboard
              ? "p-3 sm:p-4 md:p-5 max-w-7xl space-y-4"
              : "p-4 md:p-8 max-w-7xl space-y-6"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

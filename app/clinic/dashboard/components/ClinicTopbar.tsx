"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  UserPlus,
  Calendar,
  Ticket,
  Stethoscope,
  Receipt,
  Menu,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-react";
import { DashboardNavModule } from "../types";

interface ClinicTopbarProps {
  activeModule: DashboardNavModule;
  clinicName: string;
  onOpenQuickPatient: () => void;
  onOpenNewAppointment: () => void;
  onOpenGenerateToken: () => void;
  onOpenAddDoctor: () => void;
  onOpenCreateInvoice: () => void;
  onToggleMobileMenu: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
}

export const ClinicTopbar: React.FC<ClinicTopbarProps> = ({
  activeModule,
  clinicName,
  onOpenQuickPatient,
  onOpenNewAppointment,
  onOpenGenerateToken,
  onOpenAddDoctor,
  onOpenCreateInvoice,
  onToggleMobileMenu,
  unreadCount,
  onOpenNotifications,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const moduleTitles: Record<DashboardNavModule, { title: string; subtitle: string }> = {
    overview: {
      title: "Clinic Operational Overview",
      subtitle: "Live footfall, active consultation rooms, and daily financial metrics",
    },
    appointments: {
      title: "Appointments & Schedules",
      subtitle: "Manage daily online bookings, walk-ins, and consultation slots",
    },
    queue: {
      title: "Live OPD Queue Monitor",
      subtitle: "Real-time hospital token management and patient waiting lounge board",
    },
    patients: {
      title: "Patient Health Directory",
      subtitle: "Permanent medical records, visit logs, and family profiles",
    },
    doctors: {
      title: "Specialist Doctors & Roaster",
      subtitle: "Consultation fees, shift timings, room assignments, and availability",
    },
    staff: {
      title: "Staff & Role Permissions",
      subtitle: "Front desk receptionists, nurses, cashiers, and role access",
    },
    clinical: {
      title: "Clinical Workflow & Prescriptions",
      subtitle: "Doctor consultation records, e-prescriptions, and investigations",
    },
    pharmacy: {
      title: "In-House Pharmacy POS",
      subtitle: "Medicine inventory, prescription dispensing, and expiry tracking",
    },
    laboratory: {
      title: "Diagnostic Laboratory",
      subtitle: "Pathology tests, specimen collection, and verified lab reports",
    },
    billing: {
      title: "Billing & Cash Counter",
      subtitle: "Daily cash register reconciliation, invoices, and payment receipts",
    },
    inventory: {
      title: "Medical Inventory & Supplies",
      subtitle: "Consumables, surgical supplies, and automated reorder alerts",
    },
    reports: {
      title: "Reports & Financial Analytics",
      subtitle: "Daily revenue graphs, patient trends, and doctor performance",
    },
    subscription: {
      title: "Clinic SaaS Subscription",
      subtitle: "Current tier plan, patient capacity limits, and payment receipts",
    },
    settings: {
      title: "Clinic Configuration & Settings",
      subtitle: "Branding, operating shifts, consultation fees, and security",
    },
    notifications: {
      title: "System Notifications",
      subtitle: "Low stock alerts, booking confirmations, and patient arrivals",
    },
    support: {
      title: "Help & Technical Support",
      subtitle: "Submit tickets to Super-Admin team, printer setup, and guides",
    },
    activity: {
      title: "Activity & Audit Trail",
      subtitle: "Authorized operational logs for compliance and accountability",
    },
  };

  const currentInfo = moduleTitles[activeModule] || {
    title: "Clinic Workspace",
    subtitle: clinicName,
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800">
      <div className="px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Dynamic Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                {clinicName}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Shift Open
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
              {currentInfo.title}
            </h1>
          </div>
        </div>

        {/* Right Actions: Quick Buttons + Global Search + Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action Buttons Group */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={onOpenQuickPatient}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-xs cursor-pointer"
              title="Quick Register Patient"
            >
              <UserPlus className="w-3.5 h-3.5 text-sky-600" />
              <span>+ Patient</span>
            </button>

            <button
              onClick={onOpenNewAppointment}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-xs cursor-pointer"
              title="New Appointment"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>+ Appt</span>
            </button>

            <button
              onClick={onOpenGenerateToken}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-xs cursor-pointer"
              title="Generate OPD Token"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-600" />
              <span>+ Token</span>
            </button>

            <button
              onClick={onOpenCreateInvoice}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-xs cursor-pointer"
              title="Create Invoice"
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Invoice</span>
            </button>
          </div>

          {/* Quick Date Display */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Fri, 25 Sep 2024</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => onOpenNotifications()}
              className="relative p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

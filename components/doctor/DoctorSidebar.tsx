"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  CalendarDays,
  UserCheck,
  Stethoscope,
  FileText,
  FlaskConical,
  RotateCcw,
  Clock,
  BarChart3,
  Bell,
  Settings,
  ShieldCheck,
  Building2,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Radio,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { DoctorAvailabilityStatus } from "@/lib/types/doctor";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function DoctorSidebar() {
  const pathname = usePathname();
  const {
    doctor,
    activeClinic,
    doctorStatus,
    setDoctorStatus,
    waitingQueue,
    followUps,
    unreadNotificationsCount,
  } = useDoctor();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const waitingCount = waitingQueue.length;
  const followUpCount = followUps.filter((f) => f.status === "pending" && f.followUpDate === "2026-09-24").length;

  const navSections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        {
          name: "Dashboard",
          href: "/doctor",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "CLINICAL",
      items: [
        {
          name: "Today's Queue",
          href: "/doctor/queue",
          icon: Users2,
          badge: waitingCount > 0 ? `${waitingCount}` : undefined,
        },
        {
          name: "Appointments",
          href: "/doctor/appointments",
          icon: CalendarDays,
        },
        {
          name: "Patients",
          href: "/doctor/patients",
          icon: UserCheck,
        },
        {
          name: "Consultations",
          href: "/doctor/consultations",
          icon: Stethoscope,
        },
        {
          name: "Prescriptions",
          href: "/doctor/prescriptions",
          icon: FileText,
        },
        {
          name: "Investigations / Labs",
          href: "/doctor/labs",
          icon: FlaskConical,
        },
        {
          name: "Follow-ups",
          href: "/doctor/follow-ups",
          icon: RotateCcw,
          badge: followUpCount > 0 ? `${followUpCount}` : undefined,
        },
      ],
    },
    {
      title: "PRACTICE",
      items: [
        {
          name: "Availability & Schedule",
          href: "/doctor/availability",
          icon: Clock,
        },
      ],
    },
    {
      title: "INSIGHTS",
      items: [
        {
          name: "Analytics",
          href: "/doctor/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        {
          name: "Notifications",
          href: "/doctor/notifications",
          icon: Bell,
          badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined,
        },
        {
          name: "Settings & Profile",
          href: "/doctor/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const statusConfig: Record<DoctorAvailabilityStatus, { label: string; color: string; bg: string }> = {
    available: { label: "Available", color: "bg-emerald-500", bg: "text-emerald-700 dark:text-emerald-300" },
    in_consultation: { label: "In Consultation", color: "bg-amber-500", bg: "text-amber-700 dark:text-amber-300" },
    on_break: { label: "On Break", color: "bg-blue-500", bg: "text-blue-700 dark:text-blue-300" },
    offline: { label: "Offline", color: "bg-slate-400", bg: "text-slate-600 dark:text-slate-400" },
  };

  const currentStatus = statusConfig[doctorStatus] || statusConfig.available;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <Link href="/doctor" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  DIGITAL MEDICAL
                </span>
              </div>
              <span className="text-[11px] font-medium tracking-wide uppercase text-sky-600 dark:text-sky-400">
                Doctor Workspace
              </span>
            </div>
          </Link>
          {/* Close for mobile drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Info Card */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
              />
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${currentStatus.color}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {doctor.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {doctor.specialty}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                <span className="text-[11px] font-medium text-sky-700 dark:text-sky-300">
                  PMDC #{doctor.pmdcRegistration} • Verified
                </span>
              </div>
            </div>
          </div>

          {/* Active Clinic quick display */}
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">{activeClinic.name} ({activeClinic.city})</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/doctor" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? "text-sky-600 dark:text-sky-400"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${
                          isActive
                            ? "bg-sky-200/80 dark:bg-sky-800/80 text-sky-800 dark:text-sky-100"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Controls: Availability toggle & Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
        {/* Availability status dropdown */}
        <div className="relative">
          <button
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-left shadow-xs hover:border-sky-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentStatus.color}`} />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Status: {currentStatus.label}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {statusDropdownOpen && (
            <div className="absolute bottom-full mb-1 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1.5 z-50 space-y-1">
              {(["available", "in_consultation", "on_break", "offline"] as DoctorAvailabilityStatus[]).map(
                (status) => {
                  const cfg = statusConfig[status];
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        setDoctorStatus(status);
                        setStatusDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        doctorStatus === status
                          ? "bg-slate-100 dark:bg-slate-700 font-bold"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${cfg.color}`} />
                      <span>{cfg.label}</span>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Doctor portal exit/logout */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Workspace</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button Floating Header trigger */}
      <div className="md:hidden fixed top-3 left-3 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md text-slate-700 dark:text-slate-200 hover:text-sky-600"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-slideInLeft">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

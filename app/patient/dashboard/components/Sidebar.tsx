"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Pill,
  Activity,
  Users,
  Stethoscope,
  Clock,
  Bell,
  Settings,
  LogOut,
  HeartPulse,
  X,
  User,
  ShieldCheck,
  ChevronRight,
  Home,
} from "lucide-react";
import { DashboardTab } from "./types";
import { PatientUser } from "@/lib/types/patient";

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  patientUser: PatientUser | null;
  onLogout: () => void;
  appointmentCount?: number;
  unreadNotificationsCount?: number;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
  patientUser,
  onLogout,
  appointmentCount = 0,
  unreadNotificationsCount = 2,
}: SidebarProps) {
  const navItems: { id: DashboardTab; label: string; icon: React.ElementType; badge?: number | string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "appointments", label: "Appointments", icon: CalendarDays, badge: appointmentCount > 0 ? appointmentCount : undefined },
    { id: "medical-records", label: "Medical Records", icon: FileText },
    { id: "prescriptions", label: "Prescriptions", icon: Pill },
    { id: "lab-reports", label: "Lab Reports", icon: Activity },
    { id: "family", label: "Family Members", icon: Users },
    { id: "doctors-clinics", label: "Doctors & Clinics", icon: Stethoscope },
    { id: "follow-ups", label: "Follow-ups", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined },
    { id: "settings", label: "Profile & Settings", icon: Settings },
  ];

  const displayName = patientUser?.name || "Muhammad Ahmed";
  const displayPhone = patientUser?.phone || "0300-1234567";

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B1426] text-slate-300 flex flex-col border-r border-slate-800/80 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1 leading-tight">
                Digital<span className="text-teal-400">Medical</span>
              </span>
              <span className="text-[10px] text-teal-300/80 font-semibold tracking-wider uppercase">
                Patient Portal
              </span>
            </div>
          </Link>

          {/* Close button on Mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Website Switcher Link */}
        <div className="px-4 pt-3 pb-1">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-teal-300 hover:bg-slate-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Home className="w-3.5 h-3.5 text-teal-400" />
              <span>Public Website Home</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </Link>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            Patient Desk
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-teal-500/15 text-teal-400 border border-teal-500/30 shadow-xs font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-teal-500 text-white shadow-xs shadow-teal-500/30"
                        : "bg-slate-800/80 text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-teal-400 text-slate-900"
                        : "bg-slate-800 text-teal-300 border border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Area: Patient Profile & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-[#070e1b]/70">
          <div className="p-2.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-teal-500/20 flex-shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate leading-tight flex items-center gap-1">
                  {displayName}
                  <ShieldCheck className="w-3 h-3 text-teal-400 flex-shrink-0" />
                </span>
                <span className="text-[10px] text-slate-400 truncate font-mono">
                  {displayPhone}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

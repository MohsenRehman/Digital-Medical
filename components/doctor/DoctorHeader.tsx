"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  User,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { PatientProfile } from "@/lib/types/doctor";
import { LoadingSpinner } from "@/components/doctor/loading/LoadingSpinner";
import { useDoctorToast } from "@/components/doctor/loading/DoctorToast";

export default function DoctorHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useDoctorToast();
  const {
    doctor,
    activeClinic,
    switchClinic,
    doctorStatus,
    searchPatients,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useDoctor();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PatientProfile[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Clinic switcher state
  const [clinicDropdownOpen, setClinicDropdownOpen] = useState(false);
  const [switchingClinicId, setSwitchingClinicId] = useState<string | null>(null);
  const clinicRef = useRef<HTMLDivElement>(null);

  // Notification dropdown state
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Handle global patient search with perceived loading feedback
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const results = searchPatients(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      }, 160);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, searchPatients]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (clinicRef.current && !clinicRef.current.contains(event.target as Node)) {
        setClinicDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute breadcrumb/title from pathname
  const getPageTitle = () => {
    if (pathname === "/doctor") return "Doctor Dashboard";
    if (pathname.startsWith("/doctor/queue")) return "Live Patient Queue";
    if (pathname.startsWith("/doctor/appointments")) return "Appointments Schedule";
    if (pathname.startsWith("/doctor/patients")) return "Patient Registry";
    if (pathname.startsWith("/doctor/consultations")) return "Consultation Workspace";
    if (pathname.startsWith("/doctor/prescriptions")) return "Digital Prescriptions";
    if (pathname.startsWith("/doctor/labs")) return "Investigations & Labs";
    if (pathname.startsWith("/doctor/follow-ups")) return "Follow-up Management";
    if (pathname.startsWith("/doctor/availability")) return "Availability & Working Hours";
    if (pathname.startsWith("/doctor/analytics")) return "Practice Analytics";
    if (pathname.startsWith("/doctor/notifications")) return "Notification Center";
    if (pathname.startsWith("/doctor/settings")) return "Doctor Settings";
    return "Doctor Workspace";
  };

  const statusColorMap = {
    available: "bg-emerald-500",
    in_consultation: "bg-amber-500",
    on_break: "bg-blue-500",
    offline: "bg-slate-400",
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Page Title / Breadcrumb (with margin on mobile for hamburger button) */}
        <div className="flex flex-col min-w-0 pl-10 md:pl-0">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            Doctor Workspace
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-sky-600 dark:text-sky-400 font-semibold">{getPageTitle()}</span>
          </span>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Center: Global Patient Search Bar */}
        <div ref={searchRef} className="flex-1 max-w-lg relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient by name, phone or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-10 pr-10 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-xs"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {isSearching && <LoadingSpinner size="xs" />}
              {searchQuery && !isSearching && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Results Dropdown */}
          {searchFocused && searchQuery.trim().length > 1 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-popIn">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Search Results ({searchResults.length})
                  </span>
                  {isSearching && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                      <LoadingSpinner size="xs" />
                      <span>Updating...</span>
                    </span>
                  )}
                </div>
                <span className="text-[11px]">Strict Clinical RBAC Protected</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  No matching patients found in this clinic registry.
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {p.name}
                          </span>
                          <span className="text-slate-500">
                            {p.age} yrs • {p.gender}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono text-[10px]">
                            {p.id}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-3">
                          <span>Phone: {p.phone}</span>
                          <span>Last Visit: {p.lastVisitDate || "None"}</span>
                        </div>
                        {p.allergies.length > 0 && (
                          <div className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            <span>Allergies: {p.allergies.join(", ")}</span>
                          </div>
                        )}
                        {p.currentMedications.length > 0 && (
                          <div className="text-[11px] text-slate-600 dark:text-slate-400">
                            Current Rx: {p.currentMedications.join(", ")}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSearchFocused(false);
                          setSearchQuery("");
                          router.push(`/doctor/patients/${p.id}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <span>Open Patient</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Clinic Switcher, Notifications, Doctor Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Multi-Clinic / Tenant Context Switcher */}
          <div ref={clinicRef} className="relative">
            <button
              onClick={() => setClinicDropdownOpen(!clinicDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-left hover:border-sky-400 transition-colors shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
              <div className="hidden sm:block text-left">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Clinic</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                  {activeClinic.name}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {clinicDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-popIn">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <p className="font-bold text-slate-900 dark:text-white">Affiliated Clinics</p>
                  <p className="text-[11px] text-slate-500">Switch active clinic workspace</p>
                </div>
                <div className="mt-1 space-y-1">
                  {doctor.affiliatedClinics.map((clinic) => {
                    const isSelected = clinic.id === activeClinic.id;
                    return (
                      <button
                        key={clinic.id}
                        disabled={switchingClinicId !== null}
                        onClick={() => {
                          if (switchingClinicId) return;
                          setSwitchingClinicId(clinic.id);
                          setTimeout(() => {
                            switchClinic(clinic.id);
                            setSwitchingClinicId(null);
                            setClinicDropdownOpen(false);
                            showToast(`Switched workspace to ${clinic.name}`, "success");
                          }, 250);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between ${
                          isSelected
                            ? "bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-200 font-semibold"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div>
                          <p className="font-medium">{clinic.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {clinic.city} • {clinic.roomNumber}
                          </p>
                        </div>
                        {switchingClinicId === clinic.id ? (
                          <LoadingSpinner size="xs" />
                        ) : isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Flyout */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-popIn">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 text-[10px] font-bold">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-sky-600 hover:text-sky-700 dark:text-sky-400 font-medium"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer ${
                        !n.isRead ? "bg-sky-50/50 dark:bg-sky-950/20" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
                  <Link
                    href="/doctor/notifications"
                    onClick={() => setNotifDropdownOpen(false)}
                    className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    View All Notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Doctor Profile link */}
          <Link
            href="/doctor/settings"
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="relative">
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <span
                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${
                  statusColorMap[doctorStatus] || "bg-emerald-500"
                }`}
              />
            </div>
            <div className="hidden sm:block text-left text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[130px] lg:max-w-none">
                  {doctor.name}
                </span>
                <img
                  src="/images/varified-badge.png"
                  alt="Verified Doctor"
                  className="w-3.5 h-3.5 object-contain inline-block flex-shrink-0"
                />
              </div>
              <p className="text-[11px] text-slate-400">{doctor.specialty}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

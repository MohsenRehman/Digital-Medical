"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Plus,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CalendarDays,
  Settings,
  HeartPulse,
  X,
  FileText,
  Users,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import { PatientUser } from "@/lib/types/patient";
import { DashboardTab } from "./types";

interface TopNavbarProps {
  onToggleSidebar: () => void;
  onOpenBooking: () => void;
  onOpenNotifications: () => void;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
  patientUser: PatientUser | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadCount?: number;
  activeTab?: DashboardTab;
  sidebarCollapsed?: boolean;
}

export default function TopNavbar({
  onToggleSidebar,
  onOpenBooking,
  onOpenNotifications,
  onTabChange,
  onLogout,
  patientUser,
  searchQuery,
  onSearchChange,
  unreadCount = 2,
  activeTab = "dashboard",
  sidebarCollapsed = false,
}: TopNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = patientUser?.name || "Muhammad Ahmed";
  const displayPhone = patientUser?.phone || "0300-1234567";

  // Profile picture synchronized state
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const readImage = () => {
      try {
        const saved = localStorage.getItem("patient_profile_image");
        setProfileImage(saved);
      } catch {
        // ignore
      }
    };

    readImage();

    const handleCustomUpdate = () => readImage();
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === "patient_profile_image") {
        readImage();
      }
    };

    window.addEventListener("patient-profile-image-updated", handleCustomUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("patient-profile-image-updated", handleCustomUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = (tab: DashboardTab) => {
    switch (tab) {
      case "dashboard":
        return "Patient Dashboard";
      case "appointments":
        return "My Appointments";
      case "medical-records":
        return "Medical Records";
      case "prescriptions":
        return "Prescriptions & E-Pharmacy";
      case "lab-reports":
        return "Lab Reports & Scans";
      case "family":
        return "Family Profiles";
      case "doctors-clinics":
        return "Doctors & Clinics Directory";
      case "follow-ups":
        return "Follow-up Schedule";
      case "settings":
        return "Profile & Settings";
      case "notifications":
        return "Notification Center";
      default:
        return "Patient Portal";
    }
  };

  const getMobileTitle = (tab: DashboardTab) => {
    switch (tab) {
      case "dashboard":
        return "Patient Portal";
      case "appointments":
        return "Appointments";
      case "medical-records":
        return "Medical Records";
      case "prescriptions":
        return "Prescriptions";
      case "lab-reports":
        return "Lab Reports";
      case "family":
        return "Family Profiles";
      case "doctors-clinics":
        return "Doctors & Clinics";
      case "follow-ups":
        return "Follow-ups";
      case "settings":
        return "Settings";
      case "notifications":
        return "Notifications";
      default:
        return "Patient Portal";
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-14 sm:h-16 md:h-[70px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex items-center left-0 ${
        sidebarCollapsed ? "md:left-20" : "md:left-64"
      }`}
    >
      <div className="relative w-full px-2.5 sm:px-4 md:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Left: Menu Toggle Button only */}
        <div className="flex items-center md:hidden flex-shrink-0">
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Desktop Left: Breadcrumb / Section Title */}
        <div className="hidden md:flex items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate leading-tight">
              {getPageTitle(activeTab)}
            </h1>
          </div>
        </div>

        {/* Mobile Center: Visually and perfectly centered across the entire navbar */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center md:hidden pointer-events-none max-w-[calc(100%-195px)] sm:max-w-[calc(100%-230px)] px-1">
          <h1 className="text-xs sm:text-sm font-semibold tracking-tight text-slate-900 dark:text-white truncate pointer-events-auto select-none">
            {getMobileTitle(activeTab)}
          </h1>
        </div>

        {/* Desktop Center: Search Bar */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search doctors, records, appointments..."
              className="w-full pl-10 pr-9 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Actions (Mobile order: Theme -> Bell -> Avatar) */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 flex-shrink-0">
          {/* Quick Book Appointment CTA (Hidden on mobile, preserved on desktop: order 1) */}
          <button
            onClick={onOpenBooking}
            className="hidden md:inline-flex md:order-1 items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>

          {/* Theme Toggle (Mobile: order-1, Desktop: md:order-3) */}
          <button
            onClick={toggleTheme}
            className="order-1 md:order-3 w-8 h-8 sm:w-9 sm:h-9 md:w-auto md:h-auto md:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer outline-none"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* Notifications Trigger (Mobile: order-2, Desktop: md:order-2) */}
          <button
            onClick={onOpenNotifications}
            className="order-2 md:order-2 relative w-8 h-8 sm:w-9 sm:h-9 md:w-auto md:h-auto md:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer outline-none"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            )}
          </button>

          {/* Divider (Desktop only: md:order-4) */}
          <div className="hidden md:block md:order-4 h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

          {/* Patient Profile Dropdown (Mobile: order-3, Desktop: md:order-5) */}
          <div ref={profileRef} className="relative order-3 md:order-5">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-0.5 sm:p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-none"
              aria-label="User profile menu"
            >
              <div className="w-[34px] h-[34px] sm:w-9 sm:h-9 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-2xs flex-shrink-0 overflow-hidden">
                {profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImage}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                    {displayName}
                  </span>
                  <ShieldCheck className="w-3 h-3 text-sky-500 flex-shrink-0" />
                </div>
                <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">Primary Account</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-popIn">
                <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {displayPhone}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onTabChange("settings");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Profile & Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      onTabChange("appointments");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Appointments</span>
                  </button>
                  <button
                    onClick={() => {
                      onTabChange("medical-records");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Medical Records</span>
                  </button>
                  <button
                    onClick={() => {
                      onTabChange("family");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-sky-500" />
                    <span>Family Profiles</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

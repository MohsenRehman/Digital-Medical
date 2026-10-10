"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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
  ShieldCheck,
  Home,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
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
  sidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

interface NavSection {
  title: string;
  items: {
    id: DashboardTab;
    name: string;
    icon: React.ElementType;
    badge?: number | string;
  }[];
}

interface TooltipData {
  text: string;
  badge?: string | number;
  top: number;
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
  sidebarCollapsed = false,
  onToggleCollapse,
  searchQuery = "",
  onSearchChange,
}: SidebarProps) {
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

  // Floating tooltip for collapsed mode
  const [hoveredTooltip, setHoveredTooltip] = useState<TooltipData | null>(null);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = useCallback((text: string, top: number, badge?: string | number) => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    tooltipTimerRef.current = setTimeout(() => {
      setHoveredTooltip({ text, top, badge });
    }, 100);
  }, []);

  const hideTooltip = useCallback(() => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    setHoveredTooltip(null);
  }, []);

  // Clear tooltip when tab changes
  useEffect(() => {
    hideTooltip();
  }, [activeTab, hideTooltip]);

  const navSections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "CLINICAL CARE",
      items: [
        {
          id: "appointments",
          name: "Appointments",
          icon: CalendarDays,
          badge: appointmentCount > 0 ? `${appointmentCount}` : undefined,
        },
        { id: "medical-records", name: "Medical Records", icon: FileText },
        { id: "prescriptions", name: "Prescriptions", icon: Pill },
        { id: "lab-reports", name: "Lab Reports", icon: Activity },
        { id: "follow-ups", name: "Follow-ups", icon: Clock },
      ],
    },
    {
      title: "FAMILY & PROVIDERS",
      items: [
        { id: "family", name: "Family Profiles", icon: Users },
        { id: "doctors-clinics", name: "Doctors & Clinics", icon: Stethoscope },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        {
          id: "notifications",
          name: "Notifications",
          icon: Bell,
          badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined,
        },
        { id: "settings", name: "Profile & Settings", icon: Settings },
      ],
    },
  ];

  // ----------------------------------------------------
  // RENDER: Desktop Sidebar Content (Supports Collapsed & Expanded)
  // ----------------------------------------------------
  const desktopSidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 select-none">
      {/* 1. Header / Branding / Collapse Toggle Area */}
      {sidebarCollapsed ? (
        // COLLAPSED HEADER
        <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5 h-[70px]">
          <button
            type="button"
            onClick={() => onTabChange("dashboard")}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              showTooltip("Digital Medical - Patient Portal", rect.top + rect.height / 2);
            }}
            onMouseLeave={hideTooltip}
            aria-label="Digital Medical - Patient Portal"
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20 hover:scale-105 transition-transform flex-shrink-0 cursor-pointer outline-none border-0"
          >
            <HeartPulse className="w-4 h-4 animate-pulse" />
          </button>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                showTooltip("Expand sidebar", rect.top + rect.height / 2);
              }}
              onMouseLeave={hideTooltip}
              aria-label="Expand sidebar"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer outline-none border-0"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        // EXPANDED HEADER
        <div className="px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 h-[70px]">
          <button
            onClick={() => onTabChange("dashboard")}
            className="flex items-center gap-2.5 min-w-0 group outline-none focus:outline-none text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                DIGITAL MEDICAL
              </h1>
              <span className="text-[10px] font-semibold tracking-wide uppercase text-sky-600 dark:text-sky-400 block truncate">
                Patient Portal
              </span>
            </div>
          </button>

          {/* Dedicated Collapse Toggle */}
          {onToggleCollapse && (
            <div className="relative group/toggle flex-shrink-0">
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer outline-none border-0"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-1.5 px-2 py-1 rounded-md bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap shadow-lg border border-slate-700 pointer-events-none opacity-0 group-hover/toggle:opacity-100 transition-opacity z-50">
                Collapse sidebar
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Public Site Link (Subtle Bridge) */}
      {sidebarCollapsed ? (
        <div className="p-2 flex justify-center">
          <Link
            href="/"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              showTooltip("Public Website Home", rect.top + rect.height / 2);
            }}
            onMouseLeave={hideTooltip}
            aria-label="Public Website Home"
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="px-3 pt-2.5 pb-0.5">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
          >
            <span className="flex items-center gap-2">
              <Home className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
              <span>Public Website Home</span>
            </span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
        </div>
      )}

      {/* 3. Navigation Sections (Scrollbar removed in expanded mode, fills vertical space completely) */}
      <div
        className={`flex-1 ${
          sidebarCollapsed
            ? "overflow-y-auto scrollbar-thin px-2 py-3 space-y-4"
            : "overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-3 py-2 flex flex-col justify-between"
        }`}
      >
        {navSections.map((section, idx) => (
          <div key={section.title} className={sidebarCollapsed ? "space-y-0.5" : "space-y-1"}>
            {sidebarCollapsed ? (
              idx > 0 && <div className="my-2 border-t border-slate-200/60 dark:border-slate-800/60 mx-1" />
            ) : (
              <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {section.title}
              </h3>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return sidebarCollapsed ? (
                  // COLLAPSED ITEM: Centered Icon Only with Tooltip
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      showTooltip(item.name, rect.top + rect.height / 2, item.badge);
                    }}
                    onMouseLeave={hideTooltip}
                    aria-label={item.name}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all duration-150 group cursor-pointer outline-none border-0 ${
                      isActive
                        ? "bg-sky-600 text-white font-semibold shadow-sm shadow-sky-600/30"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white"
                      }`}
                    />

                    {/* Badge notification dot */}
                    {item.badge && !isActive && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </button>
                ) : (
                  // EXPANDED ITEM: Icon + Label + Badge
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 group cursor-pointer outline-none border-0 ${
                      isActive
                        ? "bg-sky-600 text-white font-semibold shadow-sm shadow-sky-600/30"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 transition-colors flex-shrink-0 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 font-bold rounded-full transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Bottom Controls: Patient Profile & Sign Out */}
      {sidebarCollapsed ? (
        // COLLAPSED FOOTER
        <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => onTabChange("settings")}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              showTooltip(`${displayName} (${displayPhone})`, rect.top + rect.height / 2);
            }}
            onMouseLeave={hideTooltip}
            aria-label={displayName}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-xs hover:scale-105 transition-transform cursor-pointer outline-none border-0 overflow-hidden"
          >
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
          </button>

          <button
            type="button"
            onClick={onLogout}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              showTooltip("Sign Out", rect.top + rect.height / 2);
            }}
            onMouseLeave={hideTooltip}
            aria-label="Sign Out"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer outline-none border-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // EXPANDED FOOTER
        <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-1.5">
          {/* Patient Profile Card */}
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-xs flex-shrink-0 overflow-hidden">
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
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight flex items-center gap-1">
                  {displayName}
                  <ShieldCheck className="w-3 h-3 text-sky-500 flex-shrink-0" />
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                  {displayPhone}
                </span>
              </div>
            </div>
          </div>

          {/* Exit / Sign Out Button */}
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full py-1.5 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer outline-none border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Floating Tooltip in Collapsed Mode */}
      {sidebarCollapsed && hoveredTooltip && (
        <div
          style={{ top: `${hoveredTooltip.top}px` }}
          role="tooltip"
          className="fixed left-[86px] -translate-y-1/2 z-[100] px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-slate-700/80 flex items-center gap-2 pointer-events-none transition-opacity duration-150 animate-fadeIn"
        >
          <span>{hoveredTooltip.text}</span>
          {hoveredTooltip.badge && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500 text-white leading-none">
              {hoveredTooltip.badge}
            </span>
          )}
          {/* Caret arrow pointing to the icon */}
          <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
        </div>
      )}
    </div>
  );

  // ----------------------------------------------------
  // RENDER: Mobile Drawer Content (Always Full Expanded)
  // ----------------------------------------------------
  const mobileSidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 select-none">
      <div className="px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 h-[70px]">
        <button
          onClick={() => {
            onTabChange("dashboard");
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 min-w-0 group outline-none focus:outline-none text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight truncate">
              DIGITAL MEDICAL
            </h1>
            <span className="text-[10px] font-semibold tracking-wide uppercase text-sky-600 dark:text-sky-400 block truncate">
              Patient Portal
            </span>
          </div>
        </button>

        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Mobile Search Input (Reusing Existing Dashboard Search) */}
      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onCloseMobile();
              }
            }}
            placeholder="Search doctors, records, appointments..."
            className="w-full h-10 sm:h-11 pl-9 pr-8 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange?.("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md cursor-pointer outline-none"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="px-3 pt-1 pb-1">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
        >
          <span className="flex items-center gap-2">
            <Home className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
            <span>Public Website Home</span>
          </span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {section.title}
            </h3>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onCloseMobile();
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group cursor-pointer outline-none border-0 ${
                      isActive
                        ? "bg-sky-600 text-white font-semibold shadow-sm shadow-sky-600/30"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 transition-colors flex-shrink-0 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 font-bold rounded-full transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-2">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-xs flex-shrink-0 overflow-hidden">
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
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight flex items-center gap-1">
                {displayName}
                <ShieldCheck className="w-3 h-3 text-sky-500 flex-shrink-0" />
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                {displayPhone}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onCloseMobile();
            onLogout();
          }}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer outline-none border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar with Dynamic Width & Transition */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {desktopSidebarContent}
      </aside>

      {/* Mobile Off-canvas Drawer (Always Full Expanded) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-slideInLeft">
            {mobileSidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

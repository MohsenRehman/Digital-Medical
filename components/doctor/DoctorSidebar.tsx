"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Radio,
  PanelLeftClose,
  PanelLeftOpen,
  CreditCard,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import { DoctorAvailabilityStatus } from "@/lib/types/doctor";
import DoctorSidebarPlanCard from "@/components/doctor/subscription/DoctorSidebarPlanCard";

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

interface TooltipData {
  text: string;
  badge?: string | number;
  top: number;
}

export default function DoctorSidebar() {
  const pathname = usePathname();
  const {
    doctor,
    doctorStatus,
    setDoctorStatus,
    waitingQueue,
    followUps,
    unreadNotificationsCount,
    sidebarCollapsed,
    toggleSidebarCollapsed,
  } = useDoctor();

  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Clear tooltip when pathname changes
  useEffect(() => {
    hideTooltip();
  }, [pathname, hideTooltip]);

  const waitingCount = waitingQueue.length;
  const followUpCount = followUps.filter(
    (f) => f.status === "pending" && f.followUpDate === "2026-09-24"
  ).length;

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
      title: "ACCOUNT",
      items: [
        {
          name: "Notifications",
          href: "/doctor/notifications",
          icon: Bell,
          badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined,
        },
        {
          name: "Subscription & Plans",
          href: "/doctor/subscription",
          icon: CreditCard,
        },
        {
          name: "Settings & Profile",
          href: "/doctor/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const statusConfig: Record<
    DoctorAvailabilityStatus,
    { label: string; color: string; bg: string }
  > = {
    available: { label: "Available", color: "bg-emerald-500", bg: "text-emerald-700 dark:text-emerald-300" },
    in_consultation: { label: "In Consultation", color: "bg-amber-500", bg: "text-amber-700 dark:text-amber-300" },
    on_break: { label: "On Break", color: "bg-blue-500", bg: "text-blue-700 dark:text-blue-300" },
    offline: { label: "Offline", color: "bg-slate-400", bg: "text-slate-600 dark:text-slate-400" },
  };

  const currentStatus = statusConfig[doctorStatus] || statusConfig.available;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("dm_doctor_session");
      } catch (e) {
        // ignore
      }
      window.location.href = "/";
    }
  };

  // ----------------------------------------------------
  // RENDER: Desktop Sidebar Content
  // ----------------------------------------------------
  const desktopSidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 select-none">
      {/* 1. Header / Branding / Collapse Toggle Area */}
      {sidebarCollapsed ? (
        // COLLAPSED HEADER
        <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5 h-[70px]">
          <Link
            href="/doctor"
            aria-label="Digital Medical - Doctor Workspace"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              showTooltip("Digital Medical - Doctor Workspace", rect.top + rect.height / 2);
            }}
            onMouseLeave={hideTooltip}
            onFocus={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoveredTooltip({ text: "Digital Medical - Doctor Workspace", top: rect.top + rect.height / 2 });
            }}
            onBlur={hideTooltip}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20 hover:scale-105 transition-transform flex-shrink-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none border-0"
          >
            <Radio className="w-4 h-4 animate-pulse" />
          </Link>

          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              showTooltip("Expand sidebar", rect.top + rect.height / 2);
            }}
            onMouseLeave={hideTooltip}
            onFocus={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoveredTooltip({ text: "Expand sidebar", top: rect.top + rect.height / 2 });
            }}
            onBlur={hideTooltip}
            aria-label="Expand sidebar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none border-0"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // EXPANDED HEADER
        <div className="px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 h-[70px]">
          <Link href="/doctor" className="flex items-center gap-2.5 min-w-0 group outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none border-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                DIGITAL MEDICAL
              </h1>
              <span className="text-[10px] font-semibold tracking-wide uppercase text-sky-600 dark:text-sky-400 block truncate">
                Doctor Workspace
              </span>
            </div>
          </Link>

          {/* Dedicated Collapse Toggle */}
          <div className="relative group/toggle flex-shrink-0">
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              aria-label="Collapse sidebar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none border-0"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1.5 px-2 py-1 rounded-md bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap shadow-lg border border-slate-700 pointer-events-none opacity-0 group-hover/toggle:opacity-100 group-focus-within/toggle:opacity-100 transition-opacity z-50">
              Collapse sidebar
            </div>
          </div>
        </div>
      )}

      {/* 2. Navigation Sections */}
      <div className={`flex-1 overflow-y-auto ${sidebarCollapsed ? "px-2 py-3 space-y-4" : "px-3 py-4 space-y-6"} scrollbar-thin`}>
        {navSections.map((section, idx) => (
          <div key={section.title} className="space-y-1">
            {/* Group Header: Text in expanded, subtle divider/spacing in collapsed */}
            {sidebarCollapsed ? (
              idx > 0 && <div className="my-2 border-t border-slate-200/60 dark:border-slate-800/60 w-8 mx-auto" />
            ) : (
              <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {section.title}
              </h3>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/doctor" && pathname.startsWith(item.href));

                return sidebarCollapsed ? (
                  // COLLAPSED ITEM: Centered Icon Only
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      showTooltip(item.name, rect.top + rect.height / 2, item.badge);
                    }}
                    onMouseLeave={hideTooltip}
                    onFocus={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredTooltip({
                        text: item.name,
                        badge: item.badge,
                        top: rect.top + rect.height / 2,
                      });
                    }}
                    onBlur={hideTooltip}
                    aria-label={item.name}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all duration-150 group cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none border-0 ${
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
                  </Link>
                ) : (
                  // EXPANDED ITEM: Icon + Option Name + Badge
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none border-0 ${
                      isActive
                        ? "bg-sky-600 text-white font-semibold shadow-sm shadow-sky-600/30"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white active:bg-sky-600 active:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 transition-colors flex-shrink-0 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-active:text-white"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          suppressHydrationWarning
                          className={`text-[10px] px-2 py-0.5 font-bold rounded-full transition-colors ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 group-active:bg-white/20 group-active:text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Plan Card Section */}
      <div className={`border-t border-slate-200/80 dark:border-slate-800/80 flex-shrink-0 ${sidebarCollapsed ? "py-2 px-1" : "py-2.5 px-1 bg-slate-50/40 dark:bg-slate-900/40"}`}>
        <DoctorSidebarPlanCard
          collapsed={sidebarCollapsed}
          onShowTooltip={showTooltip}
          onHideTooltip={hideTooltip}
        />
      </div>

      {/* 3. Bottom Controls: Doctor Profile & Logout */}
      <div className={`border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 ${sidebarCollapsed ? "p-2" : "p-3"}`}>
        {sidebarCollapsed ? (
          // COLLAPSED: Avatar Link + Logout Button
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/doctor/settings"
              aria-label={`${doctor.name} - Profile & Settings`}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                showTooltip(`${doctor.name} (${doctor.specialty})`, rect.top + rect.height / 2);
              }}
              onMouseLeave={hideTooltip}
              onFocus={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoveredTooltip({ text: `${doctor.name} (${doctor.specialty})`, top: rect.top + rect.height / 2 });
              }}
              onBlur={hideTooltip}
              className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-sky-400 transition-colors flex items-center justify-center cursor-pointer outline-none focus:outline-none"
            >
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                  currentStatus.color
                }`}
              />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                showTooltip("Logout", rect.top + rect.height / 2);
              }}
              onMouseLeave={hideTooltip}
              onFocus={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoveredTooltip({ text: "Logout", top: rect.top + rect.height / 2 });
              }}
              onBlur={hideTooltip}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer outline-none focus:outline-none"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // EXPANDED: Doctor Profile Card + Logout Button
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
            <Link
              href="/doctor/settings"
              className="flex items-center gap-2.5 min-w-0 flex-1 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors outline-none focus:outline-none group"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                    currentStatus.color
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {doctor.name}
                  </span>
                  <img
                    src="/images/varified-badge.png"
                    alt="Verified"
                    className="w-3 h-3 object-contain flex-shrink-0"
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {doctor.specialty}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer flex-shrink-0 outline-none focus:outline-none"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Collapsed Hover Tooltip Floating Element */}
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
      <div className="px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between h-[70px]">
        <Link
          href="/doctor"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 min-w-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none border-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">
              DIGITAL MEDICAL
            </h1>
            <span className="text-[10px] font-semibold tracking-wide uppercase text-sky-600 dark:text-sky-400">
              Doctor Workspace
            </span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none border-0"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
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
                    onClick={() => {
                      setMobileOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none border-0 ${
                      isActive
                        ? "bg-sky-600 text-white font-semibold shadow-sm shadow-sky-600/30"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        suppressHydrationWarning
                        className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
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

      {/* Mobile Drawer Plan Card */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 flex-shrink-0">
        <DoctorSidebarPlanCard collapsed={false} />
      </div>

      {/* Mobile Drawer Bottom: Doctor Profile & Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <Link
            href="/doctor/settings"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 min-w-0 flex-1 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="relative flex-shrink-0">
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                  currentStatus.color
                }`}
              />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {doctor.name}
                </span>
                <img
                  src="/images/varified-badge.png"
                  alt="Verified"
                  className="w-3 h-3 object-contain flex-shrink-0"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {doctor.specialty}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Floating Menu Button */}
      <div className="md:hidden fixed top-3.5 left-3 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md text-slate-700 dark:text-slate-200 hover:text-sky-600 cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Persistent Sidebar with Dynamic Width & Transition */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {desktopSidebarContent}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-slideInLeft">
            {mobileSidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserCheck,
  Stethoscope,
  UserCog,
  Activity,
  Pill,
  FlaskConical,
  Boxes,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Settings,
  Bell,
  LifeBuoy,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  User,
} from "lucide-react";
import clsx from "clsx";
import { DashboardNavModule } from "../types";

interface ClinicSidebarProps {
  activeModule: DashboardNavModule;
  setActiveModule: (module: DashboardNavModule) => void;
  clinicName: string;
  plan: string;
  adminName: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  waitingCount: number;
  appointmentsCount: number;
  unreadNotifications: number;
  onLogout: () => void;
}

export const ClinicSidebar: React.FC<ClinicSidebarProps> = ({
  activeModule,
  setActiveModule,
  clinicName,
  plan,
  adminName,
  isCollapsed,
  setIsCollapsed,
  waitingCount,
  appointmentsCount,
  unreadNotifications,
  onLogout,
}) => {
  const navSections = [
    {
      title: "CLINIC DESK",
      items: [
        {
          id: "overview" as DashboardNavModule,
          label: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          id: "appointments" as DashboardNavModule,
          label: "Appointments",
          icon: CalendarDays,
          badge: appointmentsCount > 0 ? `${appointmentsCount}` : undefined,
          badgeColor: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
        },
        {
          id: "queue" as DashboardNavModule,
          label: "Live OPD Queue",
          icon: Users,
          badge: waitingCount > 0 ? `${waitingCount} waiting` : undefined,
          badgeColor: "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse",
        },
        {
          id: "patients" as DashboardNavModule,
          label: "Patient Directory",
          icon: UserCheck,
        },
      ],
    },
    {
      title: "MEDICAL OPERATIONS",
      items: [
        {
          id: "doctors" as DashboardNavModule,
          label: "Doctors & Roster",
          icon: Stethoscope,
        },
        {
          id: "staff" as DashboardNavModule,
          label: "Staff & Roles",
          icon: UserCog,
        },
        {
          id: "clinical" as DashboardNavModule,
          label: "Clinical Records",
          icon: Activity,
        },
      ],
    },
    {
      title: "DEPARTMENTS",
      items: [
        {
          id: "pharmacy" as DashboardNavModule,
          label: "Pharmacy & POS",
          icon: Pill,
          badge: "Live",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
        },
        {
          id: "laboratory" as DashboardNavModule,
          label: "Diagnostic Lab",
          icon: FlaskConical,
        },
        {
          id: "inventory" as DashboardNavModule,
          label: "Medical Inventory",
          icon: Boxes,
        },
      ],
    },
    {
      title: "FINANCE & MANAGEMENT",
      items: [
        {
          id: "billing" as DashboardNavModule,
          label: "Billing & Cash Counter",
          icon: CreditCard,
        },
        {
          id: "reports" as DashboardNavModule,
          label: "Reports & Analytics",
          icon: BarChart3,
        },
        {
          id: "subscription" as DashboardNavModule,
          label: "Subscription Plan",
          icon: ShieldCheck,
          badge: plan.toUpperCase(),
          badgeColor: "bg-teal-500/20 text-teal-300 border border-teal-500/30",
        },
        {
          id: "settings" as DashboardNavModule,
          label: "Clinic Settings",
          icon: Settings,
        },
      ],
    },
    {
      title: "SUPPORT & SYSTEM",
      items: [
        {
          id: "notifications" as DashboardNavModule,
          label: "Notifications",
          icon: Bell,
          badge: unreadNotifications > 0 ? `${unreadNotifications}` : undefined,
          badgeColor: "bg-rose-500 text-white font-bold",
        },
        {
          id: "support" as DashboardNavModule,
          label: "Help & Support",
          icon: LifeBuoy,
        },
        {
          id: "activity" as DashboardNavModule,
          label: "Activity & Audit Logs",
          icon: History,
        },
      ],
    },
  ];

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 bottom-0 z-40 bg-[#152332] text-gray-300 shadow-xl flex flex-col transition-all duration-300 border-r border-gray-700/50",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-gray-700/50 shrink-0">
        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
          <div className="bg-[#0ea5e9] text-white p-2 rounded-lg shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            <HeartPulse size={24} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-white font-bold text-lg leading-tight tracking-wide truncate">
                Digital Medical
              </h1>
              <p className="text-xs text-gray-400 font-medium truncate">Clinic Admin</p>
            </div>
          )}
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e3043] transition-colors cursor-pointer shrink-0 hidden md:block"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-4 custom-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-gray-400/80 uppercase">
                {section.title}
              </h4>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={clsx(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out w-full text-left cursor-pointer",
                      isActive
                        ? "bg-[#059669] text-white shadow-sm"
                        : "hover:bg-[#1e3043] text-gray-300 hover:text-white",
                      isCollapsed && "justify-center px-0"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div
                      className={clsx(
                        "shrink-0 transition-transform duration-200",
                        !isActive && "group-hover:scale-105"
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={clsx(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold",
                              isActive ? "bg-white/20 text-white" : item.badgeColor
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Profile & Logout Footer */}
      <div className="p-4 border-t border-gray-700/50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 border-none shrink-0 font-bold text-sm">
              {adminName ? adminName.charAt(0).toUpperCase() : <User size={20} />}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-white text-sm font-bold truncate leading-tight">
                  {adminName || "Admin"}
                </p>
                <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">
                  {clinicName || "Clinic Admin"}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-rose-400 hover:bg-[#1e3043] p-2 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

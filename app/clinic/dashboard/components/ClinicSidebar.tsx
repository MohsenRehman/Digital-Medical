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
  Sparkles,
  ExternalLink,
} from "lucide-react";
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
      title: "MAIN",
      items: [
        {
          id: "overview" as DashboardNavModule,
          label: "Overview",
          icon: LayoutDashboard,
        },
        {
          id: "appointments" as DashboardNavModule,
          label: "Appointments",
          icon: CalendarDays,
          badge: appointmentsCount > 0 ? `${appointmentsCount}` : undefined,
          badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20",
        },
        {
          id: "queue" as DashboardNavModule,
          label: "Live OPD Queue",
          icon: Users,
          badge: waitingCount > 0 ? `${waitingCount} waiting` : undefined,
          badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse",
        },
        {
          id: "patients" as DashboardNavModule,
          label: "Patient Directory",
          icon: UserCheck,
        },
      ],
    },
    {
      title: "CLINIC MANAGEMENT",
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
          badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20",
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
      title: "FINANCE & ANALYTICS",
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
          label: "Clinic Subscription",
          icon: ShieldCheck,
          badge: plan.toUpperCase(),
          badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        {
          id: "settings" as DashboardNavModule,
          label: "Clinic Settings",
          icon: Settings,
        },
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
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Clinic Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-400 text-white flex items-center justify-center shadow-md shadow-sky-600/20 shrink-0">
            <HeartPulse className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm text-slate-900 dark:text-white truncate tracking-tight">
                Digital<span className="text-sky-600 dark:text-sky-400">Medical</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase truncate">
                Clinic Workspace
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Clinic Active Tenant Badge */}
      {!isCollapsed && (
        <div className="p-3 mx-3 my-2.5 rounded-2xl bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-50 dark:from-sky-950/40 dark:via-slate-800/80 dark:to-teal-950/40 border border-sky-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate block">
              {clinicName}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white shrink-0">
              OPEN
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            <span className="capitalize">{plan} Plan Active</span>
            <span className="text-sky-600 dark:text-sky-400 font-bold">Shift Active</span>
          </div>
        </div>
      )}

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase">
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all group cursor-pointer ${
                      isActive
                        ? "bg-sky-600 text-white shadow-md shadow-sky-600/25"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                    } ${isCollapsed ? "justify-center px-0" : ""}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 dark:text-slate-500 group-hover:text-sky-500"
                      }`}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                              isActive ? "bg-white/20 text-white" : item.badgeColor
                            }`}
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

      {/* Bottom User Area */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                {adminName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate block">
                  {adminName}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  Clinic Administrator
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <Link
                href="/"
                target="_blank"
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Public Site</span>
              </Link>

              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Logout from clinic desk"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center hover:bg-rose-100 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

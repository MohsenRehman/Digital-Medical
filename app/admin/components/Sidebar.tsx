"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Receipt,
  LayoutGrid,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
  ChevronDown,
  LogOut,
  User,
  HeartPulse,
} from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#152332] text-gray-300 shadow-xl flex flex-col h-full hidden md:flex transition-all">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="bg-[#0ea5e9] text-white p-2 rounded-lg shadow-sm">
            <HeartPulse size={24} />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-wide">
              Digital Medical
            </h1>
            <p className="text-xs text-gray-400 font-medium">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
        <NavItem
          href="/admin/dashboard"
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active={pathname === "/admin/dashboard"}
        />
        <NavItem
          href="/admin/clinics"
          icon={<Building2 size={20} />}
          label="Clinics / Organizations"
          active={pathname.startsWith("/admin/clinics")}
        />
        <NavItem
          href="/admin/billing"
          icon={<Receipt size={20} />}
          label="Billing & Payments"
          active={pathname.startsWith("/admin/billing")}
        />
        <NavItem
          href="/admin/reports"
          icon={<BarChart3 size={20} />}
          label="Reports"
          active={pathname.startsWith("/admin/reports")}
        />
        <NavItem
          href="/admin/settings"
          icon={<Settings size={20} />}
          label="Settings"
          active={pathname.startsWith("/admin/settings")}
        />
      </div>

      {/* Admin Profile */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 border-none">
              <User size={20} />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Admin</p>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out",
        active
          ? "bg-[#059669] text-white shadow-sm"
          : "hover:bg-[#1e3043] text-gray-300 hover:text-white"
      )}
    >
      <div className={clsx("transition-transform duration-200", !active && "group-hover:scale-105")}>
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}

function SubNavItem({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={clsx(
        "block py-1.5 text-sm transition-colors",
        active ? "text-white font-medium" : "text-gray-400 hover:text-white"
      )}
    >
      {label}
    </Link>
  );
}




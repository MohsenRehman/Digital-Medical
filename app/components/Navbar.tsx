"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import {
  Sun,
  Moon,
  Menu as MenuIcon,
  X,
  Search,
  Activity,
  HeartPulse,
  Home,
  Stethoscope,
  Building2,
  CalendarDays,
  BookOpen
} from "lucide-react";

interface NavbarProps {
  onOpenAppointment: () => void;
}

export default function Navbar({ onOpenAppointment }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const navItems = [
    { label: "Home", href: "#hero", id: "hero", icon: Home },
    { label: "Doctors", href: "#doctors", id: "doctors", icon: Stethoscope },
    { label: "Specialties", href: "#specialties", id: "specialties", icon: Activity },
    { label: "Clinics", href: "#clinics", id: "clinics", icon: Building2 },
    { label: "Schedule", href: "#schedule", id: "schedule", icon: CalendarDays },
    { label: "Articles", href: "#articles", id: "articles", icon: BookOpen },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scroll Spy for active nav item
      const sections = ["hero", "doctors", "specialties", "clinics", "schedule", "articles"];
      const scrollPosition = window.scrollY + 220;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50">
        {/* Main Glassmorphism Sticky Navbar */}
        <nav
          className={`glass-nav transition-all duration-300 ${
            isScrolled ? "scrolled py-2 shadow-lg shadow-sky-950/10" : "py-3 sm:py-3.5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Digital<span className="text-sky-600 dark:text-sky-400">Medical</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase block">
                  Healthcare Network
                </span>
              </div>
            </Link>

            {/* Desktop & Tablet Menu Dock (From Uiverse.io by mymiamo - Spacious & Equal Gap) */}
            <div className="hidden md:flex flex-1 max-w-4xl mx-3 lg:mx-8 menu">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => handleNavClick(item.id)}
                    className={isActive ? "active" : ""}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Actions & Theme Switcher (No APPOINTMENT NOW button) */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              {/* Search Bar Trigger */}
              <button
                onClick={() => {
                  const el = document.getElementById("search-filter-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                aria-label="Search doctors"
                className="glass-action-btn"
                title="Search Doctors & Clinics"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Shopping Cart / Prescription Bag Icon */}
              <button
                onClick={onOpenAppointment}
                aria-label="View Prescriptions / Appointments"
                className="glass-action-btn"
                title="Your Medical Desk"
              >
                <Activity className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white dark:ring-[#0b1426]">
                  1
                </span>
              </button>

              {/* Dark / Light Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="glass-action-btn"
                title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              >
                <div className="relative w-4 h-4">
                  <Sun
                    className={`w-4 h-4 text-amber-500 absolute inset-0 transition-all duration-300 transform ${
                      theme === "dark"
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-50"
                    }`}
                  />
                  <Moon
                    className={`w-4 h-4 text-sky-600 absolute inset-0 transition-all duration-300 transform ${
                      theme === "light"
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-90 scale-50"
                    }`}
                  />
                </div>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden glass-action-btn"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Slide-down Drawer (No APPOINTMENT NOW button) */}
          {mobileMenuOpen && (
            <div className="md:hidden px-4 pt-3 pb-6 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0b1426]/95 backdrop-blur-xl animate-fadeInUp">
              <div className="flex flex-col gap-2 py-2 text-base font-medium text-slate-700 dark:text-slate-200">
                <Link
                  href="#hero"
                  onClick={() => handleNavClick("hero")}
                  className="px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800"
                >
                  Home
                </Link>
                <Link
                  href="#doctors"
                  onClick={() => handleNavClick("doctors")}
                  className="px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800"
                >
                  Find Doctors
                </Link>
                <Link
                  href="#specialties"
                  onClick={() => handleNavClick("specialties")}
                  className="px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800"
                >
                  Specialties
                </Link>
                <Link
                  href="#clinics"
                  onClick={() => handleNavClick("clinics")}
                  className="px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800"
                >
                  Clinics & Hospitals
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={() => handleNavClick("how-it-works")}
                  className="px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800"
                >
                  How It Works
                </Link>
                <Link
                  href="#schedule"
                  onClick={() => handleNavClick("schedule")}
                  className="px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800"
                >
                  Doctor Schedule
                </Link>
                <Link
                  href="#articles"
                  onClick={() => handleNavClick("articles")}
                  className="px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800"
                >
                  Health Articles
                </Link>
                <Link
                  href="#clinics-join"
                  onClick={() => handleNavClick("clinics-join")}
                  className="px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold"
                >
                  Join As Clinic
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Floating Bottom Dock for Mobile Screens (From Uiverse.io by mymiamo) */}
      <nav aria-label="Mobile Navigation Dock" className="md:hidden menu menu-floating-bottom">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <Link
              key={`mobile-${item.id}`}
              href={item.href}
              onClick={() => handleNavClick(item.id)}
              className={isActive ? "active" : ""}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

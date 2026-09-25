"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { usePatientAuth } from "../context/PatientAuthContext";
import { useClinicAuth } from "../context/ClinicAuthContext";
import PatientLoginModal from "./auth/PatientLoginModal";
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
  UserPlus,
  ChevronRight,
  ArrowRight,
  User,
  LogIn,
} from "lucide-react";

interface NavbarProps {
  onOpenAppointment?: () => void;
}

export default function Navbar({ onOpenAppointment }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { patientUser } = usePatientAuth();
  const { clinicUser } = useClinicAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const navItems = [
    { label: "Home", href: "/#hero", id: "hero", icon: Home },
    { label: "Doctors", href: "/#doctors", id: "doctors", icon: Stethoscope },
    { label: "Explore Clinics", href: "/#specialties", id: "specialties", icon: Activity },
    { label: "Clinics", href: "/clinics", id: "clinics", icon: Building2 },
    { label: "Schedule", href: "/#schedule", id: "schedule", icon: CalendarDays },
  ];

  const mobileNavItems = [
    {
      label: "Home",
      desc: "Healthcare portal & network overview",
      href: "/#hero",
      id: "hero",
      icon: Home,
      num: "01",
    },
    {
      label: "Find Doctors",
      desc: "Top verified specialists & surgeons",
      href: "/#doctors",
      id: "doctors",
      icon: Stethoscope,
      num: "02",
    },
    {
      label: "Explore Clinics",
      desc: "Cardiology, Neurology, Pediatrics & clinical centers",
      href: "/#specialties",
      id: "specialties",
      icon: Activity,
      num: "03",
    },
    {
      label: "Clinics & Hospitals",
      desc: "Browse our partner medical centers",
      href: "/clinics",
      id: "clinics",
      icon: Building2,
      num: "04",
    },
    {
      label: "Doctor Schedule",
      desc: "Check available timings & consultation slots",
      href: "/#schedule",
      id: "schedule",
      icon: CalendarDays,
      num: "05",
    },
  ];

  // Prevent background scrolling when island mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close island menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scroll Spy for active nav item (only active on home page)
      if (pathname === "/") {
        const sections = ["hero", "doctors", "specialties", "clinics", "schedule"];
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
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    setMobileMenuOpen(false);

    // If currently on homepage, smooth scroll to the section
    if (pathname === "/") {
      if (sectionId === "clinics") {
        return; // Allow standard navigation to /clinics
      }
      const el = document.getElementById(sectionId);
      if (el) {
        e.preventDefault();
        setActiveSection(sectionId);
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${sectionId}`);
      }
    }
    // If on another page (e.g. /clinics/cardiology-center), Link naturally navigates to /#hero etc.!
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50">
        {/* Main Glassmorphism Sticky Navbar */}
        <nav
          className={`glass-nav transition-all duration-300 ${
            isScrolled ? "scrolled py-2 shadow-lg shadow-sky-950/10" : "py-2.5 sm:py-3.5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-3">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                <HeartPulse className="w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight whitespace-nowrap">
                    Digital<span className="text-sky-600 dark:text-sky-400">Medical</span>
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase hidden min-[360px]:block whitespace-nowrap">
                  Healthcare Network
                </span>
              </div>
            </Link>

            {/* Desktop Menu Dock (Strictly Only on Large Screens >= 1024px) */}
            <div className="hidden lg:flex flex-1 justify-center max-w-2xl xl:max-w-3xl mx-3 xl:mx-8 menu desktop-nav-dock">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id && pathname === "/";
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={isActive ? "active" : ""}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Actions & Theme Switcher */}
            <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">


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

              {/* Elegant Divider */}
              <div className="hidden sm:block h-6 w-[1px] bg-slate-200 dark:bg-slate-700/60 mx-0.5" />

              {/* Patient Login or My Portal Pill */}
              {patientUser ? (
                <Link
                  href="/patient/dashboard"
                  className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:border-sky-400 font-semibold text-xs transition-all shadow-sm group"
                  title="Open Patient Portal / My Appointments"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center text-[10px] font-bold group-hover:scale-110 transition-transform flex-shrink-0">
                    {patientUser.name ? patientUser.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] md:max-w-[120px] truncate">
                    {patientUser.name || "Portal"}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </Link>
              ) : (
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
                  title="Patient Sign In / Check Appointments"
                >
                  <LogIn className="w-3.5 h-3.5 text-sky-500" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Primary Register CTA Button or Clinic Desk */}
              {clinicUser ? (
                <Link
                  href="/clinic/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 cursor-pointer group shadow-sm"
                  title="Open Clinic Dashboard"
                >
                  <Building2 className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                  <span>Clinic Desk</span>
                </Link>
              ) : (
                <Link
                  href="/clinic/register"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs uppercase tracking-wider text-white btn-mockup-blue cursor-pointer group shadow-sm"
                  title="Register Your Clinic"
                >
                  <UserPlus className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                  <span>Register</span>
                </Link>
              )}

              {/* Mobile & Tablet Menu Toggle Button (Visible on Mobile & Tablet < 1024px) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden glass-action-btn relative z-[1020]"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close-icon"
                      initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5 text-slate-800 dark:text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu-icon"
                      initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <MenuIcon className="w-5 h-5 text-slate-800 dark:text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Full-width Professional Mobile & Tablet Navigation Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <div className="lg:hidden fixed inset-0 z-[1000]">
                {/* Blurred Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute inset-0 bg-slate-950/65 dark:bg-black/80 backdrop-blur-md cursor-pointer"
                  aria-hidden="true"
                />

                {/* Horizontally Spacious Professional Panel */}
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile Navigation Menu"
                  initial={{ opacity: 0, y: -18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -14, scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 28,
                    mass: 0.8,
                  }}
                  className="fixed top-16 sm:top-20 inset-x-3 sm:inset-x-6 max-w-xl mx-auto z-[1010] bg-white/95 dark:bg-[#0c1424]/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700/70 shadow-2xl shadow-slate-950/25 dark:shadow-cyan-950/40 overflow-hidden"
                >
                  {/* Top Header Status */}
                  <div className="px-4 py-2.5 bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold tracking-wider uppercase text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      DigitalMedical Menu
                    </span>
                    <span className="font-mono text-[10px]">24/7 Healthcare Network</span>
                  </div>

                  {/* Nav Links */}
                  <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60 py-1">
                    {mobileNavItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive =
                        (activeSection === item.id && pathname === "/") ||
                        (item.href.startsWith("/clinics") && pathname.startsWith("/clinics"));

                      return (
                        <motion.div
                          key={`mobile-item-${item.id}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.03 * (index + 1), duration: 0.18 }}
                        >
                          <Link
                            href={item.href}
                            onClick={(e) => {
                              handleNavClick(e, item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 transition-all duration-200 hover:bg-sky-50/80 dark:hover:bg-slate-800/60 group ${
                              isActive
                                ? "bg-sky-50/90 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400"
                                : "text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                                  isActive
                                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                                    : "bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 group-hover:bg-sky-600 group-hover:text-white"
                                }`}
                              >
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm sm:text-base leading-tight truncate">
                                  {item.label}
                                </span>
                                <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                                  {item.desc}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 font-semibold group-hover:text-sky-500 transition-colors">
                                {item.num}
                              </span>
                              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Mobile Patient Profile / Login Card */}
                  {patientUser ? (
                    <div className="p-3 sm:p-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-sky-50/60 dark:bg-sky-950/20">
                      <Link
                        href="/patient/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-sky-900 shadow-sm hover:border-sky-300 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {patientUser.name ? patientUser.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0 text-left">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {patientUser.name || "Patient Portal"}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                              {patientUser.phone}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                          Dashboard <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    </div>
                  ) : (
                    <div className="p-3 sm:p-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/40">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setLoginModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-sky-500 hover:text-sky-600 transition-colors shadow-sm"
                      >
                        <LogIn className="w-4 h-4 text-sky-500" />
                        <span>Patient Sign In / Check Appointments</span>
                      </button>
                    </div>
                  )}

                  {/* Prominent Bottom CTA Card */}
                  <div className="p-3 sm:p-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/60">
                    <Link
                      href={clinicUser ? "/clinic/dashboard" : "/clinic/register"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white font-semibold text-sm shadow-md shadow-sky-600/20 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                          {clinicUser ? <Building2 className="w-4 h-4 text-white" /> : <UserPlus className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-xs uppercase tracking-wider">
                            {clinicUser ? "Open Clinic Dashboard" : "Register Your Clinic"}
                          </span>
                          <span className="text-[10px] text-sky-100 font-normal">
                            {clinicUser ? clinicUser.clinicName : "Join our digital medical ecosystem"}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </nav>
      </header>

      {/* Patient Login Modal */}
      <PatientLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}

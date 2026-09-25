"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePatientAuth } from "@/app/context/PatientAuthContext";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";
import {
  X,
  Phone,
  KeyRound,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  User,
  Building2,
  Mail,
  Lock,
} from "lucide-react";

interface PatientLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PatientLoginModal({ isOpen, onClose }: PatientLoginModalProps) {
  const router = useRouter();
  const { loginWithOtp, loginWithPassword, patientUser } = usePatientAuth();
  const { adminLogin } = useClinicAuth();

  // Top-level Tab: Patient Login vs Admin Login
  const [portalTab, setPortalTab] = useState<"patient" | "admin">("patient");

  // Patient Login States
  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");
  const [phone, setPhone] = useState(patientUser?.phone || "03001234567");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  // Admin Login States
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);

  // Feedback messages
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setPortalTab("patient");
      setOtpSent(false);
      setOtpDigits(["", "", "", ""]);
      setErrorMsg("");
      setSuccessMsg("");
      setAdminEmail("");
      setAdminPassword("");
      if (patientUser?.phone) {
        setPhone(patientUser.phone);
      }
    }
  }, [isOpen, patientUser]);

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ----------------------------------------------------
  // PATIENT ACTIONS (Unchanged)
  // ----------------------------------------------------
  const handleSendOtp = () => {
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10) {
      setErrorMsg("Please enter a valid 11-digit mobile number");
      return;
    }
    setErrorMsg("");
    setOtpSent(true);
    setCountdown(30);
    setTimeout(() => {
      inputRefs[0].current?.focus();
    }, 150);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);

    if (val && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    if (newDigits.every((d) => d !== "") && index === 3) {
      verifyOtpCode(newDigits.join(""));
    }
  };

  const verifyOtpCode = (code: string) => {
    setIsVerifying(true);
    setErrorMsg("");

    setTimeout(() => {
      const ok = loginWithOtp(phone, code);
      setIsVerifying(false);
      if (ok) {
        setSuccessMsg("Login Successful! Accessing your patient desk...");
        setTimeout(() => {
          onClose();
          router.push("/patient/dashboard");
        }, 800);
      } else {
        setErrorMsg("Invalid verification code. Please try again.");
      }
    }, 600);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const res = loginWithPassword(phone, password);
    if (res.success) {
      setSuccessMsg("Login Successful! Redirecting to Dashboard...");
      setTimeout(() => {
        onClose();
        router.push("/patient/dashboard");
      }, 700);
    } else {
      setErrorMsg(res.error || "Login failed");
    }
  };

  // ----------------------------------------------------
  // ADMIN ACTIONS (Super Admin & Clinic Admin Automatic Detection)
  // ----------------------------------------------------
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!adminEmail.trim() || !adminEmail.includes("@")) {
      setErrorMsg("Please enter a valid official administrator email.");
      return;
    }
    if (!adminPassword) {
      setErrorMsg("Please enter your account password.");
      return;
    }

    setIsAdminSubmitting(true);

    setTimeout(() => {
      const res = adminLogin(adminEmail, adminPassword);
      setIsAdminSubmitting(false);

      if (res.success) {
        if (res.role === "super_admin") {
          setSuccessMsg("Welcome Super Admin! Redirecting to Platform Dashboard...");
        } else {
          setSuccessMsg("Welcome Clinic Admin! Accessing your Clinic Desk...");
        }

        setTimeout(() => {
          onClose();
          router.push(res.redirectUrl || (res.role === "super_admin" ? "/admin/dashboard" : "/clinic/dashboard"));
        }, 700);
      } else {
        setErrorMsg(res.error || "Invalid credentials. Please verify your email and password.");
      }
    }, 500);
  };

  const handleFillSuperAdminDemo = () => {
    setAdminEmail("admin@digitalmedical.com");
    setAdminPassword("admin123");
    setErrorMsg("");
  };

  const handleFillClinicAdminDemo = () => {
    setAdminEmail("demo@clinic.pk");
    setAdminPassword("admin123");
    setErrorMsg("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1250] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 dark:bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md bg-white dark:bg-[#0c1424] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">
                {portalTab === "patient" ? "DigitalMedical Patient Desk" : "DigitalMedical Administration"}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {portalTab === "patient" ? "Patient Account Login" : "Admin Portal Sign In"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Top-level Switcher: Patient Login vs Admin Login */}
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setPortalTab("patient");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  portalTab === "patient"
                    ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Patient Login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortalTab("admin");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  portalTab === "admin"
                    ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          {/* ==================================================== */}
          {/* OPTION 1: PATIENT LOGIN (Completely Preserved)        */}
          {/* ==================================================== */}
          {portalTab === "patient" && (
            <>
              {/* Sub-tabs for Patient Login: OTP vs Password */}
              <div className="px-6 pt-3">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("otp");
                      setErrorMsg("");
                    }}
                    className={`py-1.5 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      authMode === "otp"
                        ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Phone + OTP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("password");
                      setErrorMsg("");
                    }}
                    className={`py-1.5 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      authMode === "password"
                        ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Phone + Password</span>
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-300 font-semibold text-center">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-600 dark:text-emerald-300 font-bold flex items-center justify-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* TAB 1: PHONE + OTP (Passwordless Instant Login) */}
                {authMode === "otp" && (
                  <div className="space-y-4">
                    {!otpSent ? (
                      <>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                            Registered Mobile Number
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 select-none">
                              +92
                            </span>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="0300 1234567"
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                            />
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            We will send a 4-digit verification code via SMS / WhatsApp.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="w-full btn-mockup-blue py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-md shadow-sky-600/25 cursor-pointer hover:shadow-sky-600/40 transition-all"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Send Verification Code</span>
                        </button>

                        {/* Quick Demo Fill Helper */}
                        <div className="pt-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setPhone("03001234567");
                              setErrorMsg("");
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 hover:underline font-semibold"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Quick Demo Account (0300-1234567)</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Enter the 4-digit code sent to{" "}
                            <span className="font-bold text-slate-800 dark:text-white font-mono">{phone}</span>
                          </p>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline mt-0.5 inline-block"
                          >
                            Change phone number
                          </button>
                        </div>

                        {/* 4-digit OTP Inputs */}
                        <div className="flex justify-center gap-3 my-4">
                          {otpDigits.map((digit, i) => (
                            <input
                              key={i}
                              ref={inputRefs[i]}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(i, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Backspace" && !digit && i > 0) {
                                  inputRefs[i - 1].current?.focus();
                                }
                              }}
                              className="w-12 h-14 text-center text-xl font-black rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all"
                            />
                          ))}
                        </div>

                        {/* Demo Helper */}
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center">
                          <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                            Demo Code: Enter <strong className="font-mono font-bold">1234</strong> or any 4 digits.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setOtpDigits(["1", "2", "3", "4"]);
                              verifyOtpCode("1234");
                            }}
                            className="mt-1 text-[11px] font-bold text-amber-800 dark:text-amber-200 hover:underline inline-flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Auto-fill Demo Code (1234)</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                          {countdown > 0 ? (
                            <span>Resend code in {countdown}s</span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-sky-600 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Resend OTP Code</span>
                            </button>
                          )}
                          <span className="text-[11px] text-slate-400">Step 2 of 2</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* TAB 2: PHONE + PASSWORD */}
                {authMode === "password" && (
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0300 1234567"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("otp");
                            setErrorMsg("");
                          }}
                          className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                        >
                          Forgot? Use OTP Login
                        </button>
                      </div>

                      <div className="relative flex items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your account password"
                          className="w-full px-4 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-mockup-blue py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-md shadow-sky-600/25 cursor-pointer"
                    >
                      <span>Login with Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>

              {/* Patient Footer note */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
                <span>New patient? Just book any appointment and your account auto-registers!</span>
              </div>
            </>
          )}

          {/* ==================================================== */}
          {/* OPTION 2: ADMIN LOGIN (Super Admin & Clinic Admin)    */}
          {/* ==================================================== */}
          {portalTab === "admin" && (
            <div className="p-6 space-y-4">
              {/* Subtle Role Identification Guidance */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Unified access for <strong>Super Admins</strong> and <strong>Clinic Administrators</strong>. The system automatically detects your role and directs you to your workspace.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-300 font-semibold text-center">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-600 dark:text-emerald-300 font-bold flex items-center justify-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                {/* Admin Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Official Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@digitalmedical.com or clinic@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Admin Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Password
                    </label>
                    <Link
                      href="/clinic/status"
                      onClick={onClose}
                      className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Check Clinic Status?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type={showAdminPassword ? "text" : "password"}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick Demo Fill Buttons */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Quick Demo Credentials:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleFillSuperAdminDemo}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:border-teal-500 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Super Admin</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">
                        admin@digitalmedical.com
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFillClinicAdminDemo}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:border-teal-500 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        <Building2 className="w-3 h-3 text-teal-500" />
                        <span>Clinic Admin</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">
                        demo@clinic.pk
                      </span>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isAdminSubmitting}
                  className="w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 flex items-center justify-center gap-2 shadow-md shadow-teal-600/25 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {isAdminSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Admin Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Admin Footer link to register */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Registering a new healthcare clinic?{" "}
                  <Link
                    href="/clinic/register"
                    onClick={onClose}
                    className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                  >
                    Register Clinic →
                  </Link>
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

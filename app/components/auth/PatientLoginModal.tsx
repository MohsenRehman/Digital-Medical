"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePatientAuth } from "@/app/context/PatientAuthContext";
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
} from "lucide-react";

interface PatientLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PatientLoginModal({ isOpen, onClose }: PatientLoginModalProps) {
  const router = useRouter();
  const { loginWithOtp, loginWithPassword, patientUser } = usePatientAuth();

  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");
  const [phone, setPhone] = useState(patientUser?.phone || "03001234567");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
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
      setOtpSent(false);
      setOtpDigits(["", "", "", ""]);
      setErrorMsg("");
      setSuccessMsg("");
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
                DigitalMedical Patient Desk
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Patient Account Login
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Login Mode Tabs */}
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("otp");
                  setErrorMsg("");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === "otp"
                    ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Phone + OTP (Instant)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("password");
                  setErrorMsg("");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === "password"
                    ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
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
                        <div className="absolute left-3 flex items-center gap-1.5 text-xs font-bold text-slate-500 border-r border-slate-200 dark:border-slate-700 pr-2.5">
                          <span>🇵🇰</span>
                          <span>+92</span>
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0300 1234567"
                          className="w-full pl-22 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full btn-mockup-blue py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-md shadow-sky-600/25 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send 4-Digit Login OTP</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-center text-slate-500">
                      Enter the 4-digit code sent to <strong className="font-mono text-slate-900 dark:text-white">{phone}</strong>
                    </p>

                    <div className="flex items-center justify-center gap-2.5">
                      {otpDigits.map((digit, i) => (
                        <input
                          key={i}
                          ref={inputRefs[i]}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          className="w-12 h-14 text-center text-2xl font-black rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      ))}
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpDigits(["1", "2", "3", "4"]);
                          verifyOtpCode("1234");
                        }}
                        className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold hover:underline"
                      >
                        [Quick Test Code: 1234]
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      {countdown > 0 ? (
                        <span>Resend in {countdown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="font-bold text-sky-600 hover:underline"
                        >
                          Resend Code
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="underline hover:text-slate-600"
                      >
                        Change Number
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => verifyOtpCode(otpDigits.join(""))}
                      disabled={isVerifying}
                      className="w-full btn-mockup-blue py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-md shadow-sky-600/25 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Access Dashboard</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
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

          {/* Footer note */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
            <span>New patient? Just book any appointment and your account auto-registers!</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

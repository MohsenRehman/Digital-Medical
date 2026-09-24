"use client";

import React, { useState, useEffect, useRef } from "react";
import { MailCheck, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, Sparkles, Mail } from "lucide-react";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";

interface Step3VerifyEmailProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step3VerifyEmail({ onNext, onBack }: Step3VerifyEmailProps) {
  const { draft, verifyEmailOtp, sendEmailOtp } = useClinicAuth();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean && val !== "") return;

    const newDigits = [...digits];
    newDigits[index] = clean.slice(-1);
    setDigits(newDigits);
    setError("");

    // Auto advance
    if (clean && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto verify when all 6 digits entered
    if (newDigits.every((d) => d !== "") && index === 5) {
      triggerVerification(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (paste.length === 6) {
      const arr = paste.split("");
      setDigits(arr);
      triggerVerification(paste);
    }
  };

  const triggerVerification = (code: string) => {
    setIsVerifying(true);
    setError("");

    setTimeout(() => {
      const valid = verifyEmailOtp(code);
      setIsVerifying(false);
      if (valid) {
        setSuccess(true);
        setTimeout(() => {
          onNext();
        }, 800);
      } else {
        setError("Invalid verification code. Please check and try again.");
      }
    }, 500);
  };

  const handleResend = () => {
    sendEmailOtp();
    setCountdown(30);
    setError("");
    setDigits(["", "", "", "", "", ""]);
    inputRefs[0].current?.focus();
  };

  const handleAutoFillDemo = () => {
    const demo = ["6", "5", "4", "3", "2", "1"];
    setDigits(demo);
    triggerVerification("654321");
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <MailCheck className="w-3.5 h-3.5 text-emerald-500" />
          Step 3: Email Verification Gate
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Verify Your Clinic Email
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          We sent a 6-digit confirmation code to:
        </p>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-mono text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>{draft.credentials.email || "clinic@digitalmedical.pk"}</span>
        </div>
      </div>

      {/* Demo autofill helper banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 dark:from-slate-800/80 dark:to-sky-950/40 border border-sky-200 dark:border-sky-800/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span className="text-slate-600 dark:text-slate-300">
            Testing Demo OTP: <strong className="font-mono text-sky-600 dark:text-sky-400">654321</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] transition-all cursor-pointer shadow-sm"
        >
          Auto Fill
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Email Verified Successfully! Redirecting to Next Step...
        </div>
      )}

      {/* 6 Digit Input Boxes */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 py-2" onPaste={handlePaste}>
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={inputRefs[idx]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            disabled={isVerifying || success}
            className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              digit
                ? "border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-sky-950 dark:text-white"
                : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
            }`}
          />
        ))}
      </div>

      {/* Resend and Countdown */}
      <div className="text-center pt-2">
        {countdown > 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Resend verification code in{" "}
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
              00:{countdown.toString().padStart(2, "0")}
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resend Code</span>
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Details</span>
        </button>

        <button
          type="button"
          onClick={() => triggerVerification(digits.join(""))}
          disabled={digits.some((d) => !d) || isVerifying || success}
          className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 group transition-all disabled:opacity-50 cursor-pointer"
        >
          <span>{isVerifying ? "Verifying..." : "Verify & Continue"}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

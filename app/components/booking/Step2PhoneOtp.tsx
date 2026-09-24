"use client";

import React, { useState, useEffect, useRef } from "react";
import { Phone, MessageSquare, ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";

interface Step2PhoneOtpProps {
  initialPhone?: string;
  onVerified: (verifiedPhone: string) => void;
  onBack: () => void;
}

export default function Step2PhoneOtp({ initialPhone = "", onVerified, onBack }: Step2PhoneOtpProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || "03001234567");
  const [otpSent, setOtpSent] = useState(false);
  const [otpChannel, setOtpChannel] = useState<"sms" | "whatsapp">("whatsapp");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleSendOtp = (channel: "sms" | "whatsapp" = otpChannel) => {
    const clean = phoneNumber.replace(/\D/g, "");
    if (clean.length < 10) {
      setErrorMessage("Please enter a valid 11-digit mobile number (e.g. 0300-1234567)");
      return;
    }
    setErrorMessage("");
    setOtpChannel(channel);
    setOtpSent(true);
    setCountdown(30);
    setOtpDigits(["", "", "", ""]);
    setTimeout(() => {
      inputRefs[0].current?.focus();
    }, 150);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto advance to next box
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto verify if all 4 digits entered
    if (newDigits.every((d) => d !== "") && index === 3) {
      triggerVerification(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const triggerVerification = (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join("");
    if (code.length < 4) {
      setErrorMessage("Please enter the complete 4-digit OTP code");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        onVerified(phoneNumber);
      }, 700);
    }, 600);
  };

  const fillDemoCode = () => {
    setOtpDigits(["1", "2", "3", "4"]);
    triggerVerification("1234");
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 mb-3 shadow-inner">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
          {otpSent ? "Verify Your Phone Number" : "Enter Your Mobile Number"}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          {otpSent
            ? `We sent a 4-digit verification code via ${
                otpChannel === "whatsapp" ? "WhatsApp" : "SMS"
              } to ${phoneNumber}`
            : "We will send an instant one-time verification code to secure your booking & register your medical profile."}
        </p>
      </div>

      {!otpSent ? (
        /* Phone Input Screen */
        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Mobile Number (Pakistan / International)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center gap-1.5 text-xs font-bold text-slate-500 border-r border-slate-200 dark:border-slate-700 pr-2.5">
                <span className="text-base">🇵🇰</span>
                <span>+92</span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0300 1234567"
                className="w-full pl-24 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-500 font-semibold text-center">{errorMessage}</p>
          )}

          {/* Verification Channel Option */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleSendOtp("whatsapp")}
              className="flex-1 py-3 px-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Send via WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendOtp("sms")}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4 text-sky-500" />
              <span>Send via SMS</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
            By continuing, your phone number will be automatically registered for your DigitalMedical patient desk.
          </p>
        </div>
      ) : (
        /* OTP Input Screen */
        <div className="space-y-5 max-w-sm mx-auto">
          {/* 4 Digit Boxes */}
          <div className="flex items-center justify-center gap-3">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerifying || isSuccess}
                className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-black rounded-2xl border ${
                  isSuccess
                    ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                    : digit
                    ? "border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 ring-2 ring-sky-500"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                } focus:outline-none transition-all shadow-sm`}
              />
            ))}
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-500 font-semibold text-center">{errorMessage}</p>
          )}

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Phone Verified! Provisioning Account...</span>
            </div>
          )}

          {/* Quick Demo Helper */}
          <div className="text-center">
            <button
              type="button"
              onClick={fillDemoCode}
              className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold hover:underline"
            >
              [Auto-Fill Demo Code: 1234]
            </button>
          </div>

          {/* Resend & Channel Switch */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            {countdown > 0 ? (
              <span>Resend OTP in <strong className="text-sky-600">{countdown}s</strong></span>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSendOtp("whatsapp")}
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Resend via WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendOtp("sms")}
                  className="font-bold text-sky-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend SMS</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
            >
              Change Phone
            </button>
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={() => triggerVerification()}
            disabled={isVerifying || isSuccess}
            className="w-full btn-mockup-blue py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified!</span>
              </>
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Back to Slot Step */}
      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Date & Slot</span>
        </button>
      </div>
    </div>
  );
}

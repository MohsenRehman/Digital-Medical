"use client";

import React from "react";
import {
  Pill,
  PackageCheck,
  Zap,
  Users,
  Receipt,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";

interface Step4PharmacyMarketingProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step4PharmacyMarketing({ onNext, onBack }: Step4PharmacyMarketingProps) {
  const { draft, setPharmacyAddon } = useClinicAuth();

  const handleAddPharmacy = () => {
    setPharmacyAddon(true);
    onNext();
  };

  const handleSkipPharmacy = () => {
    setPharmacyAddon(false);
    onNext();
  };

  const features = [
    {
      icon: PackageCheck,
      title: "Complete Stock Tracking & Expiry Alerts",
      desc: "Live inventory deduction on each dispensed medicine with automated 30-day expiry notifications.",
    },
    {
      icon: Zap,
      title: "Instant Prescription Sync From Doctor",
      desc: "Doctor clicks 'Send to Pharmacy' and digital prescription appears live on pharmacist POS screen.",
    },
    {
      icon: Users,
      title: "Separate Secure Pharmacist Accounts",
      desc: "Role-based restricted access so clinical medical records stay private while pharmacy staff bills accurately.",
    },
    {
      icon: Receipt,
      title: "Offline Billing & Barcode POS Support",
      desc: "Fast thermal receipt printing, barcode scanner integration, and works even during internet interruptions.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Marketing Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          Recommended Clinic Module
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Empower Your Pharmacy
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Connect your in-house clinic pharmacy with your doctors' consultation rooms for zero prescription leakage and double the revenue.
        </p>
      </div>

      {/* Featured Showcase Card */}
      <div className="relative rounded-2xl p-5 sm:p-7 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-indigo-500/10 dark:from-teal-950/40 dark:via-sky-950/30 dark:to-slate-900/50 border border-teal-200/80 dark:border-teal-800/80 shadow-xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-teal-200/60 dark:border-teal-800/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Digital Pharmacy POS & Inventory Suite
              </h3>
              <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                Available as a seamless clinic add-on
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-teal-100 dark:border-teal-900 flex-shrink-0">
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider block">
              Add-on Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Rs. 3,500</span>
              <span className="text-xs text-slate-500 font-semibold">/month</span>
            </div>
          </div>
        </div>

        {/* 4 Core Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3 shadow-sm hover:border-teal-300 dark:hover:border-teal-700 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guaranteed ROI Note */}
        <div className="mt-5 p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/60 flex items-center gap-2.5 text-xs text-teal-800 dark:text-teal-200">
          <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
          <span>
            Clinics using Digital Pharmacy report a <strong>42% increase</strong> in in-house medicine dispensing within 30 days.
          </span>
        </div>
      </div>

      {/* Choice CTAs as specified in diagram */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="order-3 sm:order-1 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Email</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
          {/* Maybe Later Button */}
          <button
            type="button"
            onClick={handleSkipPharmacy}
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Maybe Later
          </button>

          {/* Add to Pkg Button */}
          <button
            type="button"
            onClick={handleAddPharmacy}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 group transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add to Pkg</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

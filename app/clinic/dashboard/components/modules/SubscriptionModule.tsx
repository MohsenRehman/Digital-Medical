"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Receipt,
  ArrowUpRight,
  Zap,
  Sparkles,
  AlertCircle,
  Clock,
  Building2,
} from "lucide-react";
import { ClinicPlanTier } from "@/lib/types/clinic";

interface SubscriptionModuleProps {
  plan: ClinicPlanTier | string;
  totalMonthlyAmount: number;
  clinicName: string;
  registeredPatientsCount: number;
}

export const SubscriptionModule: React.FC<SubscriptionModuleProps> = ({
  plan,
  totalMonthlyAmount,
  clinicName,
  registeredPatientsCount,
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const planQuota = plan === "professional" ? 2500 : plan === "pro" ? 1000 : 500;
  const currentUsage = Math.min(registeredPatientsCount + 340, planQuota);
  const percentage = Math.round((currentUsage / planQuota) * 100);

  const planFeatures = [
    "Unlimited Doctor Shift Rosters & Room Assignments",
    "Live OPD Electronic Queue Board & TV Calling",
    "Patient Medical Records & Family Profiles",
    "In-house Pharmacy POS & Automated Stock Warnings",
    "Diagnostic Laboratory Specimen Tracking",
    "End-of-Day Cash Drawer Reconciliation Register",
    "Super-Admin Verified Tenant Isolation",
  ];

  return (
    <div className="space-y-6">
      {/* 1. CURRENT ACTIVE PLAN CARD */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-slate-950 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Subscription
              </span>
              <span className="text-xs text-slate-400">Verified by Super-Admin</span>
            </div>
            <h2 className="text-2xl font-black text-white capitalize">
              {plan} Tier Workspace
            </h2>
            <span className="text-xs text-slate-400">{clinicName}</span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block uppercase tracking-wider font-bold">
              Monthly Subscription Fee
            </span>
            <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono mt-0.5">
              PKR {(totalMonthlyAmount || 8999).toLocaleString()}
              <span className="text-xs font-normal text-slate-400"> / month</span>
            </div>
          </div>
        </div>

        {/* Quota Progress Bar */}
        <div className="py-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">
              Monthly Patient Capacity: <strong>{currentUsage}</strong> / {planQuota} Patients
            </span>
            <span className="text-teal-400 font-mono">{percentage}% Utilized</span>
          </div>

          <div className="w-full h-3.5 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Quota resets on 1st of next month</span>
            <span className="text-emerald-400 font-bold">
              {planQuota - currentUsage} capacity slots remaining
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Next billing cycle renewal: <strong>24 October 2024</strong></span>
          </div>

          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade Plan Tier</span>
          </button>
        </div>
      </div>

      {/* 2. PLAN FEATURES & PAYMENT HISTORY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Features Checklist */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Included Platform Features
          </h3>
          <div className="space-y-2.5 text-xs">
            {planFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History Record */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Verified Bank Transfer Receipts
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-900 dark:text-white">Activation Subscription</span>
                <span className="text-emerald-600">PKR {(totalMonthlyAmount || 8999).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Bank: Meezan Bank Ltd</span>
                <span className="font-mono">Ref: MZ-94819284</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block pt-1">
                Verified & Activated by Super-Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Request Subscription Plan Upgrade
              </h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-300">
              Upgrades to the <strong>Hospital Enterprise Tier</strong> (PKR 15,999/mo) unlock unlimited patient capacity, multi-branch synchronization, and custom SMS sender branding.
            </p>

            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900">
              <span className="font-bold text-sky-800 dark:text-sky-300 block mb-1">
                Super-Admin Verification Flow:
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Submitting an upgrade request generates a bank transfer voucher for Meezan Bank. Once the receipt is uploaded, the Super-Admin instantly updates your clinic quota.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Upgrade ticket submitted to Super-Admin team.");
                  setShowUpgradeModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold cursor-pointer shadow-sm"
              >
                Submit Upgrade Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

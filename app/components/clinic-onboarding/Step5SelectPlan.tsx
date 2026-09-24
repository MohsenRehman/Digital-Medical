"use client";

import React from "react";
import { Check, Zap, Sparkles, ArrowRight, ArrowLeft, Pill, ShieldCheck } from "lucide-react";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";
import { ClinicPlanTier } from "@/lib/types/clinic";

interface Step5SelectPlanProps {
  onNext: () => void;
  onBack: () => void;
}

interface PlanDetails {
  id: ClinicPlanTier;
  name: string;
  badge?: string;
  price: number;
  description: string;
  features: string[];
}

const PLANS: PlanDetails[] = [
  {
    id: "basic",
    name: "Basic",
    price: 4999,
    description: "Ideal for solo practitioners and small local community clinics.",
    features: [
      "Up to 3 Doctors & Staff",
      "Online Appointment Booking",
      "Patient SMS Notifications",
      "Digital Patient Records (EMR)",
      "Standard Email Support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Most Popular",
    price: 8999,
    description: "Best for growing specialist clinics and multi-doctor care centers.",
    features: [
      "Up to 10 Doctors & Staff",
      "WhatsApp + SMS Automated Reminders",
      "Doctor Schedule & Shift Management",
      "Revenue & Patient Flow Analytics",
      "Verified Clinic Badge & Priority Listing",
      "Priority WhatsApp Support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    badge: "Enterprise",
    price: 15999,
    description: "Comprehensive enterprise suite for large medical centers and hospitals.",
    features: [
      "Unlimited Doctors & Staff",
      "Multi-branch Clinic Management",
      "Dedicated Account Manager",
      "Custom Clinic Domain & Branding",
      "Advanced Lab & Diagnostics Sync",
      "24/7 Direct Hotline Support",
    ],
  },
];

export default function Step5SelectPlan({ onNext, onBack }: Step5SelectPlanProps) {
  const { draft, setSelectedPlan, calculateTotalMonthly } = useClinicAuth();

  const handlePlanSelect = (plan: ClinicPlanTier) => {
    setSelectedPlan(plan);
  };

  const totalMonthly = calculateTotalMonthly();
  const selectedPlanData = PLANS.find((p) => p.id === draft.selectedPlan) || PLANS[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <Zap className="w-3.5 h-3.5 text-sky-500" />
          Step 5: Select Your Plan
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Choose Your Clinic Subscription
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Flexible plans designed to grow with your practice. Change or upgrade anytime.
        </p>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isSelected = draft.selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-sky-50/90 dark:bg-sky-950/50 border-2 border-sky-500 shadow-xl shadow-sky-500/15 ring-2 ring-sky-500/20"
                  : "bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-md shadow-sky-500/20">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{plan.name}</h3>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    Rs. {plan.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">/mo</span>
                </div>

                {/* Features List */}
                <ul className="mt-4 space-y-2 text-xs">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selection button */}
              <button
                type="button"
                className={`w-full mt-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  isSelected
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {isSelected ? "Selected Plan" : "Choose Plan"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Bill Summary Strip */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              Selected: {selectedPlanData.name} Plan (Rs. {selectedPlanData.price.toLocaleString()}/mo)
            </span>
          </div>
          {draft.pharmacyAddon.isAdded && (
            <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-medium">
              <Pill className="w-3.5 h-3.5" />
              <span>Includes Digital Pharmacy Suite (+ Rs. 3,500/mo)</span>
            </div>
          )}
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
            Total Payable At Next Step
          </span>
          <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400">
            Rs. {totalMonthly.toLocaleString()}{" "}
            <span className="text-xs text-slate-500 font-normal">/ month</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pharmacy</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 group transition-all cursor-pointer"
        >
          <span>Continue to Payment Verification</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

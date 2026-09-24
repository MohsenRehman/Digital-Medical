"use client";

import React from "react";
import { Check, Building2, MapPin, MailCheck, Pill, CreditCard, ShieldCheck } from "lucide-react";

interface OnboardingStepperProps {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  isEmailVerified: boolean;
}

const STEPS = [
  { step: 1, title: "Clinic Account", icon: Building2 },
  { step: 2, title: "Location & Phone", icon: MapPin },
  { step: 3, title: "Verify Email", icon: MailCheck },
  { step: 4, title: "Pharmacy Add-on", icon: Pill },
  { step: 5, title: "Select Plan", icon: CreditCard },
  { step: 6, title: "Payment & Proof", icon: ShieldCheck },
];

export default function OnboardingStepper({ currentStep, isEmailVerified }: OnboardingStepperProps) {
  return (
    <div className="w-full py-4 px-2 sm:px-6">
      {/* Mobile Stepper Header: Step X of 6 */}
      <div className="flex md:hidden items-center justify-between mb-3 text-xs">
        <span className="font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
          Step {currentStep} of 6
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {STEPS[currentStep - 1].title}
        </span>
      </div>

      {/* Mobile Progress Bar */}
      <div className="block md:hidden w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
        <div
          className="bg-gradient-to-r from-sky-500 to-teal-400 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(currentStep / 6) * 100}%` }}
        />
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative max-w-4xl mx-auto">
        {/* Connecting horizontal line */}
        <div className="absolute top-5 left-8 right-8 h-[2px] bg-slate-200 dark:bg-slate-700 z-0">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-teal-400 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
          />
        </div>

        {STEPS.map((s) => {
          const Icon = s.icon;
          const isCompleted = currentStep > s.step || (s.step === 3 && isEmailVerified);
          const isCurrent = currentStep === s.step;

          return (
            <div key={s.step} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-emerald-500/30 scale-100"
                    : isCurrent
                    ? "bg-gradient-to-tr from-sky-600 to-sky-400 text-white ring-4 ring-sky-100 dark:ring-sky-900/50 shadow-md shadow-sky-500/30 scale-110"
                    : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
              </div>

              <span
                className={`text-[11px] font-semibold mt-2 transition-colors text-center whitespace-nowrap ${
                  isCurrent
                    ? "text-sky-600 dark:text-sky-400 font-bold"
                    : isCompleted
                    ? "text-slate-800 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

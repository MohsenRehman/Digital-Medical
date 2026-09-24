"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, ArrowLeft, ShieldCheck, Stethoscope } from "lucide-react";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";
import OnboardingStepper from "@/app/components/clinic-onboarding/OnboardingStepper";
import Step1Credentials from "@/app/components/clinic-onboarding/Step1Credentials";
import Step2LocationContact from "@/app/components/clinic-onboarding/Step2LocationContact";
import Step3VerifyEmail from "@/app/components/clinic-onboarding/Step3VerifyEmail";
import Step4PharmacyMarketing from "@/app/components/clinic-onboarding/Step4PharmacyMarketing";
import Step5SelectPlan from "@/app/components/clinic-onboarding/Step5SelectPlan";
import Step6PaymentProof from "@/app/components/clinic-onboarding/Step6PaymentProof";

export default function ClinicRegisterPage() {
  const { draft, currentStep, setCurrentStep } = useClinicAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/30 to-slate-100 dark:from-slate-950 dark:via-[#0c1424] dark:to-black text-slate-900 dark:text-white selection:bg-sky-500 selection:text-white py-6 sm:py-10 px-3.5 sm:px-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-400/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-4xl mx-auto flex items-center justify-between gap-4 mb-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Digital<span className="text-sky-600 dark:text-sky-400">Medical</span>
            </span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
              Clinic Registration Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/clinic/login"
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Already Registered? <span className="text-sky-600 dark:text-sky-400 font-bold">Sign In</span>
          </Link>
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Wizard Card */}
      <main className="max-w-3xl mx-auto bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl shadow-sky-950/10 dark:shadow-cyan-950/20 p-5 sm:p-8 relative z-10">
        {/* Horizontal Progress Stepper */}
        <OnboardingStepper
          currentStep={currentStep}
          isEmailVerified={draft.isEmailVerified}
        />

        {/* Dynamic Step Content with Fade Animation */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Step1Credentials onNext={() => setCurrentStep(2)} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Step2LocationContact
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Step3VerifyEmail
                  onNext={() => setCurrentStep(4)}
                  onBack={() => setCurrentStep(2)}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Step4PharmacyMarketing
                  onNext={() => setCurrentStep(5)}
                  onBack={() => setCurrentStep(3)}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Step5SelectPlan
                  onNext={() => setCurrentStep(6)}
                  onBack={() => setCurrentStep(4)}
                />
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Step6PaymentProof onBack={() => setCurrentStep(5)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Trust & Security Footnote */}
      <footer className="max-w-2xl mx-auto text-center mt-8 text-xs text-slate-400 dark:text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-4 text-[11px] font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            256-Bit SSL Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-sky-500" />
            PMDC & Healthcare Commission Ready
          </span>
        </div>
        <p>© 2026 Digital Medical Healthcare Network. All rights reserved.</p>
      </footer>
    </div>
  );
}

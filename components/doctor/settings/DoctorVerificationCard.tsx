"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Building,
  Award,
  Calendar,
  X,
  FileCheck,
} from "lucide-react";
import { DoctorProfile } from "@/lib/types/doctor";

interface DoctorVerificationCardProps {
  doctor: DoctorProfile;
}

export default function DoctorVerificationCard({ doctor }: DoctorVerificationCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const statusConfig = {
    verified: {
      title: "PMDC VERIFIED DOCTOR",
      badgeText: "Verified Clinical Practitioner",
      badgeColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      cardBorder: "border-emerald-200 dark:border-emerald-900/60",
      description: "Your license has been cross-verified with the Pakistan Medical & Dental Council (PMDC) national registry.",
    },
    pending: {
      title: "VERIFICATION IN PROGRESS",
      badgeText: "Pending PMDC Verification",
      badgeColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      iconColor: "text-amber-600 dark:text-amber-400",
      cardBorder: "border-amber-200 dark:border-amber-900/60",
      description: "Your credential documents are currently undergoing review by our clinical verification board.",
    },
    unverified: {
      title: "VERIFICATION REQUIRED",
      badgeText: "Unverified Account",
      badgeColor: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800",
      iconColor: "text-rose-600 dark:text-rose-400",
      cardBorder: "border-rose-200 dark:border-rose-900/60",
      description: "Please upload your valid PMDC registration certificate to activate public booking.",
    },
  }[doctor.verificationStatus] || {
    title: "VERIFIED PRACTITIONER",
    badgeText: "Verified",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-300",
    iconColor: "text-emerald-600",
    cardBorder: "border-emerald-200",
    description: "Doctor credentials verified.",
  };

  return (
    <>
      <div
        className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${statusConfig.cardBorder} shadow-xs space-y-4`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {statusConfig.title}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusConfig.badgeColor}`}
                >
                  {statusConfig.badgeText}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {statusConfig.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <FileCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>View Verification Details</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              PMDC Registration No.
            </span>
            <p className="font-mono font-extrabold text-slate-900 dark:text-white text-sm mt-1">
              {doctor.pmdcRegistration}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Medical Council
            </span>
            <p className="font-semibold text-slate-900 dark:text-white text-xs mt-1 truncate">
              {doctor.medicalCouncil || "PMDC (Pakistan)"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Last Verified Date
            </span>
            <p className="font-semibold text-slate-900 dark:text-white text-xs mt-1">
              {doctor.verificationDate || "12 Sep 2026"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Registry Status
            </span>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active Good Standing</span>
            </p>
          </div>
        </div>
      </div>

      {/* Verification Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    PMDC Clinical Credential Registry
                  </h3>
                  <p className="text-xs text-slate-500">Official Certification Record</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Licensed Practitioner</span>
                  <span className="font-bold text-slate-900 dark:text-white">{doctor.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Permanent PMDC Reg #</span>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{doctor.pmdcRegistration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Medical Council</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Pakistan Medical & Dental Council (Islamabad)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Authorized Practice Scope</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{doctor.specialty} & Interventional Procedures</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Accredited Degrees on Record</h4>
                <div className="space-y-2">
                  {doctor.qualifications.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{q}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-[11px] text-sky-800 dark:text-sky-300">
                This verification badge is prominently displayed to patients searching the Digital Medical Doctor Directory, ensuring clinical authenticity and trust.
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold text-xs"
              >
                Close Verification Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

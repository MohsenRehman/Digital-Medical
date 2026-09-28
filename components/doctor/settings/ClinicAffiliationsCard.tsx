"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Plus,
  AlertTriangle,
  X,
  Phone,
} from "lucide-react";
import { ClinicAffiliation } from "@/lib/types/doctor";

interface ClinicAffiliationsCardProps {
  clinics: ClinicAffiliation[];
  activeClinicId: string;
  onSwitchActiveClinic: (clinicId: string) => void;
  onManageSchedule: () => void;
}

export default function ClinicAffiliationsCard({
  clinics,
  activeClinicId,
  onSwitchActiveClinic,
  onManageSchedule,
}: ClinicAffiliationsCardProps) {
  const [selectedClinicDetails, setSelectedClinicDetails] = useState<ClinicAffiliation | null>(null);
  const [leaveModalClinic, setLeaveModalClinic] = useState<ClinicAffiliation | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Clinic & Hospital Practice Affiliations
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              MULTI-BRANCH PRACTICE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage physical consultation suites, hospital branches, and active practice locations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRequestModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Affiliate With New Clinic</span>
        </button>
      </div>

      {requestSubmitted && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Affiliation request submitted to clinic administration for approval.</span>
        </div>
      )}

      {/* Clinics List */}
      <div className="space-y-4">
        {clinics.map((clinic) => {
          const isActiveSession = clinic.id === activeClinicId;

          return (
            <div
              key={clinic.id}
              className={`p-5 rounded-2xl border transition-all ${
                isActiveSession
                  ? "bg-sky-50/50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800 shadow-xs"
                  : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {clinic.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {clinic.city}
                    </span>
                    {isActiveSession && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-600 text-white shadow-xs">
                        Active Workspace Location
                      </span>
                    )}
                    {clinic.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        Primary Clinical Hub
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    <span>{clinic.address}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded ml-1">
                      Managed by Clinic
                    </span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>
                      Room / Chamber: <strong className="text-slate-800 dark:text-slate-200">{clinic.roomNumber}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Clinic Desk Phone: <strong className="text-slate-800 dark:text-slate-200">{clinic.phone}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Status: <strong className="text-emerald-600 dark:text-emerald-400">Active Practicing</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  {!isActiveSession && (
                    <button
                      type="button"
                      onClick={() => onSwitchActiveClinic(clinic.id)}
                      className="px-3 py-1.5 rounded-xl border border-sky-300 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-xs font-semibold transition-colors"
                    >
                      Switch to This Clinic
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onManageSchedule()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-semibold transition-colors"
                  >
                    Manage Hours
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedClinicDetails(clinic)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    title="View Clinic Information"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeaveModalClinic(clinic)}
                    className="px-2.5 py-1.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold"
                  >
                    Leave
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clinic Details Modal */}
      {selectedClinicDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedClinicDetails.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClinicDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Street Address (Clinic Managed)</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedClinicDetails.address}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">City & Region</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedClinicDetails.city}, Pakistan</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">OPD Reception Phone</span>
                  <p className="font-mono font-bold text-sky-600 dark:text-sky-400 mt-0.5">{selectedClinicDetails.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedClinicDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Clinic Modal */}
      {leaveModalClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Leave {leaveModalClinic.name}?
                </h3>
                <p className="text-xs text-slate-500">Practice Affiliation Termination</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to request disaffiliation from <strong>{leaveModalClinic.name}</strong>? Any upcoming scheduled patients will need to be reassigned by the clinic desk.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setLeaveModalClinic(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setLeaveModalClinic(null)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request New Affiliation Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Affiliate With Registered Clinic
              </h3>
              <button
                onClick={() => setRequestModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Select Clinic or Hospital
                </label>
                <select className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  <option value="pesh-02">Hayatabad Medical Complex (Peshawar)</option>
                  <option value="pesh-03">Northwest General Hospital & Research Center</option>
                  <option value="isb-03">Shifa International Hospital (Islamabad)</option>
                  <option value="lah-01">National Hospital & Medical Centre (Lahore)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Clinical Role / Designation
                </label>
                <input
                  type="text"
                  defaultValue="Visiting Consultant Cardiologist"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-[11px] text-sky-800 dark:text-sky-300">
                The clinic medical director will verify your PMDC registration number ({clinics[0]?.phone ? "48291-P" : "Verified"}) before scheduling room assignment.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setRequestModalOpen(false);
                  setRequestSubmitted(true);
                  setTimeout(() => setRequestSubmitted(false), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs"
              >
                Submit Affiliation Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

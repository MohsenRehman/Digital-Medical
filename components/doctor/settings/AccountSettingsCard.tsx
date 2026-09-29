"use client";

import React, { useState } from "react";
import {
  User,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Lock,
  Trash2,
  PauseCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { DoctorProfile } from "@/lib/types/doctor";

interface AccountSettingsCardProps {
  doctor: DoctorProfile;
}

export default function AccountSettingsCard({ doctor }: AccountSettingsCardProps) {
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleDeactivate = () => {
    setDeactivateModalOpen(false);
    setActionNotice("Account deactivation request logged. Clinical desk notified.");
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleDelete = () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleteModalOpen(false);
    setActionNotice("Account termination request submitted to PMDC platform admin.");
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Account Profile Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Practitioner Account Record
          </h2>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            SYSTEM IDENTIFIER
          </span>
        </div>

        {actionNotice && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
            <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Practitioner UUID
            </span>
            <p className="font-mono font-bold text-slate-900 dark:text-white mt-1">
              {doctor.id}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Member Status
            </span>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active in Good Standing</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Verified Since
            </span>
            <p className="font-semibold text-slate-900 dark:text-white mt-1">
              12 September 2024
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              PMDC Council Number
            </span>
            <p className="font-mono font-bold text-sky-600 dark:text-sky-400 mt-1">
              {doctor.pmdcRegistration}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Primary Clinic Tenant
            </span>
            <p className="font-semibold text-slate-900 dark:text-white mt-1">
              tenant-pesh-cmc
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Data Privacy Tier
            </span>
            <p className="font-semibold text-slate-900 dark:text-white mt-1">
              HIPAA & PMDC Compliant
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-900/60 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-600 border-b border-rose-100 dark:border-rose-900/40 pb-3">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Danger Zone
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Deactivate Account */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Temporarily Deactivate Practice</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Take a sabbatical or medical leave. Your profile will be temporarily hidden from new patient discovery, but patient medical history remains preserved.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDeactivateModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold text-xs self-start flex items-center gap-1.5"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              <span>Deactivate Account</span>
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-rose-700 dark:text-rose-400">Request Permanent Account Termination</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Permanent deletion initiates a compliance audit. Medical records and past prescriptions are retained in accordance with PMDC statutory retention regulations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmText("");
                setDeleteModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs self-start flex items-center gap-1.5 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      {deactivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                <PauseCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Deactivate Doctor Account?
                </h3>
                <p className="text-xs text-slate-500">Temporary Inactive Status</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Your appointment booking calendar will be halted and you will not appear in the Doctor Discovery Directory. You can reactivate anytime by logging back in.
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                Reason for leave
              </label>
              <input
                type="text"
                placeholder="e.g. Sabbatical, medical conference, overseas leave"
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeactivateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-popIn space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Permanently Terminate Account?
                </h3>
                <p className="text-xs text-slate-500">Irreversible Clinical Workflow</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This action submits a permanent account closure request to the medical board. To confirm, type <strong className="font-mono text-rose-600">DELETE</strong> in the box below:
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-900 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== "DELETE"}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs"
              >
                Submit Termination Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

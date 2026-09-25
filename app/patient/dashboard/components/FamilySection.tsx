"use client";

import React from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Trash2,
  HeartHandshake,
  User,
  Plus,
} from "lucide-react";
import { FamilyMemberRecord, AppointmentRecord, PatientUser } from "@/lib/types/patient";

interface FamilySectionProps {
  patientUser: PatientUser | null;
  familyMembers: FamilyMemberRecord[];
  appointments: AppointmentRecord[];
  onOpenAddFamily: () => void;
  onOpenBooking: () => void;
  onRemoveFamilyMember?: (id: string) => void;
}

export default function FamilySection({
  patientUser,
  familyMembers,
  appointments,
  onOpenAddFamily,
  onOpenBooking,
  onRemoveFamilyMember,
}: FamilySectionProps) {
  const primaryName = patientUser?.name || "Muhammad Ahmed";

  // Build unified patient profile list
  const primaryProfile = {
    id: "primary-self",
    name: primaryName,
    relation: "Self (Primary Account Holder)",
    age: patientUser?.age || 32,
    gender: patientUser?.gender || "male",
    isPrimary: true,
  };

  const primaryAppointments = appointments.filter(
    (a) => a.bookedByRelation === "self" || a.patientName.toLowerCase() === primaryName.toLowerCase()
  );

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Family Care Unit</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Family Patient Profiles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            One account managing separate patient identities for children, spouse, and parents.
          </p>
        </div>

        <button
          onClick={onOpenAddFamily}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Medical Isolation Explainer Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-500/10 via-teal-500/5 to-transparent border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Strict Medical Profile Isolation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed max-w-2xl">
              Each dependent maintains their own clinical chart. Prescriptions, diagnoses, lab investigations, and doctor schedules are partitioned per profile and never mixed with the guardian's record.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-purple-700 dark:text-purple-300 font-bold whitespace-nowrap self-end sm:self-auto">
          {1 + familyMembers.length} Active Profiles
        </div>
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Primary Account Card (Self) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1424] border-2 border-teal-500/40 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-black flex items-center justify-center text-base shadow-md shadow-teal-500/20">
                  {primaryProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {primaryProfile.name}
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                  </div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    Self • Primary Account
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Age / Gender</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {primaryProfile.age} yrs • {primaryProfile.gender}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Visits</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  {primaryAppointments.length} consultation{primaryAppointments.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment for Self</span>
            </button>
          </div>
        </div>

        {/* Dependents Cards */}
        {familyMembers.map((member) => {
          const memberAppointments = appointments.filter(
            (a) =>
              a.patientName.toLowerCase() === member.name.toLowerCase() ||
              a.bookedByRelation === member.relation
          );

          return (
            <div
              key={member.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-400/50 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-black flex items-center justify-center text-base shadow-md shadow-purple-500/20">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </h3>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {member.relation}
                      </span>
                    </div>
                  </div>

                  {onRemoveFamilyMember && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${member.name} from family profiles?`)) {
                          onRemoveFamilyMember(member.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Age / Gender</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                      {member.age ? `${member.age} yrs` : "N/A"} • {member.gender || "Profile"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Visits</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {memberAppointments.length} consultation{memberAppointments.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book for {member.name}</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Dependent Card Trigger */}
        <div
          onClick={onOpenAddFamily}
          className="p-6 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-teal-500/60 bg-slate-50/40 dark:bg-slate-800/20 flex flex-col items-center justify-center text-center p-8 cursor-pointer transition-all group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Add Another Family Member
          </h4>
          <p className="mt-1 text-[11px] text-slate-400 max-w-xs">
            Link a child, spouse, or parent to your account for unified scheduling.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
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
  Edit3,
} from "lucide-react";
import {
  FamilyMemberRecord,
  AppointmentRecord,
  PatientUser,
  AppointmentRelation,
  GenderType,
} from "@/lib/types/patient";
import { DashboardTab } from "./types";
import FamilyMemberProfileDetail from "./FamilyMemberProfileDetail";
import EditFamilyModal from "./EditFamilyModal";
import FamilyMemberAvatar from "./FamilyMemberAvatar";

interface FamilySectionProps {
  patientUser: PatientUser | null;
  familyMembers: FamilyMemberRecord[];
  appointments: AppointmentRecord[];
  onOpenAddFamily: () => void;
  onOpenBooking: () => void;
  onRemoveFamilyMember?: (id: string) => void;
  onUpdateFamilyMember?: (
    memberId: string,
    data: {
      relation: AppointmentRelation;
      name: string;
      age?: number;
      gender?: GenderType;
    }
  ) => void;
  onTabChange?: (tab: DashboardTab) => void;
  onViewAppointmentDetail?: (apt: AppointmentRecord) => void;
  onToggleWhatsApp?: (id: string) => void;
}

export default function FamilySection({
  patientUser,
  familyMembers,
  appointments,
  onOpenAddFamily,
  onOpenBooking,
  onRemoveFamilyMember,
  onUpdateFamilyMember,
  onTabChange,
  onViewAppointmentDetail,
  onToggleWhatsApp,
}: FamilySectionProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMemberRecord | null>(null);

  const primaryName = patientUser?.name || "Muhammad Ahmed";

  // Build unified patient profile list for Self
  const primaryProfile = {
    id: "primary-self",
    name: primaryName,
    relation: "Self (Primary Account Holder)",
    age: patientUser?.age || 32,
    gender: patientUser?.gender || "male",
    isPrimary: true,
  };

  const primaryAppointments = appointments.filter(
    (a) => !a.familyMemberId && (a.bookedByRelation === "self" || !a.bookedByRelation)
  );

  // If a member is selected, locate the current record
  const selectedMember = selectedMemberId
    ? familyMembers.find((m) => m.id === selectedMemberId) || null
    : null;

  // -------------------------------------------------------------------------
  // RENDER DETAIL VIEW IF A FAMILY MEMBER CARD WAS CLICKED
  // -------------------------------------------------------------------------
  if (selectedMember) {
    return (
      <>
        <FamilyMemberProfileDetail
          member={selectedMember}
          primaryPatient={patientUser}
          appointments={appointments}
          onBack={() => setSelectedMemberId(null)}
          onOpenBooking={onOpenBooking}
          onEditMember={(m) => setEditingMember(m)}
          onRemoveMember={(id) => {
            onRemoveFamilyMember?.(id);
            setSelectedMemberId(null);
          }}
          onViewAppointmentDetail={onViewAppointmentDetail}
          onToggleWhatsApp={onToggleWhatsApp}
        />

        <EditFamilyModal
          isOpen={!!editingMember}
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={(id, data) => {
            onUpdateFamilyMember?.(id, data);
            setEditingMember(null);
          }}
        />
      </>
    );
  }

  // -------------------------------------------------------------------------
  // RENDER DEFAULT FAMILY PROFILES ROSTER LIST
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 gap-3.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[11px] font-semibold mb-1">
            <Users className="w-3 h-3 text-sky-600 dark:text-sky-400" />
            <span>Family Care Unit</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Family Patient Profiles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            One account managing separate patient identities for children, spouse, and parents.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddFamily}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Medical Isolation Explainer Banner */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Strict Medical Profile Isolation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed max-w-2xl">
              Each dependent maintains their own clinical chart. Prescriptions, diagnoses, lab investigations, and doctor schedules are partitioned per profile and never mixed with the guardian&apos;s record.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-sky-700 dark:text-sky-300 font-semibold px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 whitespace-nowrap self-end sm:self-auto">
          {1 + familyMembers.length} Active Profiles
        </div>
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Primary Account Card (Self) - Clicking opens Profile & Settings */}
        <div
          onClick={() => onTabChange?.("settings")}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border-2 border-sky-500/40 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-xs transition-shadow cursor-pointer group"
          title="Click to view & manage Primary Account Settings"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {primaryProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {primaryProfile.name}
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                  </div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    Self • Primary Account
                  </span>
                </div>
              </div>

              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                Settings <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Age / Gender
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {primaryProfile.age} yrs • {primaryProfile.gender}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Visits
                </span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  {primaryAppointments.length} consultation{primaryAppointments.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenBooking();
              }}
              className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment for Self</span>
            </button>
          </div>
        </div>

        {/* Dependents Cards - Clicking card opens Family Member Profile Detail view */}
        {familyMembers.map((member) => {
          const memberAppointments = appointments.filter(
            (a) => a.familyMemberId === member.id
          );

          return (
            <div
              key={member.id}
              onClick={() => setSelectedMemberId(member.id)}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4 hover:border-sky-400 dark:hover:border-sky-600 transition-all hover:shadow-xs cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <FamilyMemberAvatar
                      memberId={member.id}
                      name={member.name}
                      className="w-11 h-11 rounded-xl text-sm group-hover:scale-105 transition-transform shadow-2xs"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {member.name}
                      </h3>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {member.relation}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingMember(member);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit member"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {onRemoveFamilyMember && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove ${member.name} from family profiles?`)) {
                            onRemoveFamilyMember(member.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Remove profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Age / Gender
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                      {member.age ? `${member.age} yrs` : "N/A"} • {member.gender || "Profile"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Visits
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {memberAppointments.length} consultation{memberAppointments.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenBooking();
                  }}
                  className="w-full py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Book for {member.name}</span>
                </button>

                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 group-hover:underline">
                  <span>View Member Profile &amp; History</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Dependent Card Trigger */}
        <div
          onClick={onOpenAddFamily}
          className="p-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-sky-500/60 bg-white dark:bg-slate-900/40 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[220px]"
        >
          <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Add Another Family Member
          </h4>
          <p className="mt-1 text-[11px] text-slate-400 max-w-xs">
            Link a child, spouse, or parent to your account for unified scheduling.
          </p>
        </div>
      </div>

      {/* Edit Member Modal for card-level editing */}
      <EditFamilyModal
        isOpen={!!editingMember}
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSave={(id, data) => {
          onUpdateFamilyMember?.(id, data);
          setEditingMember(null);
        }}
      />
    </div>
  );
}

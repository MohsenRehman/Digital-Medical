"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Calendar,
  Clock,
  Users,
  FileText,
  Pill,
  Activity,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building2,
  Stethoscope,
  ShieldCheck,
  User,
  HeartPulse,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { AppointmentRecord, FamilyMemberRecord, PatientUser } from "@/lib/types/patient";
import { DashboardTab, ActivityItem } from "./types";
import FamilyMemberAvatar from "./FamilyMemberAvatar";

interface DashboardHomeProps {
  patientUser: PatientUser | null;
  appointments: AppointmentRecord[];
  familyMembers: FamilyMemberRecord[];
  onTabChange: (tab: DashboardTab) => void;
  onOpenBooking: (doctor?: any) => void;
  onOpenAddFamily: () => void;
  onViewAppointmentDetail: (apt: AppointmentRecord) => void;
}

export default function DashboardHome({
  patientUser,
  appointments,
  familyMembers,
  onTabChange,
  onOpenBooking,
  onOpenAddFamily,
  onViewAppointmentDetail,
}: DashboardHomeProps) {
  const patientName = patientUser?.name || "Muhammad Ahmed";

  // Filter upcoming appointments (confirmed appointments)
  const upcomingAppointments = useMemo(() => {
    return appointments.filter((apt) => apt.status === "confirmed");
  }, [appointments]);

  const nearestUpcoming = upcomingAppointments[0] || null;

  // Build unified patient profiles list (Account Holder as Self + Dependents)
  const allProfiles = useMemo(() => {
    const selfProfile = {
      id: "self-profile",
      relation: "self" as const,
      name: patientName,
      age: patientUser?.age || 32,
      gender: patientUser?.gender || "male",
      isPrimary: true,
    };

    const dependents = familyMembers.map((m) => ({
      id: m.id,
      relation: m.relation,
      name: m.name,
      age: m.age,
      gender: m.gender,
      isPrimary: false,
    }));

    return [selfProfile, ...dependents];
  }, [patientName, patientUser, familyMembers]);

  // Construct real activity items from appointments
  const recentActivities: ActivityItem[] = useMemo(() => {
    const list: ActivityItem[] = [];

    // Appointments activities
    appointments.slice(0, 3).forEach((apt) => {
      list.push({
        id: `act-${apt.id}`,
        type: "appointment",
        title: `Appointment with ${apt.doctorName}`,
        description: `${apt.clinicName} • ${apt.date} at ${apt.timeSlot}`,
        time: "Confirmed",
        patientName: apt.patientName,
        relation: apt.bookedByRelation,
      });
    });

    // Profile activity
    if (patientUser?.profileCompleted) {
      list.push({
        id: "act-profile",
        type: "profile",
        title: "Medical Profile Completed",
        description: "Emergency contact, age, and health details updated",
        time: "Account Active",
        patientName: patientName,
        relation: "self",
      });
    }

    return list;
  }, [appointments, patientUser, patientName]);

  const kpis = [
    {
      title: "Upcoming Visits",
      value: upcomingAppointments.length,
      description: upcomingAppointments.length > 0 ? "Scheduled clinic visits" : "No visits scheduled",
      icon: CalendarDays,
      accentText: "text-sky-600 dark:text-sky-400",
      accentBg: "bg-sky-50 dark:bg-sky-950/50",
      border: "border-sky-200/90 dark:border-sky-900/60",
      hoverBorder: "hover:border-sky-400 dark:hover:border-sky-600",
      pillBg: "bg-sky-100/80 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300",
      pillText: upcomingAppointments.length > 0 ? "Active Schedule" : "Clear",
      actionLabel: "View appointments",
      onClick: () => onTabChange("appointments"),
    },
    {
      title: "Total Visits",
      value: appointments.length,
      description: "Lifetime checkup history",
      icon: Activity,
      accentText: "text-emerald-600 dark:text-emerald-400",
      accentBg: "bg-emerald-50 dark:bg-emerald-950/50",
      border: "border-emerald-200/90 dark:border-emerald-900/60",
      hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-600",
      pillBg: "bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
      pillText: "Recorded",
      actionLabel: "View history",
      onClick: () => onTabChange("appointments"),
    },
    {
      title: "Family Profiles",
      value: allProfiles.length,
      description: "Self + Dependent accounts",
      icon: Users,
      accentText: "text-indigo-600 dark:text-indigo-400",
      accentBg: "bg-indigo-50 dark:bg-indigo-950/50",
      border: "border-indigo-200/90 dark:border-indigo-900/60",
      hoverBorder: "hover:border-indigo-400 dark:hover:border-indigo-600",
      pillBg: "bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300",
      pillText: "Isolated IDs",
      actionLabel: "Manage family",
      onClick: () => onTabChange("family"),
    },
    {
      title: "Next Follow-up",
      value: upcomingAppointments.length > 0 ? 1 : 0,
      description: upcomingAppointments.length > 0 ? "Review consultation advised" : "Up to date",
      icon: Clock,
      accentText: "text-amber-600 dark:text-amber-400",
      accentBg: "bg-amber-50 dark:bg-amber-950/50",
      border: "border-amber-200/90 dark:border-amber-900/60",
      hoverBorder: "hover:border-amber-400 dark:hover:border-amber-600",
      pillBg: "bg-amber-100/80 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
      pillText: upcomingAppointments.length > 0 ? "Milestone Due" : "On Track",
      actionLabel: "Check timeline",
      onClick: () => onTabChange("follow-ups"),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 animate-fadeInUp">
      {/* 1. Top Summary KPI Cards (4 Cards matching DoctorKpiCards style) */}
      <section aria-label="Patient Summary Metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-3.5">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;

            return (
              <div
                key={kpi.title}
                onClick={kpi.onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    kpi.onClick();
                  }
                }}
                className={`group relative flex flex-col justify-between p-3.5 sm:px-4 sm:py-3.5 rounded-xl bg-white dark:bg-slate-900 border ${kpi.border} ${kpi.hoverBorder} shadow-2xs hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 min-h-[128px] select-none`}
              >
                {/* Upper Content: Label Row + Metric & Pill */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase truncate">
                      {kpi.title}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg ${kpi.accentBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className={`w-4 h-4 ${kpi.accentText}`} />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {kpi.value}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none ${kpi.pillBg}`}>
                      {kpi.pillText}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 truncate">
                    {kpi.description}
                  </p>
                </div>

                {/* Bottom Action Footer with translate on hover */}
                <div className="mt-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold flex items-center justify-between text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  <span>{kpi.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Main Grid: Upcoming Appointment Spotlight (2 cols) + Quick Actions (1 col) */}
      <section aria-label="Upcoming Consultations and Quick Actions">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Prominent Upcoming Appointment Card */}
          <div className="lg:col-span-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  Upcoming Appointment
                </h2>
              </div>
              {upcomingAppointments.length > 1 && (
                <button
                  onClick={() => onTabChange("appointments")}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  +{upcomingAppointments.length - 1} more scheduled →
                </button>
              )}
            </div>

            {nearestUpcoming ? (
              <div className="p-4 sm:p-5 space-y-3.5">
                {/* Spotlight Box */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-sky-50/50 via-slate-50/40 to-indigo-50/30 dark:from-sky-950/20 dark:via-slate-900 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative flex-shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs">
                      {nearestUpcoming.doctorImage ? (
                        <Image
                          src={nearestUpcoming.doctorImage}
                          alt={nearestUpcoming.doctorName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Stethoscope className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider mb-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{nearestUpcoming.status}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                        {nearestUpcoming.doctorName}
                      </h3>
                      <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold truncate">
                        {nearestUpcoming.doctorSpecialty}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{nearestUpcoming.clinicName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Slot & Token badge */}
                  <div className="sm:text-right bg-white dark:bg-slate-800/90 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/70 sm:min-w-[170px] shadow-2xs flex-shrink-0">
                    <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      <span>{nearestUpcoming.date}</span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{nearestUpcoming.timeSlot}</span>
                    </div>
                    <div className="mt-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      Token: <span className="font-bold text-slate-800 dark:text-slate-200">{nearestUpcoming.bookingRef}</span>
                    </div>
                  </div>
                </div>

                {/* Patient Identity & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Patient:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {nearestUpcoming.patientName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {nearestUpcoming.bookedByRelation}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewAppointmentDetail(nearestUpcoming)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      View Pass Details
                    </button>
                    <button
                      onClick={() => onOpenBooking()}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
                    >
                      Book Another
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 sm:p-10 text-center m-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-2.5">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No upcoming appointments scheduled
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  You have no consultations on the clinic roster. Select from top certified physicians and reserve your slot in seconds.
                </p>
                <button
                  onClick={() => onOpenBooking()}
                  className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  Quick Actions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Essential patient care workflows
                </p>
              </div>

              <div className="mt-3 space-y-2">
                <button
                  onClick={() => onOpenBooking()}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 hover:bg-sky-100/80 dark:hover:bg-sky-950/50 border border-sky-200/70 dark:border-sky-800/40 text-sky-900 dark:text-sky-200 font-bold text-xs transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center flex-shrink-0">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span>Book New Appointment</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-600 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => onTabChange("doctors-clinics")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <span>Find Specialist Doctor</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <Link
                  href="/clinics"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Explore Partner Clinics</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <button
                  onClick={() => onTabChange("medical-records")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span>View Medical Records</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={onOpenAddFamily}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span>Add Family Member</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span>Certified Healthcare Network Support Available 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Family Members Profiles Section Preview */}
      <section aria-label="Family Member Profiles">
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  Family Members &amp; Profiles
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Single unified account managing isolated medical records for dependents.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => onTabChange("family")}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
              >
                View All ({allProfiles.length})
              </button>
              <button
                onClick={onOpenAddFamily}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>
          </div>

          {/* Profiles Grid */}
          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allProfiles.map((profile) => {
              const memberAppointments = appointments.filter((a) =>
                profile.isPrimary
                  ? !a.familyMemberId && (a.bookedByRelation === "self" || !a.bookedByRelation)
                  : a.familyMemberId === profile.id
              );

              return (
                <div
                  key={profile.id}
                  className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-sky-400/60 transition-all flex flex-col justify-between gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {profile.isPrimary ? (
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-2xs flex-shrink-0">
                          {profile.name.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <FamilyMemberAvatar
                          memberId={profile.id}
                          name={profile.name}
                          className="w-9 h-9 rounded-xl text-xs shadow-2xs"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {profile.name}
                          </h4>
                          {profile.isPrimary && (
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0" />
                          )}
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {profile.relation}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                      {profile.age ? `${profile.age} yrs` : "Profile"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {memberAppointments.length} appointment{memberAppointments.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => onOpenBooking()}
                      className="text-sky-600 dark:text-sky-400 font-bold hover:underline text-[11px] flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Book</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Lower Two-Column Grid: Recent Activity & Clinical Records Preview */}
      <section aria-label="Recent Medical Activity and Records Preview">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          {/* Recent Medical Activity Card */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                    Recent Medical Activity
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Timeline
                </span>
              </div>

              <div className="mt-3.5 space-y-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {act.type === "appointment" ? (
                        <Calendar className="w-4 h-4" />
                      ) : act.type === "profile" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Activity className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {act.title}
                        </h4>
                        <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold whitespace-nowrap">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {act.description}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span>Profile: {act.patientName}</span>
                        <span>•</span>
                        <span className="capitalize">{act.relation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => onTabChange("appointments")}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Activity</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Medical Records & Prescriptions Preview */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                    Medical Records &amp; Prescriptions
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Clinical Docs
                </span>
              </div>

              {/* Safe Empty State */}
              <div className="mt-4 py-6 px-4 text-center rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2.5">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  No medical records uploaded yet
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Physician consultation summaries, lab findings, and signed digital e-prescriptions will appear here automatically following clinic encounters.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => onTabChange("prescriptions")}
                className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 font-semibold cursor-pointer"
              >
                Prescriptions (0)
              </button>
              <button
                onClick={() => onTabChange("medical-records")}
                className="text-sky-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore Records Section</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

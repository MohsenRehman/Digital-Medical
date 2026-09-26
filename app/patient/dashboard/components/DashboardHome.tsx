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
  // Determine dynamic greeting based on current hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

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

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeInUp">
      {/* 1. Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-500/10 via-cyan-500/5 to-transparent p-5 sm:p-7 rounded-3xl border border-teal-500/20 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Digital Medical Patient Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {greeting}, {patientName} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Here's an overview of your healthcare activity.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => onOpenBooking()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-teal-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Card 1: Upcoming Appointments */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Upcoming
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {upcomingAppointments.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Scheduled visits</span>
            <span className="font-semibold text-teal-600 dark:text-teal-400">
              {upcomingAppointments.length > 0 ? "Active" : "None"}
            </span>
          </div>
        </div>

        {/* Card 2: Total Appointments */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Visits
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {appointments.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Lifetime history</span>
            <span className="font-semibold text-sky-600 dark:text-sky-400">Recorded</span>
          </div>
        </div>

        {/* Card 3: Family Members */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Family Profiles
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {allProfiles.length}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Self + Dependents</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">Separate IDs</span>
          </div>
        </div>

        {/* Card 4: Next Follow-up */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Next Follow-up
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {upcomingAppointments.length > 0 ? "1" : "0"}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Milestone</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {upcomingAppointments.length > 0 ? "On Track" : "Up to date"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Upcoming Appointment Highlight + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prominent Upcoming Appointment Card (Spans 2 cols on lg) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming Appointment
              </h2>
            </div>
            {upcomingAppointments.length > 1 && (
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                +{upcomingAppointments.length - 1} more scheduled
              </span>
            )}
          </div>

          {nearestUpcoming ? (
            <div className="mt-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/30 dark:from-slate-800/40 dark:to-teal-950/20 border border-slate-200/70 dark:border-slate-800">
                {/* Doctor Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 relative flex-shrink-0 shadow-xs">
                    {nearestUpcoming.doctorImage ? (
                      <Image
                        src={nearestUpcoming.doctorImage}
                        alt={nearestUpcoming.doctorName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Stethoscope className="w-7 h-7" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider mb-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{nearestUpcoming.status}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {nearestUpcoming.doctorName}
                    </h3>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                      {nearestUpcoming.doctorSpecialty}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{nearestUpcoming.clinicName}</span>
                    </div>
                  </div>
                </div>

                {/* Date & Time Slot Badge */}
                <div className="sm:text-right bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 sm:min-w-[170px]">
                  <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <Calendar className="w-3.5 h-3.5 text-teal-500" />
                    <span>{nearestUpcoming.date}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{nearestUpcoming.timeSlot}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Token: {nearestUpcoming.bookingRef}
                  </div>
                </div>
              </div>

              {/* Patient Identity Tag & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
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
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onOpenBooking()}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-sm transition-all cursor-pointer"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Polished Empty State for Upcoming Appointment */
            <div className="mt-8 py-10 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <CalendarDays className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No upcoming appointments
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You have no consultations scheduled. Select from verified physicians and book a visit in seconds.
              </p>
              <button
                onClick={() => onOpenBooking()}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Quick Actions
            </h2>
            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => onOpenBooking()}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-100/60 dark:hover:bg-teal-950/50 border border-teal-200/60 dark:border-teal-800/40 text-teal-900 dark:text-teal-200 font-bold text-xs transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Book New Appointment</span>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-600 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onTabChange("doctors-clinics")}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <span>Find Doctor</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <Link
                href="/clinics"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span>Explore Partner Clinics</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <button
                onClick={() => onTabChange("medical-records")}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>View Medical Records</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenAddFamily}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Add Family Member</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <span>24/7 Digital Clinic Network Support Available</span>
          </div>
        </div>
      </div>

      {/* 4. Family Members Section Preview (One Account -> Multiple Profiles) */}
      <div className="rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Family Members &amp; Profiles
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              One account managing multiple isolated patient identities.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onTabChange("family")}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              View All
            </button>
            <button
              onClick={onOpenAddFamily}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProfiles.map((profile) => {
            const memberAppointments = appointments.filter(
              (a) => a.patientName.toLowerCase() === profile.name.toLowerCase()
            );

            return (
              <div
                key={profile.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-teal-400/60 transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {profile.name}
                        </h4>
                        {profile.isPrimary && (
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        )}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {profile.relation}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    {profile.age ? `${profile.age} yrs` : "Profile"}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {memberAppointments.length} appointment{memberAppointments.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => onOpenBooking()}
                    className="text-teal-600 dark:text-teal-400 font-bold hover:underline text-[11px] flex items-center gap-0.5"
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

      {/* 5. Lower Dual Column: Recent Medical Activity + Medical Records & Prescriptions Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Medical Activity Card */}
        <div className="rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Recent Medical Activity</span>
              </h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Timeline
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
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
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold whitespace-nowrap">
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

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => onTabChange("appointments")}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View Full Activity</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Medical Records & Prescriptions Preview */}
        <div className="rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Medical Records &amp; Prescriptions</span>
              </h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Clinical Docs
              </span>
            </div>

            {/* Clean, Future-Ready Safe Empty State */}
            <div className="mt-6 py-6 px-4 text-center rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                No medical records uploaded yet
              </h4>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Consultation summaries, laboratory investigations, and digital e-prescriptions will appear here automatically following your appointment checkup.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <button
              onClick={() => onTabChange("prescriptions")}
              className="text-slate-600 dark:text-slate-400 hover:text-teal-500 font-semibold"
            >
              Prescriptions (0)
            </button>
            <button
              onClick={() => onTabChange("medical-records")}
              className="text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>Explore Records Section</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

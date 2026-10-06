"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  MessageSquare,
  ShieldCheck,
  User,
  Eye,
  Filter,
} from "lucide-react";
import { AppointmentRecord, FamilyMemberRecord } from "@/lib/types/patient";

interface AppointmentsSectionProps {
  appointments: AppointmentRecord[];
  familyMembers: FamilyMemberRecord[];
  primaryPatientName: string;
  onOpenBooking: () => void;
  onViewDetail: (apt: AppointmentRecord) => void;
  onCancelAppointment: (id: string) => void;
  onToggleWhatsApp: (id: string) => void;
}

export default function AppointmentsSection({
  appointments,
  familyMembers,
  primaryPatientName,
  onOpenBooking,
  onViewDetail,
  onCancelAppointment,
  onToggleWhatsApp,
}: AppointmentsSectionProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "completed" | "cancelled">("all");
  const [profileFilter, setProfileFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Profiles list for filter
  const profileOptions = useMemo(() => {
    return [
      { id: "all", name: "All Family Profiles" },
      { id: "self", name: `${primaryPatientName} (Self)` },
      ...familyMembers.map((m) => ({
        id: m.id,
        name: `${m.name} (${m.relation})`,
      })),
    ];
  }, [primaryPatientName, familyMembers]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchStatus = statusFilter === "all" || apt.status === statusFilter;
      const matchProfile =
        profileFilter === "all" ||
        (profileFilter === "self" && (!apt.familyMemberId || apt.bookedByRelation === "self")) ||
        apt.familyMemberId === profileFilter;
      const matchSearch =
        searchQuery === "" ||
        apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.bookingRef.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStatus && matchProfile && matchSearch;
    });
  }, [appointments, statusFilter, profileFilter, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-5 animate-fadeInUp">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-bold uppercase tracking-wider mb-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Consultation Schedule</span>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Appointments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage upcoming visits, past records, and family checkup schedules.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm shadow-sky-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 overflow-x-auto self-start">
            {(
              [
                { id: "all", label: "All Visits" },
                { id: "confirmed", label: "Upcoming" },
                { id: "completed", label: "Completed" },
                { id: "cancelled", label: "Cancelled" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-bold shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Patient Profile Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Patient:
            </span>
            <select
              value={profileFilter}
              onChange={(e) => setProfileFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {profileOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search input within appointments */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor, specialty, clinic, or token reference..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="p-10 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-2.5">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No appointments found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              There are no appointments matching your selected filter. Book a visit or reset filters.
            </p>
            <button
              onClick={onOpenBooking}
              className="mt-3.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-sm shadow-sky-600/20 cursor-pointer"
            >
              Book New Appointment
            </button>
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const isConfirmed = apt.status === "confirmed";
            const isCancelled = apt.status === "cancelled";

            return (
              <div
                key={apt.id}
                className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-sky-400/60 dark:hover:border-sky-600/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3.5"
              >
                {/* Left Side: Doctor & Clinic details */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    {apt.doctorImage ? (
                      <Image
                        src={apt.doctorImage}
                        alt={apt.doctorName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {apt.doctorName}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          isConfirmed
                            ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"
                            : isCancelled
                            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                            : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold truncate">
                      {apt.doctorSpecialty}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{apt.clinicName}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Timing & Patient Name */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:flex md:flex-col gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 md:min-w-[200px]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Time Slot
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      <span>{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{apt.timeSlot}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Patient
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                      <User className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                      <span className="truncate">{apt.patientName}</span>
                    </div>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold uppercase">
                      ({apt.bookedByRelation})
                    </span>
                  </div>
                </div>

                {/* Right Side: Actions & WhatsApp status */}
                <div className="flex flex-col items-end justify-between gap-2.5 min-w-[140px]">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      PKR {apt.consultationFee.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ref: {apt.bookingRef}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* WhatsApp Toggle Button */}
                    <button
                      onClick={() => onToggleWhatsApp(apt.id)}
                      title="Toggle WhatsApp alert"
                      className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        apt.remindViaWhatsApp
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onViewDetail(apt)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Pass Details
                    </button>

                    {isConfirmed && (
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to cancel this appointment?")) {
                            onCancelAppointment(apt.id);
                          }
                        }}
                        className="px-2 py-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

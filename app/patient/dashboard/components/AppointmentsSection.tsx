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
      { id: primaryPatientName.toLowerCase(), name: `${primaryPatientName} (Self)` },
      ...familyMembers.map((m) => ({
        id: m.name.toLowerCase(),
        name: `${m.name} (${m.relation})`,
      })),
    ];
  }, [primaryPatientName, familyMembers]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchStatus = statusFilter === "all" || apt.status === statusFilter;
      const matchProfile =
        profileFilter === "all" || apt.patientName.toLowerCase() === profileFilter.toLowerCase();
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
    <div className="space-y-6 animate-fadeInUp">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold mb-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Consultation Schedule</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            My Appointments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage upcoming visits, past records, and family checkup schedules.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 overflow-x-auto self-start">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? "bg-white dark:bg-[#0B1426] text-teal-600 dark:text-teal-400 shadow-xs"
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
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20"
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
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor, specialty, clinic, or reference number..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No appointments found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              There are no appointments matching your selected filter. Book a visit or clear filters.
            </p>
            <button
              onClick={onOpenBooking}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
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
                className="p-5 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-400/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Side: Doctor & Clinic details */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 relative flex-shrink-0">
                    {apt.doctorImage ? (
                      <Image
                        src={apt.doctorImage}
                        alt={apt.doctorName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {apt.doctorName}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isConfirmed
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : isCancelled
                            ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                      {apt.doctorSpecialty}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.clinicName}</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Timing & Patient Name */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:flex md:flex-col gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 md:min-w-[210px]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Slot
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-500" />
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
                <div className="flex flex-col items-end justify-between gap-3 min-w-[140px]">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      PKR {apt.consultationFee.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ref: {apt.bookingRef}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* WhatsApp Toggle Button */}
                    <button
                      onClick={() => onToggleWhatsApp(apt.id)}
                      title="Toggle WhatsApp alert"
                      className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        apt.remindViaWhatsApp
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onViewDetail(apt)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      Pass
                    </button>

                    {isConfirmed && (
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to cancel this appointment?")) {
                            onCancelAppointment(apt.id);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
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

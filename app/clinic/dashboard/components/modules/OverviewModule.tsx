"use client";

import React, { useState } from "react";
import {
  Users,
  CalendarDays,
  CreditCard,
  Clock,
  CheckCircle2,
  Stethoscope,
  FlaskConical,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  Search,
  Eye,
  Ticket,
  Pill,
  Sparkles,
} from "lucide-react";
import {
  DashboardPatient,
  DashboardAppointment,
  DashboardQueueItem,
  DashboardDoctor,
  DashboardMedicine,
  DashboardLabOrder,
  DashboardInvoice,
  DashboardActivityLog,
  DashboardNavModule,
} from "../../types";

interface OverviewModuleProps {
  patients: DashboardPatient[];
  appointments: DashboardAppointment[];
  queue: DashboardQueueItem[];
  doctors: DashboardDoctor[];
  medicines: DashboardMedicine[];
  labOrders: DashboardLabOrder[];
  invoices: DashboardInvoice[];
  activityLogs: DashboardActivityLog[];
  onNavigate: (module: DashboardNavModule) => void;
  onCallNextQueue: (id: string) => void;
  onCheckInAppointment: (id: string) => void;
  onOpenNewAppointment: () => void;
  onOpenQuickPatient: () => void;
  onOpenGenerateToken: () => void;
  onOpenCreateInvoice: () => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  patients,
  appointments,
  queue,
  doctors,
  medicines,
  labOrders,
  invoices,
  activityLogs,
  onNavigate,
  onCallNextQueue,
  onCheckInAppointment,
  onOpenNewAppointment,
  onOpenQuickPatient,
  onOpenGenerateToken,
  onOpenCreateInvoice,
}) => {
  const [revenueRange, setRevenueRange] = useState<"today" | "7days" | "30days">("today");
  const [appointmentSearch, setAppointmentSearch] = useState("");

  // Computed metrics
  const waitingPatients = queue.filter((q) => q.status === "waiting" || q.status === "called");
  const currentInConsultation = queue.find((q) => q.status === "in-consultation");
  const completedToday = appointments.filter((a) => a.status === "completed").length;
  const activeDoctorsCount = doctors.filter((d) => d.status !== "Off Duty").length;
  const pendingLabsCount = labOrders.filter((l) => l.resultStatus !== "Verified" && l.resultStatus !== "Delivered").length;
  
  const todayRevenue = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const pendingPayments = invoices.reduce((acc, inv) => acc + inv.balanceAmount, 0);

  // Low stock medicines
  const lowStockMeds = medicines.filter(
    (m) => m.stockStatus === "low_stock" || m.stockStatus === "out_of_stock" || m.stockStatus === "expiring_soon"
  );

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.patientName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.bookingRef.toLowerCase().includes(appointmentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. PRIMARY 8 STATISTICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Registered Patients */}
        <div
          onClick={() => onNavigate("patients")}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Patients
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">
            {patients.length + 320}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14 this week</span>
          </div>
        </div>

        {/* Card 2: Today's Appointments */}
        <div
          onClick={() => onNavigate("appointments")}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today's Appts
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">
            {appointments.length}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-600 dark:text-sky-400 mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{waitingPatients.length} in queue</span>
          </div>
        </div>

        {/* Card 3: Today's Revenue */}
        <div
          onClick={() => onNavigate("billing")}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today's Income
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">
            <span className="text-base font-bold text-slate-400 mr-1">Rs.</span>
            {todayRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cash counter reconciled</span>
          </div>
        </div>

        {/* Card 4: Patients Waiting */}
        <div
          onClick={() => onNavigate("queue")}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Waiting in OPD
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">
            {waitingPatients.length}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Avg. wait ~14 mins</span>
          </div>
        </div>

        {/* Card 5: Completed Consultations */}
        <div
          onClick={() => onNavigate("clinical")}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completed Visits
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            {completedToday + 12}
          </div>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
            Prescriptions issued
          </span>
        </div>

        {/* Card 6: Active Doctors */}
        <div
          onClick={() => onNavigate("doctors")}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Doctors on Duty
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            {activeDoctorsCount} / {doctors.length}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
            Rooms 101, 104, 107 active
          </span>
        </div>

        {/* Card 7: Pending Lab Tests */}
        <div
          onClick={() => onNavigate("laboratory")}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Lab Tests
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            {pendingLabsCount}
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-1 block">
            Specimens processing
          </span>
        </div>

        {/* Card 8: Pending Payments */}
        <div
          onClick={() => onNavigate("billing")}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Invoices
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            <span className="text-base font-bold text-slate-400 mr-1">Rs.</span>
            {pendingPayments.toLocaleString()}
          </div>
          <span className="text-[11px] text-rose-500 font-bold mt-1 block">
            1 unpaid lab invoice
          </span>
        </div>
      </div>

      {/* 2. LIVE OPD QUEUE MONITOR (HIGHLIGHT SECTION) */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                Live OPD Desk
              </span>
              <span className="text-xs text-slate-300 font-medium">Real-Time Waiting Lounge</span>
            </div>
            <h2 className="text-lg font-black tracking-tight text-white">
              Current Patient Token & Active Consultations
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenGenerateToken}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>+ Issue Token</span>
            </button>

            <button
              onClick={() => onNavigate("queue")}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Full Queue ({queue.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Current Call vs Next in Queue grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 relative z-10">
          {/* Box 1: Currently In Consultation Room */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block mb-2">
              Inside Consultation Room
            </span>
            {currentInConsultation ? (
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black font-mono text-emerald-400">
                    Token #{currentInConsultation.tokenNo}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    In Room
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-extrabold text-white block">
                    {currentInConsultation.patientName}
                  </span>
                  <span className="text-xs text-slate-300 block">
                    {currentInConsultation.doctorName} • {currentInConsultation.room}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-3">No patient currently in room.</div>
            )}
          </div>

          {/* Box 2: Next Patient To Be Called */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-2">
              Next In Line (Waiting)
            </span>
            {waitingPatients[0] ? (
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black font-mono text-amber-400">
                    Token #{waitingPatients[0].tokenNo}
                  </span>
                  <button
                    onClick={() => onCallNextQueue(waitingPatients[0].id)}
                    className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Call In
                  </button>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-extrabold text-white block">
                    {waitingPatients[0].patientName}
                  </span>
                  <span className="text-xs text-slate-300 block">
                    For {waitingPatients[0].doctorName} ({waitingPatients[0].room})
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-3">All waiting patients cleared.</div>
            )}
          </div>

          {/* Box 3: Quick Queue Summary */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Waiting Lounge Status
            </span>
            <div className="grid grid-cols-2 gap-2 my-2 text-center">
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-xl font-black font-mono text-white block">
                  {waitingPatients.length}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Waiting</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-xl font-black font-mono text-emerald-400 block">
                  {completedToday}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Done Today</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 text-center block">
              Average consultation: 12 minutes
            </span>
          </div>
        </div>
      </div>

      {/* 3. TODAY'S APPOINTMENTS TABLE & REVENUE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Appointments Table (2 Columns) */}
        <div className="lg:col-span-2 rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Today's Bookings & OPD Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Live appointments synced with public portal & walk-ins
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={appointmentSearch}
                  onChange={(e) => setAppointmentSearch(e.target.value)}
                  placeholder="Search patient or doctor..."
                  className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <button
                onClick={onOpenNewAppointment}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>+ Book</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                  <th className="py-2.5 pr-2">Token / Ref</th>
                  <th className="py-2.5">Patient Details</th>
                  <th className="py-2.5">Doctor & Room</th>
                  <th className="py-2.5">Time</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.slice(0, 5).map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 pr-2">
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                          {apt.tokenNo ? `#${apt.tokenNo}` : apt.bookingRef}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {apt.patientName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {apt.patientPhone}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-800 dark:text-slate-200 block font-semibold">
                          {apt.doctorName}
                        </span>
                        <span className="text-[11px] text-slate-400">{apt.room || "Room 101"}</span>
                      </td>
                      <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                        {apt.timeSlot}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {apt.type}
                        </span>
                      </td>
                      <td className="py-3">
                        {apt.status === "in-consultation" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                            In Room
                          </span>
                        )}
                        {apt.status === "arrived" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            Waiting
                          </span>
                        )}
                        {apt.status === "scheduled" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                            Scheduled
                          </span>
                        )}
                        {apt.status === "completed" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Completed
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {apt.status === "scheduled" ? (
                          <button
                            onClick={() => onCheckInAppointment(apt.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-400 cursor-pointer"
                          >
                            Check-in
                          </button>
                        ) : (
                          <button
                            onClick={() => onNavigate("appointments")}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400 text-xs">
                      No appointments matching search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Revenue Breakdown Card */}
        <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Financial Breakdown
            </h3>
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-bold">
              <button
                onClick={() => setRevenueRange("today")}
                className={`px-2 py-1 rounded-lg cursor-pointer ${
                  revenueRange === "today" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setRevenueRange("7days")}
                className={`px-2 py-1 rounded-lg cursor-pointer ${
                  revenueRange === "7days" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
                }`}
              >
                7 Days
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
              Total Collections Recorded
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              PKR {todayRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              100% reconciled across cash & POS
            </span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div>
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-300">OPD Consultation Fees</span>
                <span className="font-mono text-slate-900 dark:text-white">PKR 7,500</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: "65%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Pharmacy Medicine POS</span>
                <span className="font-mono text-slate-900 dark:text-white">PKR 2,450</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: "22%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Diagnostic Laboratory</span>
                <span className="font-mono text-slate-900 dark:text-white">PKR 1,450</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "13%" }} />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("billing")}
            className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Cash Register & Invoices</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. DOCTORS ON DUTY STRIP & IMPORTANT ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctors On Duty (2 Columns) */}
        <div className="lg:col-span-2 rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Active Medical Specialists
              </h3>
              <p className="text-xs text-slate-500">Live consultation status and assigned rooms</p>
            </div>
            <button
              onClick={() => onNavigate("doctors")}
              className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
            >
              Full Roster →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 flex items-start gap-3.5"
              >
                <div className="w-11 h-11 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-sm shrink-0">
                  {doc.name.replace("Dr. ", "").charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {doc.name}
                    </h4>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                      {doc.room}
                    </span>
                  </div>
                  <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold truncate block">
                    {doc.specialization}
                  </span>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {doc.shifts}
                    </span>
                    <span
                      className={`font-bold ${
                        doc.status === "In Consultation"
                          ? "text-sky-600 dark:text-sky-400"
                          : doc.status === "Available"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-400"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Alerts & Recent Activity (1 Column) */}
        <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Actionable Alerts ({lowStockMeds.length + 1})
          </h3>

          <div className="space-y-2.5 text-xs">
            {lowStockMeds.slice(0, 2).map((med) => (
              <div
                key={med.id}
                className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    {med.name}
                  </span>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 block">
                    Only {med.quantity} {med.unit} left (Reorder: {med.reorderLevel})
                  </span>
                </div>
                <button
                  onClick={() => onNavigate("pharmacy")}
                  className="text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline shrink-0"
                >
                  Restock
                </button>
              </div>
            ))}

            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 flex items-start gap-2.5">
              <FlaskConical className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="font-extrabold text-slate-900 dark:text-white block">
                  1 Lab Test Pending Verification
                </span>
                <span className="text-[11px] text-indigo-700 dark:text-indigo-400 block">
                  CBC for Muhammad Usman awaiting pathologist signature.
                </span>
              </div>
              <button
                onClick={() => onNavigate("laboratory")}
                className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:underline shrink-0"
              >
                Verify
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Recent Activity Feed
            </span>
            <div className="space-y-2 text-[11px]">
              {activityLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-center justify-between text-slate-500">
                  <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                    {log.details}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

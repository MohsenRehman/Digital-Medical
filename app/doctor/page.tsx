"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Building2,
  Play,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useDoctor } from "@/app/context/DoctorContext";
import DoctorKpiCards from "@/components/doctor/DoctorKpiCards";
import LiveQueueCard from "@/components/doctor/LiveQueueCard";
import AppointmentTable from "@/components/doctor/AppointmentTable";

export default function DoctorDashboardOverview() {
  const router = useRouter();
  const { doctor, activeClinic, doctorStatus, currentQueuePatient, waitingQueue } = useDoctor();

  const handleStartConsultation = () => {
    if (currentQueuePatient) {
      router.push(`/doctor/consultations/${currentQueuePatient.appointmentId}`);
    } else if (waitingQueue.length > 0) {
      router.push(`/doctor/consultations/${waitingQueue[0].appointmentId}`);
    } else {
      router.push("/doctor/queue");
    }
  };

  const statusLabel = {
    available: "Available",
    in_consultation: "In Consultation",
    on_break: "On Break",
    offline: "Offline",
  }[doctorStatus];

  const statusDot = {
    available: "bg-emerald-500",
    in_consultation: "bg-amber-500",
    on_break: "bg-blue-500",
    offline: "bg-slate-400",
  }[doctorStatus];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <section className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 text-white shadow-lg relative overflow-hidden">
        {/* Background decorative medical shapes */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-80 h-80 rounded-full border-8 border-white transform translate-x-20" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-xs text-white border border-white/20">
                Cardiology Department
              </span>
              <span className="text-sky-100 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Thursday, 24 September 2026
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Good morning, {doctor.name.split(" ")[0]} {doctor.name.split(" ")[1]}
            </h1>
            <p className="text-sm text-sky-100 max-w-xl">
              Here&apos;s your clinical schedule for today. You have{" "}
              <span className="font-bold underline decoration-sky-300">
                {waitingQueue.length} patients waiting
              </span>{" "}
              in the reception lounge.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-sky-100">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-300" />
                <span>
                  Clinic: <strong className="text-white">{activeClinic.name} — {activeClinic.city}</strong> ({activeClinic.roomNumber})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${statusDot} ring-2 ring-white/30`} />
                <span>
                  Status: <strong className="text-white">{statusLabel}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Contextual Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleStartConsultation}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-sky-50 text-sky-800 font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 group"
            >
              <Play className="w-4 h-4 text-sky-600 fill-current group-hover:scale-110 transition-transform" />
              <span>
                {currentQueuePatient
                  ? `Resume Token ${currentQueuePatient.tokenNumber}`
                  : waitingQueue.length > 0
                  ? `Start Consultation (${waitingQueue[0].tokenNumber})`
                  : "Start Consultation"}
              </span>
            </button>
            <Link
              href="/doctor/queue"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 border border-white/20 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Manage Queue</span>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section>
        <DoctorKpiCards />
      </section>

      {/* Live Patient Queue */}
      <section>
        <LiveQueueCard />
      </section>

      {/* Today's Appointments List */}
      <section>
        <AppointmentTable limit={6} />
      </section>
    </div>
  );
}
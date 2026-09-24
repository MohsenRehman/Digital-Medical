"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  CalendarDays,
  Pill,
  CreditCard,
  CheckCircle2,
  Clock,
  LogOut,
  Stethoscope,
  Activity,
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  Receipt,
  Plus,
  Search,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useClinicAuth } from "@/app/context/ClinicAuthContext";
import { usePatientAuth } from "@/app/context/PatientAuthContext";

export default function ClinicDashboardPage() {
  const router = useRouter();
  const { application, clinicUser, clinicLogout, isLoaded } = useClinicAuth();
  const { appointments } = usePatientAuth();

  const [activeTab, setActiveTab] = useState<"appointments" | "doctors" | "pharmacy" | "billing">("appointments");

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // If application is not approved yet, redirect to status screen
  if (!application || application.status !== "approved") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Account Under Verification</h1>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          Your clinic application is currently being verified by the admin team.
        </p>
        <Link
          href="/clinic/status"
          className="px-6 py-3 rounded-full bg-sky-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-sky-500 transition-all shadow-md"
        >
          Check Application Status
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    clinicLogout();
    router.push("/");
  };

  const isPharmacyActive = application.pharmacyIncluded;

  // Mock doctors list for this clinic
  const clinicDoctors = [
    {
      id: "doc-1",
      name: application.ownerFullName || "Dr. Tariq Mahmood",
      speciality: application.speciality || "Chief Physician",
      room: "Room 101",
      shifts: "09:00 AM - 02:00 PM",
      status: "Available",
    },
    {
      id: "doc-2",
      name: "Dr. Ayesha Malik",
      speciality: "Consultant Pediatrician",
      room: "Room 104",
      shifts: "02:00 PM - 08:00 PM",
      status: "In Consultation",
    },
    {
      id: "doc-3",
      name: "Dr. Hamza Siddiqui",
      speciality: "Cardiologist",
      room: "Room 202",
      shifts: "05:00 PM - 09:00 PM",
      status: "Off Duty",
    },
  ];

  // Pharmacy mock inventory
  const pharmacyStock = [
    { name: "Augmentin 625mg (GlaxoSmithKline)", stock: "142 Packs", expiry: "Dec 2027", alert: "normal" },
    { name: "Panadol Extra Paracetamol 500mg", stock: "480 Strips", expiry: "Aug 2028", alert: "normal" },
    { name: "Softin 10mg Loratadine", stock: "18 Packs", expiry: "Nov 2026", alert: "low_stock" },
    { name: "Lipiget 20mg Atorvastatin", stock: "65 Packs", expiry: "Oct 2026", alert: "expiring_soon" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Top Clinic Nav */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Clinic Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-teal-400 text-white flex items-center justify-center shadow-sm">
                <HeartPulse className="w-5 h-5" />
              </div>
            </Link>
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                  {application.clinicName}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {application.city} • Plan: <strong className="uppercase">{application.plan}</strong>
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white hidden md:inline"
            >
              Public Website
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Doctors</span>
              <Stethoscope className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {clinicDoctors.length}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              All slots active today
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Today's Visits</span>
              <CalendarDays className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {appointments.length > 0 ? appointments.length : 8}
            </div>
            <span className="text-[11px] text-sky-600 font-semibold mt-0.5 block">
              3 In Queue • 5 Scheduled
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Monthly Patients</span>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">324</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18% this month
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Pharmacy Status</span>
              <Pill className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-2">
              {isPharmacyActive ? "Active POS" : "Not Enabled"}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
              {isPharmacyActive ? "Synced with doctors" : "Available to add"}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "appointments"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Patient Appointments Queue</span>
          </button>

          <button
            onClick={() => setActiveTab("doctors")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "doctors"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors & Timings</span>
          </button>

          <button
            onClick={() => setActiveTab("pharmacy")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "pharmacy"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Pharmacy POS Suite {isPharmacyActive && "• Live"}</span>
          </button>

          <button
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "billing"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscription & Plan</span>
          </button>
        </div>

        {/* Tab 1: Appointments Queue */}
        {activeTab === "appointments" && (
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Today's Patient Queue
                </h3>
                <p className="text-xs text-slate-500">Real-time appointments booked through Digital Medical network.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search patient name..."
                    className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <div key={apt.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs">
                        {apt.patientName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {apt.patientName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {apt.date} • {apt.timeSlot} • For {apt.bookedByRelation}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        Rs. {apt.consultationFee}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No active patient appointments in queue right now. New online bookings will show up here automatically.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Doctors & Timings */}
        {activeTab === "doctors" && (
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Clinic Specialists & Roaster
                </h3>
                <p className="text-xs text-slate-500">Consultation rooms and shift schedules.</p>
              </div>
              <button className="px-3.5 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Doctor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {clinicDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{doc.name}</h4>
                      <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                        {doc.speciality}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {doc.room}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.shifts}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-emerald-600 font-semibold">{doc.status}</span>
                    <button className="text-sky-600 hover:underline font-bold text-[11px]">
                      Edit Timings
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Pharmacy POS Suite */}
        {activeTab === "pharmacy" && (
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {isPharmacyActive ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 uppercase tracking-wider mb-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Live Pharmacy POS Enabled
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Pharmacy Stock & Prescription Sync
                    </h3>
                  </div>

                  <button className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Sale / Dispense</span>
                  </button>
                </div>

                {/* Stock Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5">Medicine Name</th>
                        <th className="py-2.5">In Stock</th>
                        <th className="py-2.5">Expiry Date</th>
                        <th className="py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {pharmacyStock.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                            {item.name}
                          </td>
                          <td className="py-3 font-semibold text-slate-600 dark:text-slate-300">
                            {item.stock}
                          </td>
                          <td className="py-3 font-mono text-slate-500">{item.expiry}</td>
                          <td className="py-3">
                            {item.alert === "normal" && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                In Stock
                              </span>
                            )}
                            {item.alert === "low_stock" && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                Low Stock
                              </span>
                            )}
                            {item.alert === "expiring_soon" && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                                Expiry Alert
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="p-8 text-center max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-500 flex items-center justify-center mx-auto">
                  <Pill className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    Pharmacy Suite Not Active
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    You opted out of the pharmacy module during registration. You can activate it anytime for Rs. 3,500/month.
                  </p>
                </div>
                <button className="px-6 py-3 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-600/25 transition-all">
                  Upgrade & Add Pharmacy Module
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Subscription & Billing */}
        {activeTab === "billing" && (
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Subscription & Invoices
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Current Plan
                </span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white uppercase mt-1 block">
                  {application.plan} Plan
                </span>
                <span className="text-xs text-sky-600 font-semibold mt-0.5 block">
                  Rs. {application.totalMonthlyAmount.toLocaleString()} / mo
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Payment Status
                </span>
                <span className="text-lg font-extrabold text-emerald-600 mt-1 block">
                  Verified & Active
                </span>
                <span className="text-xs text-slate-500 mt-0.5 block font-mono">
                  Ref: {application.paymentProof.transactionId}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Invoice Receipt
                </span>
                <button className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Download Activation Receipt</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

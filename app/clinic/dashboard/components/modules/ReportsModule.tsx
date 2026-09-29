"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  Activity,
  Printer,
  ChevronDown,
} from "lucide-react";
import { DashboardDoctor, DashboardInvoice } from "../../types";

interface ReportsModuleProps {
  invoices: DashboardInvoice[];
  doctors: DashboardDoctor[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({ invoices, doctors }) => {
  const [reportPeriod, setReportPeriod] = useState<"this_month" | "last_month" | "quarter">("this_month");

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0) + 142000;
  const opdRevenue = Math.round(totalRevenue * 0.62);
  const rxRevenue = Math.round(totalRevenue * 0.24);
  const labRevenue = totalRevenue - opdRevenue - rxRevenue;

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Doctor,Department,Monthly Patients,Consultation Revenue",
        ...doctors.map(
          (d) => `${d.name},${d.department},${d.monthlyPatients},${d.monthlyPatients * d.consultationFee}`
        ),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clinic_financial_report_${reportPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & EXPORT */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Clinic Operational & Financial Analytics
          </h3>
          <p className="text-xs text-slate-500">
            Exportable business intelligence, OPD footfall trends, and revenue insights
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="this_month">This Month (September 2024)</option>
            <option value="last_month">Last Month (August 2024)</option>
            <option value="quarter">Q3 2024 (July - Sept)</option>
          </select>

          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. REVENUE STREAMS BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Revenue Stream Distribution
            </h4>
            <span className="text-xs font-mono font-bold text-emerald-600">
              Total: PKR {totalRevenue.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Doctor OPD (62%)
              </span>
              <span className="text-base font-black text-sky-600 dark:text-sky-400 font-mono mt-1 block">
                PKR {opdRevenue.toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Pharmacy POS (24%)
              </span>
              <span className="text-base font-black text-teal-600 dark:text-teal-400 font-mono mt-1 block">
                PKR {rxRevenue.toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Diagnostic Lab (14%)
              </span>
              <span className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1 block">
                PKR {labRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div className="bg-sky-500 h-full" style={{ width: "62%" }} title="OPD Fees 62%" />
            <div className="bg-teal-500 h-full" style={{ width: "24%" }} title="Pharmacy 24%" />
            <div className="bg-indigo-500 h-full" style={{ width: "14%" }} title="Laboratory 14%" />
          </div>

          <div className="pt-2 text-[11px] text-slate-500">
            Average patient revenue per visit: <strong>PKR 3,450</strong> (Consultation + Medicines)
          </div>
        </div>

        {/* Peak OPD Hours Card */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Peak OPD Rush Hours
          </h4>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Morning Rush (10:00 AM - 01:00 PM)</span>
                <span className="font-mono text-sky-600">68% Load</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: "68%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Evening Rush (06:00 PM - 09:00 PM)</span>
                <span className="font-mono text-teal-600">84% Load</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: "84%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Afternoon Lull (02:00 PM - 05:00 PM)</span>
                <span className="font-mono text-slate-400">22% Load</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400" style={{ width: "22%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DOCTOR PERFORMANCE LEADERBOARD */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Consultant Doctor Volume & Financial Contributions
          </h4>
          <span className="text-xs text-slate-400">Based on verified completed consultations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
              <tr>
                <th className="py-3 px-4">Specialist Doctor</th>
                <th className="py-3 px-3">Specialty</th>
                <th className="py-3 px-3">Monthly Visits</th>
                <th className="py-3 px-3">OPD Consultation Fee</th>
                <th className="py-3 px-3">Gross Collections</th>
                <th className="py-3 px-4 text-right">Satisfaction Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {doctors.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {doc.name}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{doc.specialization}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {doc.monthlyPatients} Patients
                  </td>
                  <td className="py-3.5 px-3 font-mono">PKR {doc.consultationFee.toLocaleString()}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-600">
                    PKR {(doc.monthlyPatients * doc.consultationFee).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-amber-500">
                    ★ {doc.rating} / 5.0
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

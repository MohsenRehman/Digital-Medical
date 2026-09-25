"use client";

import React, { useState } from "react";
import { appointments } from "../data/mockData";
import { Search, Calendar } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.clinic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Platform-wide appointment overview.</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {["Today's Appointments", "Upcoming Appointments", "Completed", "Cancelled"].map((title, i) => (
          <motion.div variants={item} key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{Math.floor(Math.random() * 50) + 10}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by patient, doctor, or clinic..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Clinic</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <motion.tbody variants={container} initial="hidden" animate="show" className="divide-y divide-gray-100">
              {filteredAppointments.map(appointment => (
                <motion.tr variants={item} key={appointment.id} className="hover:bg-gray-50 dark:bg-gray-800 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100 group-hover:text-[#0ea5e9]">
                    {appointment.patient}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{appointment.doctor}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{appointment.clinic}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{appointment.date}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{appointment.time}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{appointment.type}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                      {
                        "bg-blue-100 text-blue-800": appointment.status === "Scheduled",
                        "bg-emerald-100 text-emerald-800": appointment.status === "Completed",
                        "bg-red-100 text-red-800": appointment.status === "Cancelled",
                      }
                    )}>
                      {appointment.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {filteredAppointments.length === 0 && (
                <motion.tr variants={item}>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No appointments found.</td>
                </motion.tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}


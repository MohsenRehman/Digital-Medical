"use client";

import React, { useState } from "react";
import { doctors } from "../data/mockData";
import { Search, Stethoscope } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.clinic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctors</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all doctors across clinics.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          + Add Doctor
        </motion.button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, specialization, or clinic..." 
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
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Doctor Name</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Clinic</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Patients</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-gray-100"
            >
              {filteredDoctors.map(doctor => (
                <motion.tr 
                  variants={itemVariants}
                  key={doctor.id} 
                  className="hover:bg-gray-50 dark:bg-gray-800 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100 group-hover:text-[#0ea5e9] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                      <Stethoscope size={16} />
                    </div>
                    {doctor.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{doctor.specialization}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{doctor.clinic}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{doctor.experience}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{doctor.patients.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                      {
                        "bg-emerald-100 text-emerald-800": doctor.status === "Active",
                        "bg-[#f8f9fa] dark:bg-gray-900mber-100 text-amber-800": doctor.status === "On Leave",
                        "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100": doctor.status === "Inactive",
                      }
                    )}>
                      {doctor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{doctor.joinedDate}</td>
                </motion.tr>
              ))}
              {filteredDoctors.length === 0 && (
                <motion.tr variants={itemVariants}>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No doctors found.</td>
                </motion.tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}


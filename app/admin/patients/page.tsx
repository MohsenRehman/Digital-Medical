"use client";

import React, { useState } from "react";
import { patients } from "../data/mockData";
import { Search, User, Plus } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patients</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all registered patients across clinics.</p>
        </motion.div>
        <motion.button 
          variants={item}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-[#059669] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#047857] transition-colors"
        >
          <Plus size={16} />
          <span>Add Patient</span>
        </motion.button>
      </div>

      <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, clinic, or doctor..." 
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
              <option value="In Treatment">In Treatment</option>
              <option value="Recovered">Recovered</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Gender & Age</th>
                <th className="px-6 py-4">Clinic</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Last Visit</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map(patient => (
                <motion.tr 
                  variants={item}
                  key={patient.id} 
                  className="hover:bg-gray-50 dark:bg-gray-800 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100 group-hover:text-[#0ea5e9] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{patient.gender}, {patient.age}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{patient.clinic}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{patient.doctor}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{patient.lastVisit}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                      {
                        "bg-emerald-100 text-emerald-800": patient.status === "Recovered",
                        "bg-blue-100 text-blue-800": patient.status === "Active",
                        "bg-[#f8f9fa] dark:bg-gray-900mber-100 text-amber-800": patient.status === "In Treatment",
                      }
                    )}>
                      {patient.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {filteredPatients.length === 0 && (
                <motion.tr variants={item}>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No patients found.</td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}


"use client";

import React, { useState, useMemo } from "react";
import { clinics, Clinic } from "../data/mockData";
import { useSearch } from "./SearchContext";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export default function ClinicOverview() {
  const { searchTerm } = useSearch();
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      const matchSearch =
        clinic.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.status.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "All" || clinic.status === statusFilter;
      const matchPlan = planFilter === "All Plans" || clinic.plan === planFilter;

      return matchSearch && matchStatus && matchPlan;
    });
  }, [searchTerm, statusFilter, planFilter]);

  const closeDetails = () => setSelectedClinic(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Clinic Overview</h3>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
          >
            <option value="All Plans">All Plans</option>
            <option value="Basic">Basic</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4">Clinic</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Doctors</th>
              <th className="px-6 py-4">Staff</th>
              <th className="px-6 py-4">Patients</th>
              <th className="px-6 py-4">Plan</th>
            </tr>
          </thead>
          <motion.tbody 
            className="divide-y divide-gray-100"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {filteredClinics.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No clinics found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredClinics.map((clinic) => (
                <motion.tr
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic)}
                  className="hover:bg-gray-50 dark:bg-gray-800 transition-colors cursor-pointer group"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100 group-hover:text-[#0ea5e9] transition-colors">
                    {clinic.clinic}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                        {
                          "bg-emerald-100 text-emerald-800": clinic.status === "Active",
                          "bg-[#f8f9fa] dark:bg-gray-900mber-100 text-amber-800": clinic.status === "Pending",
                          "bg-red-100 text-red-800": clinic.status === "Suspended",
                        }
                      )}
                    >
                      {clinic.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{clinic.doctors}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{clinic.staff}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {clinic.patients.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{clinic.plan}</td>
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>
      </div>

      {/* Clinic Details Drawer/Modal */}
      <AnimatePresence>
        {selectedClinic && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.97, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Clinic Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                    Clinic Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">{selectedClinic.clinic}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">{selectedClinic.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                      <span
                        className={clsx(
                          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1",
                          {
                            "bg-emerald-100 text-emerald-800": selectedClinic.status === "Active",
                            "bg-[#f8f9fa] dark:bg-gray-900mber-100 text-amber-800": selectedClinic.status === "Pending",
                            "bg-red-100 text-red-800": selectedClinic.status === "Suspended",
                          }
                        )}
                      >
                        {selectedClinic.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                    Organization Overview
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Doctors</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{selectedClinic.doctors}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Staff</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{selectedClinic.staff}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Patients</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{selectedClinic.patients.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
                    Subscription
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Plan</p>
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">{selectedClinic.plan}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                      <p className="font-medium text-emerald-600 text-sm">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={closeDetails}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Suspend Clinic
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#0ea5e9] hover:bg-[#0284c7] transition-colors"
                >
                  View Clinic
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



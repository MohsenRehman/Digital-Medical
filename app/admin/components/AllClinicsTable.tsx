"use client";

import React, { useState, useMemo } from "react";
import { clinics, Clinic } from "../data/mockData";
import { useSearch } from "./SearchContext";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, Ban } from "lucide-react";

export default function AllClinicsTable() {
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
    <div className="bg-white dark:bg-[#131315] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-50">All Clinics</h3>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-700 text-slate-700 dark:text-zinc-200"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-sm bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-700 text-slate-700 dark:text-zinc-200"
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
          <thead className="bg-slate-50 dark:bg-zinc-900/50 text-slate-500 dark:text-zinc-400 font-medium border-b border-slate-200 dark:border-zinc-800">
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
            className="divide-y divide-zinc-800/50"
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
                <td colSpan={6} className="px-6 py-8 text-center text-slate-800 dark:text-zinc-500">
                  No clinics found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredClinics.map((clinic) => (
                <motion.tr
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic)}
                  className="hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-zinc-200 group-hover:text-emerald-500 transition-colors">
                    {clinic.clinic}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
                        {
                          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20": clinic.status === "Active",
                          "bg-amber-500/10 text-amber-500 border-amber-500/20": clinic.status === "Pending",
                          "bg-red-500/10 text-red-500 border-red-500/20": clinic.status === "Suspended",
                        }
                      )}
                    >
                      {clinic.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-zinc-400">{clinic.doctors}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-zinc-400">{clinic.staff}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-zinc-400">
                    {clinic.patients.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-zinc-400">{clinic.plan}</td>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.97, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-[#18181b] rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-zinc-800"
            >
              <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-50">Clinic Details</h2>
                <button onClick={closeDetails} className="text-slate-800 dark:text-zinc-500 hover:text-slate-600 dark:text-zinc-300 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-100 mb-3 border-b border-slate-200 dark:border-zinc-800 pb-2">
                    Clinic Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-800 dark:text-zinc-500">Name</p>
                      <p className="font-medium text-slate-700 dark:text-zinc-200 text-sm">{selectedClinic.clinic}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-800 dark:text-zinc-500">Location</p>
                      <p className="font-medium text-slate-700 dark:text-zinc-200 text-sm">{selectedClinic.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-800 dark:text-zinc-500">Status</p>
                      <span
                        className={clsx(
                          "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold mt-1 border",
                          {
                            "bg-emerald-500/10 text-emerald-500 border-emerald-500/20": selectedClinic.status === "Active",
                            "bg-amber-500/10 text-amber-500 border-amber-500/20": selectedClinic.status === "Pending",
                            "bg-red-500/10 text-red-500 border-red-500/20": selectedClinic.status === "Suspended",
                          }
                        )}
                      >
                        {selectedClinic.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-100 mb-3 border-b border-slate-200 dark:border-zinc-800 pb-2">
                    Organization Overview
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-800 dark:text-zinc-500">Doctors</p>
                      <p className="font-medium text-slate-700 dark:text-zinc-200">{selectedClinic.doctors}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-800 dark:text-zinc-500">Staff</p>
                      <p className="font-medium text-slate-700 dark:text-zinc-200">{selectedClinic.staff}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-800 dark:text-zinc-500">Patients</p>
                      <p className="font-medium text-slate-700 dark:text-zinc-200">{selectedClinic.patients.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-100 mb-3 border-b border-slate-200 dark:border-zinc-800 pb-2">
                    Subscription
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-800 dark:text-zinc-500">Plan</p>
                      <p className="font-medium text-slate-700 dark:text-zinc-200 text-sm">{selectedClinic.plan}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-800 dark:text-zinc-500">Status</p>
                      <p className="font-medium text-emerald-500 text-sm">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-200 dark:border-zinc-800 flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={closeDetails}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center gap-1.5"
                >
                  <Ban size={16} />
                  Suspend
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white dark:text-zinc-950 bg-emerald-500 hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Eye size={16} />
                  View
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



"use client";

import React, { useState } from "react";
import { pendingRegistrations, Clinic } from "../data/mockData";
import clsx from "clsx";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, XCircle, CheckCircle, Eye, ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function PendingRegistrations() {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [clinics, setClinics] = useState(pendingRegistrations);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleReview = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  const closeReview = () => {
    setSelectedClinic(null);
  };

  const handleApprove = () => {
    if (selectedClinic) {
      setClinics(clinics.filter((c) => c.id !== selectedClinic.id));
      setNotification({ message: "Clinic approved successfully", type: "success" });
      setTimeout(() => setNotification(null), 3000);
      closeReview();
    }
  };

  const handleReject = () => {
    if (selectedClinic) {
      setClinics(clinics.filter((c) => c.id !== selectedClinic.id));
      setNotification({ message: "Clinic registration rejected", type: "error" });
      setTimeout(() => setNotification(null), 3000);
      closeReview();
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/60 dark:bg-[#131315]/60 backdrop-blur-xl rounded-[20px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-white/50 dark:border-zinc-800 overflow-hidden relative"
    >
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={clsx(
              "absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-medium z-10 flex items-center gap-2 border",
              notification.type === "success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
            )}
          >
            {notification.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-50">Pending Clinic Registrations</h3>
        <Link href="/admin/clinics" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors hover:underline">
          View All &rarr;
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-zinc-900/50 text-slate-500 dark:text-zinc-400 font-medium">
            <tr>
              <th className="px-6 py-4">Clinic</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <motion.tbody className="divide-y divide-zinc-800/50">
            {clinics.length === 0 ? (
              <motion.tr variants={rowVariants}>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-800 dark:text-zinc-500">
                  No pending registrations.
                </td>
              </motion.tr>
            ) : (
              clinics.map((clinic) => (
                <motion.tr key={clinic.id} variants={rowVariants} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-zinc-200">{clinic.clinic}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-zinc-400">{clinic.location}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-zinc-400">{clinic.plan}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-zinc-400">{clinic.submitted}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {clinic.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleReview(clinic)}
                      className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#0084d1] dark:bg-zinc-800 px-5 py-2 text-sm font-semibold text-white dark:text-zinc-200 shadow-sm hover:bg-[#0073b6] dark:hover:bg-zinc-700 transition-all duration-300 border border-transparent dark:border-zinc-700 hover:border-transparent dark:hover:border-zinc-600"
                    >
                      <Eye size={16} />
                      <span>View Details</span>
                      <ArrowRight 
                        size={16} 
                        className="transition-transform duration-300 group-hover:translate-x-1" 
                      />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedClinic && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#18181b] rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-zinc-800"
            >
              <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-50">Clinic Details</h2>
                <button onClick={closeReview} className="text-slate-800 dark:text-zinc-500 hover:text-slate-600 dark:text-zinc-300 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-slate-800 dark:text-zinc-500">Clinic Name</p>
                  <p className="font-medium text-slate-700 dark:text-zinc-200">{selectedClinic.clinic}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-800 dark:text-zinc-500">Location</p>
                  <p className="font-medium text-slate-700 dark:text-zinc-200">{selectedClinic.location}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-800 dark:text-zinc-500">Registration Date</p>
                  <p className="font-medium text-slate-700 dark:text-zinc-200">{selectedClinic.submitted}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-800 dark:text-zinc-500">Selected Plan</p>
                  <p className="font-medium text-slate-700 dark:text-zinc-200">{selectedClinic.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-800 dark:text-zinc-500">Contact Email</p>
                  <p className="font-medium text-slate-700 dark:text-zinc-200">
                    contact@{selectedClinic.clinic.toLowerCase().replace(/\s+/g, "")}.com
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-800 dark:text-zinc-500">Submitted Documents</p>
                  <p className="font-medium text-emerald-500 cursor-pointer hover:underline">
                    View Medical License (PDF)
                  </p>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-200 dark:border-zinc-800 flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeReview}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReject}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center gap-1.5"
                >
                  <X size={16} />
                  Reject
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApprove}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white dark:text-zinc-950 bg-emerald-500 hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Check size={16} />
                  Approve
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}



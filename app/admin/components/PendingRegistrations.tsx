"use client";

import React, { useState } from "react";
import { pendingRegistrations, Clinic } from "../data/mockData";
import clsx from "clsx";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden relative"
    >
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={clsx(
              "absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-medium z-10",
              notification.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            )}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Pending Clinic Registrations</h3>
        <Link href="/admin/clinics" className="text-sm font-medium text-[#0ea5e9] hover:text-[#0284c7] transition-colors hover:underline">
          View All &rarr;
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4">Clinic</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <motion.tbody className="divide-y divide-gray-100">
            {clinics.length === 0 ? (
              <motion.tr variants={rowVariants}>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No pending registrations.
                </td>
              </motion.tr>
            ) : (
              clinics.map((clinic) => (
                <motion.tr key={clinic.id} variants={rowVariants} className="hover:bg-gray-50 dark:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{clinic.clinic}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{clinic.location}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{clinic.plan}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{clinic.submitted}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f8f9fa] dark:bg-gray-900mber-100 text-amber-800">
                      {clinic.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReview(clinic)}
                      className="text-sm font-medium text-[#059669] hover:text-[#047857] transition-colors bg-emerald-50 px-3 py-1.5 rounded-lg inline-block"
                    >
                      Review
                    </motion.button>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Clinic Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Clinic Name</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{selectedClinic.clinic}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{selectedClinic.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Registration Date</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{selectedClinic.submitted}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Selected Plan</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{selectedClinic.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contact Email</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    contact@{selectedClinic.clinic.toLowerCase().replace(/\s+/g, "")}.com
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Submitted Documents</p>
                  <p className="font-medium text-[#0ea5e9] cursor-pointer hover:underline">
                    View Medical License (PDF)
                  </p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeReview}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReject}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Reject
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApprove}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#059669] hover:bg-[#047857] transition-colors"
                >
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



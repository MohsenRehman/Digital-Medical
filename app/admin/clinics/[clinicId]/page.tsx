"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clinics } from "../../data/mockData";
import { ArrowLeft, Building2, MapPin, Mail, Phone, Users, Shield, Calendar } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ClinicDetailsPage({ params }: { params: { clinicId: string } }) {
  const [clinic, setClinic] = useState(clinics.find(c => c.id === params.clinicId));
  const [activeTab, setActiveTab] = useState("overview");
  const [notification, setNotification] = useState("");

  if (!clinic) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Clinic not found</h2>
        <Link href="/admin/clinics" className="text-[#0ea5e9] mt-4 inline-block hover:underline">
          ← Back to Clinics
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: "Active" | "Pending" | "Suspended") => {
    setClinic({ ...clinic, status: newStatus });
    setNotification(`Clinic status changed to ${newStatus}`);
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <motion.div 
      className="space-y-6 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-0 right-0 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium z-10"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Link href="/admin/clinics" className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:text-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{clinic.clinic}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">ID: {clinic.id.toUpperCase()}</p>
        </div>
        <div className="ml-auto flex gap-3">
          {clinic.status !== "Active" && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusChange("Active")}
              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Approve Clinic
            </motion.button>
          )}
          {clinic.status !== "Suspended" && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatusChange("Suspended")}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Suspend Clinic
            </motion.button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Quick Info */}
        <motion.div variants={itemVariants} className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
              <Building2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Clinic Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{clinic.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Contact Phone</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{clinic.contact}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{clinic.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Registration Date</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{clinic.submitted}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Tabs and Data */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex border-b border-gray-100 dark:border-gray-700">
              <motion.button 
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("overview")}
                className={clsx("px-6 py-4 text-sm font-medium transition-colors", activeTab === "overview" ? "border-b-2 border-[#059669] text-[#059669]" : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:text-gray-100")}
              >
                Overview
              </motion.button>
              <motion.button 
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("billing")}
                className={clsx("px-6 py-4 text-sm font-medium transition-colors", activeTab === "billing" ? "border-b-2 border-[#059669] text-[#059669]" : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:text-gray-100")}
              >
                Billing & Subscription
              </motion.button>
            </div>
            
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div 
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-3 gap-6"
                  >
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Doctors</p>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{clinic.doctors}</h3>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Staff</p>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{clinic.staff}</h3>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Patients</p>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{clinic.patients.toLocaleString()}</h3>
                    </div>
                    <div className="col-span-3 mt-4">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Clinic Activity</h4>
                      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-3">
                        <p>• Clinic profile updated on {clinic.submitted}</p>
                        <p>• Doctor Ahmed joined the clinic yesterday</p>
                        <p>• Payment successful for Professional plan</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "billing" && (
                  <motion.div 
                    key="billing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-4">
                        <Shield className="text-emerald-600" size={24} />
                        <div>
                          <p className="text-sm text-emerald-800 font-medium">Current Plan: {clinic.plan}</p>
                          <p className="text-xs text-emerald-600 mt-0.5">Active until Dec 2024</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-200 text-emerald-800 text-xs font-bold rounded-full uppercase">
                        {clinic.billingStatus}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Invoices</h4>
                      <table className="w-full text-left text-sm">
                        <thead className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-2 rounded-l-lg">Invoice ID</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2 rounded-r-lg">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr>
                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">INV-2024-001</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">01 Sep 2024</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">Rs. 15,000</td>
                            <td className="px-4 py-3 text-emerald-600 font-medium">Paid</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useState } from "react";
import { clinics } from "../data/mockData";
import { Building2, Search, Filter, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

import { useSearch } from "../components/SearchContext";

export default function ClinicsPage() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [clinicsData, setClinicsData] = useState(clinics);
  const [newClinicData, setNewClinicData] = useState({
    clinic: "",
    location: "",
    email: "",
    plan: "Professional" as any,
    status: "Active" as any,
  });

  const handleSaveClinic = () => {
    const newEntry = {
      id: `ORG-${Math.floor(Math.random() * 10000)}`,
      clinic: newClinicData.clinic,
      location: newClinicData.location,
      email: newClinicData.email,
      plan: newClinicData.plan,
      status: newClinicData.status,
      doctors: 0,
      patients: 0,
      staff: 0
    };
    
    setClinicsData(prev => [newEntry, ...prev]);
    setIsAddModalOpen(false);
    
    // Reset form
    setNewClinicData({
      clinic: "",
      location: "",
      email: "",
      plan: "Professional",
      status: "Active",
    });
  };

  const filteredClinics = clinicsData.filter(c => {
    const matchesSearch = c.clinic.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full md:hidden relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0084d1] dark:focus:ring-emerald-500"
          />
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0084d1] hover:bg-[#0073b6] dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          + Add New Clinic
        </motion.button>
      </div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-end">
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0084d1] dark:focus:ring-emerald-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Clinic Name</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Doctors</th>
                <th className="px-6 py-4">Patients</th>
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              className="divide-y divide-gray-100"
              variants={containerVariants}
            >
              {filteredClinics.map(clinic => (
                <motion.tr 
                  key={clinic.id} 
                  variants={itemVariants}
                  className="hover:bg-gray-50 dark:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                    <Link href={`/admin/clinics/${clinic.id}`} className="hover:text-[#0084d1] dark:text-emerald-500">
                      {clinic.clinic}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{clinic.location}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{clinic.doctors}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{clinic.patients.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{clinic.plan}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
                      {
                        "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20": clinic.status === "Active",
                        "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20": clinic.status === "Pending",
                        "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20": clinic.status === "Suspended",
                      }
                    )}>
                      {clinic.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                      <Link 
                        href={`/admin/clinics/${clinic.id}`} 
                        className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#0084d1] dark:bg-zinc-800 px-4 py-2 text-xs font-semibold text-white dark:text-zinc-200 shadow-sm hover:bg-[#0073b6] dark:hover:bg-zinc-700 transition-all duration-300 border border-transparent dark:border-zinc-700 dark:hover:border-zinc-600"
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                        <ArrowRight 
                          size={14} 
                          className="transition-transform duration-300 group-hover:translate-x-1" 
                        />
                      </Link>
                    </motion.div>
                  </td>
                </motion.tr>
              ))}
              {filteredClinics.length === 0 && (
                <motion.tr variants={itemVariants}>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No clinics found.</td>
                </motion.tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>

      {/* Add New Clinic Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add New Clinic</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 transition-colors">
                  &times;
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clinic Name</label>
                    <input 
                      type="text" 
                      value={newClinicData.clinic}
                      onChange={e => setNewClinicData({...newClinicData, clinic: e.target.value})}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0084d1] dark:focus:ring-emerald-500" 
                      placeholder="Enter clinic name" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City/Location</label>
                    <input 
                      type="text" 
                      value={newClinicData.location}
                      onChange={e => setNewClinicData({...newClinicData, location: e.target.value})}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0084d1] dark:focus:ring-emerald-500" 
                      placeholder="Enter location" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={newClinicData.email}
                    onChange={e => setNewClinicData({...newClinicData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0084d1] dark:focus:ring-emerald-500" 
                    placeholder="clinic@example.com" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subscription Plan</label>
                    <select 
                      value={newClinicData.plan}
                      onChange={e => setNewClinicData({...newClinicData, plan: e.target.value as any})}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0084d1] dark:focus:ring-emerald-500"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Status</label>
                    <select 
                      value={newClinicData.status}
                      onChange={e => setNewClinicData({...newClinicData, status: e.target.value as any})}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0084d1] dark:focus:ring-emerald-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleSaveClinic}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white dark:text-zinc-950 bg-[#0084d1] hover:bg-[#0073b6] dark:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors shadow-sm disabled:opacity-50"
                  disabled={!newClinicData.clinic || !newClinicData.location}
                >
                  Save Clinic
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


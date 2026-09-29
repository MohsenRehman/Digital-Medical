"use client";

import React, { useState } from "react";
import { FileText, Download, Building2, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reports = [
    { id: "clinic-reg", title: "Clinic Registration Report", desc: "Detailed summary of new and pending clinic registrations.", icon: <Building2 className="text-blue-500" size={24} />, bg: "bg-blue-50" },
    { id: "sub-report", title: "Subscription Report", desc: "Breakdown of active, pending, and cancelled subscriptions.", icon: <CreditCard className="text-emerald-500" size={24} />, bg: "bg-emerald-50" },
    { id: "payment-report", title: "Payment Report", desc: "Overview of platform revenue, pending payments, and failed transactions.", icon: <CreditCard className="text-purple-500" size={24} />, bg: "bg-purple-50" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* Removed title as requested */}
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {reports.map((report) => (
          <motion.div 
            key={report.id} 
            variants={cardVariants}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedReport(report.title)}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col group cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${report.bg}`}>
              {report.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{report.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 mb-6">{report.desc}</p>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between mt-auto">
              <button className="text-sm font-medium text-[#0ea5e9] group-hover:underline">
                View Report
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Downloading ${report.title}...`);
                }}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Download size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{selectedReport} Details</h2>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  Close
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Showing mock data for the selected report.</p>
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                    <tr>
                      <th className="p-3 border-b border-gray-200 dark:border-gray-700">Date</th>
                      <th className="p-3 border-b border-gray-200 dark:border-gray-700">Metric</th>
                      <th className="p-3 border-b border-gray-200 dark:border-gray-700">Value</th>
                      <th className="p-3 border-b border-gray-200 dark:border-gray-700">Status</th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    initial="hidden" 
                    animate="show" 
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
                    }}
                    className="divide-y divide-gray-100"
                  >
                    {[1, 2, 3, 4, 5].map((item) => (
                      <motion.tr 
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          show: { opacity: 1, y: 0 }
                        }}
                        key={item} 
                        className="hover:bg-gray-50 dark:bg-gray-800"
                      >
                        <td className="p-3 text-gray-600 dark:text-gray-300">Sep {item + 10}, 2024</td>
                        <td className="p-3 text-gray-800 dark:text-gray-100 font-medium">Sample Data Point {item}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-300">{(item * 1234).toLocaleString()}</td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs">Generated</span>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => alert("Downloading CSV...")}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#0ea5e9] hover:bg-[#0284c7] transition-colors flex items-center gap-2"
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


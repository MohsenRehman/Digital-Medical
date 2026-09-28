import React from "react";
import { CheckCircle, UserPlus, CreditCard, AlertCircle, Ban } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";

const newRecentActivities = [
  {
    id: "a1",
    title: "New Clinic Registration",
    description: "Life Care Clinic submitted a registration application.",
    type: "registration",
    time: "10 mins ago",
    status: "Pending"
  },
  {
    id: "a2",
    title: "Clinic Approved",
    description: "City Medical Clinic was approved by Super Admin.",
    type: "approval",
    time: "1 hour ago",
    status: "Approved"
  },
  {
    id: "a3",
    title: "Subscription Activated",
    description: "Health Plus Clinic activated its Professional plan.",
    type: "subscription",
    time: "2 hours ago",
    status: "Active"
  },
  {
    id: "a4",
    title: "Payment Received",
    description: "Payment received from Wellness Hospital.",
    type: "payment",
    time: "3 hours ago",
    status: "Completed"
  },
  {
    id: "a5",
    title: "Clinic Suspended",
    description: "A clinic account was suspended by Super Admin.",
    type: "suspension",
    time: "1 day ago",
    status: "Suspended"
  }
];

export default function RecentActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="text-emerald-500" size={18} />;
      case "registration":
        return <UserPlus className="text-blue-500" size={18} />;
      case "subscription":
        return <CheckCircle className="text-emerald-500" size={18} />;
      case "payment":
        return <CreditCard className="text-purple-500" size={18} />;
      case "suspension":
        return <Ban className="text-red-500" size={18} />;
      default:
        return <AlertCircle className="text-gray-500 dark:text-gray-400" size={18} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "approval":
      case "subscription":
        return "bg-emerald-50 dark:bg-emerald-900/20";
      case "registration":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "payment":
        return "bg-purple-50 dark:bg-purple-900/20";
      case "suspension":
        return "bg-red-50 dark:bg-red-900/20";
      default:
        return "bg-gray-50 dark:bg-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full dark:bg-amber-900/30 dark:text-amber-300">{status}</span>;
      case "Approved":
      case "Active":
      case "Completed":
        return <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full dark:bg-emerald-900/30 dark:text-emerald-300">{status}</span>;
      case "Suspended":
        return <span className="text-[10px] font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded-full dark:bg-red-900/30 dark:text-red-300">{status}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[450px]">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Recent Activities</h3>
        <Link href="/admin/reports" className="text-sm font-medium text-[#3b82f6] hover:text-[#2563eb] transition-colors hover:underline">
          View All &rarr;
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="relative pl-2">
          {/* Timeline line */}
          <div className="absolute top-4 bottom-4 left-[1.15rem] w-px bg-gray-100 dark:bg-gray-800"></div>
          
          <motion.div 
            className="space-y-6 relative"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {newRecentActivities.map((activity) => (
              <motion.div 
                key={activity.id} 
                className="flex gap-4"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                }}
              >
                <div
                  className={clsx(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white dark:border-[#1a1a1a]",
                    getBgColor(activity.type)
                  )}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="pt-1.5 flex-1 pb-4 border-b border-gray-50 dark:border-gray-800/50 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{activity.title}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 leading-relaxed">{activity.description}</p>
                  <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}



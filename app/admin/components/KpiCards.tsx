"use client";

import React, { useEffect, useState } from "react";
import { Building2, CheckCircle2, Clock, Ban, ShieldCheck, CreditCard } from "lucide-react";
import clsx from "clsx";
import { motion, useAnimation, useInView } from "framer-motion";

const AnimatedNumber = ({ value }: { value: string }) => {
  const numericValue = parseInt(value.replace(/,/g, ""), 10);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isNaN(numericValue)) {
      return;
    }
    let startTime: number;
    const duration = 800; // 800ms
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(ease * numericValue));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [numericValue]);

  return <span>{isNaN(numericValue) ? value : displayValue.toLocaleString()}</span>;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function KpiCards() {
  const cards = [
    {
      title: "Total Clinics",
      value: "128",
      icon: <Building2 className="text-blue-500" size={24} />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Clinics",
      value: "104",
      icon: <CheckCircle2 className="text-emerald-500" size={24} />,
      bgColor: "bg-emerald-50",
    },
    {
      title: "Pending Clinics",
      value: "16",
      icon: <Clock className="text-amber-500" size={24} />,
      bgColor: "bg-[#f8f9fa] dark:bg-gray-900mber-50",
    },
    {
      title: "Suspended Clinics",
      value: "8",
      icon: <Ban className="text-red-500" size={24} />,
      bgColor: "bg-red-50",
    },
    {
      title: "Active Subscriptions",
      value: "96",
      icon: <ShieldCheck className="text-indigo-500" size={24} />,
      bgColor: "bg-indigo-50",
    },
    {
      title: "Pending Payments",
      value: "12",
      icon: <CreditCard className="text-orange-500" size={24} />,
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
    >
      {cards.map((card, i) => (
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          key={i}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between hover:shadow-md transition-shadow cursor-default"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", card.bgColor)}>
              {card.icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              <AnimatedNumber value={card.value} />
            </h3>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}



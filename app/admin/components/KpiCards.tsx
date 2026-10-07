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
      icon: <Building2 className="text-[#0084d1] dark:text-zinc-400" size={20} />,
      bgColor: "bg-[#0084d1]/10 dark:bg-zinc-800/50",
    },
    {
      title: "Active Clinics",
      value: "104",
      icon: <CheckCircle2 className="text-[#0084d1] dark:text-emerald-500" size={20} />,
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "Pending Clinics",
      value: "16",
      icon: <Clock className="text-amber-600 dark:text-amber-500" size={20} />,
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      title: "Suspended Clinics",
      value: "8",
      icon: <Ban className="text-red-600 dark:text-red-500" size={20} />,
      bgColor: "bg-red-50 dark:bg-red-500/10",
    },
    {
      title: "Active Subscriptions",
      value: "96",
      icon: <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={20} />,
      bgColor: "bg-indigo-50 dark:bg-indigo-500/10",
    },
    {
      title: "Pending Payments",
      value: "12",
      icon: <CreditCard className="text-orange-600 dark:text-orange-400" size={20} />,
      bgColor: "bg-orange-50 dark:bg-orange-500/10",
    },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5"
    >
      {cards.map((card, i) => (
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          key={i}
          className="bg-white/60 dark:bg-[#131315]/60 backdrop-blur-xl p-5 rounded-[20px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-white/50 dark:border-zinc-800 flex flex-col justify-between hover:bg-white/80 dark:hover:bg-[#131315]/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] transition-all duration-300 cursor-default"
        >
          <div className="flex items-center justify-between mb-6">
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", card.bgColor)}>
              {card.icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{card.title}</p>
            <h3 className="text-3xl font-semibold text-slate-800 dark:text-zinc-50 mt-2 tracking-tight">
              <AnimatedNumber value={card.value} />
            </h3>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}



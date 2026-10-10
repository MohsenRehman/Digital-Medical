"use client";

import React, { useState, useEffect } from "react";
import { User, Camera, Trash2 } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const [notification, setNotification] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const [settings, setSettings] = useState<{
    adminName: string;
    email: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    autoApproveClinics: boolean;
    maintenanceMode: boolean;
    profileImage: string | null;
  }>({
    adminName: "Super Admin",
    email: "admin@digitalmedical.com",
    emailNotifications: true,
    smsNotifications: false,
    autoApproveClinics: false,
    maintenanceMode: false,
    profileImage: null,
  });

  useEffect(() => {
    setMounted(true);
    const savedImage = localStorage.getItem("adminProfileImage");
    if (savedImage) {
      setSettings(prev => ({ ...prev, profileImage: savedImage }));
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSettings(prev => ({ ...prev, profileImage: result }));
        localStorage.setItem("adminProfileImage", result);
        setNotification("Profile photo updated!");
        setTimeout(() => setNotification(""), 3000);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSettings(prev => ({ ...prev, profileImage: null }));
    localStorage.removeItem("adminProfileImage");
    setNotification("Profile photo removed.");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleSave = () => {
    setNotification("Settings updated successfully!");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 relative max-w-4xl">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-0 right-0 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium z-10"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure global preferences and admin details.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700"
      >
        
        {/* Profile Section */}
        <motion.div variants={itemVariants} className="p-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-8">Admin Profile</h3>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-gray-900 border-2 border-slate-200 dark:border-gray-700 overflow-hidden flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                {settings.profileImage ? (
                  <img src={settings.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-slate-300 dark:text-gray-600" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#0084d1] dark:bg-emerald-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#0073b6] dark:hover:bg-emerald-400 transition-colors border-2 border-white dark:border-gray-800">
                <Camera size={14} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100">Profile Picture</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
              <div className="flex items-center gap-3 mt-1">
                <label className="cursor-pointer text-sm font-medium text-[#0084d1] dark:text-emerald-500 hover:text-[#0073b6] dark:hover:text-emerald-400 transition-colors">
                  Upload New
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                {settings.profileImage && (
                  <>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <button 
                      onClick={handleRemoveImage}
                      className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input 
                type="text" 
                value={settings.adminName}
                onChange={e => setSettings({ ...settings, adminName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
              />
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div variants={itemVariants} className="p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Email Notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive daily summaries and critical alerts via email.</p>
              </div>
              <button 
                onClick={() => handleToggle("emailNotifications")}
                className={clsx("w-11 h-6 rounded-full transition-colors relative", settings.emailNotifications ? "bg-[#0084d1] dark:bg-emerald-500" : "bg-gray-200")}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-gray-800", settings.emailNotifications ? "left-6" : "left-1")}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">SMS Alerts</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Get text messages for system emergencies.</p>
              </div>
              <button 
                onClick={() => handleToggle("smsNotifications")}
                className={clsx("w-11 h-6 rounded-full transition-colors relative", settings.smsNotifications ? "bg-[#0084d1] dark:bg-emerald-500" : "bg-gray-200")}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-gray-800", settings.smsNotifications ? "left-6" : "left-1")}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Platform Preferences */}
        <motion.div variants={itemVariants} className="p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Platform Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Auto-Approve Clinics</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Automatically set new clinics to Active (Not recommended).</p>
              </div>
              <button 
                onClick={() => handleToggle("autoApproveClinics")}
                className={clsx("w-11 h-6 rounded-full transition-colors relative", settings.autoApproveClinics ? "bg-[#0084d1] dark:bg-emerald-500" : "bg-gray-200")}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-gray-800", settings.autoApproveClinics ? "left-6" : "left-1")}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 text-red-600">Maintenance Mode</p>
                <p className="text-xs text-red-500">Disable access for all non-admin users.</p>
              </div>
              <button 
                onClick={() => handleToggle("maintenanceMode")}
                className={clsx("w-11 h-6 rounded-full transition-colors relative", settings.maintenanceMode ? "bg-red-500" : "bg-gray-200")}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={clsx("absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-gray-800", settings.maintenanceMode ? "left-6" : "left-1")}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer Actions */}
        <motion.div variants={itemVariants} className="p-6 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3 rounded-b-xl">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:bg-gray-800 transition-colors">
            Cancel
          </button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-lg transition-colors"
          >
            Save Changes
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
}


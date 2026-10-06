"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  User,
  Phone,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Bell,
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
  Pencil,
  X,
  Check,
  Calendar,
  Clock,
  HeartPulse,
  Activity,
  AlertCircle,
  BadgeCheck,
  Info,
  Camera,
  Trash2,
} from "lucide-react";
import { PatientUser, GenderType } from "@/lib/types/patient";

interface ProfileSettingsSectionProps {
  patientUser: PatientUser | null;
  onUpdateProfile?: (data: {
    name?: string;
    gender?: GenderType;
    age?: number;
    password?: string;
  }) => void;
}

// Accessible Modern Toggle Switch
function ToggleSwitch({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  id: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus:ring-2 focus:ring-sky-500/30 ${
        checked ? "bg-sky-600 dark:bg-sky-500" : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function ProfileSettingsSection({
  patientUser,
  onUpdateProfile,
}: ProfileSettingsSectionProps) {
  // Current Patient Data
  const displayName = patientUser?.name || "Muhammad Ahmed";
  const displayPhone = patientUser?.phone || "0300-1234567";
  const displayAge = patientUser?.age ?? 32;
  const displayGender: GenderType = patientUser?.gender || "male";
  const isPhoneVerified = patientUser?.isPhoneVerified ?? true;

  // Profile Picture State (Frontend-Only with localStorage persistence)
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load saved profile image on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("patient_profile_image");
      if (saved) {
        setProfileImage(saved);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  // Edit Profile Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(displayName);
  const [editAge, setEditAge] = useState(String(displayAge));
  const [editGender, setEditGender] = useState<GenderType>(displayGender);
  const [editError, setEditError] = useState<string | null>(null);

  // Synchronize when patientUser prop updates
  useEffect(() => {
    setEditName(patientUser?.name || "Muhammad Ahmed");
    setEditAge(String(patientUser?.age ?? 32));
    setEditGender(patientUser?.gender || "male");
  }, [patientUser]);

  // Password Management State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Notification Preferences (with localStorage persistence)
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);

  useEffect(() => {
    try {
      const savedWa = localStorage.getItem("patient_pref_whatsapp");
      if (savedWa !== null) setWhatsappEnabled(savedWa === "true");
      const savedSms = localStorage.getItem("patient_pref_sms");
      if (savedSms !== null) setSmsEnabled(savedSms === "true");
    } catch {
      // ignore localStorage error
    }
  }, []);

  const handleToggleWhatsApp = (val: boolean) => {
    setWhatsappEnabled(val);
    try {
      localStorage.setItem("patient_pref_whatsapp", String(val));
    } catch {
      // ignore
    }
  };

  const handleToggleSms = (val: boolean) => {
    setSmsEnabled(val);
    try {
      localStorage.setItem("patient_pref_sms", String(val));
    } catch {
      // ignore
    }
  };

  // Toast / Feedback State
  const [feedbackToast, setFeedbackToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setFeedbackToast({ type, message });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Formatted Registration Date
  const memberSince = useMemo(() => {
    if (!patientUser?.createdAt) return "September 2024";
    try {
      const d = new Date(patientUser.createdAt);
      if (isNaN(d.getTime())) return "September 2024";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "September 2024";
    }
  }, [patientUser?.createdAt]);

  // Initials for avatar fallback
  const initials = useMemo(() => {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase() || "DM";
  }, [displayName]);

  // Profile Picture File Selection & Validation Handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showToast("error", "Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast("error", "Selected image exceeds 5MB limit. Please choose a smaller photo.");
      return;
    }

    // Read as Data URL and update state
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProfileImage(result);
      try {
        localStorage.setItem("patient_profile_image", result);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("patient-profile-image-updated"));
        }
      } catch {
        // LocalStorage quota may be reached for very large data URLs
      }
      showToast("success", "Profile picture updated (stored locally in browser).");
    };
    reader.onerror = () => {
      showToast("error", "Failed to load the selected image. Please try again.");
    };
    reader.readAsDataURL(file);

    // Reset input value so re-selecting same file triggers change
    e.target.value = "";
  };

  // Remove Photo Handler
  const handleRemovePhoto = () => {
    setProfileImage(null);
    try {
      localStorage.removeItem("patient_profile_image");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("patient-profile-image-updated"));
      }
    } catch {
      // ignore
    }
    showToast("success", "Profile picture removed. Reverted to initials.");
  };

  // Handlers for Edit Profile
  const handleStartEdit = () => {
    setEditName(displayName);
    setEditAge(String(displayAge));
    setEditGender(displayGender);
    setEditError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditName(displayName);
    setEditAge(String(displayAge));
    setEditGender(displayGender);
    setEditError(null);
    setIsEditing(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = editName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setEditError("Please enter a valid full name (minimum 2 characters).");
      return;
    }

    const parsedAge = parseInt(editAge, 10);
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      setEditError("Please enter a realistic age between 1 and 120.");
      return;
    }

    setEditError(null);

    if (onUpdateProfile) {
      onUpdateProfile({
        name: trimmedName,
        age: parsedAge,
        gender: editGender,
      });
    }

    setIsEditing(false);
    showToast("success", "Patient profile details updated successfully!");
  };

  // Handlers for Password Update
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters in length.");
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match. Please re-enter.");
      return;
    }

    setPasswordError(null);

    if (onUpdateProfile) {
      onUpdateProfile({
        password: password.trim(),
      });
    }

    setPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
    setPasswordSuccess(true);
    showToast("success", "Password updated successfully. You can now use password sign-in.");
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Hidden Native File Picker for Profile Photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* Toast Notification Banner */}
      {feedbackToast && (
        <div
          className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold shadow-sm transition-all animate-fadeIn ${
            feedbackToast.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedbackToast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{feedbackToast.message}</span>
          </div>
          <button
            onClick={() => setFeedbackToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. TOP PATIENT PROFILE OVERVIEW CARD */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        {/* Subtle decorative top brand accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-600 via-teal-500 to-sky-500" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 pt-1">
          {/* Avatar and Primary Identity Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
            {/* Circular Patient Profile Photo with Camera / Action Buttons */}
            <div className="relative shrink-0 group/avatar">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-sky-600 via-teal-500 to-sky-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-sky-600/20 ring-4 ring-white dark:ring-slate-900 select-none overflow-hidden relative">
                {profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImage}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="tracking-tight">{initials}</span>
                )}
              </div>

              {/* Camera / Edit Photo Button (Overlapping Bottom-Right Edge) */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-md transition-all transform hover:scale-105 cursor-pointer outline-none"
                aria-label="Change profile photo"
                title="Change profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Remove Photo Button (Overlapping Top-Right Edge when photo is present) */}
              {profileImage && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-0 right-0 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm transition-all transform hover:scale-110 cursor-pointer outline-none"
                  aria-label="Remove profile photo"
                  title="Remove photo and return to initials"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Name, Badges & Quick Metadata */}
            <div className="min-w-0 space-y-1.5">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                  <BadgeCheck className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                  <span>Primary Account</span>
                </span>

                {isPhoneVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Patient</span>
                  </span>
                )}

                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  ID: #{patientUser?.id ? patientUser.id.replace("patient_", "").slice(0, 8) : "DM-8942"}
                </span>
              </div>

              {/* Full Name */}
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {displayName}
              </h1>

              {/* Quick Details Chips */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{displayPhone}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 capitalize">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{displayGender}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{displayAge} years old</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {memberSince}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA: Edit Profile Button */}
          <div className="flex items-center justify-center md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleStartEdit}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Editing</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID (2/3 Left Column, 1/3 Right Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* ================= LEFT COLUMN (2 Cols): Personal Info & Medical Identity ================= */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          {/* Card A: Personal Information */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Personal Information
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Your official identity details registered on the platform
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1 cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  Editing Mode
                </span>
              )}
            </div>

            {/* Read-Only Mode */}
            {!isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Full Name
                  </span>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {displayName}
                  </p>
                </div>

                {/* Mobile Phone (Locked) */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Registered Mobile
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-slate-900 dark:text-white">
                    {displayPhone}
                  </p>
                </div>

                {/* Age */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Age
                  </span>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {displayAge} Years
                  </p>
                </div>

                {/* Gender */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Gender
                  </span>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white capitalize">
                    {displayGender}
                  </p>
                </div>

                {/* Registration Date */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Registered On
                  </span>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {memberSince}
                  </p>
                </div>

                {/* Clinical Chart Status */}
                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Clinical Chart Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                    <span>Active Patient Roster</span>
                  </span>
                </div>
              </div>
            ) : (
              /* Editable Form Mode */
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {editError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="edit-fullname"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="edit-fullname"
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
                    placeholder="Enter full legal name"
                  />
                </div>

                {/* Registered Phone (Locked with Explanatory Notice) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="edit-phone"
                      className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                    >
                      Registered Mobile (Account Identifier)
                    </label>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                      <Lock className="w-3 h-3" />
                      <span>Non-editable identity</span>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="edit-phone"
                      type="text"
                      disabled
                      value={displayPhone}
                      className="w-full h-10 px-3.5 pr-24 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono cursor-not-allowed select-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                    Your phone number is bound to verified SMS/OTP health pass records across partner clinics and cannot be edited directly.
                  </p>
                </div>

                {/* Age & Gender Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="edit-age"
                      className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                    >
                      Age (Years) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="edit-age"
                      type="number"
                      min="1"
                      max="120"
                      required
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
                      placeholder="e.g. 32"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-gender"
                      className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                    >
                      Gender <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="edit-gender"
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value as GenderType)}
                      className="w-full h-10 px-3.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all cursor-pointer"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Card B: Medical Information & Clinical Status */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Medical Information &amp; Clinical Status
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Clinical record indicators and emergency parameters
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 px-2.5 py-0.5 rounded-full font-semibold">
                <Activity className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>Health Chart</span>
              </span>
            </div>

            {/* Clinical Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Blood Group */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Blood Group &amp; Rh Factor
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Pending Clinical Consultation
                </p>
                <p className="text-[10px] text-slate-400">
                  Recorded upon in-clinic diagnostic visit or lab report submission
                </p>
              </div>

              {/* Known Allergies */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Known Drug &amp; Food Allergies
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  No Critical Allergies Documented
                </p>
                <p className="text-[10px] text-slate-400">
                  Updated directly during doctor intake consultation
                </p>
              </div>

              {/* Chronic Conditions */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Chronic Medical Conditions
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  None Registered
                </p>
                <p className="text-[10px] text-slate-400">
                  Synthesized across attending physician encounter summaries
                </p>
              </div>

              {/* Emergency Contact */}
              <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Primary Emergency Contact
                </span>
                <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200">
                  {displayPhone} (Primary Line)
                </p>
                <p className="text-[10px] text-slate-400">
                  Family members can also be managed in Family Profiles
                </p>
              </div>
            </div>

            {/* Clinically Neutral Explanatory Note */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Vital medical indicators, blood typing, and verified allergy flags are documented and verified directly by licensed clinicians and laboratory technicians during in-person clinical encounters.
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (1 Col): Account Security, Notifications & Privacy ================= */}
        <div className="space-y-5 sm:space-y-6">
          {/* Card C: Account & Security */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Account &amp; Security
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Authentication and credentials
                </p>
              </div>
            </div>

            {/* Phone Verification Status Tile */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Sign-In Identity
                </span>
                <span className="text-xs font-mono font-semibold text-slate-900 dark:text-white truncate block">
                  {displayPhone}
                </span>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Verified</span>
              </span>
            </div>

            {/* Password Section (Collapsed by default) */}
            <div className="pt-1">
              {!isChangingPassword ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Account Password
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {patientUser?.password ? "Custom password configured" : "Sign-in via Phone OTP (Default)"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(true);
                        setPasswordError(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>{patientUser?.password ? "Change" : "Set Password"}</span>
                    </button>
                  </div>
                  {passwordSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Password successfully updated.</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Expandable Password Form */
                <form onSubmit={handleSavePassword} className="space-y-3 pt-1">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Update Account Password
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPassword("");
                        setConfirmPassword("");
                        setPasswordError(null);
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  {passwordError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                      {passwordError}
                    </div>
                  )}

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1"
                    >
                      New Password (Min. 6 characters)
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full h-9 px-3 pr-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full h-9 px-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-9 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save New Password</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Card D: Notification Preferences */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Notification Preferences
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Communication channels for appointments
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* WhatsApp Reminders */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      WhatsApp Reminders
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      Automated reminders 2 hours before your scheduled appointment
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  id="notif-whatsapp"
                  label="Toggle WhatsApp Appointment Reminders"
                  checked={whatsappEnabled}
                  onChange={handleToggleWhatsApp}
                />
              </div>

              {/* SMS Status Alerts */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      SMS Status Updates
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      Instant booking reference, clinic confirmation, and token updates
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  id="notif-sms"
                  label="Toggle SMS Status Updates"
                  checked={smsEnabled}
                  onChange={handleToggleSms}
                />
              </div>
            </div>
          </div>

          {/* Card E: Privacy & Medical Data */}
          <div className="rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-sky-800 dark:text-sky-300">
              <ShieldCheck className="w-4.5 h-4.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                Privacy &amp; Medical Data
              </h2>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Your medical chart, diagnoses, prescriptions, and visit histories are strictly confidential. Patient records are shared only with attending licensed medical practitioners during confirmed clinical encounters.
            </p>

            <div className="pt-1 flex flex-col gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Encrypted patient identity verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Direct access to download official records anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

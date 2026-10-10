"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Stethoscope,
  ShieldCheck,
  User,
  Users,
  Edit3,
  Trash2,
  FileText,
  Pill,
  Activity,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Eye,
  Plus,
  HeartHandshake,
  CalendarDays,
  Camera,
  X,
} from "lucide-react";
import {
  FamilyMemberRecord,
  AppointmentRecord,
  PatientUser,
} from "@/lib/types/patient";

interface FamilyMemberProfileDetailProps {
  member: FamilyMemberRecord;
  primaryPatient: PatientUser | null;
  appointments: AppointmentRecord[];
  onBack: () => void;
  onOpenBooking: () => void;
  onEditMember: (member: FamilyMemberRecord) => void;
  onRemoveMember?: (id: string) => void;
  onViewAppointmentDetail?: (apt: AppointmentRecord) => void;
  onToggleWhatsApp?: (id: string) => void;
}

type ClinicalTab =
  | "overview"
  | "appointments"
  | "records"
  | "prescriptions"
  | "lab-reports"
  | "follow-ups";

export default function FamilyMemberProfileDetail({
  member,
  primaryPatient,
  appointments,
  onBack,
  onOpenBooking,
  onEditMember,
  onRemoveMember,
  onViewAppointmentDetail,
  onToggleWhatsApp,
}: FamilyMemberProfileDetailProps) {
  const [activeTab, setActiveTab] = useState<ClinicalTab>("overview");
  const primaryName = primaryPatient?.name || "Muhammad Ahmed";

  // Profile Picture State (Frontend-only with member-isolated localStorage)
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const readImage = () => {
      try {
        const saved = localStorage.getItem(`family_member_profile_image_${member.id}`);
        setProfileImage(saved);
      } catch {
        // ignore
      }
    };

    readImage();

    const handleCustomUpdate = (e: Event) => {
      const custom = e as CustomEvent<{ memberId?: string }>;
      if (!custom.detail || custom.detail.memberId === member.id) {
        readImage();
      }
    };

    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === `family_member_profile_image_${member.id}`) {
        readImage();
      }
    };

    window.addEventListener("family-member-profile-image-updated", handleCustomUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("family-member-profile-image-updated", handleCustomUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [member.id]);

  const initials = useMemo(() => {
    const trimmed = member.name.trim();
    if (!trimmed) return "FM";
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  }, [member.name]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showToast("error", "Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast("error", "Selected image exceeds 5MB limit. Please choose a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProfileImage(result);
      try {
        localStorage.setItem(`family_member_profile_image_${member.id}`, result);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("family-member-profile-image-updated", {
              detail: { memberId: member.id },
            })
          );
        }
      } catch {
        // ignore
      }
      showToast("success", `Profile picture updated for ${member.name}.`);
    };
    reader.onerror = () => {
      showToast("error", "Failed to load the selected image. Please try again.");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
    try {
      localStorage.removeItem(`family_member_profile_image_${member.id}`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("family-member-profile-image-updated", {
            detail: { memberId: member.id },
          })
        );
      }
    } catch {
      // ignore
    }
    showToast("success", `Profile picture removed for ${member.name}. Reverted to initials.`);
  };

  // -------------------------------------------------------------------------
  // Strict Medical Data Isolation:
  // Only extract data belonging to this specific family member
  // -------------------------------------------------------------------------
  const memberAppointments = useMemo(() => {
    return appointments.filter((a) => a.familyMemberId === member.id);
  }, [appointments, member.id]);

  const upcomingVisits = useMemo(() => {
    return memberAppointments.filter((a) => a.status === "confirmed");
  }, [memberAppointments]);

  const completedVisits = useMemo(() => {
    return memberAppointments.filter((a) => a.status === "completed");
  }, [memberAppointments]);

  // Formatted added date
  const addedDateFormatted = useMemo(() => {
    try {
      const d = new Date(member.addedAt);
      if (isNaN(d.getTime())) return "Recently enrolled";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently enrolled";
    }
  }, [member.addedAt]);

  const nextUpcomingMilestone = upcomingVisits[0] || null;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Back Navigation & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>← Family Profiles</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>/</span>
            <span className="text-slate-500 dark:text-slate-400">Dependent Profile</span>
            <span>/</span>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
              {member.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Clinical Data Partitioned</span>
          </span>
        </div>
      </div>

      {/* Feedback Toast */}
      {toast && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 shadow-2xs animate-fadeIn ${
            toast.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
          }`}
        >
          <span className="font-semibold">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-0.5 hover:opacity-75 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Top Member Profile Header Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Avatar & Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 min-w-0 text-center sm:text-left">
            {/* Circular Profile Avatar with Camera / Remove action */}
            <div className="relative shrink-0 group/avatar">
              <div className="w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-sky-600 to-teal-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md shadow-sky-500/20 ring-4 ring-white dark:ring-slate-900 select-none overflow-hidden relative">
                {profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImage}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="tracking-tight">{initials}</span>
                )}
              </div>

              {/* Camera / Edit Photo Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-md transition-all transform hover:scale-105 cursor-pointer outline-none"
                aria-label={`Change profile photo for ${member.name}`}
                title="Change profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Remove Photo Button if photo exists */}
              {profileImage && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-0 right-0 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm transition-all transform hover:scale-110 cursor-pointer outline-none"
                  aria-label={`Remove photo for ${member.name}`}
                  title="Remove photo and return to initials"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                  {member.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {member.relation}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Dependent Profile
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                <span>
                  {member.age ? `${member.age} yrs` : "Age N/A"} •{" "}
                  <span className="capitalize">{member.gender || "Profile"}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <HeartHandshake className="w-3.5 h-3.5 text-sky-500" />
                  <span>Managed under {primaryName}&apos;s Account</span>
                </span>
              </p>

              <div className="pt-0.5 text-[11px] text-slate-400 flex items-center gap-2">
                <span>Enrolled: {addedDateFormatted}</span>
                <span>•</span>
                <span className="font-mono">ID: #FAM-{member.id.replace("fam_", "").slice(0, 6).toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onEditMember(member)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Edit Member</span>
            </button>

            <button
              type="button"
              onClick={onOpenBooking}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            {onRemoveMember && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove ${member.name} from family profiles?`)) {
                    onRemoveMember(member.id);
                    onBack();
                  }
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-center cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
                title={`Remove ${member.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Member Care KPI Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Consultations
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {memberAppointments.length}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">visits</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Upcoming Visits
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-sky-600 dark:text-sky-400">
              {upcomingVisits.length}
            </span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">scheduled</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Completed Visits
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {completedVisits.length}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">recorded</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Clinical Privacy
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              Isolated
            </span>
          </div>
        </div>
      </div>

      {/* 4. Subnavigation Tabs for Member Sections */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: "overview", label: "Profile Overview", icon: User },
          {
            id: "appointments",
            label: "Appointments",
            icon: CalendarDays,
            badge: memberAppointments.length,
          },
          { id: "records", label: "Medical Records", icon: FileText },
          { id: "prescriptions", label: "Prescriptions", icon: Pill },
          { id: "lab-reports", label: "Lab Reports", icon: Activity },
          { id: "follow-ups", label: "Follow-ups", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ClinicalTab)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-sky-600 text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 5. TAB CONTENT */}

      {/* TAB 1: OVERVIEW (Personal Info + Relationship + Next Milestone) */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Information Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Personal Information
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Dependent personal identifiers and demographic data
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Full Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{member.name}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Age</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {member.age ? `${member.age} years old` : "Not specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Gender</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                    {member.gender || "Profile"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Profile Reference</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    FAM-{member.id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Enrollment Date</span>
                  <span className="text-slate-700 dark:text-slate-300">{addedDateFormatted}</span>
                </div>
              </div>
            </div>

            {/* Relationship & Guardianship Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Relationship to Account Holder
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Family hierarchy &amp; clinical governance status
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Family Relation</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400 capitalize">
                    {member.relation}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Primary Account Holder</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{primaryName}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Medical Chart Isolation</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Active &amp; Partitioned
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Booking Privilege</span>
                  <span className="text-slate-700 dark:text-slate-300">Authorized</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">SMS &amp; WhatsApp Alerts</span>
                  <span className="text-slate-700 dark:text-slate-300">Routed to Guardian</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Visit Callout if available */}
          {nextUpcomingMilestone && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50/80 to-teal-50/80 dark:from-sky-950/30 dark:to-teal-950/30 border border-sky-200 dark:border-sky-900 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider block">
                    Upcoming Appointment for {member.name}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {nextUpcomingMilestone.doctorName} • {nextUpcomingMilestone.doctorSpecialty}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span>{nextUpcomingMilestone.clinicName}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {nextUpcomingMilestone.date} at {nextUpcomingMilestone.timeSlot}
                    </span>
                  </p>
                </div>
              </div>

              {onViewAppointmentDetail && (
                <button
                  type="button"
                  onClick={() => onViewAppointmentDetail(nextUpcomingMilestone)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors shrink-0 shadow-2xs self-start sm:self-auto cursor-pointer"
                >
                  View Details &amp; Pass
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPOINTMENTS (Member-Isolated) */}
      {activeTab === "appointments" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Appointments for {member.name} ({memberAppointments.length})
            </h3>
            <button
              type="button"
              onClick={onOpenBooking}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book New Appointment</span>
            </button>
          </div>

          {memberAppointments.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Appointments Booked for {member.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Schedule clinical visits, consultations, or follow-ups for {member.name} under your family care unit.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book First Appointment</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {memberAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-900">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {apt.doctorName}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                          {apt.doctorSpecialty}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === "confirmed"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : apt.status === "completed"
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{apt.clinicName}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span>{apt.date} at {apt.timeSlot}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span>Ref: {apt.bookingRef}</span>
                        <span>•</span>
                        <span>Fee: ${apt.consultationFee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {onToggleWhatsApp && (
                      <button
                        type="button"
                        onClick={() => onToggleWhatsApp(apt.id)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          apt.remindViaWhatsApp
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                        }`}
                        title="Toggle WhatsApp Reminder"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}

                    {onViewAppointmentDetail && (
                      <button
                        type="button"
                        onClick={() => onViewAppointmentDetail(apt)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MEDICAL RECORDS (Member-Isolated) */}
      {activeTab === "records" && (
        <div className="space-y-4">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No Clinical Medical Records for {member.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                When doctors record consultation notes, patient diagnoses, or clinical assessments for {member.name}, they will appear here under this isolated dependent chart.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Clinical Checkup</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: PRESCRIPTIONS (Member-Isolated) */}
      {activeTab === "prescriptions" && (
        <div className="space-y-4">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No Active Prescriptions for {member.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                Physician e-prescriptions, dosage instructions, and refill orders issued specifically for {member.name} will be listed here.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Consult a Doctor for Medication</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: LAB REPORTS (Member-Isolated) */}
      {activeTab === "lab-reports" && (
        <div className="space-y-4">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No Diagnostic Reports for {member.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                Pathology lab tests, radiology scans, and blood work for {member.name} will be securely stored here.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Lab or Scan Consultation</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: FOLLOW-UPS (Member-Isolated) */}
      {activeTab === "follow-ups" && (
        <div className="space-y-4">
          {nextUpcomingMilestone ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Next Scheduled Milestone for {member.name}
                </h4>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                    {nextUpcomingMilestone.doctorName}
                  </h5>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                    {nextUpcomingMilestone.doctorSpecialty} • {nextUpcomingMilestone.clinicName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{nextUpcomingMilestone.date} at {nextUpcomingMilestone.timeSlot}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Schedule Another Follow-up
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  No Follow-Up Visits Scheduled for {member.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  Postoperative checkups, medication reviews, and routine health evaluations will be tracked here.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Follow-Up</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

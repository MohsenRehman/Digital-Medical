"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Award,
  Lock,
  Plus,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  FileText,
} from "lucide-react";
import { DoctorProfile } from "@/lib/types/doctor";

interface ProfessionalInfoFormProps {
  doctor: DoctorProfile;
  onSave: (updates: Partial<DoctorProfile>) => void;
}

const COMMON_LANGUAGES = [
  "English",
  "Urdu",
  "Pashto",
  "Punjabi",
  "Sindhi",
  "Balochi",
  "Saraiki",
  "Arabic",
];

const BIO_CHAR_LIMIT = 600;

export default function ProfessionalInfoForm({ doctor, onSave }: ProfessionalInfoFormProps) {
  const [specialty, setSpecialty] = useState(doctor.specialty || "Cardiologist");
  const [subSpecialty, setSubSpecialty] = useState(doctor.subSpecialty || "");
  const [title, setTitle] = useState(doctor.title || "Consultant Cardiologist & Electrophysiologist");
  const [experienceYears, setExperienceYears] = useState(doctor.experienceYears || 16);
  const [qualifications, setQualifications] = useState<string[]>(doctor.qualifications || []);
  const [newQualification, setNewQualification] = useState("");
  const [languages, setLanguages] = useState<string[]>(doctor.languages || ["English", "Urdu"]);
  const [bio, setBio] = useState(doctor.bio || "");

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddQualification = () => {
    if (newQualification.trim() && !qualifications.includes(newQualification.trim())) {
      setQualifications([...qualifications, newQualification.trim()]);
      setNewQualification("");
    }
  };

  const handleRemoveQualification = (idx: number) => {
    setQualifications(qualifications.filter((_, i) => i !== idx));
  };

  const handleToggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) {
        setLanguages(languages.filter((l) => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!specialty.trim()) errs.specialty = "Medical specialty is required.";
    if (!title.trim()) errs.title = "Professional clinical title is required.";
    if (experienceYears < 0 || experienceYears > 70) errs.experienceYears = "Valid experience years required.";
    if (qualifications.length === 0) errs.qualifications = "At least one accredited qualification required.";
    if (bio.length > BIO_CHAR_LIMIT) errs.bio = `Bio exceeds maximum of ${BIO_CHAR_LIMIT} characters.`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setTimeout(() => {
      onSave({
        specialty,
        subSpecialty,
        title,
        experienceYears,
        qualifications,
        languages,
        bio,
      });
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  };

  const bioLength = bio.length;
  const isNearLimit = bioLength > BIO_CHAR_LIMIT * 0.85;
  const isOverLimit = bioLength > BIO_CHAR_LIMIT;

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Professional & Clinical Information
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Specialty, medical degrees, council licensing credentials, and clinical biography.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          PUBLIC DIRECTORY
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Professional information saved successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Primary Specialty */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Primary Medical Specialty <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Stethoscope className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                errors.specialty ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
              } text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500`}
              placeholder="e.g. Cardiologist"
            />
          </div>
          {errors.specialty && <p className="text-[10px] text-rose-500 mt-1">{errors.specialty}</p>}
        </div>

        {/* Sub-Specialty Focus */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Sub-Specialty / Clinical Interests
          </label>
          <input
            type="text"
            value={subSpecialty}
            onChange={(e) => setSubSpecialty(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="e.g. Interventional Cardiology & Hypertension"
          />
        </div>

        {/* Professional Clinical Title */}
        <div className="md:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Professional Title / Designation <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
              errors.title ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
            } text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500`}
            placeholder="e.g. Consultant Cardiologist & Electrophysiologist"
          />
          {errors.title && <p className="text-[10px] text-rose-500 mt-1">{errors.title}</p>}
        </div>

        {/* PMDC Registration Number (Protected) */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            PMDC Registration Number (Protected)
          </label>
          <div className="relative">
            <input
              type="text"
              disabled
              value={doctor.pmdcRegistration}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-600 dark:text-slate-400 cursor-not-allowed"
            />
            <Lock className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            PMDC license is tied to your verified clinical practitioner credentials.
          </span>
        </div>

        {/* Years of Experience */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Years of Post-Graduate Clinical Experience <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              min="0"
              max="70"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                errors.experienceYears ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
              } text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-sky-500`}
            />
          </div>
          {errors.experienceYears && <p className="text-[10px] text-rose-500 mt-1">{errors.experienceYears}</p>}
        </div>
      </div>

      {/* Qualifications Manager */}
      <div className="space-y-2 pt-2">
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
          Accredited Degrees & Fellowships <span className="text-rose-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {qualifications.map((q, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-semibold text-xs"
            >
              <Award className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <span>{q}</span>
              <button
                type="button"
                onClick={() => handleRemoveQualification(idx)}
                className="p-0.5 rounded-md hover:bg-sky-200/60 dark:hover:bg-sky-800 text-sky-700 dark:text-sky-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newQualification}
            onChange={(e) => setNewQualification(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddQualification();
              }
            }}
            placeholder="Add qualification (e.g. Fellowship in Cardiac Electrophysiology)..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="button"
            onClick={handleAddQualification}
            className="px-3.5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
        {errors.qualifications && <p className="text-[10px] text-rose-500">{errors.qualifications}</p>}
      </div>

      {/* Languages Spoken (Multi-select) */}
      <div className="space-y-2 pt-2">
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
          Languages Spoken With Patients (Multi-select)
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_LANGUAGES.map((lang) => {
            const isSelected = languages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => handleToggleLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                {lang} {isSelected && "✓"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clinical Bio with Character Counter */}
      <div className="space-y-1.5 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
            Professional Biography
          </label>
          <span
            className={`text-[10px] font-mono font-bold ${
              isOverLimit ? "text-rose-600" : isNearLimit ? "text-amber-600" : "text-slate-400"
            }`}
          >
            {bioLength} / {BIO_CHAR_LIMIT} characters
          </span>
        </div>
        <textarea
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Brief clinical background, key areas of clinical expertise, hospital appointments, and patient care philosophy..."
          className={`w-full p-3.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border ${
            isOverLimit ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 dark:border-slate-700"
          } text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500`}
        />
        {errors.bio && <p className="text-[10px] text-rose-500">{errors.bio}</p>}
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="submit"
          disabled={saving || isOverLimit}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? "Saving Changes..." : "Save Professional Info"}</span>
        </button>
      </div>
    </form>
  );
}

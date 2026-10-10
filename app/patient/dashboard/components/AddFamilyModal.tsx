"use client";

import React, { useState } from "react";
import { X, UserPlus, ShieldCheck, Heart, Users } from "lucide-react";
import { AppointmentRelation, GenderType } from "@/lib/types/patient";
import CustomSelect from "./CustomSelect";

interface AddFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    relation: AppointmentRelation;
    name: string;
    age?: number;
    gender?: GenderType;
  }) => void;
}

export default function AddFamilyModal({ isOpen, onClose, onAdd }: AddFamilyModalProps) {
  const [relation, setRelation] = useState<AppointmentRelation>("son");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<GenderType>("male");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the family member's full name.");
      return;
    }

    onAdd({
      relation,
      name: name.trim(),
      age: age ? parseInt(age, 10) : undefined,
      gender,
    });

    setName("");
    setAge("");
    setError("");
    onClose();
  };

  const relationOptions: { value: AppointmentRelation; label: string }[] = [
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "spouse", label: "Spouse" },
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "other", label: "Other Dependent" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                Add Family Member
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Create a separate medical profile under your account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="mt-3.5 p-3 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 text-[11px] text-sky-800 dark:text-sky-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <span>
            <strong className="font-semibold">Isolated Patient Profile:</strong> Appointments, prescriptions, and medical records will be recorded specifically under this profile.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-300 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Relationship to You
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {relationOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setRelation(opt.value)}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    relation === opt.value
                      ? "bg-sky-600 text-white border-sky-600 shadow-2xs"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-500"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ali Ahmed"
              className="w-full px-3 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Age (Years)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 8"
                className="w-full px-3 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <CustomSelect
                value={gender}
                onChange={(val) => setGender(val as GenderType)}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                className="w-full"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-2xs transition-all cursor-pointer"
            >
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

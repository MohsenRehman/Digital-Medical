"use client";

import React, { useState, useEffect } from "react";
import { X, Edit3, Users } from "lucide-react";
import { AppointmentRelation, GenderType, FamilyMemberRecord } from "@/lib/types/patient";
import CustomSelect from "./CustomSelect";

interface EditFamilyModalProps {
  isOpen: boolean;
  member: FamilyMemberRecord | null;
  onClose: () => void;
  onSave: (
    memberId: string,
    data: {
      relation: AppointmentRelation;
      name: string;
      age?: number;
      gender?: GenderType;
    }
  ) => void;
}

export default function EditFamilyModal({
  isOpen,
  member,
  onClose,
  onSave,
}: EditFamilyModalProps) {
  const [relation, setRelation] = useState<AppointmentRelation>("son");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<GenderType>("male");
  const [error, setError] = useState("");

  useEffect(() => {
    if (member) {
      setName(member.name || "");
      setRelation(member.relation || "other");
      setAge(member.age !== undefined ? String(member.age) : "");
      setGender(member.gender || "male");
      setError("");
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the family member's full name.");
      return;
    }

    onSave(member.id, {
      relation,
      name: name.trim(),
      age: age ? parseInt(age, 10) : undefined,
      gender,
    });

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
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                Edit Family Member
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Update dependent identity &amp; relationship info
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Relationship to You *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {relationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRelation(opt.value)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    relation === opt.value
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Muhammad Ismail"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Age
              </label>
              <input
                type="number"
                min="0"
                max="125"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 62"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

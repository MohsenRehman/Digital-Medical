"use client";

import React, { useState, useRef } from "react";
import {
  Camera,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Info,
} from "lucide-react";

interface ProfilePhotoUploaderProps {
  currentPhotoUrl: string;
  onPhotoChange: (newUrl: string) => void;
}

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop";

export default function ProfilePhotoUploader({
  currentPhotoUrl,
  onPhotoChange,
}: ProfilePhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string>(currentPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Invalid file format. Please upload a JPG, JPEG, PNG, or WEBP image.");
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg("File size exceeds 5MB. Please upload an image under 5MB.");
      return;
    }

    // Read and preview client-side
    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      setTimeout(() => {
        setPreviewUrl(result);
        onPhotoChange(result);
        setIsUploading(false);
        setSuccessMsg("Profile photo updated successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }, 600);
    };

    reader.onerror = () => {
      setIsUploading(false);
      setErrorMsg("Failed to read image file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(DEFAULT_AVATAR);
    onPhotoChange(DEFAULT_AVATAR);
    setSuccessMsg("Profile photo reset to default avatar.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Doctor Profile Photo
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This photograph appears on your public doctor profile, digital prescriptions, and patient booking pages.
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          PUBLIC DIRECTORY
        </span>
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fadeInUp">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Photo Display with overlay */}
        <div className="relative group flex-shrink-0">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-md relative">
            <img
              src={previewUrl}
              alt="Doctor Profile Photo"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mb-1 text-sky-400" />
                <span>Uploading...</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white shadow-md ring-2 ring-white dark:ring-slate-900 transition-transform active:scale-95"
            title="Upload new photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons and Guidance */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Change Photo</span>
            </button>

            <button
              type="button"
              onClick={handleRemovePhoto}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Remove Photo</span>
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Info className="w-3.5 h-3.5 text-sky-600" />
              <span>Recommended Image Specifications</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-1">
              <li>Square crop (1:1 ratio), minimum 400x400 pixels resolution</li>
              <li>Clear head-and-shoulders portrait with clinical or neutral background</li>
              <li>Supported formats: JPG, PNG, WEBP (Maximum size: 5MB)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

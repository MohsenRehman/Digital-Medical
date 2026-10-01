"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  color?: string;
  label?: string;
}

export function LoadingSpinner({
  size = "sm",
  className = "",
  color = "currentColor",
  label = "Loading...",
}: LoadingSpinnerProps) {
  const sizeMap = {
    xs: "w-3 h-3 border-[1.5px]",
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-7 h-7 border-[2.5px]",
  };

  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <span
        style={{ borderColor: `${color} transparent transparent transparent` }}
        className={`rounded-full animate-spin inline-block border-solid ${sizeMap[size]}`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function InlineLoader({
  text = "Updating...",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-medium ${className}`}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="xs" color="#0284c7" />
      <span>{text}</span>
    </span>
  );
}

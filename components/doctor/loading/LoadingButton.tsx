"use client";

import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function LoadingButton({
  loading = false,
  loadingText,
  icon: Icon,
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  children,
  onClick,
  ...props
}: LoadingButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed select-none shadow-xs";

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-xs gap-2",
    lg: "px-4 py-2 text-sm gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-sky-600 hover:bg-sky-700 text-white focus-visible:ring-sky-500 disabled:bg-sky-600/60 disabled:hover:bg-sky-600/60",
    secondary:
      "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 focus-visible:ring-slate-400 disabled:opacity-60",
    outline:
      "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus-visible:ring-sky-500 disabled:opacity-60",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500 disabled:bg-rose-600/60",
    ghost:
      "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-60 shadow-none",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      onClick={loading ? undefined : onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {loading ? (
        <>
          <LoadingSpinner
            size={size === "lg" ? "sm" : "xs"}
            color="currentColor"
            label="Loading"
          />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className={size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}

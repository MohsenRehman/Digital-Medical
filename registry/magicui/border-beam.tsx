"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorVia?: string;
  colorTo?: string;
}

/**
 * BorderBeam
 * ──────────
 * Draws a glowing beam that travels around the parent's border.
 *
 * Requirements on the parent:
 *   • position: relative  (or absolute/fixed)
 *   • overflow: hidden     ← clip the beam to the shape
 *   • border-radius: any  ← the beam inherits it
 */
export function BorderBeam({
  className,
  duration = 7,
  delay = 0,
  borderWidth = 1.5,
  colorFrom = "transparent",
  colorVia = "#38bdf8",
  colorTo = "transparent",
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 rounded-[inherit]", className)}
    >
      {/*
        Technique:
          padding = borderWidth  → defines the "ring" zone between content-box & padding-box
          background = conic-gradient rotating via @keyframes border-beam-spin
          mask = two overlapping solid layers XOR'd → only the padding ring is visible
      */}
      <div
        style={
          {
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            padding: `${borderWidth}px`,
            background: `conic-gradient(from var(--beam-angle, 0deg), ${colorFrom} 0%, ${colorVia} 50%, ${colorTo} 100%)`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animationName: "border-beam-spin",
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: delay > 0 ? `-${delay}s` : "0s",
          } as CSSProperties
        }
      />
    </div>
  );
}

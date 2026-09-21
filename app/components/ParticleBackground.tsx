"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  layer: number;
  isOrb: boolean;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Controlled particle count: elegant, sparse, non-distracting (~40-50 particles on desktop)
    const particleCount = Math.min(Math.max(Math.floor(window.innerWidth / 32), 30), 52);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isOrb = i % 5 === 0; // ~20% are soft glowing bokeh orbs
      // Soft, refined opacity: clearly visible yet gentle on the eyes and reading text
      const baseAlpha = isOrb
        ? Math.random() * 0.12 + 0.28 // 0.28 to 0.40 for soft orbs
        : Math.random() * 0.10 + 0.20; // 0.20 to 0.30 for standard motes

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isOrb ? Math.random() * 2.2 + 2.8 : Math.random() * 1.4 + 1.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.28 - 0.06, // Graceful, slow upward float
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: Math.random() * 0.015 + 0.008,
        layer: isOrb ? 1.3 : 1.0,
        isOrb,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      const isDark = theme === "dark" || document.documentElement.classList.contains("dark");
      
      // Harmonious, soothing medical palette
      const baseColor = isDark ? "125, 211, 252" : "2, 132, 199";   // sky-300 / sky-600
      const orbColor = isDark ? "56, 189, 248" : "14, 165, 233";    // sky-400 / sky-500

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smooth drift
        p.x += p.vx * p.layer;
        p.y += p.vy * p.layer;

        // Gentle breathing pulse
        p.alpha = p.baseAlpha + Math.sin(tick * p.pulseSpeed + i) * 0.06;
        const currentAlpha = Math.max(0.12, Math.min(0.48, p.alpha));

        // Soft mouse repulsion
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 2000;
          p.x -= dx * force;
          p.y -= dy * force;
        }

        // Seamless screen wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        const color = p.isOrb ? orbColor : baseColor;
        const outerRadius = p.radius * 2.2;

        // Soft-edged radial gradient prevents any hard pixel borders
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, outerRadius);
        grad.addColorStop(0, `rgba(${color}, ${currentAlpha})`);
        grad.addColorStop(0.4, `rgba(${color}, ${currentAlpha * 0.65})`);
        grad.addColorStop(1, `rgba(${color}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, outerRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}

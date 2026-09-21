"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Send,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="relative bg-[#070e1b] text-slate-300 pt-20 pb-12 overflow-hidden border-t border-slate-800">
      
      {/* Oversized Watermark Typography from PDF (Technique #27) */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 watermark-text text-white/5 whitespace-nowrap select-none pointer-events-none"
      >
        DIGITAL MEDICAL
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-800/80">
          
          {/* Brand Info (col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Digital<span className="text-sky-400">Medical</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-6">
              A nationwide healthcare network dedicated to making world-class medical specialists, diagnostic labs, and urgent appointments accessible to all.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#social"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#social"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#social"
                aria-label="Twitter"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#social"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#social"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links: About (col 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              About
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="#hero" className="hover:text-sky-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#specialties" className="hover:text-sky-400 transition-colors">
                  Clinical Services
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-sky-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#schedule" className="hover:text-sky-400 transition-colors">
                  Doctor Schedule
                </Link>
              </li>
              <li>
                <Link href="#clinics-join" className="hover:text-sky-400 transition-colors">
                  Join As Clinic
                </Link>
              </li>
              <li>
                <a href="#privacy" className="hover:text-sky-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links: Services (col 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="#clinics" className="hover:text-sky-400 transition-colors">
                  Clinics & Hospitals
                </Link>
              </li>
              <li>
                <Link href="#doctors" className="hover:text-sky-400 transition-colors">
                  Find Specialists
                </Link>
              </li>
              <li>
                <Link href="#specialties" className="hover:text-sky-400 transition-colors">
                  24/7 Diagnostics Lab
                </Link>
              </li>
              <li>
                <Link href="#specialties" className="hover:text-sky-400 transition-colors">
                  Certified Pharmacy
                </Link>
              </li>
              <li>
                <Link href="#articles" className="hover:text-sky-400 transition-colors">
                  Health Articles
                </Link>
              </li>
              <li>
                <a href="#terms" className="hover:text-sky-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter (col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact &amp; Newsletter
            </h4>
            
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-white font-medium">+1 (800) 689-2500</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>support@digitalmedical.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>100 Medical Center Parkway, NY 10016</span>
              </div>
            </div>

            {/* Newsletter input from screenshot */}
            <form onSubmit={handleSubscribe} className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Subscribe for weekly health digests:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-full bg-slate-800 text-xs text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>SUBSCRIBE</span>
                </button>
              </div>
              {subscribed && (
                <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed successfully!
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>
            Copyright &copy; 2026 Digital Medical Inc. All rights reserved. Built with Next.js &amp; CSS Animation Bible specifications.
          </p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-slate-400">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-400">Terms of Use</a>
            <span>•</span>
            <a href="#security" className="hover:text-slate-400">HIPAA Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

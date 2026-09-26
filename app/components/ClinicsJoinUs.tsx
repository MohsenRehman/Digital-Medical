"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  User,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { BorderBeam } from "@/registry/magicui/border-beam";

/* ── Shared input class — fully opaque bg so text is always legible ── */
const INPUT =
  "w-full pl-10 pr-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 " +
  "bg-slate-50 dark:bg-slate-800 " +
  "text-slate-900 dark:text-white " +
  "border border-slate-300 dark:border-slate-600 " +
  "placeholder:text-slate-400 dark:placeholder:text-slate-400 " +
  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 dark:focus:border-sky-400 " +
  "shadow-sm";

const INPUT_NO_ICON =
  "w-full px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 " +
  "bg-slate-50 dark:bg-slate-800 " +
  "text-slate-900 dark:text-white " +
  "border border-slate-300 dark:border-slate-600 " +
  "placeholder:text-slate-400 dark:placeholder:text-slate-400 " +
  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 dark:focus:border-sky-400 " +
  "shadow-sm";

/* ── Label — bright & readable on dark glass bg ── */
const LABEL = "block text-xs font-bold text-slate-200 dark:text-slate-200 mb-1.5 tracking-wide uppercase";

export default function ClinicsJoinUs() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    category: "General Medicine",
    clinicName: "",
    licenseNumber: "",
    labAvailable: true,
    pharmacyAvailable: true,
    emergency24: false,
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      alert("Please enter First Name and Email address.");
      return;
    }
    setCurrentStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <section id="clinics-join" className="py-16 sm:py-24 relative z-10 overflow-hidden">
      {/* Background with deep gradient overlay — matches site palette */}
      <div className="absolute inset-0 -z-10 bg-slate-900">
        <Image
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1600&auto=format&fit=crop"
          alt="Doctors team background"
          fill
          className="object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950/95 via-[#070e1b]/97 to-sky-900/90" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header — matches Medical Specialties style ── */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Clinics — Join Us
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Clinic owners — register your clinic profile, enable digital pharmacy sync, and receive verified patient bookings.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/clinic/register"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-full bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-lg shadow-sky-600/30 transition-all group cursor-pointer max-w-full text-center"
            >
              <span>Launch Clinic Registration Wizard</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
            </Link>
          </div>
        </div>

        {/* ── Stepper Card — glassmorphism matching site theme ── */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 dark:border-slate-700/60 bg-white/[0.04] dark:bg-slate-900/70 backdrop-blur-2xl shadow-2xl shadow-sky-950/40 p-4 sm:p-10">

          {/* Step Progress Tabs */}
          <div className="grid grid-cols-2 gap-3 mb-8 pb-6 border-b border-white/10 dark:border-slate-800">
            {[
              { step: 1 as const, label: "Contact Details" },
              { step: 2 as const, label: "Clinic Services" },
            ].map(({ step, label }) => (
              <button
                key={step}
                type="button"
                onClick={() => {
                  if (step === 1) setCurrentStep(1);
                  if (step === 2 && formData.firstName && formData.email) setCurrentStep(2);
                }}
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  currentStep === step
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30"
                    : "bg-white/5 dark:bg-slate-800/60 text-slate-300 hover:bg-white/10 dark:hover:bg-slate-700/60 border border-white/10 dark:border-slate-700"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                  currentStep === step ? "bg-white/20 text-white" : "bg-white/10 text-slate-300"
                }`}>
                  {step}
                </span>
                Step {step}: {label}
              </button>
            ))}
          </div>

          {/* ── Success State ── */}
          {isSuccess ? (
            <div className="py-12 text-center space-y-4 animate-fadeInUp">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-lg ring-2 ring-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Registration Submitted!
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you,{" "}
                <span className="font-semibold text-white">{formData.firstName}</span>. Our
                onboarding team will verify your accreditation and activate your digital
                profile within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => { setIsSuccess(false); setCurrentStep(1); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer"
                >
                  Register Another Clinic
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={currentStep === 1 ? handleStep1Submit : handleFinalSubmit}>

              {/* ── Step 1 ── */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fadeInUp">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className={LABEL}>First Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-sky-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="text" name="firstName" required
                          placeholder="e.g. Dr. Jennifer"
                          value={formData.firstName} onChange={handleChange}
                          className={INPUT}
                        />
                      </div>
                    </div>
                    {/* Last Name */}
                    <div>
                      <label className={LABEL}>Last Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-sky-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="text" name="lastName" required
                          placeholder="e.g. Adams"
                          value={formData.lastName} onChange={handleChange}
                          className={INPUT}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className={LABEL}>Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-sky-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="email" name="email" required
                          placeholder="clinic@example.com"
                          value={formData.email} onChange={handleChange}
                          className={INPUT}
                        />
                      </div>
                    </div>
                    {/* City */}
                    <div>
                      <label className={LABEL}>City / Location</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-sky-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="text" name="city"
                          placeholder="e.g. New York, NY"
                          value={formData.city} onChange={handleChange}
                          className={INPUT}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className={LABEL}>Phone / Direct Line</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-sky-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <input
                          type="tel" name="phone"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone} onChange={handleChange}
                          className={INPUT}
                        />
                      </div>
                    </div>
                    {/* Specialty */}
                    <div>
                      <label className={LABEL}>Primary Specialty Category</label>
                      <div className="relative">
                        <Stethoscope className="w-4 h-4 text-sky-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        <select
                          name="category"
                          value={formData.category} onChange={handleChange}
                          className={INPUT + " appearance-none"}
                        >
                          <option value="General Medicine">General Medicine &amp; Family</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Pulmonology">Pulmonology</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Diagnostics">Laboratory &amp; Imaging Center</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-full font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 active:scale-95 shadow-lg shadow-sky-600/30 flex items-center gap-2 cursor-pointer transition-all duration-200"
                    >
                      <span>Continue to Step 2</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 2 ── */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fadeInUp">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Clinic Name */}
                    <div>
                      <label className={LABEL}>Clinic / Facility Legal Name *</label>
                      <input
                        type="text" name="clinicName" required
                        placeholder="e.g. Metro Care Health Center"
                        value={formData.clinicName} onChange={handleChange}
                        className={INPUT_NO_ICON}
                      />
                    </div>
                    {/* License */}
                    <div>
                      <label className={LABEL}>Medical License / Accreditation No. *</label>
                      <input
                        type="text" name="licenseNumber" required
                        placeholder="e.g. MED-NYC-98402"
                        value={formData.licenseNumber} onChange={handleChange}
                        className={INPUT_NO_ICON}
                      />
                    </div>
                  </div>

                  {/* Facilities */}
                  <div>
                    <label className={LABEL}>Facilities Available on Site</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { name: "labAvailable", checked: formData.labAvailable, label: "24/7 Pathology Lab" },
                        { name: "pharmacyAvailable", checked: formData.pharmacyAvailable, label: "In-House Pharmacy" },
                        { name: "emergency24", checked: formData.emergency24, label: "24/7 Emergency Unit" },
                      ].map((item) => (
                        <label
                          key={item.name}
                          className={`flex items-center gap-2.5 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                            item.checked
                              ? "border-sky-500 bg-sky-500/10 dark:bg-sky-500/10"
                              : "border-white/10 dark:border-slate-700 bg-white/5 dark:bg-slate-800/40 hover:border-sky-500/50"
                          }`}
                        >
                          <input
                            type="checkbox" name={item.name}
                            checked={item.checked} onChange={handleChange}
                            className="w-4 h-4 accent-sky-500 rounded"
                          />
                          <span className={`text-xs font-semibold ${item.checked ? "text-sky-400" : "text-slate-300"}`}>
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 rounded-full font-semibold text-xs text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 flex items-center gap-1.5 cursor-pointer transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Step 1
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-full font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 active:scale-95 shadow-lg shadow-sky-600/30 flex items-center gap-2 cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Register Clinic Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}



          {/* ── BorderBeam matching site ── */}
          <BorderBeam duration={8} size={300} colorFrom="transparent" colorVia="#38bdf8" colorTo="transparent" />
          <BorderBeam duration={8} delay={4} size={300} borderWidth={2} colorFrom="transparent" colorVia="#818cf8" colorTo="transparent" />
        </div>

      </div>
    </section>
  );
}

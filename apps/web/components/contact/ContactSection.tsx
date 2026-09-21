"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  MapPin,
  Sparkles,
  Send,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Clock,
} from "lucide-react";

const serviceOptions = [
  "AI Video Production",
  "Social Media Management",
  "Web & AI Automation",
  "Brand Growth Strategy",
  "Website Development",
  "Web Application Development",
  "eCommerce Development",
  "Mobile App Development",
  "Digital Marketing",
  "Content Creation",
  "Graphic Design & Branding",
  "Website Security & Maintenance",
  "Creator Academy",
  "Custom Project",
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    whatsapp: "",
    service: serviceOptions[0],
    brief: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          company: formData.company,
          email: formData.email,
          whatsapp: formData.whatsapp,
          service: formData.service,
          brief: formData.brief,
        }),
      });
    } catch (err) {
      console.warn("Lead submission network fallback:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          fullName: "",
          company: "",
          email: "",
          whatsapp: "",
          service: serviceOptions[0],
          brief: "",
        });
      }, 5000);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden pt-28 pb-32 scroll-mt-24"
    >
      {/* Subtle Blue/Purple Radial Ambient Background Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-48 top-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[150px] transform-gpu" />
        <div className="absolute -right-48 bottom-10 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[160px] transform-gpu" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[180px] transform-gpu" />

        {/* Subtle Floating Ambient Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-15, -45, -15],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + (i % 5) * 1.5,
              ease: "easeInOut",
            }}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.5)] transform-gpu"
            style={{
              left: `${8 + i * 8}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-[1280px] px-6">
        {/* Responsive Grid: Left Information & Right Glass Card Form */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* ================= LEFT COLUMN ================= */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 lg:col-span-6"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Let's Talk</span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
              </div>

              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                Let's build your next{" "}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  AI project.
                </span>
              </h2>

              <p className="max-w-xl text-base text-zinc-400 leading-relaxed sm:text-lg">
                WorknAI Media is an autonomous AI media operating system. We partner with visionary brands to design intelligent media pipelines, hyper-realistic content engines, and automated distribution architectures that scale organic reach exponentially.
              </p>
            </div>

            {/* Direct Contact Channels */}
            <div className="space-y-4 pt-2">
              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919823000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                      Direct WhatsApp Chat
                    </span>
                    <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      +91 98230 00000
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Start Chat</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:contact@worknai.media"
                className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.06]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Official Inquiries
                  </span>
                  <p className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    contact@worknai.media
                  </p>
                </div>
              </a>

              {/* Pune Location */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Headquarters & Innovation Labs
                  </span>
                  <p className="text-sm font-bold text-white">
                    Pune, Maharashtra, India
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time Badge */}
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span>Typical response time: <strong className="text-zinc-200">Under 2 hours</strong></span>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN (GLASS CARD) ================= */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-[32px] border border-white/10 bg-white/[0.04] p-7 sm:p-9 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]">
              {/* Form Title */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">
                  Send Project Directive
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Tell us about your brand goals. Our AI media engineers will prepare a custom proposal.
                </p>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Directive Received!
                  </h4>
                  <p className="mt-1.5 max-w-xs text-xs text-zinc-400">
                    Thank you, {formData.fullName || "Partner"}. Our engineering team will review your project and connect via WhatsApp/Email shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name & Company Row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Full Name <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="e.g. Alex Morgan"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-zinc-500 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        placeholder="e.g. WorknAI Media"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-zinc-500 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                      />
                    </div>
                  </div>

                  {/* Work Email & WhatsApp Number Row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Work Email <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="name@company.com"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-zinc-500 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        WhatsApp Number <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.whatsapp}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsapp: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-zinc-500 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                      />
                    </div>
                  </div>

                  {/* Service Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      Target Project / Service <span className="text-blue-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                        className="w-full appearance-none rounded-xl border border-white/10 bg-[#070D20] px-4 py-3 text-xs text-white transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-[0_0_15px_rgba(59,130,246,0.25)] pr-10"
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#0B1020] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    </div>
                  </div>

                  {/* Project Brief Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      Project Brief & Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={formData.brief}
                      onChange={(e) =>
                        setFormData({ ...formData, brief: e.target.value })
                      }
                      placeholder="Tell us about your brand, target deliverables, or goals..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder-zinc-500 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-[0_0_15px_rgba(59,130,246,0.25)] leading-relaxed"
                    />
                  </div>

                  {/* Gradient Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3.5 px-6 font-semibold text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 hover:shadow-blue-500/40 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span className="text-xs tracking-wide">Transmitting Directive...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 text-blue-200 transition-transform group-hover:translate-x-0.5" />
                        <span className="text-xs font-bold tracking-wide">Submit Project Request</span>
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-[10px] text-zinc-500 pt-1">
                    🔒 Secured with enterprise encryption. We never share your contact details.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

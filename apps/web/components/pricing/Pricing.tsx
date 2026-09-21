"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Check,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  PhoneCall,
  Calendar,
  Layers,
  Crown,
} from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  description: string;
  monthlyPrice: number | "custom";
  annualPrice: number | "custom";
  featured?: boolean;
  features: string[];
  cta: string;
  ctaVariant: "default" | "featured" | "outline";
}

export default function Pricing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  // Mouse hover specular tracking for cards
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredCard(cardId);
  };

  const plans: PricingPlan[] = [
    {
      id: "starter",
      name: "Starter",
      description: "Essential AI media generation tools for individual creators and solo entrepreneurs.",
      monthlyPrice: 999,
      annualPrice: 799,
      features: [
        "1 Brand Profile",
        "AI Post Generator",
        "30 Scheduled Posts / mo",
        "Basic Audience Analytics",
        "Community Support",
      ],
      cta: "Get Started",
      ctaVariant: "default",
    },
    {
      id: "professional",
      name: "Professional",
      badge: "Most Popular",
      description: "Comprehensive AI automation suite built for fast-growing businesses and active media agencies.",
      monthlyPrice: 2999,
      annualPrice: 2399,
      featured: true,
      features: [
        "Unlimited Brands",
        "AI Image Studio (4K HDR)",
        "Reels Script Generator",
        "Auto Social Scheduler",
        "Advanced Real-Time Analytics",
        "Priority 24/7 Support",
      ],
      cta: "Start Free Trial",
      ctaVariant: "featured",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Custom-tailored platform infrastructure, team governance and integrations for media enterprises.",
      monthlyPrice: "custom",
      annualPrice: "custom",
      features: [
        "Unlimited Team Members",
        "White Label Platform",
        "Full REST API Access",
        "Custom CRM & Zapier Integration",
        "Dedicated Account Manager",
      ],
      cta: "Contact Sales",
      ctaVariant: "outline",
    },
  ];

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden pt-28 pb-36">
      {/* Background Animated Gradient Mesh & Blurred Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Animated fluid blur orbs */}
        <motion.div
          animate={{
            x: [-30, 30, -30],
            y: [-20, 20, -20],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-600/15 to-indigo-600/10 blur-[160px]"
        />
        <motion.div
          animate={{
            x: [30, -30, 30],
            y: [20, -20, 20],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-1/4 bottom-1/3 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-purple-600/15 to-pink-600/10 blur-[170px]"
        />
      </div>

      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
              <Crown className="h-3.5 w-3.5" />
              <span>Choose Your Growth Plan</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Scale Your Business{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                with AI
              </span>
            </h2>

            <p className="mx-auto max-w-2xl text-base text-zinc-400">
              One platform for content creation, scheduling, analytics and business automation.
            </p>

            {/* Interactive Billing Switcher */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 ${
                  billingCycle === "annual"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  Save 20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* 3 Premium Pricing Cards in Center */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
          {plans.map((plan, idx) => {
            const isHovered = hoveredCard === plan.id;
            const price =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 35 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`relative ${plan.featured ? "lg:-translate-y-2 z-20" : "z-10"}`}
              >
                {/* Featured Outer Glow & Animated Gradient Border */}
                <div
                  onMouseMove={(e) => handleMouseMove(e, plan.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative overflow-hidden rounded-[32px] transition-all duration-300 ease-out hover:-translate-y-2.5 ${
                    plan.featured
                      ? "p-[1.5px] bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:shadow-[0_0_70px_rgba(59,130,246,0.5)]"
                      : "p-[1px] bg-white/10 hover:bg-white/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
                  }`}
                >
                  {/* Card Inner Glass Container */}
                  <div
                    className={`relative flex h-full flex-col justify-between rounded-[31px] p-8 backdrop-blur-2xl ${
                      plan.featured
                        ? "bg-[#050816]/95 bg-gradient-to-b from-blue-950/30 to-transparent"
                        : "bg-[#050816]/90 bg-white/[0.03]"
                    }`}
                  >
                    {/* Cursor Specular Sheen */}
                    <div
                      className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.2), transparent 75%)`,
                      }}
                    />

                    {/* Top Rim Highlight */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                    <div>
                      {/* Plan Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                          {plan.name}
                        </h3>

                        {plan.badge && (
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.4)] animate-pulse">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>{plan.badge}</span>
                          </div>
                        )}
                      </div>

                      <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                        {plan.description}
                      </p>

                      {/* Pricing Display */}
                      <div className="mt-6 border-b border-white/[0.08] pb-6">
                        {price === "custom" ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold tracking-tight text-white font-mono md:text-4xl">
                              Custom
                            </span>
                            <span className="text-xs text-zinc-400">/ tailored</span>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-extrabold tracking-tight text-white font-mono md:text-5xl">
                              ₹{price}
                            </span>
                            <span className="text-xs text-zinc-400">
                              / month
                            </span>
                          </div>
                        )}
                        {billingCycle === "annual" && price !== "custom" && (
                          <div className="mt-1 text-[11px] font-medium text-emerald-400">
                            Billed annually (₹{(price as number) * 12} / yr)
                          </div>
                        )}
                      </div>

                      {/* Feature List */}
                      <div className="mt-6 space-y-3.5">
                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Included Features
                        </div>
                        {plan.features.map((feat) => (
                          <div key={feat} className="flex items-start gap-2.5">
                            <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                            <span className="text-xs leading-5 text-zinc-300">
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8 pt-4">
                      {plan.ctaVariant === "featured" ? (
                        <button className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] active:scale-95">
                          <span>{plan.cta}</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </button>
                      ) : (
                        <button className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 active:scale-95">
                          <span>{plan.cta}</span>
                          <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform duration-200 group-hover/btn:translate-x-1 group-hover/btn:text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Premium Final CTA Glass Card with Floating Orbs */}
        <div className="relative mt-24">
          {/* Floating Blurred Orbs */}
          <div className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full bg-blue-600/25 blur-[120px]" />
          <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full bg-purple-600/25 blur-[130px]" />

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[36px] border border-white/15 bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-white/[0.03] p-10 md:p-16 backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-center"
          >
            {/* Specular Top Rim */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 via-50% to-transparent" />

            <div className="relative z-10 mx-auto max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
                <Sparkles className="h-4 w-4 animate-pulse text-blue-400" />
                <span>Next-Gen Media OS</span>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                Ready to Build the Future of Your{" "}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                  Media Business?
                </span>
              </h2>

              <p className="mx-auto max-w-xl text-base text-zinc-300 md:text-lg">
                Join creators, agencies and businesses already growing with WorknAI.
              </p>

              {/* Dual Action Buttons */}
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {/* Primary Button */}
                <button className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-105 active:scale-95">
                  <span>Launch WorknAI Studio</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                {/* Secondary Button */}
                <button className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/10 active:scale-95">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span>Book a Demo</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Star,
  Quote,
  TrendingUp,
  CheckCircle2,
  Building2,
  Sparkles,
  Heart,
  Plane,
  Home,
  Truck,
  Palette,
} from "lucide-react";

// --- Smooth Animated Counter Hook ---
function useAnimatedCounter(endValue: number, duration: number = 1800, shouldStart: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(easeProgress * endValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [endValue, duration, shouldStart]);

  return count;
}

// --- Star Rating Component with Shimmer ---
function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-amber-400 text-amber-400 transition-transform duration-300 hover:scale-125"
          style={{
            filter: "drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))",
            animation: `pulse 3s infinite ${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

// --- Smaller Testimonial Card Component ---
interface SmallCardProps {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  icon: React.ElementType;
  iconColor: string;
  index: number;
  isInView: boolean;
}

function SmallTestimonialCard({
  name,
  role,
  company,
  avatar,
  quote,
  icon: IconComponent,
  iconColor,
  index,
  isInView,
}: SmallCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
      >
        {/* Specular Cursor Glow */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(260px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.18), transparent 75%)`,
          }}
        />

        <div className="relative z-10">
          {/* Card Top: Avatar & Company Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt={name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white/15 group-hover:ring-blue-400/50 transition-all"
              />
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                  {name}
                </h4>
                <p className="text-xs text-zinc-400">{role}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur-md">
              <IconComponent className={`h-3.5 w-3.5 ${iconColor}`} />
              <span>{company}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="mt-4">
            <StarRating />
          </div>

          {/* Short Testimonial Quote */}
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            “{quote}”
          </p>
        </div>

        {/* Bottom Accent */}
        <div className="relative z-10 mt-5 border-t border-white/[0.06] pt-3 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified Customer
          </span>
          <span className="font-mono text-[11px] text-zinc-400">WorknAI Pro</span>
        </div>
      </div>
    </motion.div>
  );
}

// --- Stat Counter Item ---
function StatCounterItem({
  value,
  suffix = "",
  decimals = 0,
  label,
  isInView,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  isInView: boolean;
  delay?: number;
}) {
  const count = useAnimatedCounter(value, 1900, isInView);
  const formatted =
    (decimals ? count.toFixed(decimals) : Math.round(count).toString()) + suffix;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="text-4xl font-black tracking-tight text-white md:text-5xl font-mono">
        <span className="bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          {formatted}
        </span>
      </div>
      <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </div>
    </motion.div>
  );
}

// --- Main Success Stories Component ---
export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const [featuredMousePos, setFeaturedMousePos] = useState({ x: 0, y: 0 });
  const [featuredHovered, setFeaturedHovered] = useState(false);
  const featuredCardRef = useRef<HTMLDivElement>(null);

  const handleFeaturedMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!featuredCardRef.current) return;
    const rect = featuredCardRef.current.getBoundingClientRect();
    setFeaturedMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const smallCards = [
    {
      name: "Vikram Malhotra",
      role: "Head of Growth",
      company: "GoAirClass",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      quote: "Our flight booking campaigns saw a 3.8x ROI within 30 days of auto-generating 9:16 travel reels.",
      icon: Plane,
      iconColor: "text-blue-400",
    },
    {
      name: "Priya Sharma",
      role: "Operations Director",
      company: "PG Info",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      quote: "Generating room tour scripts and localized student housing ads saved our team 15+ hours every week.",
      icon: Home,
      iconColor: "text-purple-400",
    },
    {
      name: "Devendra Patel",
      role: "Marketing VP",
      company: "Online Go Logistics",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      quote: "Cross-posting scheduled automated updates across 4 platforms reduced our social media overhead by 65%.",
      icon: Truck,
      iconColor: "text-cyan-400",
    },
    {
      name: "Ananya Deshmukh",
      role: "Creative Lead",
      company: "WorknAI Studio",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      quote: "The AI Image Studio and Brand Voice models keep all our brand assets perfectly aligned and viral-ready.",
      icon: Palette,
      iconColor: "text-pink-400",
    },
  ];

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden pt-28 pb-32">
      {/* Background Aurora Lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute right-1/4 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-purple-600/10 blur-[160px]" />
      </div>

      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section Header */}
        <div className="mb-14 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
              <Heart className="h-3.5 w-3.5 fill-blue-400" />
              <span>Success Stories</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              Loved by Creators &{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Growing Businesses
              </span>
            </h2>

            <p className="max-w-2xl text-base text-zinc-400">
              See how brands are increasing reach, generating leads and automating their media workflow using WorknAI.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid: 1 Large Featured Card (Left) + 4 Small Cards (Right 2x2) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT: Large Featured Card (5 Columns on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div
              ref={featuredCardRef}
              onMouseMove={handleFeaturedMouseMove}
              onMouseEnter={() => setFeaturedHovered(true)}
              onMouseLeave={() => setFeaturedHovered(false)}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[30px] border border-blue-500/20 bg-gradient-to-b from-blue-950/30 via-white/[0.04] to-white/[0.02] p-8 backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/40 hover:shadow-[0_20px_50px_rgba(59,130,246,0.18)]"
            >
              {/* Specular Mouse Glow */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: featuredHovered ? 1 : 0,
                  background: `radial-gradient(350px circle at ${featuredMousePos.x}px ${featuredMousePos.y}px, rgba(139, 92, 246, 0.25), transparent 75%)`,
                }}
              />

              {/* Top Accent Rim */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

              <div className="relative z-10">
                {/* Founder Info Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
                        alt="Aarav Mehta"
                        className="h-16 w-16 rounded-2xl object-cover ring-2 ring-blue-400/50 shadow-lg"
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white ring-2 ring-[#050816]">
                        <CheckCircle2 className="h-3.5 w-3.5 fill-white text-blue-500" />
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                        Aarav Mehta
                      </h3>
                      <p className="text-xs font-medium text-zinc-400">
                        Founder & CEO, SkySprint Media
                      </p>
                      <div className="mt-1">
                        <StarRating count={5} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Big Quote */}
                <div className="mt-7 relative">
                  <Quote className="absolute -top-3 -left-2 h-8 w-8 text-blue-500/20 -z-10" />
                  <p className="text-lg font-medium leading-relaxed text-white md:text-xl">
                    “WorknAI reduced our entire content production cycle from{" "}
                    <span className="text-blue-300 underline decoration-blue-500/40 underline-offset-4">
                      2 weeks to under 4 hours
                    </span>
                    , while tripling our organic inbound leads across every brand channel.”
                  </p>
                </div>
              </div>

              {/* Bottom Metric Pill Card */}
              <div className="relative z-10 mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Performance Milestone
                    </div>
                    <div className="text-2xl font-black text-white font-mono mt-0.5">
                      +240% Reach
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 shadow-inner">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-zinc-300">
                  Organic audience expansion recorded across 90 days.
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Four Smaller Cards in 2x2 Grid (7 Columns on Desktop) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            {smallCards.map((card, idx) => (
              <SmallTestimonialCard
                key={card.name}
                name={card.name}
                role={card.role}
                company={card.company}
                avatar={card.avatar}
                quote={card.quote}
                icon={card.icon}
                iconColor={card.iconColor}
                index={idx}
                isInView={isInView}
              />
            ))}
          </div>
        </div>

        {/* Statistics Strip Below Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-14 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
        >
          {/* Top highlight line */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 via-50% to-transparent" />

          {/* 4 Counter Columns */}
          <div className="grid grid-cols-2 divide-y divide-white/[0.08] sm:divide-y-0 sm:divide-x sm:divide-white/[0.08] lg:grid-cols-4">
            <StatCounterItem
              value={25}
              suffix="K+"
              label="Active Users"
              isInView={isInView}
              delay={0.6}
            />
            <StatCounterItem
              value={2.4}
              suffix="M"
              decimals={1}
              label="Posts Generated"
              isInView={isInView}
              delay={0.7}
            />
            <StatCounterItem
              value={98}
              suffix="%"
              label="Customer Satisfaction"
              isInView={isInView}
              delay={0.8}
            />
            <StatCounterItem
              value={180}
              suffix="+"
              label="Business Brands"
              isInView={isInView}
              delay={0.9}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

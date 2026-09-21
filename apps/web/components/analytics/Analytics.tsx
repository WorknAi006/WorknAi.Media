"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  TrendingUp,
  ArrowUpRight,
  Eye,
  Users,
  Target,
  IndianRupee,
  Sparkles,
  BarChart3,
  Calendar,
  ArrowRight,
  FileText,
  Share2,
} from "lucide-react";

// --- Custom Animated Counter Hook ---
function useAnimatedCounter(endValue: number, duration: number = 1800, shouldStart: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
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

// --- Top KPI Card Component with Mouse Glow ---
interface KpiItem {
  id: string;
  label: string;
  prefix?: string;
  value: number;
  suffix: string;
  decimals?: number;
  change: string;
  icon: React.ElementType;
  accent: string;
  glowColor: string;
}

function KpiCard({ item, index, isInView }: { item: KpiItem; index: number; isInView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const count = useAnimatedCounter(item.value, 1800, isInView);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const formattedValue =
    (item.prefix || "") +
    (item.decimals ? count.toFixed(item.decimals) : Math.round(count).toString()) +
    item.suffix;

  const IconComponent = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-[0_12px_35px_rgba(59,130,246,0.15)]"
      >
        {/* Cursor Glow Interaction */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, ${item.glowColor}, transparent 70%)`,
          }}
        />

        {/* Ambient Top Subtle Gradient */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-inner group-hover:border-blue-400/40 group-hover:scale-105 transition-all">
            <IconComponent className={`h-5 w-5 ${item.accent}`} />
          </div>

          <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{item.change}</span>
          </div>
        </div>

        <div className="relative z-10 mt-5">
          <div className="text-3xl font-extrabold tracking-tight text-white md:text-4xl font-mono">
            {formattedValue}
          </div>
          <div className="mt-1 text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {item.label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Analytics Section Component ---
export default function Analytics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const [activeTab, setActiveTab] = useState<"7D" | "30D" | "90D">("7D");
  const [activeMetric, setActiveMetric] = useState<"reach" | "views">("reach");
  const [hoveredDataIndex, setHoveredDataIndex] = useState<number | null>(4); // Default hover Friday

  const kpis: KpiItem[] = [
    {
      id: "reach",
      label: "Total Reach",
      value: 2.4,
      suffix: "M",
      decimals: 1,
      change: "+18%",
      icon: Users,
      accent: "text-blue-400",
      glowColor: "rgba(59, 130, 246, 0.22)",
    },
    {
      id: "views",
      label: "Views",
      value: 182,
      suffix: "K",
      decimals: 0,
      change: "+42%",
      icon: Eye,
      accent: "text-purple-400",
      glowColor: "rgba(139, 92, 246, 0.22)",
    },
    {
      id: "leads",
      label: "Leads Generated",
      value: 12.8,
      suffix: "K",
      decimals: 1,
      change: "+31%",
      icon: Target,
      accent: "text-cyan-400",
      glowColor: "rgba(6, 182, 212, 0.22)",
    },
    {
      id: "revenue",
      label: "Revenue",
      prefix: "₹",
      value: 8.6,
      suffix: "L",
      decimals: 1,
      change: "+26%",
      icon: IndianRupee,
      accent: "text-emerald-400",
      glowColor: "rgba(34, 197, 94, 0.22)",
    },
  ];

  // Weekly data points for chart
  const weeklyData = [
    { day: "Mon", reach: 240, views: 18, label: "240K" },
    { day: "Tue", reach: 310, views: 24, label: "310K" },
    { day: "Wed", reach: 280, views: 22, label: "280K" },
    { day: "Thu", reach: 420, views: 35, label: "420K" },
    { day: "Fri", reach: 580, views: 48, label: "580K" }, // peak
    { day: "Sat", reach: 490, views: 39, label: "490K" },
    { day: "Sun", reach: 520, views: 42, label: "520K" },
  ];

  // SVG Chart Dimensions & Calculation
  const chartWidth = 700;
  const chartHeight = 260;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = 620;
  const minVal = 180;

  const points = weeklyData.map((d, i) => {
    const x = paddingX + (i * (chartWidth - paddingX * 2)) / (weeklyData.length - 1);
    const y =
      chartHeight -
      paddingY -
      ((d.reach - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // Generate smooth cubic bezier SVG path string
  const createSmoothPath = (pts: typeof points) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i != pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Top Performing Platforms Data
  const platforms = [
    {
      name: "Instagram",
      handle: "@worknai.media",
      percentage: 78,
      reach: "1.42M",
      growth: "+42%",
      color: "from-pink-500 via-purple-500 to-indigo-500",
      barColor: "bg-gradient-to-r from-pink-500 to-purple-500",
      iconBg: "bg-pink-500/10 border-pink-500/20 text-pink-400",
    },
    {
      name: "YouTube",
      handle: "WorknAI Studio",
      percentage: 65,
      reach: "520K",
      growth: "+31%",
      color: "from-red-500 to-amber-500",
      barColor: "bg-gradient-to-r from-red-500 to-amber-500",
      iconBg: "bg-red-500/10 border-red-500/20 text-red-400",
    },
    {
      name: "LinkedIn",
      handle: "WorknAI Media OS",
      percentage: 52,
      reach: "310K",
      growth: "+24%",
      color: "from-blue-600 to-cyan-500",
      barColor: "bg-gradient-to-r from-blue-600 to-cyan-500",
      iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    },
    {
      name: "Facebook",
      handle: "WorknAI Official",
      percentage: 38,
      reach: "150K",
      growth: "+14%",
      color: "from-blue-500 to-indigo-600",
      barColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
      iconBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    },
  ];

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden pt-28 pb-32">
      {/* Aurora Background Accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[420px] w-[420px] rounded-full bg-purple-600/10 blur-[150px]" />
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
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Business Analytics</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              Grow Faster with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Real-Time Insights
              </span>
            </h2>

            <p className="max-w-2xl text-base text-zinc-400">
              Track reach, engagement, leads and revenue across every brand from one intelligent dashboard.
            </p>
          </motion.div>
        </div>

        {/* Top 4 KPI Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, idx) => (
            <KpiCard key={kpi.id} item={kpi} index={idx} isInView={isInView} />
          ))}
        </div>

        {/* 12-Column Desktop Grid: Chart (8 cols) + Platforms (4 cols) */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT: Large Analytics Chart (8 Columns) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.05] p-6 lg:col-span-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          >
            {/* Chart Top Header & Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.06] pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-white">Weekly Performance</h3>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    +24.6% avg
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Daily cross-platform engagement metrics
                </p>
              </div>

              {/* Time Range Filter Pills */}
              <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
                {(["7D", "30D", "90D"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Chart Canvas */}
            <div className="relative mt-6 w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto overflow-visible select-none"
              >
                <defs>
                  {/* Line Gradient */}
                  <linearGradient id="chartLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>

                  {/* Area Fill Gradient */}
                  <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.38" />
                    <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#050816" stopOpacity="0" />
                  </linearGradient>

                  {/* Dot Glow Filter */}
                  <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Horizontal Grid Lines */}
                {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const yLine = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                  return (
                    <g key={i}>
                      <line
                        x1={paddingX}
                        y1={yLine}
                        x2={chartWidth - paddingX}
                        y2={yLine}
                        stroke="rgba(255,255,255,0.06)"
                        strokeDasharray="4 4"
                      />
                    </g>
                  );
                })}

                {/* Animated Area Gradient Fill */}
                <motion.path
                  d={areaPath}
                  fill="url(#chartAreaGrad)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.4 }}
                />

                {/* Progressive Animated Line Draw */}
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="url(#chartLineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />

                {/* Data Points and Vertical Hover Guide */}
                {points.map((pt, i) => {
                  const isHovered = hoveredDataIndex === i;
                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredDataIndex(i)}
                    >
                      {/* Vertical Guideline on Active Hover */}
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1={paddingY - 10}
                          x2={pt.x}
                          y2={chartHeight - paddingY}
                          stroke="rgba(59,130,246,0.4)"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* Outer Pulse Circle */}
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="12"
                          fill="rgba(59,130,246,0.25)"
                          className="animate-ping origin-center"
                        />
                      )}

                      {/* Main Data Point Dot */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? "6.5" : "4.5"}
                        fill="#050816"
                        stroke={isHovered ? "#60A5FA" : "#3B82F6"}
                        strokeWidth="3"
                        filter="url(#glowFilter)"
                        className="transition-all duration-200"
                      />

                      {/* Transparent Hit Target */}
                      <rect
                        x={pt.x - 20}
                        y={0}
                        width={40}
                        height={chartHeight}
                        fill="transparent"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Day Labels Axis */}
              <div className="flex justify-between px-6 pt-2 text-xs font-medium text-zinc-400">
                {weeklyData.map((d, i) => (
                  <span
                    key={d.day}
                    className={`transition-colors cursor-pointer ${
                      hoveredDataIndex === i ? "text-blue-400 font-bold" : "hover:text-white"
                    }`}
                    onMouseEnter={() => setHoveredDataIndex(i)}
                  >
                    {d.day}
                  </span>
                ))}
              </div>

              {/* Floating Tooltip Display on Hover */}
              {hoveredDataIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 rounded-xl border border-white/15 bg-[#050816]/90 px-4 py-2.5 backdrop-blur-xl shadow-2xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_#3B82F6]" />
                    <span className="text-xs font-semibold text-white">
                      {weeklyData[hoveredDataIndex].day}:{" "}
                      <span className="text-blue-300 font-mono">
                        {weeklyData[hoveredDataIndex].reach}K Reach
                      </span>
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-400">
                    {weeklyData[hoveredDataIndex].views}K Video Views •{" "}
                    <span className="text-emerald-400 font-medium">+38% vs prev week</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* RIGHT: Top Performing Platforms (4 Columns) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.05] p-6 lg:col-span-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Top Platforms</h3>
                  <p className="mt-0.5 text-xs text-zinc-400">Audience distribution</p>
                </div>
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400">
                  Omnichannel
                </span>
              </div>

              {/* Platform Bars List */}
              <div className="mt-5 space-y-4">
                {platforms.map((platform, idx) => (
                  <div
                    key={platform.name}
                    className="group/plat rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3.5 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl border ${platform.iconBg}`}
                        >
                          <Share2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover/plat:text-blue-300 transition-colors">
                            {platform.name}
                          </div>
                          <div className="text-[11px] text-zinc-400">{platform.handle}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-white font-mono">
                          {platform.percentage}%
                        </div>
                        <div className="text-[11px] font-medium text-emerald-400">
                          {platform.growth}
                        </div>
                      </div>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${platform.percentage}%` } : {}}
                        transition={{
                          duration: 1.2,
                          delay: 0.5 + idx * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`h-full rounded-full ${platform.barColor}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick summary note */}
            <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center">
              <span className="text-xs text-zinc-400">
                Primary conversion source:{" "}
                <span className="font-semibold text-white">Instagram Reels (48%)</span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM: Premium Glass AI Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-8 overflow-hidden rounded-[24px] border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/40 hover:shadow-[0_0_35px_rgba(59,130,246,0.18)]"
        >
          {/* Subtle glowing ambient accent */}
          <div className="pointer-events-none absolute -left-20 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-blue-500/30 blur-[60px]" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            {/* Left AI Insight Content */}
            <div className="flex items-start gap-4">
              <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-600 to-purple-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <Sparkles className="h-6 w-6 text-white animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    AI Insight
                  </span>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-zinc-300">
                    Live Recommendation
                  </span>
                </div>
                <p className="mt-1 text-base font-semibold text-white md:text-lg">
                  “Instagram Reels generated{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-bold">
                    42% higher engagement
                  </span>{" "}
                  this week.”
                </p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Optimal posting schedule suggested: Thursday & Friday at 7:30 PM IST.
                </p>
              </div>
            </div>

            {/* Right Action: Generate Report Button */}
            <div className="flex w-full md:w-auto items-center justify-end">
              <button className="group relative inline-flex w-full md:w-auto items-center justify-center gap-2 overflow-hidden rounded-full border border-blue-400/30 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] active:scale-95">
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

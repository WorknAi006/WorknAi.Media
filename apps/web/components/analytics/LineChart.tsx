"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Info } from "lucide-react";
import { PerformanceDataPoint } from "./data";

interface LineChartProps {
  data: PerformanceDataPoint[];
}

type PlatformSeries = "Instagram" | "Facebook" | "YouTube" | "LinkedIn";

const seriesConfig: Record<
  PlatformSeries,
  { name: PlatformSeries; color: string; hex: string; bgBadge: string; textBadge: string; borderBadge: string }
> = {
  Instagram: {
    name: "Instagram",
    color: "pink",
    hex: "#EC4899",
    bgBadge: "bg-pink-500/15",
    textBadge: "text-pink-400",
    borderBadge: "border-pink-500/30",
  },
  Facebook: {
    name: "Facebook",
    color: "blue",
    hex: "#3B82F6",
    bgBadge: "bg-blue-500/15",
    textBadge: "text-blue-400",
    borderBadge: "border-blue-500/30",
  },
  YouTube: {
    name: "YouTube",
    color: "red",
    hex: "#EF4444",
    bgBadge: "bg-red-500/15",
    textBadge: "text-red-400",
    borderBadge: "border-red-500/30",
  },
  LinkedIn: {
    name: "LinkedIn",
    color: "cyan",
    hex: "#06B6D4",
    bgBadge: "bg-cyan-500/15",
    textBadge: "text-cyan-400",
    borderBadge: "border-cyan-500/30",
  },
};

export default function LineChart({ data }: LineChartProps) {
  const [activeSeries, setActiveSeries] = useState<Record<PlatformSeries, boolean>>({
    Instagram: true,
    Facebook: true,
    YouTube: true,
    LinkedIn: true,
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const toggleSeries = (s: PlatformSeries) => {
    setActiveSeries((prev) => {
      // Don't disable all
      const count = Object.values(prev).filter(Boolean).length;
      if (count === 1 && prev[s]) return prev;
      return { ...prev, [s]: !prev[s] };
    });
  };

  // Dimensions
  const svgWidth = 720;
  const svgHeight = 280;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxY = 130; // Max reach in thousands

  const getX = (index: number) => {
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return paddingTop + chartHeight - (val / maxY) * chartHeight;
  };

  // Helper to build smooth bezier curve string
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return "";
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i != pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const platforms: PlatformSeries[] = ["Instagram", "Facebook", "YouTube", "LinkedIn"];

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
      {/* Header & Series Toggles */}
      <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Multi-Channel Audience Velocity
            </h3>
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono text-blue-300">
              Daily Reach (k)
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Compare growth velocity across active social syndication channels
          </p>
        </div>

        {/* Series Toggle Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {platforms.map((platform) => {
            const config = seriesConfig[platform];
            const isActive = activeSeries[platform];
            return (
              <button
                type="button"
                key={platform}
                onClick={() => toggleSeries(platform)}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? `${config.bgBadge} ${config.borderBadge} ${config.textBadge} ring-1 ring-white/15`
                    : "border-white/10 bg-white/[0.02] text-zinc-500 opacity-60 hover:opacity-90"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full transition-transform"
                  style={{
                    backgroundColor: config.hex,
                    transform: isActive ? "scale(1)" : "scale(0.7)",
                  }}
                />
                <span>{platform}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative mt-5 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {platforms.map((p) => {
              const hex = seriesConfig[p].hex;
              return (
                <linearGradient key={`grad-${p}`} id={`area-grad-${p}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={hex} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={hex} stopOpacity="0.0" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Y-Axis Horizontal Grid Lines */}
          {[0, 30, 60, 90, 120].map((val) => {
            const y = getY(val);
            return (
              <g key={`y-${val}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="rgba(161, 161, 170, 0.6)"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val}k
                </text>
              </g>
            );
          })}

          {/* X-Axis Dates */}
          {data.map((d, i) => {
            const x = getX(i);
            return (
              <text
                key={`x-${d.date}`}
                x={x}
                y={svgHeight - 12}
                textAnchor="middle"
                fill="rgba(161, 161, 170, 0.8)"
                fontSize="10"
                fontFamily="sans-serif"
              >
                {d.date}
              </text>
            );
          })}

          {/* Render Area Gradients & Drawn Path Curves */}
          {platforms.map((p) => {
            if (!activeSeries[p]) return null;
            const pts = data.map((d, i) => ({ x: getX(i), y: getY(d[p]) }));
            const curve = createSmoothPath(pts);
            const areaPath = `${curve} L ${pts[pts.length - 1].x},${getY(0)} L ${pts[0].x},${getY(0)} Z`;

            return (
              <g key={`series-${p}`}>
                {/* Area Gradient */}
                <path d={areaPath} fill={`url(#area-grad-${p})`} />

                {/* Animated Draw Line */}
                <motion.path
                  d={curve}
                  fill="none"
                  stroke={seriesConfig[p].hex}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />

                {/* Data Points */}
                {pts.map((pt, ptIdx) => (
                  <circle
                    key={`pt-${p}-${ptIdx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredIndex === ptIdx ? "5" : "3"}
                    fill={seriesConfig[p].hex}
                    stroke="#0B1020"
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />
                ))}
              </g>
            );
          })}

          {/* Hover Crosshair Line */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={paddingTop}
              x2={getX(hoveredIndex)}
              y2={paddingTop + chartHeight}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
          )}

          {/* Invisible Overlay Rectangles for Smooth Hover Detection */}
          {data.map((_, idx) => {
            const x = getX(idx);
            const w = chartWidth / (data.length - 1);
            return (
              <rect
                key={`hit-${idx}`}
                x={x - w / 2}
                y={paddingTop}
                width={w}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip Box */}
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute top-2 right-4 z-10 rounded-2xl border border-white/15 bg-[#0B1020]/95 p-3.5 shadow-2xl backdrop-blur-xl"
          >
            <span className="block border-b border-white/[0.08] pb-1 font-mono text-xs font-bold text-white">
              {data[hoveredIndex].date} Reach Metrics
            </span>
            <div className="mt-2 space-y-1.5 text-xs">
              {platforms.map((p) => {
                if (!activeSeries[p]) return null;
                const cfg = seriesConfig[p];
                return (
                  <div key={`tip-${p}`} className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.hex }} />
                      {p}:
                    </span>
                    <span className="font-mono font-bold text-white">
                      {data[hoveredIndex][p]}k impressions
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

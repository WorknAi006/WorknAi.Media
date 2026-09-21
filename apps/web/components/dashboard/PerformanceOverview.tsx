"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, BarChart2 } from "lucide-react";
import { performanceOverviewData } from "./data";

export default function PerformanceOverview() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(4); // Default Friday

  const chartWidth = 500;
  const chartHeight = 180;
  const paddingX = 30;
  const paddingY = 25;

  const maxVal = 100;
  const minVal = 20;

  const points = performanceOverviewData.map((d, i) => {
    const x = paddingX + (i * (chartWidth - paddingX * 2)) / (performanceOverviewData.length - 1);
    const y =
      chartHeight -
      paddingY -
      ((d.value - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const createSmoothPath = (pts: typeof points) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <BarChart2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                Performance Overview
              </h3>
              <p className="text-xs text-zinc-400">Daily organic reach across brands</p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            <ArrowUpRight className="h-3 w-3" />
            <span>+28.4%</span>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="mt-5 flex items-baseline gap-4 border-b border-white/[0.06] pb-4">
          <div>
            <span className="text-3xl font-extrabold text-white font-mono">
              89.2K
            </span>
            <span className="ml-1.5 text-xs text-zinc-400">peak daily</span>
          </div>
          <div className="text-xs text-zinc-400">
            Avg: <span className="font-semibold text-zinc-200 font-mono">61.4K</span> reach/day
          </div>
        </div>
      </div>

      {/* SVG Area Chart Placeholder Canvas */}
      <div className="relative mt-4 w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="perfLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>

            <linearGradient id="perfAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0.33, 0.66, 1].map((ratio, i) => {
            const yLine = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={yLine}
                x2={chartWidth - paddingX}
                y2={yLine}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#perfAreaGrad)" />

          {/* Smooth Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#perfLineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Interactive Dots */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#050816"
                  stroke={isHovered ? "#60A5FA" : "#3B82F6"}
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        {/* Days X Axis */}
        <div className="flex justify-between px-3 pt-2 text-[11px] font-medium text-zinc-400">
          {performanceOverviewData.map((d, i) => (
            <span
              key={d.day}
              onMouseEnter={() => setHoveredIndex(i)}
              className={`cursor-pointer transition-colors ${
                hoveredIndex === i ? "text-blue-400 font-bold" : "hover:text-white"
              }`}
            >
              {d.day}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Target,
  Users,
  Flame,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { CompetitorData } from "./data";

interface CompetitorCardProps {
  competitor: CompetitorData;
  competitorsList: CompetitorData[];
  onSelectCompetitor: (name: string) => void;
}

function RadarChart({ radar }: { radar: { label: string; value: number }[] }) {
  const size = 220;
  const center = size / 2;
  const radius = 75;
  const numAxes = radar.length;

  // Compute (x, y) coordinates for any value on a given axis index
  const getCoordinates = (axisIndex: number, valueRatio: number) => {
    const angle = (Math.PI * 2 / numAxes) * axisIndex - Math.PI / 2;
    const r = radius * valueRatio;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build grid rings (0.2, 0.4, 0.6, 0.8, 1.0)
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Radar polygon points
  const pointsStr = radar
    .map((item, idx) => {
      const pt = getCoordinates(idx, item.value / 100);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible select-none">
        <defs>
          <linearGradient id="radar-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Background Web Polygon Rings */}
        {rings.map((ringVal) => {
          const ringPts = Array.from({ length: numAxes })
            .map((_, i) => {
              const pt = getCoordinates(i, ringVal);
              return `${pt.x},${pt.y}`;
            })
            .join(" ");

          return (
            <polygon
              key={`ring-${ringVal}`}
              points={ringPts}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Spokes */}
        {radar.map((_, i) => {
          const outerPt = getCoordinates(i, 1.0);
          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={outerPt.x}
              y2={outerPt.y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Animated Filled Value Polygon */}
        <motion.polygon
          points={pointsStr}
          fill="url(#radar-grad)"
          stroke="#60A5FA"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Data points */}
        {radar.map((item, idx) => {
          const pt = getCoordinates(idx, item.value / 100);
          return (
            <circle
              key={`pt-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="#93C5FD"
              stroke="#1E3A8A"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels around perimeter */}
        {radar.map((item, idx) => {
          const labelPt = getCoordinates(idx, 1.25);
          return (
            <text
              key={`lbl-${idx}`}
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(209, 213, 219, 0.85)"
              fontSize="9"
              fontWeight="600"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default function CompetitorCard({
  competitor,
  competitorsList,
  onSelectCompetitor,
}: CompetitorCardProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onSelectCompetitor(searchInput);
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full">
      <div>
        {/* Header with Competitor Switcher */}
        <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/15 text-blue-400">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Competitor Intelligence
              </h3>
              <p className="text-[11px] text-zinc-400">
                Audience overlap & performance benchmark
              </p>
            </div>
          </div>

          {/* Quick Competitor Selection Chips */}
          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-0.5 text-xs">
            {competitorsList.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => onSelectCompetitor(c.name)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  competitor.name === c.name
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Competitor Profile Banner */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black/40">
              <img
                src={competitor.logo}
                alt={competitor.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-wide">
                {competitor.name}
              </h4>
              <span className="text-xs text-zinc-400">{competitor.industry}</span>
            </div>
          </div>

          {/* Strength Score Circle Badge */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1">
              <span className="text-xs font-semibold text-blue-300">Score:</span>
              <span className="font-mono text-sm font-black text-white">
                {competitor.strengthScore}/100
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              High Threat Tier
            </span>
          </div>
        </div>

        {/* 4 Core Benchmark Metric Pills */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
              Followers
            </span>
            <span className="mt-0.5 block font-mono text-sm font-bold text-white">
              {competitor.followers}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
              Engagement
            </span>
            <span className="mt-0.5 block font-mono text-sm font-bold text-emerald-400">
              {competitor.engagement}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
              Cadence
            </span>
            <span className="mt-0.5 block font-mono text-xs font-bold text-cyan-300">
              {competitor.postingFrequency}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
              Best Channel
            </span>
            <span className="mt-0.5 block text-xs font-bold text-purple-300 truncate">
              {competitor.bestPlatform}
            </span>
          </div>
        </div>

        {/* Radar Chart Section */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              5-Axis Competitive Strength Radar
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">WorknAI Telemetry</span>
          </div>
          <RadarChart radar={competitor.radar} />
        </div>
      </div>

      {/* Weakness & Vulnerability Insight */}
      <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3 text-[11px] text-amber-200">
        <span className="font-bold text-amber-300 block mb-0.5">
          Vulnerability Gap:
        </span>
        {competitor.keyWeakness}
      </div>
    </div>
  );
}

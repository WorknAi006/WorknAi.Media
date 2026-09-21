"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, MapPin, PieChart, Sparkles } from "lucide-react";
import { AudienceData } from "./data";

interface AudienceProps {
  audience: AudienceData;
}

export default function Audience({ audience }: AudienceProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-400">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Audience Demographics & Geo-Distribution
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verified follower distribution across gender, age cohorts, and tier-1 metropolitan hubs
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-zinc-300">
          1.84M Total Profile Impressions
        </span>
      </div>

      {/* 3-Column Demographic Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 1. Gender Ratio */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Gender Split
              </h4>
              <span className="text-[11px] font-mono text-zinc-500">Global</span>
            </div>

            {/* Split Progress Bar */}
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/10 flex">
              {audience.gender.map((g) => (
                <motion.div
                  key={g.label}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${g.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{ backgroundColor: g.color || "#3B82F6" }}
                />
              ))}
            </div>

            {/* Gender Stats */}
            <div className="mt-4 space-y-3">
              {audience.gender.map((g) => (
                <div
                  key={g.label}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: g.color }}
                    />
                    <span className="font-semibold text-white">{g.label}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-zinc-400">{g.count}</span>
                    <span className="font-bold text-white">{g.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-white/[0.06] pt-3 text-[11px] text-zinc-400">
            Balanced 56/44 split driven by lifestyle travel and tech co-living campaigns.
          </div>
        </div>

        {/* 2. Age Cohorts */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Age Cohorts
            </h4>
            <span className="text-[11px] font-mono text-zinc-500">Ages 18-50+</span>
          </div>

          <div className="space-y-3.5">
            {audience.ageGroups.map((age, idx) => (
              <div key={age.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">
                    {age.label} years
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-zinc-500">{age.count}</span>
                    <span className="font-bold text-white">{age.percentage}%</span>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${age.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: age.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Top Cities */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              Metropolitan Hubs
            </h4>
            <span className="text-[11px] font-mono text-zinc-500">Top 5 Cities</span>
          </div>

          <div className="space-y-3">
            {audience.cities.map((city, idx) => (
              <div key={city.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">
                    {city.label}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-zinc-500">{city.count}</span>
                    <span className="font-bold text-white">{city.percentage}%</span>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${city.percentage * 2.5}%` }} // normalized for visual scale
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: city.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

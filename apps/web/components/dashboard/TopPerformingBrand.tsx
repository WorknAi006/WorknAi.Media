"use client";

import React from "react";
import { motion } from "framer-motion";
import { Crown, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { topBrandData } from "./data";

export default function TopPerformingBrand() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <Crown className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                Top Performing Brand
              </h3>
              <p className="text-xs text-zinc-400">Highest growth this cycle</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
            <Sparkles className="h-3 w-3" />
            #1 Ranked
          </span>
        </div>

        {/* Brand Profile Banner */}
        <div className="mt-5 flex items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3.5">
          <img
            src={topBrandData.avatar}
            alt={topBrandData.name}
            className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/20"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-base font-bold text-white">{topBrandData.name}</h4>
              {topBrandData.verified && (
                <CheckCircle2 className="h-4 w-4 fill-blue-500 text-[#050816]" />
              )}
            </div>
            <p className="text-xs text-zinc-400">{topBrandData.category}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {topBrandData.monthlyGrowth}
            </span>
            <div className="text-[10px] text-zinc-400">this month</div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
            <div className="text-xs text-zinc-400">Total Reach</div>
            <div className="mt-1 text-base font-bold text-white font-mono">{topBrandData.reach}</div>
          </div>
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
            <div className="text-xs text-zinc-400">Engagement</div>
            <div className="mt-1 text-base font-bold text-emerald-400 font-mono">
              {topBrandData.engagementRate}
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
            <div className="text-xs text-zinc-400">Posts Published</div>
            <div className="mt-1 text-base font-bold text-white font-mono">
              {topBrandData.postsPublished}
            </div>
          </div>
        </div>
      </div>

      {/* Top Post Note & Link */}
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
        <span className="text-zinc-400 truncate max-w-[240px]">
          Best: <span className="text-zinc-200 font-medium">{topBrandData.topPost}</span>
        </span>
        <button className="flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          View Studio
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}

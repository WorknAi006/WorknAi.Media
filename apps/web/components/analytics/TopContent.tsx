"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Eye, Clock, ThumbsUp, ArrowUpRight } from "lucide-react";
import { TopContentItem } from "./data";

interface TopContentProps {
  items: TopContentItem[];
}

export default function TopContent({ items }: TopContentProps) {
  const getPlatformBadge = (platform: TopContentItem["platform"]) => {
    switch (platform) {
      case "Instagram":
        return "border-pink-500/30 bg-pink-500/10 text-pink-400";
      case "Facebook":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
      case "YouTube":
        return "border-red-500/30 bg-red-500/10 text-red-400";
      case "LinkedIn":
        return "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";
      default:
        return "border-white/10 bg-white/5 text-zinc-300";
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Top Performing Content
              </h3>
              <p className="text-[11px] text-zinc-400">
                Highest retention and conversion assets
              </p>
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
            Ranked
          </span>
        </div>

        {/* Mapped Content Cards */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="group relative flex gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:bg-white/[0.06] hover:shadow-[0_4px_25px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              {/* Media Thumbnail */}
              <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-md bg-black/70 text-[10px] font-bold text-white backdrop-blur-md">
                  #{index + 1}
                </span>
              </div>

              {/* Details & Metrics */}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 truncate">
                      {item.brand}
                    </span>
                    <span
                      className={`rounded-md border px-1.5 py-0.2 text-[9px] font-semibold ${getPlatformBadge(
                        item.platform
                      )}`}
                    >
                      {item.platform}
                    </span>
                  </div>

                  <h4 className="mt-1 text-xs font-bold text-white leading-snug line-clamp-1 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h4>
                </div>

                {/* 3 Metric Pills: Reach, Engagement, Watch Time */}
                <div className="mt-2 grid grid-cols-3 gap-1.5 border-t border-white/[0.04] pt-1.5 text-[10px]">
                  <div>
                    <span className="text-[9px] text-zinc-400 block">Reach</span>
                    <span className="font-mono font-bold text-white">{item.reach}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 block">Engage</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {item.engagement}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 block">Watch</span>
                    <span className="font-mono font-bold text-cyan-300 truncate block">
                      {item.watchTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom info link */}
      <div className="mt-4 border-t border-white/[0.06] pt-3 text-center text-[11px] text-zinc-500">
        ⚡ Syndicated organically across WorknAI AI Multi-channel Studio.
      </div>
    </div>
  );
}

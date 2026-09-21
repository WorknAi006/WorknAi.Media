"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, ExternalLink } from "lucide-react";
import { ScheduledEvent } from "./types";
import PlatformIcon from "./PlatformIcon";
import { statusBadges } from "./data";

interface ScheduledPostCardProps {
  post: ScheduledEvent;
  index: number;
}

export default function ScheduledPostCard({ post, index }: ScheduledPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
    >
      {/* Glow accent indicator line */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b ${post.color.accent}`}
      />

      <div className="pl-2">
        {/* Top meta row: Brand & Platform & Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Platform Icon Badge */}
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg border ${post.color.border} bg-white/5 ${post.color.text} ${post.color.glow}`}
            >
              <PlatformIcon platform={post.platform} className="h-3.5 w-3.5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-blue-200 transition-colors">
                  {post.brand}
                </span>
                <span className="text-[10px] text-zinc-500">•</span>
                <span className="text-[11px] font-medium text-zinc-400">
                  {post.platform}
                </span>
              </div>
            </div>
          </div>

          {/* Status pill with color */}
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${
              statusBadges[post.status] || post.color.badge
            }`}
          >
            {post.status}
          </span>
        </div>

        {/* Title & Media Type */}
        <div className="mt-2.5">
          <h4 className="line-clamp-1 text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
            {post.title}
          </h4>
        </div>

        {/* Bottom footer: Time & Media Type Pill & Quick Actions */}
        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-zinc-300">
              <Clock className="h-3 w-3 text-zinc-400" />
              {post.time}
            </span>

            <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
              {post.mediaType}
            </span>
          </div>

          <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              title="Preview post details"
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-blue-400 transition-colors"
            >
              <span>Inspect</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

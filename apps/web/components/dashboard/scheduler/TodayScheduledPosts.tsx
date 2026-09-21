"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Layers } from "lucide-react";
import { ScheduledEvent } from "./types";
import ScheduledPostCard from "./ScheduledPostCard";

interface TodayScheduledPostsProps {
  selectedDay: number;
  posts: ScheduledEvent[];
  onOpenNewPostModal?: () => void;
}

export default function TodayScheduledPosts({
  selectedDay,
  posts,
}: TodayScheduledPostsProps) {
  const [activePlatformFilter, setActivePlatformFilter] = useState<string>("All");

  const filteredPosts = posts.filter((post) => {
    if (activePlatformFilter === "All") return true;
    return post.platform.toLowerCase().includes(activePlatformFilter.toLowerCase());
  });

  const filterTabs = ["All", "Instagram", "LinkedIn", "YouTube"];

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {selectedDay === 7 ? "Today's Schedule" : `Scheduled for Sep ${selectedDay}`}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"} ready in queue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Auto-Pilot</span>
          </div>
        </div>

        {/* Platform quick filters */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePlatformFilter(tab)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                activePlatformFilter === tab
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mapped Posts List */}
        <div className="mt-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, idx) => (
                <ScheduledPostCard key={post.id} post={post} index={idx} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-400 mb-2">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-zinc-300">No posts scheduled</p>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
                  There are no scheduled releases matching this filter for Day {selectedDay}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Schedule Action */}
      <div className="mt-5 border-t border-white/[0.06] pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:from-blue-500 hover:to-indigo-500"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Schedule New Post</span>
        </motion.button>
      </div>
    </div>
  );
}

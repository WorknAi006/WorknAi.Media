"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Flame, ArrowUpRight } from "lucide-react";
import { TrendingTopic } from "./data";

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  selectedTopic: string;
  onSelectTopic: (topicName: string) => void;
}

export default function TrendingTopics({
  topics,
  selectedTopic,
  onSelectTopic,
}: TrendingTopicsProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/15 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Trending Topics
              </h3>
              <p className="text-[11px] text-zinc-400">
                Algorithmically detected breakout topics
              </p>
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
            Realtime
          </span>
        </div>

        {/* Mapped Cards */}
        <div className="space-y-2.5">
          {topics.map((topic, index) => {
            const isSelected = selectedTopic === topic.name;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                onClick={() => onSelectTopic(topic.name)}
                className={`group relative flex items-center justify-between rounded-2xl border p-3 cursor-pointer transition-all duration-300 select-none ${
                  isSelected
                    ? "border-blue-500/80 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/50"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      {topic.category}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-zinc-600" />
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {topic.volume}
                    </span>
                  </div>

                  <h4 className="mt-1 text-xs font-bold text-white tracking-wide truncate group-hover:text-blue-300 transition-colors">
                    {topic.name}
                  </h4>
                </div>

                {/* Growth Badge */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    +{topic.growth}%
                  </span>
                  <span className="mt-1 text-[9px] text-zinc-500 font-medium">
                    {topic.sentiment}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-4 border-t border-white/[0.06] pt-3 text-[11px] text-zinc-500 text-center">
        💡 Click any trend to cross-examine audience interest.
      </div>
    </div>
  );
}

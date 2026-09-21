"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock, Eye, Music, ArrowRight, Wand2 } from "lucide-react";
import { ViralReelIdea } from "./data";
import Link from "next/link";

interface ViralIdeasProps {
  ideas: ViralReelIdea[];
  onGenerateSimilar: (idea: ViralReelIdea) => void;
}

export default function ViralIdeas({ ideas, onGenerateSimilar }: ViralIdeasProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-pink-500/30 bg-pink-500/15 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.25)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Viral Reel Ideas
              </h3>
              <p className="text-[11px] text-zinc-400">
                AI extracted retention hooks & audio pairings
              </p>
            </div>
          </div>

          <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-[10px] font-semibold text-pink-300">
            Top 4 Formats
          </span>
        </div>

        {/* Mapped Viral Reel Cards */}
        <div className="space-y-3">
          {ideas.map((idea, index) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-xl transition-all duration-300 hover:border-pink-500/40 hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail with Duration Overlay */}
                <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <img
                    src={idea.thumbnail}
                    alt="Reel concept"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white backdrop-blur-md">
                    {idea.duration}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 truncate">
                      {idea.category}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {idea.expectedReach}
                    </span>
                  </div>

                  {/* Hook Text */}
                  <p className="mt-1 text-xs font-bold text-white leading-snug line-clamp-2 group-hover:text-pink-200 transition-colors">
                    {idea.hook}
                  </p>

                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-zinc-400 truncate">
                    <Music className="h-3 w-3 shrink-0 text-pink-400" />
                    <span className="truncate">{idea.soundTrend}</span>
                  </div>
                </div>
              </div>

              {/* Card Action Row: Generate Similar */}
              <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.05] pt-2">
                <span className="text-[10px] text-zinc-500">
                  Expected Reach: <strong className="text-zinc-300">{idea.expectedReach}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => onGenerateSimilar(idea)}
                  className="flex items-center gap-1.5 rounded-lg border border-pink-500/40 bg-pink-500/15 px-2.5 py-1 text-[11px] font-bold text-pink-300 transition-all hover:bg-pink-500/25 hover:border-pink-400 hover:text-white"
                >
                  <Wand2 className="h-3 w-3" />
                  <span>Generate Similar</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-4 border-t border-white/[0.06] pt-3 text-center text-[11px] text-zinc-500">
        ⚡ Formats modeled directly on high-retention 9:16 Instagram Reels.
      </div>
    </div>
  );
}

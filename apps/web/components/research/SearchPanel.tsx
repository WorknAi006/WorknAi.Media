"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Zap,
  Bookmark,
  CheckCircle2,
  Cpu,
  Globe,
  Layers,
  ArrowRight,
} from "lucide-react";

interface SearchPanelProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: (q: string) => void;
  onDeepResearch: (q: string) => void;
  onSaveReport: () => void;
  isResearching: boolean;
  researchProgress: number;
  savedSuccess: boolean;
}

const quickQueries = [
  "Online Go vs MakeMyTrip",
  "Autonomous Freight in India",
  "Pune Student Co-Living Demand",
  "Viral Instagram Reel Formats 2026",
];

export default function SearchPanel({
  query,
  setQuery,
  onSearch,
  onDeepResearch,
  onSaveReport,
  isResearching,
  researchProgress,
  savedSuccess,
}: SearchPanelProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
  };

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.5)] transition-all hover:border-blue-500/30">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-purple-600/15 blur-3xl" />

      {/* Title & Tag */}
      <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/15 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Enterprise AI Research Lab
            </h2>
            <p className="text-[11px] text-zinc-400">
              Autonomous competitive benchmarking, viral hook synthesis & market telemetry
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          <Globe className="h-3 w-3 animate-spin" />
          <span>Live Web Index: 2.8B Nodes</span>
        </span>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative space-y-4">
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute left-4 text-zinc-400">
            <Search className="h-5 w-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Research any brand, industry or topic (e.g. MakeMyTrip, travel reels, student PG)..."
            className="w-full rounded-2xl border border-white/15 bg-white/5 py-4 pl-12 pr-4 text-sm sm:text-base text-white placeholder-zinc-500 backdrop-blur-md shadow-inner transition focus:border-blue-500 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
            <span className="text-[11px] font-semibold text-zinc-500 mr-1">Trending:</span>
            {quickQueries.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => {
                  setQuery(item);
                  onSearch(item);
                }}
                className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Core Action Buttons: Search, Deep Research, Save Report */}
          <div className="flex items-center gap-2">
            {/* 1. Search */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isResearching}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-zinc-200 hover:border-white/20 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search</span>
            </motion.button>

            {/* 2. Deep Research */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDeepResearch(query)}
              disabled={isResearching}
              className="relative flex items-center gap-1.5 rounded-xl border border-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_25px_rgba(59,130,246,0.4)] transition hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] disabled:opacity-75"
            >
              <Zap className="h-3.5 w-3.5 text-yellow-300" />
              <span>{isResearching ? "Synthesizing..." : "Deep Research"}</span>
            </motion.button>

            {/* 3. Save Report */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSaveReport}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-xs font-bold text-purple-300 transition hover:bg-purple-500/20 hover:border-purple-400"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Saved!</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Save Report</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>

      {/* Progress Loading Bar (Active when researching) */}
      <AnimatePresence>
        {isResearching && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative mt-5 border-t border-white/[0.08] pt-4"
          >
            <div className="flex items-center justify-between text-xs font-medium text-zinc-300 mb-2">
              <span className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-blue-400 animate-spin" />
                <span>Deep Research Agent Active: Cross-examining competitors & audience telemetry...</span>
              </span>
              <span className="font-mono font-bold text-blue-400">
                {researchProgress}%
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${researchProgress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

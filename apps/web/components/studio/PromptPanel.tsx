"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Wand2, RefreshCw } from "lucide-react";
import { brands, contentTypes, tones, languages } from "./data";

interface PromptPanelProps {
  brand: string;
  setBrand: (b: string) => void;
  contentType: string;
  setContentType: (c: string) => void;
  language: string;
  setLanguage: (l: string) => void;
  tone: string;
  setTone: (t: string) => void;
  prompt: string;
  setPrompt: (p: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export default function PromptPanel({
  brand,
  setBrand,
  contentType,
  setContentType,
  language,
  setLanguage,
  tone,
  setTone,
  prompt,
  setPrompt,
  isGenerating,
  onGenerate,
}: PromptPanelProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-blue-500/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/15 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              AI Content Studio
            </h2>
            <p className="text-[11px] text-zinc-400">
              Autonomous multi-brand generator & creative engine
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Ready
        </span>
      </div>

      <div className="space-y-5">
        {/* Brand Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">
            Target Brand
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {brands.map((b) => {
              const isSelected = brand === b.name;
              return (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setBrand(b.name)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                    isSelected
                      ? "border-blue-500/80 bg-blue-500/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.25)] ring-1 ring-blue-400/50"
                      : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-zinc-200"
                  }`}
                >
                  <span className="text-xs font-bold">{b.name}</span>
                  <span className="text-[9px] text-zinc-500 line-clamp-1 mt-0.5">
                    {b.industry}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Type Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">
            Content Format
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {contentTypes.map((type) => {
              const isSelected = contentType === type;
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all text-center ${
                    isSelected
                      ? "border-purple-500/80 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-400/50"
                      : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-zinc-200"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language & Tone Selectors */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Tone Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Tone of Voice
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tones.map((t) => {
                const isSelected = tone === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTone(t)}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all ${
                      isSelected
                        ? "border-blue-400 bg-blue-500/20 text-blue-200 shadow-sm"
                        : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Language Output
            </label>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((l) => {
                const isSelected = language === l;
                return (
                  <button
                    type="button"
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`rounded-lg border px-3 py-1 text-[11px] font-medium transition-all ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-sm"
                        : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Large Prompt Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300">
              Prompt & Directive
            </label>
            <span className="font-mono text-[10px] text-zinc-500">
              {prompt.length} chars
            </span>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md transition-all focus-within:border-blue-500/70 focus-within:ring-2 focus-within:ring-blue-500/25">
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe the ${contentType} you want to generate for ${brand} in ${tone} tone...`}
              className="w-full resize-none bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={!isGenerating ? { scale: 1.02 } : {}}
          whileTap={!isGenerating ? { scale: 0.98 } : {}}
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl py-3.5 px-6 font-semibold text-white shadow-xl transition-all duration-300 ${
            isGenerating
              ? "cursor-wait bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 shadow-purple-900/40 animate-pulse"
              : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-blue-600/30 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 hover:shadow-blue-500/40"
          } disabled:opacity-50`}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span className="text-xs tracking-wide">Synthesizing Multimodal Content...</span>
            </div>
          ) : (
            <>
              <Wand2 className="h-4 w-4 text-blue-300 animate-pulse" />
              <span className="text-xs font-bold tracking-wide">
                Generate with WorknAI Studio
              </span>
              <ArrowRight className="h-4 w-4 text-blue-300 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

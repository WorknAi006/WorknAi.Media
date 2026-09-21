"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, RefreshCw, Wand2, ArrowRight } from "lucide-react";
import { ContentTypeConfig, Brand } from "./types";

interface PromptStudioProps {
  prompt: string;
  setPrompt: (text: string) => void;
  selectedContentType: ContentTypeConfig;
  selectedBrand: Brand;
  isGenerating: boolean;
  currentStepMessage: string;
  onGenerate: () => void;
}

export default function PromptStudio({
  prompt,
  setPrompt,
  selectedContentType,
  selectedBrand,
  isGenerating,
  currentStepMessage,
  onGenerate,
}: PromptStudioProps) {
  const [toneModifier, setToneModifier] = useState<string>("Brand Default");

  const promptShortcuts = [
    { label: "Make Hook Stronger", append: " Make the opening hook aggressively viral with high emotional curiosity." },
    { label: "Add Conversion CTA", append: " Include a clear, non-pushy direct response call-to-action for high link clicks." },
    { label: "Add Industry Data", append: " Integrate authoritative 2026 industry statistics and benchmarks." },
    { label: "Optimize for Saves", append: " Format as an ultra-actionable cheatsheet maximizing bookmark saves." },
  ];

  const handleShortcutClick = (append: string) => {
    if (!prompt.includes(append.trim())) {
      setPrompt(prompt.trim() + append);
    }
  };

  return (
    <div className="space-y-3">
      {/* Label and Quick Actions */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          3. Prompt & Creative Directive
        </label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-zinc-500">
            {prompt.length} chars
          </span>
          <button
            onClick={() => setPrompt(selectedContentType.defaultPrompt)}
            className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
          >
            <RefreshCw className="h-2.5 w-2.5" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompt Inspiration Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-semibold text-zinc-500 flex items-center gap-1 mr-1">
          <Zap className="h-3 w-3 text-amber-400" />
          Quick Ideas:
        </span>
        {selectedContentType.promptSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setPrompt(suggestion)}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10px] font-medium text-zinc-400 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Main Glass Textarea Box */}
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-xl transition-all duration-300 focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/30">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder={`Describe the ${selectedContentType.label} you want to generate for ${selectedBrand.name}...`}
          className="w-full resize-none bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none leading-relaxed"
        />

        {/* Prompt Enhancer Tag Toolbar */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-2">
          <div className="flex flex-wrap items-center gap-1">
            {promptShortcuts.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleShortcutClick(chip.append)}
                className="flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-zinc-400 transition hover:bg-white/10 hover:text-zinc-200"
              >
                <span>+ {chip.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            <span>Tone: {selectedBrand.name} Brand DNA</span>
          </div>
        </div>
      </div>

      {/* Generate Button with Dynamic Loading Animation */}
      <motion.button
        whileHover={!isGenerating ? { scale: 1.01 } : {}}
        whileTap={!isGenerating ? { scale: 0.99 } : {}}
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className={`group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl py-3.5 px-6 font-semibold text-white shadow-xl transition-all duration-300 ${
          isGenerating
            ? "cursor-wait bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 shadow-purple-900/30"
            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-blue-600/25 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 hover:shadow-blue-500/40"
        } disabled:opacity-50`}
      >
        {/* Animated Light Sweep Effect */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

        {isGenerating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white/20 border-t-white"
            />
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold tracking-wide">
                Generating Multimodal Creative...
              </span>
              <span className="text-[10px] text-blue-200 font-mono animate-pulse">
                {currentStepMessage}
              </span>
            </div>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-blue-300 animate-pulse" />
            <span className="text-sm font-bold tracking-wide">
              Generate {selectedContentType.label}
            </span>
            <ArrowRight className="h-4 w-4 text-blue-300 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </motion.button>
    </div>
  );
}

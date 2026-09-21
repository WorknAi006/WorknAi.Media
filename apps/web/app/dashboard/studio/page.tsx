"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layers, Eye, RefreshCw } from "lucide-react";
import PromptPanel from "@/components/studio/PromptPanel";
import PreviewCard, { SkeletonCard } from "@/components/studio/PreviewCard";
import RecentCreations from "@/components/studio/RecentCreations";
import { defaultResultsByBrand, GeneratedResults } from "@/components/studio/data";

export default function StudioPage() {
  const [brand, setBrand] = useState<string>("Online Go");
  const [contentType, setContentType] = useState<string>("Instagram Post");
  const [language, setLanguage] = useState<string>("English");
  const [tone, setTone] = useState<string>("Luxury");
  const [prompt, setPrompt] = useState<string>(
    "Create a high-converting luxury vacation reel caption highlighting 5 secret flight hacks saving up to $800 on Southeast Asia departures."
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(true);
  const [results, setResults] = useState<GeneratedResults>(
    defaultResultsByBrand["Online Go"]
  );

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);

      const brandTemplate =
        defaultResultsByBrand[brand] || defaultResultsByBrand["Online Go"];

      setResults({
        caption: `[${brand} • ${contentType} (${tone} in ${language})]\n\n${brandTemplate.caption}`,
        hashtags: brandTemplate.hashtags,
        cta: brandTemplate.cta,
      });
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Studio Header Banner */}
      <div className="flex flex-col justify-between gap-3 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Content Studio</span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            AI Studio Workspace
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Generate high-velocity captions, viral scripts, hashtags, and conversion CTAs across your connected brand ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-zinc-300">
            Engine: WorknAI DeepMedia v4
          </span>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Panel: AI Prompt Glass Card (6 cols on desktop) */}
        <div className="lg:col-span-6">
          <PromptPanel
            brand={brand}
            setBrand={setBrand}
            contentType={contentType}
            setContentType={setContentType}
            language={language}
            setLanguage={setLanguage}
            tone={tone}
            setTone={setTone}
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
          />
        </div>

        {/* Right Panel: Live Preview (6 cols on desktop) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-blue-500/30 h-full flex flex-col justify-between">
            <div>
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide">
                      Live Output Preview
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      {isGenerating ? "Synthesizing output..." : `${brand} • ${contentType}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-purple-300">
                    3 Deliverables
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    title="Regenerate Output"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* 3 Preview Cards or Skeleton Loading */}
              <div className="space-y-4">
                {isGenerating ? (
                  <>
                    <SkeletonCard index={0} />
                    <SkeletonCard index={1} />
                    <SkeletonCard index={2} />
                  </>
                ) : (
                  <>
                    {/* 1. Instagram Caption Card */}
                    <PreviewCard
                      title="Instagram Caption"
                      badge="Caption"
                      badgeColor="border-blue-500/30 bg-blue-500/10 text-blue-300"
                      initialContent={results.caption}
                      index={0}
                    />

                    {/* 2. Hashtags Card */}
                    <PreviewCard
                      title="Hashtags"
                      badge="Algorithm Tags"
                      badgeColor="border-purple-500/30 bg-purple-500/10 text-purple-300"
                      initialContent={results.hashtags.join(" ")}
                      index={1}
                    />

                    {/* 3. CTA Card */}
                    <PreviewCard
                      title="Call To Action (CTA)"
                      badge="Conversion Hook"
                      badgeColor="border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      initialContent={results.cta}
                      index={2}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Bottom Preview Meta Indicator */}
            <div className="mt-6 border-t border-white/[0.06] pt-3 text-center text-[11px] text-zinc-500">
              ⚡ Multi-channel format optimized for high save rates and click-through velocity.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent AI Creations */}
      <RecentCreations />
    </motion.div>
  );
}

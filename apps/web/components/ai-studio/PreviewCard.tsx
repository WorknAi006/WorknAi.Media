"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Calendar,
  Share2,
  Sparkles,
  TrendingUp,
  Play,
  Layers,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { GeneratedContent } from "./types";

interface PreviewCardProps {
  content: GeneratedContent;
  onRegenerate?: () => void;
}

export default function PreviewCard({ content, onRegenerate }: PreviewCardProps) {
  const [copied, setCopied] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<"card" | "raw">("card");

  const handleCopy = () => {
    let fullText = `${content.title}\n\n`;
    if (content.hook) fullText += `[Hook]: ${content.hook}\n\n`;
    fullText += `${content.body}\n\n`;
    if (content.cta) fullText += `[CTA]: ${content.cta}\n\n`;
    if (content.hashtags) fullText += content.hashtags.join(" ");

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
    >
      <div>
        {/* Card Header: Brand, Content Type Badge, Actions */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10">
              <img
                src={content.brand.avatar}
                alt={content.brand.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {content.brand.name}
                </h3>
                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                  {content.type}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Generated {content.timestamp} • {content.brand.handle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                copied
                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                title="Regenerate"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Content Preview based on Type */}
        <div className="mt-5 space-y-4">
          {/* Post Title */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
              Creative Concept
            </span>
            <h4 className="mt-1 text-base font-bold text-white leading-snug">
              {content.title}
            </h4>
          </div>

          {/* Hook Banner (if applicable) */}
          {content.hook && (
            <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Opening Hook (0-3s)</span>
              </div>
              <p className="mt-1 text-xs text-zinc-200 font-medium italic">
                "{content.hook}"
              </p>
            </div>
          )}

          {/* Reel Scenes Breakdown (if type === 'reel') */}
          {content.type === "reel" && content.scriptScenes && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Paced Timeline Breakdown
              </span>
              <div className="space-y-2">
                {content.scriptScenes.map((scene, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-blue-400 pb-1">
                      <span>{scene.timestamp}</span>
                      <span className="text-zinc-500">Scene 0{idx + 1}</span>
                    </div>
                    <p className="text-zinc-300 font-medium">{scene.audio}</p>
                    <p className="mt-1 text-[11px] text-zinc-500 italic">
                      Visual: {scene.visual}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Body / Captions */}
          {content.type !== "reel" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs leading-relaxed text-zinc-300 whitespace-pre-line">
              {content.body}
            </div>
          )}

          {/* Visual Asset Preview (if image or instagram post with mediaUrl) */}
          {content.mediaUrl && (
            <div className="relative overflow-hidden rounded-xl border border-white/10">
              <img
                src={content.mediaUrl}
                alt={content.title}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-mono text-zinc-200 backdrop-blur-md">
                  {content.aspectRatio || "16:9 4K UHD"}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-blue-300 font-semibold">
                  <Sparkles className="h-3 w-3" />
                  Diffusion Ready
                </span>
              </div>
            </div>
          )}

          {/* CTA & Hashtags */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
            {content.cta && (
              <div className="text-zinc-400">
                <span className="font-semibold text-zinc-300">CTA: </span>
                <span className="text-blue-300">{content.cta}</span>
              </div>
            )}

            {content.hashtags && (
              <div className="flex flex-wrap gap-1">
                {content.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: AI Performance Estimates & Dispatch Action */}
      <div className="mt-6 border-t border-white/[0.06] pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {content.metricsEstimated && (
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-zinc-400">Est. Reach:</span>
                <span className="font-mono font-bold text-white">
                  {content.metricsEstimated.reach}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400">Viral Index:</span>
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-300">
                  {content.metricsEstimated.viralScore}/100
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <a
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Queue to Scheduler</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

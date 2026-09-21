"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Share2,
  Clock,
  Sparkles,
  CheckCircle2,
  Hash,
  Lightbulb,
  Check,
  Layers,
} from "lucide-react";
import { ResearchReportData } from "./data";

interface ReportProps {
  report: ResearchReportData;
  onExport: (format: "pdf" | "docx" | "share") => void;
}

export default function Report({ report, onExport }: ReportProps) {
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.5)]">
      {/* Top Header & Export Actions */}
      <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-0.5 text-xs font-bold text-blue-400">
              AI Synthesis Output
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Confidence Score:{" "}
              <strong className="text-emerald-400">{report.confidenceScore}%</strong>
            </span>
          </div>

          <h3 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-white">
            {report.query}
          </h3>
          <p className="text-xs text-zinc-400">
            Synthesized across social algorithms, SERP telemetry & audience response patterns • {report.generatedDate}
          </p>
        </div>

        {/* Export Buttons: PDF, DOCX, Share */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onExport("pdf")}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-blue-500/40 hover:bg-blue-500/15 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            <span>PDF</span>
          </button>

          <button
            type="button"
            onClick={() => onExport("docx")}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-purple-500/40 hover:bg-purple-500/15 hover:text-white"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>DOCX</span>
          </button>

          <button
            type="button"
            onClick={() => onExport("share")}
            className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/20 px-3.5 py-2 text-xs font-bold text-blue-300 transition hover:bg-blue-600/30 hover:border-blue-400 hover:text-white"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* 5 Core Report Sections */}
      <div className="mt-6 space-y-6">
        {/* Row 1: Market Opportunity & Competitor Gap */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 1. Market Opportunity */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                Market Opportunity
              </h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {report.marketOpportunity}
            </p>
          </div>

          {/* 2. Competitor Gap */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
                <Lightbulb className="h-3.5 w-3.5" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                Competitor Gap & Vulnerability
              </h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {report.competitorGap}
            </p>
          </div>
        </div>

        {/* 3. Suggested Content Strategy (Mapped Action Pillars) */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              Suggested Content Strategy
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {report.suggestedStrategy.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-500/20 font-mono text-[10px] font-bold text-blue-400">
                  0{idx + 1}
                </span>
                <p className="text-zinc-300 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Recommended Hashtags & Best Posting Time */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 4. Recommended Hashtags (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                  <Hash className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  Recommended Algorithm Hashtags
                </h4>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                Click tag to copy
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {report.recommendedHashtags.map((tag) => {
                const isCopied = copiedTag === tag;
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleCopyTag(tag)}
                    className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-cyan-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/10"
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Hash className="h-3 w-3 opacity-50" />
                    )}
                    <span>{tag.replace(/^#/, "")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Best Posting Time (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  Best Posting Time Window
                </h4>
              </div>

              <div className="mt-2 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Optimal Window:</span>
                  <span className="font-mono font-bold text-white">
                    {report.bestPostingTime.window}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Peak Days:</span>
                  <span className="font-semibold text-amber-300">
                    {report.bestPostingTime.peakDay}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-center text-xs font-bold text-emerald-300">
              ⚡ {report.bestPostingTime.projectedBoost}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

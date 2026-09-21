"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Edit2, Save, X, Sparkles } from "lucide-react";

interface PreviewCardProps {
  title: string;
  badge: string;
  badgeColor?: string;
  initialContent: string;
  index: number;
}

export default function PreviewCard({
  title,
  badge,
  badgeColor = "border-blue-500/30 bg-blue-500/10 text-blue-300",
  initialContent,
  index,
}: PreviewCardProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync content if prop changes
  React.useEffect(() => {
    setContent(initialContent);
    setIsEditing(false);
  }, [initialContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.12 }}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(59,130,246,0.18)]"
    >
      {/* Top Card Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-wide">
            {title}
          </span>
          <span
            className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${badgeColor}`}
          >
            {badge}
          </span>
        </div>

        {/* Action Buttons: Copy & Edit */}
        <div className="flex items-center gap-1.5">
          {/* Edit / Save Button */}
          {isEditing ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/30 transition"
              >
                <Save className="h-3 w-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setContent(initialContent);
                  setIsEditing(false);
                }}
                className="rounded-lg border border-white/10 bg-white/5 p-1 text-zinc-400 hover:text-white transition"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white transition"
            >
              <Edit2 className="h-3 w-3" />
              <span>Edit</span>
            </button>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
              copied
                ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Content Area */}
      {isEditing ? (
        <textarea
          rows={title === "Hashtags" ? 3 : 4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-xl border border-blue-500/40 bg-black/40 p-3 text-xs leading-relaxed text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      ) : (
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap select-text font-normal">
          {content}
        </div>
      )}
    </motion.div>
  );
}

// Skeleton Loading Card for Before Results
export function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      style={{ animationDelay: `${index * 150}ms` }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl animate-pulse space-y-3"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="h-3.5 w-28 rounded bg-white/10" />
        <div className="h-4 w-12 rounded bg-white/10" />
      </div>
      <div className="space-y-2 pt-1">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-5/6 rounded bg-white/5" />
        <div className="h-3 w-3/4 rounded bg-white/5" />
      </div>
    </div>
  );
}

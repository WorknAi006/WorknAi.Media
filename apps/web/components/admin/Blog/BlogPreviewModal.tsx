"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Calendar, Tag, Sparkles, BookOpen, Share2 } from "lucide-react";
import { BlogPost, parseBlogContent, calculateReadingTime } from "./types";

interface Props {
  blog: BlogPost | null;
  onClose: () => void;
}

export default function BlogPreviewModal({ blog, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!blog) return null;

  const { body, category, tags, seoDescription } = parseBlogContent(blog.content);
  const readingTime = calculateReadingTime(body);
  const coverUrl = blog.cover_url || blog.thumbnail || blog.media_url || "/world-map-glow.jpg";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950/95 text-white shadow-2xl p-6 sm:p-8 z-10 scrollbar-thin scrollbar-thumb-white/10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition"
            title="Close Preview (Esc)"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Category & Status Bar */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <Sparkles className="h-3 w-3" />
              {category}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                blog.status === "published"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : blog.status === "scheduled"
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-400"
              }`}
            >
              {blog.status}
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-zinc-400 ml-auto mr-10 sm:mr-0">
              <Clock className="h-3.5 w-3.5 text-zinc-500" />
              {readingTime}
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
              <Calendar className="h-3.5 w-3.5 text-zinc-500" />
              {new Date(blog.created_at || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Cover Image */}
          {coverUrl && (
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/10 mb-6 bg-zinc-900 shadow-xl">
              <img
                src={coverUrl}
                alt={blog.title}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* SEO Description Callout */}
          {seoDescription && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300 italic mb-6 border-l-4 border-l-blue-500">
              <p className="font-semibold text-zinc-400 text-xs uppercase tracking-wider not-italic mb-1">
                SEO Summary
              </p>
              &ldquo;{seoDescription}&rdquo;
            </div>
          )}

          {/* Blog Content Body */}
          <div className="prose prose-invert max-w-none text-zinc-300 text-base leading-relaxed space-y-4">
            {body.split("\n\n").map((paragraph, idx) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={idx} className="text-xl sm:text-2xl font-bold text-white pt-3 pb-1 border-b border-white/10">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-lg sm:text-xl font-semibold text-blue-300 pt-2">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("> ")) {
                return (
                  <blockquote key={idx} className="border-l-4 border-cyan-500 pl-4 italic text-zinc-300 bg-white/[0.02] py-2 rounded-r">
                    {paragraph.replace("> ", "")}
                  </blockquote>
                );
              }
              return (
                <p key={idx} className="whitespace-pre-line">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags Footer */}
          {tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 flex items-center gap-1 mr-1">
                <Tag className="h-3.5 w-3.5 text-zinc-500" />
                Tags:
              </span>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300 font-mono"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Modal Footer */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-white/10 hover:bg-white/15 px-5 py-2.5 text-sm font-semibold text-white transition"
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

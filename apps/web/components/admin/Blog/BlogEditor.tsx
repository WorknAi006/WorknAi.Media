"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Link as LinkIcon,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  Clock,
  Send,
  Save,
  Calendar,
  RotateCcw,
  Eye,
  CheckCircle2,
} from "lucide-react";
import {
  BlogPost,
  BlogFormData,
  parseBlogContent,
  serializeBlogContent,
  calculateReadingTime,
  generateSlug,
} from "./types";

interface Props {
  editingBlog: BlogPost | null;
  onSave: () => void;
  onCancel: () => void;
  onPreview: (mockBlog: BlogPost) => void;
}

const CATEGORIES = [
  "AI Technology",
  "Digital Media",
  "Growth Marketing",
  "Business Automation",
  "Case Study",
  "Creator Economy",
  "SEO & Traffic",
];

export default function BlogEditor({
  editingBlog,
  onSave,
  onCancel,
  onPreview,
}: Props) {
  const [form, setForm] = useState<BlogFormData>({
    title: "",
    slug: "",
    content: "",
    cover_url: "",
    category: "AI Technology",
    tags: "AI, Business, Media",
    seo_description: "",
    status: "draft",
    scheduled_date: "",
    scheduled_time: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSlugLocked, setAutoSlugLocked] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Load editing post or reset
  useEffect(() => {
    if (editingBlog) {
      const { body, category, tags, seoDescription } = parseBlogContent(editingBlog.content);
      let schDate = "";
      let schTime = "";
      if (editingBlog.scheduled_at) {
        const d = new Date(editingBlog.scheduled_at);
        schDate = d.toISOString().split("T")[0];
        schTime = d.toTimeString().slice(0, 5);
      }

      setForm({
        title: editingBlog.title,
        slug: editingBlog.slug,
        content: body,
        cover_url: editingBlog.cover_url || editingBlog.thumbnail || editingBlog.media_url || "",
        category: category || "AI Technology",
        tags: (tags || []).join(", "),
        seo_description: seoDescription || "",
        status: editingBlog.status || "draft",
        scheduled_date: schDate,
        scheduled_time: schTime,
      });
      setAutoSlugLocked(true);
    } else {
      resetForm();
    }
  }, [editingBlog]);

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      content: "",
      cover_url: "",
      category: "AI Technology",
      tags: "AI, Automation, Growth",
      seo_description: "",
      status: "draft",
      scheduled_date: "",
      scheduled_time: "",
    });
    setAutoSlugLocked(false);
  };

  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: autoSlugLocked ? prev.slug : generateSlug(val),
    }));
  };

  // Image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      if (json.success && json.url) {
        setForm((prev) => ({ ...prev, cover_url: json.url }));
      } else {
        alert("Upload failed: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Textarea formatting helper
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);
    const replacement = prefix + (selectedText || "text") + suffix;

    const newContent =
      form.content.substring(0, start) +
      replacement +
      form.content.substring(end);

    setForm((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      );
    }, 50);
  };

  // Submit action (Draft / Publish / Schedule)
  const submitWithStatus = async (targetStatus: "published" | "scheduled" | "draft") => {
    if (!form.title.trim()) {
      alert("Please enter a blog title");
      return;
    }

    setIsSubmitting(true);
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";

    const tagList = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const serializedContent = serializeBlogContent(
      form.content,
      form.category,
      tagList,
      form.seo_description
    );

    let scheduledAtIso: string | null = null;
    if (targetStatus === "scheduled") {
      if (form.scheduled_date) {
        const timePart = form.scheduled_time || "12:00";
        scheduledAtIso = new Date(`${form.scheduled_date}T${timePart}:00`).toISOString();
      } else {
        // Fallback 1 day from now
        scheduledAtIso = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      }
    }

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || generateSlug(form.title),
      type: "blog",
      content: serializedContent,
      cover_url: form.cover_url.trim() || null,
      thumbnail: form.cover_url.trim() || null,
      media_url: form.cover_url.trim() || null,
      status: targetStatus,
      scheduled_at: scheduledAtIso,
    };

    try {
      const url = editingBlog
        ? `${apiBase}/posts/${editingBlog.id}`
        : `${apiBase}/posts`;
      const method = editingBlog ? "PUT" : "POST";

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save blog");
      }

      onSave();
      resetForm();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewClick = () => {
    const tagList = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const serializedContent = serializeBlogContent(
      form.content || "Write your article content to preview...",
      form.category,
      tagList,
      form.seo_description
    );

    const mockBlog: BlogPost = {
      id: editingBlog?.id || 9999,
      title: form.title || "Untitled Blog Post",
      slug: form.slug || generateSlug(form.title || "untitled"),
      content: serializedContent,
      cover_url: form.cover_url || null,
      thumbnail: form.cover_url || null,
      status: form.status,
      created_at: new Date().toISOString(),
      type: "blog",
    };

    onPreview(mockBlog);
  };

  const readingTime = calculateReadingTime(form.content);

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Blog Editor</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {editingBlog ? "Edit Article" : "Compose New Article"}
          </h2>
        </div>

        {/* Quick Actions in Header */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePreviewClick}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition"
            title="Reset form"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Editor (7 Cols) + Right Meta Panel (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Main Content & Media (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Cover Image Upload & Preview Card */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
              Cover Image (Recommended: 1920x1080)
            </label>

            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] hover:border-blue-500/50 transition-colors p-4 group">
              {form.cover_url ? (
                <div className="relative w-full h-56 rounded-xl overflow-hidden bg-zinc-900">
                  <img
                    src={form.cover_url}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-blue-500 transition">
                      Change Cover
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, cover_url: "" }))}
                      className="rounded-xl bg-rose-600/80 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {isUploading ? "Uploading image..." : "Upload Cover Image"}
                  </span>
                  <span className="text-xs text-zinc-400 mt-1">
                    Click to browse or drop high-res PNG, JPG or WebP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={isUploading}
                    onChange={handleFileUpload}
                  />
                </label>
              )}

              {/* Direct Image URL input fallback */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Or paste direct image URL (e.g. https://... or /world-map-glow.jpg)"
                  value={form.cover_url}
                  onChange={(e) => setForm((prev) => ({ ...prev, cover_url: e.target.value }))}
                  className="w-full bg-transparent text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Blog Title */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
              Article Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Next-Gen Autonomous AI Media Operations in 2026"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-base font-semibold text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Content Editor with Rich Formatting Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                Article Body (Markdown Supported)
              </label>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>{readingTime}</span>
              </div>
            </div>

            {/* Quick Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-t-2xl border border-b-0 border-white/10 bg-white/[0.04] p-2">
              <button
                type="button"
                onClick={() => insertFormatting("## ")}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition text-xs font-bold"
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => insertFormatting("### ")}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition text-xs font-bold"
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </button>

              <div className="h-4 w-px bg-white/10 mx-1" />

              <button
                type="button"
                onClick={() => insertFormatting("**", "**")}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => insertFormatting("*", "*")}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => insertFormatting("> ")}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition"
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => insertFormatting("```\n", "\n```")}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition"
                title="Code block"
              >
                <Code className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => insertFormatting("- ")}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => insertFormatting("[", "](https://)")}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition"
                title="Link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            </div>

            <textarea
              ref={contentRef}
              rows={11}
              placeholder="Write or paste your article in markdown. Use ## for headings, **bold** for emphasis, > for quotes..."
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              className="w-full rounded-b-2xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-zinc-500 font-sans focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition leading-relaxed resize-y"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: SEO & Publishing Metadata Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span>SEO & Publishing Settings</span>
            </h3>

            {/* Auto Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-400">URL Slug</label>
                <button
                  type="button"
                  onClick={() => setAutoSlugLocked(!autoSlugLocked)}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  {autoSlugLocked ? "Unlock Auto-Sync" : "Lock Slug"}
                </button>
              </div>
              <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-zinc-300">
                <span className="text-zinc-500 select-none">/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setAutoSlugLocked(true);
                    setForm((prev) => ({ ...prev, slug: e.target.value }));
                  }}
                  placeholder="article-slug"
                  className="flex-1 bg-transparent text-white focus:outline-none ml-0.5"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Input */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="AI, Media, Marketing, Growth"
                value={form.tags}
                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            {/* SEO Description / Excerpt */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  SEO Description / Excerpt
                </label>
                <span
                  className={`text-[10px] ${
                    form.seo_description.length > 160
                      ? "text-rose-400 font-bold"
                      : "text-zinc-500"
                  }`}
                >
                  {form.seo_description.length}/160
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Brief summary for Google search snippet and social sharing cards..."
                value={form.seo_description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, seo_description: e.target.value }))
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition resize-none"
              />
            </div>

            {/* Schedule Section */}
            <div className="pt-2 border-t border-white/10">
              <label className="text-xs font-semibold text-zinc-400 block mb-2">
                Schedule Publishing (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={form.scheduled_date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, scheduled_date: e.target.value }))
                  }
                  className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="time"
                  value={form.scheduled_time}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, scheduled_time: e.target.value }))
                  }
                  className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Publishing Action Buttons Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Publishing Actions
            </h4>

            {/* 1. Publish Now */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => submitWithStatus("published")}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? "Publishing..." : "Publish Article Now"}</span>
            </button>

            {/* 2. Schedule Blog */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => submitWithStatus("scheduled")}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition disabled:opacity-50"
            >
              <Calendar className="h-4 w-4" />
              <span>{isSubmitting ? "Scheduling..." : "Schedule Blog Post"}</span>
            </button>

            {/* 3. Save Draft */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => submitWithStatus("draft")}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-600/20 hover:bg-blue-600/30 px-4 py-3 text-sm font-semibold text-blue-300 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>Save As Draft</span>
            </button>

            {/* Cancel Edit Button */}
            {editingBlog && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
              >
                Cancel Editing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

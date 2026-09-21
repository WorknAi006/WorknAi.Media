"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  FileCheck2,
  Calendar,
  FileEdit,
  Clock,
  TrendingUp,
} from "lucide-react";
import BlogEditor from "./BlogEditor";
import BlogTable from "./BlogTable";
import BlogPreviewModal from "./BlogPreviewModal";
import { BlogPost, parseBlogContent } from "./types";

export default function BlogManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "scheduled" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const getHeaders = (): HeadersInit => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/posts?type=blog`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      setBlogs(json.data || []);
    } catch (err) {
      console.error("Failed to load blog posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBlog = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this blog article?")) {
      return;
    }

    try {
      const res = await fetch(`${apiBase}/posts/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Filter & Search
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      // Tab filter
      if (activeTab !== "all" && b.status !== activeTab) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const { category, tags } = parseBlogContent(b.content);
        const matchTitle = b.title.toLowerCase().includes(query);
        const matchSlug = b.slug.toLowerCase().includes(query);
        const matchCategory = category.toLowerCase().includes(query);
        const matchTags = tags.some((t) => t.toLowerCase().includes(query));
        return matchTitle || matchSlug || matchCategory || matchTags;
      }
      return true;
    });
  }, [blogs, activeTab, searchQuery]);

  // Analytics
  const stats = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter((b) => b.status === "published").length;
    const scheduled = blogs.filter((b) => b.status === "scheduled").length;
    const draft = blogs.filter((b) => b.status === "draft").length;

    // Calculate Average Reading Time
    let totalMinutes = 0;
    blogs.forEach((b) => {
      const { body } = parseBlogContent(b.content);
      const words = body.trim().split(/\s+/).filter(Boolean).length;
      totalMinutes += Math.max(1, Math.ceil(words / 200));
    });
    const avgReadingTime = total > 0 ? `${Math.round(totalMinutes / total)} min` : "0 min";

    return { total, published, scheduled, draft, avgReadingTime };
  }, [blogs]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-2 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>WorknAI Media CMS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <span>Blog CMS</span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {stats.total} {stats.total === 1 ? "article" : "articles"}
            </span>
          </h1>

          <p className="text-sm text-zinc-400 mt-1.5 max-w-xl">
            Author, optimize, schedule, and publish search-engine-optimized editorial content for brand authority.
          </p>
        </div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search title, category, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {(["all", "published", "scheduled", "draft"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Live Analytics Panel (5 Stat Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Blogs */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 hover:border-white/20 transition group shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Blogs</span>
            <BookOpen className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-white">{stats.total}</p>
          <span className="text-[11px] text-zinc-500">In database</span>
        </div>

        {/* Published */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-md p-4 hover:border-emerald-500/30 transition group shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Published</span>
            <FileCheck2 className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-emerald-300">{stats.published}</p>
          <span className="text-[11px] text-emerald-500/80">Live on website</span>
        </div>

        {/* Scheduled */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-950/10 backdrop-blur-md p-4 hover:border-purple-500/30 transition group shadow-lg">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Scheduled</span>
            <Calendar className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-purple-300">{stats.scheduled}</p>
          <span className="text-[11px] text-purple-500/80">Automated queue</span>
        </div>

        {/* Draft */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 backdrop-blur-md p-4 hover:border-amber-500/30 transition group shadow-lg">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Draft</span>
            <FileEdit className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-amber-300">{stats.draft}</p>
          <span className="text-[11px] text-amber-500/80">Work in progress</span>
        </div>

        {/* Avg Reading Time */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 backdrop-blur-md p-4 hover:border-cyan-500/30 transition group shadow-lg">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Reading</span>
            <Clock className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-cyan-300">{stats.avgReadingTime}</p>
          <span className="text-[11px] text-cyan-500/80">Per publication</span>
        </div>
      </div>

      {/* 3. Blog Editor Card */}
      <BlogEditor
        editingBlog={editingBlog}
        onSave={() => {
          loadBlogs();
          setEditingBlog(null);
        }}
        onCancel={() => setEditingBlog(null)}
        onPreview={(mock) => setPreviewBlog(mock)}
      />

      {/* 4. Blog List Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>All Articles</span>
            <span className="text-xs text-zinc-400 font-mono">({filteredBlogs.length})</span>
          </h3>
        </div>

        <BlogTable
          blogs={filteredBlogs}
          isLoading={isLoading}
          onEdit={(blog) => {
            setEditingBlog(blog);
            window.scrollTo({ top: 300, behavior: "smooth" });
          }}
          onDelete={deleteBlog}
          onPreview={(blog) => setPreviewBlog(blog)}
          onCreateNew={() => window.scrollTo({ top: 300, behavior: "smooth" })}
        />
      </div>

      {/* 5. Live Article Preview Modal */}
      <BlogPreviewModal
        blog={previewBlog}
        onClose={() => setPreviewBlog(null)}
      />
    </div>
  );
}

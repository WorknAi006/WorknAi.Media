"use client";

import React from "react";
import { Edit2, Trash2, Eye, Clock, Calendar, BookOpen, Sparkles, Plus } from "lucide-react";
import { BlogPost, parseBlogContent, calculateReadingTime } from "./types";

interface Props {
  blogs: BlogPost[];
  isLoading: boolean;
  onEdit: (blog: BlogPost) => void;
  onDelete: (id: number) => void;
  onPreview: (blog: BlogPost) => void;
  onCreateNew?: () => void;
}

export default function BlogTable({
  blogs,
  isLoading,
  onEdit,
  onDelete,
  onPreview,
  onCreateNew,
}: Props) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-3" />
        <p className="text-sm text-zinc-400">Loading blog articles from database...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 sm:p-16 text-center space-y-4">
        <div className="mx-auto h-16 w-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <BookOpen className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">No Blog Articles Found</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto mt-1">
            Create your first SEO blog to drive organic traffic, scale brand awareness, and dominate search rankings.
          </p>
        </div>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create Your First SEO Blog</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white">
          <thead className="border-b border-white/10 bg-white/[0.03] text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="py-4 pl-6 pr-3">Cover</th>
              <th className="px-4 py-4">Title & Slug</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Reading Time</th>
              <th className="px-4 py-4">Date</th>
              <th className="py-4 pl-3 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {blogs.map((blog) => {
              const { body, category } = parseBlogContent(blog.content);
              const readingTime = calculateReadingTime(body);
              const coverUrl = blog.cover_url || blog.thumbnail || blog.media_url || "/world-map-glow.jpg";

              return (
                <tr
                  key={blog.id}
                  className="group hover:bg-white/[0.04] transition-colors"
                >
                  {/* Cover */}
                  <td className="py-4 pl-6 pr-3">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-md">
                      <img
                        src={coverUrl}
                        alt={blog.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/world-map-glow.jpg";
                        }}
                      />
                    </div>
                  </td>

                  {/* Title & Slug */}
                  <td className="px-4 py-4 max-w-xs sm:max-w-sm">
                    <p className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {blog.title}
                    </p>
                    <p className="font-mono text-xs text-zinc-500 line-clamp-1">
                      /{blog.slug}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300">
                      <Sparkles className="h-3 w-3 text-cyan-400" />
                      {category}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        blog.status === "published"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                          : blog.status === "scheduled"
                          ? "border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.2)]"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>

                  {/* Reading Time */}
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-500" />
                      {readingTime}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                      {new Date(blog.created_at || Date.now()).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Preview Button */}
                      <button
                        type="button"
                        onClick={() => onPreview(blog)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition"
                        title="Preview Article"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => onEdit(blog)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-blue-500/10 hover:text-blue-400 transition"
                        title="Edit Article"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onDelete(blog.id)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                        title="Delete Article"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

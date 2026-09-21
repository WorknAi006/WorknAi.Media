"use client";

import { useEffect, useState, useMemo } from "react";
import CalendarView from "./CalendarView";
import ScheduledTable from "./ScheduledTable";
import { ScheduledPost, SchedulerStats } from "./types";

const formatToLocalDateTimeString = (dateStr?: string | null): string => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function SchedulerCMS() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [stats, setStats] = useState<SchedulerStats>({
    total: 0,
    scheduled: 0,
    published: 0,
    today: 0,
    draft: 0,
  });
  const [todayPosts, setTodayPosts] = useState<ScheduledPost[]>([]);
  const [upcomingPosts, setUpcomingPosts] = useState<ScheduledPost[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<ScheduledPost[]>([]);

  const [activeTab, setActiveTab] = useState<"calendar" | "upcoming" | "today" | "history">("calendar");
  const [typeFilter, setTypeFilter] = useState<"all" | "reel" | "blog">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Reschedule modal state
  const [reschedulingPost, setReschedulingPost] = useState<ScheduledPost | null>(null);
  const [newScheduleDate, setNewScheduleDate] = useState("");
  const [newScheduleTime, setNewScheduleTime] = useState("");

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const getHeaders = (hasBody = false): HeadersInit => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: Record<string, string> = {};
    if (hasBody) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const loadSchedulerData = async () => {
    setIsLoading(true);
    try {
      const typeParam = typeFilter !== "all" ? `?type=${typeFilter}` : "";
      const res = await fetch(`${apiBase}/scheduler/overview${typeParam}`, {
        headers: getHeaders(),
      });
      const json = await res.json();

      if (json.success) {
        setPosts(json.posts || []);
        setStats(json.stats || { total: 0, scheduled: 0, published: 0, today: 0, draft: 0 });
        setTodayPosts(json.todayPosts || []);
        setUpcomingPosts(json.upcomingPosts || []);
        setPublishedPosts(json.publishedPosts || []);
      }
    } catch (err) {
      console.error("Failed to load scheduler data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedulerData();
    const interval = setInterval(() => {
      loadSchedulerData();
    }, 10000);
    window.addEventListener("focus", loadSchedulerData);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", loadSchedulerData);
    };
  }, [typeFilter]);

  // Manually trigger backend auto-publish check
  const handleTriggerSync = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${apiBase}/scheduler/trigger`, {
        method: "POST",
        headers: getHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setSyncMessage(json.message);
        setTimeout(() => setSyncMessage(null), 4000);
        await loadSchedulerData();
      }
    } catch (err: any) {
      setSyncMessage(err.message || "Sync failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Publish a post immediately
  const handlePublishNow = async (id: number) => {
    if (!window.confirm("Publish this post live right now?")) return;

    try {
      await fetch(`${apiBase}/posts/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify({ status: "published" }),
      });
      await loadSchedulerData();
    } catch (err) {
      console.error("Failed to publish now:", err);
    }
  };

  // Delete post
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await fetch(`${apiBase}/posts/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      await loadSchedulerData();
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  // Open reschedule modal with separated date and time
  const openRescheduleModal = (post: ScheduledPost) => {
    setReschedulingPost(post);
    const d = post.scheduled_at ? new Date(post.scheduled_at) : new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setNewScheduleDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    setNewScheduleTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
  };

  // Save rescheduled date & time
  const handleSaveReschedule = async () => {
    if (!reschedulingPost || !newScheduleDate || !newScheduleTime) return;

    try {
      await fetch(`${apiBase}/scheduler/reschedule/${reschedulingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduled_at: new Date(`${newScheduleDate}T${newScheduleTime}`).toISOString(),
          status: "scheduled",
        }),
      });
      setReschedulingPost(null);
      await loadSchedulerData();
    } catch (err) {
      console.error("Failed to reschedule post:", err);
    }
  };

  const filteredCalendarPosts = useMemo(() => {
    if (typeFilter === "all") return posts;
    return posts.filter((p) => p.type === typeFilter);
  }, [posts, typeFilter]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            Automated Engine (Every 1m)
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Auto-Publish Scheduler
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Automated publishing system for WorknAI Media Reels & Blog articles.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerSync}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:brightness-110 disabled:opacity-50 transition"
          >
            <span>⚡ Run Auto-Publish Check</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 animate-fadeIn">
          ✓ {syncMessage}
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 space-y-1">
          <p className="text-xs font-medium text-zinc-400">Scheduled Posts</p>
          <p className="text-2xl font-extrabold text-blue-400">{stats.scheduled}</p>
          <p className="text-[11px] text-zinc-500">Waiting in queue</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 space-y-1">
          <p className="text-xs font-medium text-zinc-400">Today's Content</p>
          <p className="text-2xl font-extrabold text-amber-400">{stats.today}</p>
          <p className="text-[11px] text-zinc-500">Scheduled for today</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 space-y-1">
          <p className="text-xs font-medium text-zinc-400">Published</p>
          <p className="text-2xl font-extrabold text-emerald-400">{stats.published}</p>
          <p className="text-[11px] text-zinc-500">Live on platform</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 space-y-1">
          <p className="text-xs font-medium text-zinc-400">Drafts</p>
          <p className="text-2xl font-extrabold text-zinc-300">{stats.draft}</p>
          <p className="text-[11px] text-zinc-500">Unscheduled</p>
        </div>
      </div>

      {/* Main Filter & Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* View Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {[
            { id: "calendar", label: "📅 Calendar View" },
            { id: "upcoming", label: `Upcoming (${upcomingPosts.length})` },
            { id: "today", label: `Today's Schedule (${todayPosts.length})` },
            { id: "history", label: `Published History (${publishedPosts.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Filter Type:</span>
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {[
              { id: "all", label: "All" },
              { id: "reel", label: "🎬 Reels" },
              { id: "blog", label: "📝 Blogs" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id as any)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                  typeFilter === t.id
                    ? "bg-white/15 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content Display */}
      {activeTab === "calendar" && (
        <CalendarView
          posts={filteredCalendarPosts}
          onSelectPost={openRescheduleModal}
        />
      )}

      {activeTab === "upcoming" && (
        <ScheduledTable
          posts={upcomingPosts}
          title="Upcoming Scheduled Posts"
          subtitle="Content configured to auto-publish in the future."
          onPublishNow={handlePublishNow}
          onReschedule={openRescheduleModal}
          onDelete={handleDelete}
        />
      )}

      {activeTab === "today" && (
        <ScheduledTable
          posts={todayPosts}
          title="Today's Scheduled Posts"
          subtitle="All content lined up for publishing today."
          onPublishNow={handlePublishNow}
          onReschedule={openRescheduleModal}
          onDelete={handleDelete}
        />
      )}

      {activeTab === "history" && (
        <ScheduledTable
          posts={publishedPosts}
          title="Published History"
          subtitle="All articles and reels that have already gone live."
          onDelete={handleDelete}
        />
      )}

      {/* Reschedule Modal */}
      {reschedulingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Reschedule Content</h3>
            <p className="text-xs text-zinc-400 line-clamp-1">
              {reschedulingPost.title}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-blue-400">
                  📅 Date (MM/DD/YYYY) *
                </label>
                <input
                  type="date"
                  value={newScheduleDate}
                  onChange={(e) => setNewScheduleDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-blue-400">
                  ⏰ Time *
                </label>
                <input
                  type="time"
                  value={newScheduleTime}
                  onChange={(e) => setNewScheduleTime(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReschedulingPost(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

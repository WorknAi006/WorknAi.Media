"use client";

import { useEffect, useState } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { ReelFormData, ReelPost } from "./types";

type Props = {
  editingReel: ReelPost | null;
  onSave: () => void;
  onCancel: () => void;
};

const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "youtube", label: "YouTube Shorts", icon: "▶️" },
  { id: "twitter", label: "X / Twitter", icon: "✖️" },
];

const initialFormData: ReelFormData = {
  title: "",
  slug: "",
  type: "reel",
  content: "",
  media_url: "",
  thumbnail: "",
  status: "draft",
  scheduled_at: "",
  brand: "",
  platforms: [],
};

const getInitialSchedule = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  };
};

export default function ReelsForm({ editingReel, onSave, onCancel }: Props) {
  const [form, setForm] = useState<ReelFormData>(initialFormData);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState(() => getInitialSchedule().date);
  const [scheduleTime, setScheduleTime] = useState(() => getInitialSchedule().time);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamically load brands from Brands & URLs (/api/clients)
  useEffect(() => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    fetch(`${apiBase}/clients`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setBrands(json.data);
        }
      })
      .catch((err) => console.error("Failed to fetch brands:", err));
  }, []);

  useEffect(() => {
    if (editingReel) {
      setForm({
        title: editingReel.title,
        slug: editingReel.slug,
        type: "reel",
        content: editingReel.content ?? "",
        media_url: editingReel.media_url ?? "",
        thumbnail: editingReel.thumbnail ?? "",
        status: editingReel.status,
        scheduled_at: editingReel.scheduled_at ?? "",
        brand: editingReel.brand ?? "",
        platforms: editingReel.platforms ?? [],
      });
      setSelectedPlatforms(editingReel.platforms ?? []);

      if (editingReel.scheduled_at) {
        const d = new Date(editingReel.scheduled_at);
        if (!isNaN(d.getTime())) {
          const pad = (n: number) => String(n).padStart(2, "0");
          setScheduleDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
          setScheduleTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
        }
      }
      setErrorMessage(null);
    } else {
      setForm(initialFormData);
      setSelectedPlatforms([]);
      const init = getInitialSchedule();
      setScheduleDate(init.date);
      setScheduleTime(init.time);
      setErrorMessage(null);
    }
  }, [editingReel]);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleTitleChange = (val: string) => {
    if (!editingReel) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setForm((prev) => ({ ...prev, title: val, slug: generatedSlug }));
    } else {
      setForm((prev) => ({ ...prev, title: val }));
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    setUploadError(null);
    try {
      const data = new FormData();
      data.append("file", file);

      const token = typeof window !== "undefined" ? localStorage.getItem("worknai_token") : "";
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: data,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setForm((prev) => ({ ...prev, media_url: json.url }));
      } else {
        setUploadError(json.error || "Failed to upload video file");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload video file");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumbnail(true);
    setUploadError(null);
    try {
      const data = new FormData();
      data.append("file", file);

      const token = typeof window !== "undefined" ? localStorage.getItem("worknai_token") : "";
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: data,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setForm((prev) => ({ ...prev, thumbnail: json.url }));
      } else {
        setUploadError(json.error || "Failed to upload thumbnail file");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload thumbnail file");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const url = editingReel ? `${apiBase}/posts/${editingReel.id}` : `${apiBase}/posts`;
    const method = editingReel ? "PUT" : "POST";

    const resolvedScheduledAt =
      form.status === "scheduled" && scheduleDate && scheduleTime
        ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
        : null;

    const payload = {
      ...form,
      type: "reel",
      media_url: form.media_url?.trim() || null,
      thumbnail: form.thumbnail?.trim() || null,
      brand: form.brand?.trim() || null,
      platforms: selectedPlatforms,
      scheduled_at: resolvedScheduledAt,
    };

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save reel");
      }

      setForm(initialFormData);
      setSelectedPlatforms([]);
      onSave();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-white shadow-[0_0_30px_rgba(59,130,246,0.08)] transition hover:border-blue-500/30"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            {editingReel ? "Edit Reel" : "Create New Reel"}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Publish or schedule vertical video content for WorknAI Media.
          </p>
        </div>
        {editingReel && (
          <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 text-xs font-semibold text-amber-300">
            Editing #{editingReel.id}
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Reel Title *</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            placeholder="e.g. 5 AI Tools Changing Media Creation"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </div>

        {/* Slug */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Slug (URL identifier) *</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            placeholder="e.g. 5-ai-tools-changing-media"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Brand & Target Social Media Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-white/5 bg-black/20 p-4">
        {/* Dynamic Brand Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
            <span>Brand / Client</span>
            <span className="text-[10px] text-zinc-500 font-mono">Dynamic (Brands & URLs)</span>
          </label>
          <select
            className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.brand ?? ""}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          >
            <option value="">-- Select Brand / Client --</option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
            {/* Fallback brands if table is empty or customized */}
            {!brands.some((b) => b.name === "WorknAI") && <option value="WorknAI">WorknAI</option>}
            {!brands.some((b) => b.name === "Online Go") && <option value="Online Go">Online Go</option>}
            {!brands.some((b) => b.name === "GoLogix") && <option value="GoLogix">GoLogix</option>}
            {!brands.some((b) => b.name === "PG Info") && <option value="PG Info">PG Info</option>}
            {!brands.some((b) => b.name === "Loveza") && <option value="Loveza">Loveza</option>}
            {!brands.some((b) => b.name === "Car Hub") && <option value="Car Hub">Car Hub</option>}
          </select>
        </div>

        {/* Social Media Platforms */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">
            Post To (Social Media Channels)
          </label>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {SOCIAL_PLATFORMS.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <button
                  type="button"
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-blue-600/30 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.35)]"
                      : "bg-black/40 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                  }`}
                >
                  <span>{platform.icon}</span>
                  <span>{platform.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          {uploadError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Media / Video URL & Direct Upload */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-300">Video / Media File (Optional)</label>
            {form.media_url?.includes("supabase.co") && (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Supabase Storage Public URL
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-white/10 bg-black/40 p-3 text-xs font-mono text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              placeholder="https://.../video.mp4 or Click Upload ->"
              value={form.media_url ?? ""}
              onChange={(e) => setForm({ ...form, media_url: e.target.value })}
            />
            <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition">
              {isUploadingMedia ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
              ) : (
                <Upload className="h-4 w-4 text-blue-400" />
              )}
              <span>{isUploadingMedia ? "Uploading..." : "Upload MP4"}</span>
              <input
                type="file"
                accept="video/mp4,video/quicktime,image/jpeg,image/png"
                className="hidden"
                onChange={handleMediaUpload}
                disabled={isUploadingMedia}
              />
            </label>
          </div>
        </div>

        {/* Thumbnail URL & Direct Upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Thumbnail Cover (Optional)</label>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-white/10 bg-black/40 p-3 text-xs font-mono text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              placeholder="https://.../cover.jpg or Click Upload ->"
              value={form.thumbnail ?? ""}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            />
            <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition">
              {isUploadingThumbnail ? (
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              ) : (
                <Upload className="h-4 w-4 text-zinc-400" />
              )}
              <span>{isUploadingThumbnail ? "Uploading..." : "Upload Image"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleThumbnailUpload}
                disabled={isUploadingThumbnail}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Caption / Content */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-300">Caption & Description</label>
        <textarea
          className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          placeholder="Write the reel caption, hashtags, and description..."
          rows={3}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
      </div>

      {/* Status & Scheduling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-white/5 bg-black/20 p-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Publishing Status</label>
          <select
            className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ReelFormData["status"] })}
          >
            <option value="draft">Draft (Save privately)</option>
            <option value="scheduled">Scheduled (Auto-publish at specific date/time)</option>
            <option value="published">Published (Go live immediately)</option>
          </select>
        </div>

        {form.status === "scheduled" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-xs font-medium text-blue-400 flex items-center gap-1">
                📅 Date (MM/DD/YYYY) *
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-blue-500/40 bg-zinc-900 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                required={form.status === "scheduled"}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-blue-400 flex items-center gap-1">
                ⏰ Time *
              </label>
              <input
                type="time"
                className="w-full rounded-xl border border-blue-500/40 bg-zinc-900 p-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                required={form.status === "scheduled"}
              />
            </div>
          </div>
        )}
      </div>

      {/* Form Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:brightness-110 disabled:opacity-50 transition"
        >
          {isSubmitting ? "Saving..." : editingReel ? "Update Reel" : "Save Reel"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 bg-zinc-800/80 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

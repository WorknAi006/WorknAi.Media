"use client";

import { useEffect, useState } from "react";
import { Hero } from "./HeroManager";

type Props = {
  editingHero: Hero | null;
  onSave: () => void;
  onCancel: () => void;
};

export default function HeroForm({
  editingHero,
  onSave,
  onCancel,
}: Props) {
  const [form, setForm] = useState<Omit<Hero, "id">>({
    title: "",
    subtitle: "",
    image_url: "",
    video_url: "",
    button_text: "",
  });

  useEffect(() => {
    if (editingHero) {
      setForm({
        title: editingHero.title,
        subtitle: editingHero.subtitle,
        image_url: editingHero.image_url ?? "",
        video_url: editingHero.video_url ?? "",
        button_text: editingHero.button_text,
      });
    } else {
      setForm({
        title: "",
        subtitle: "",
        image_url: "",
        video_url: "",
        button_text: "",
      });
    }
  }, [editingHero]);

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingVideo(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      if (json.success && json.url) {
        setForm((prev) => ({ ...prev, video_url: json.url }));
      } else {
        alert("Upload failed: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error uploading video: " + err.message);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      if (json.success && json.url) {
        setForm((prev) => ({ ...prev, image_url: json.url }));
      } else {
        alert("Upload failed: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";

    const url = editingHero
      ? `${apiBase}/hero/${editingHero.id}`
      : `${apiBase}/hero`;

    const method = editingHero ? "PUT" : "POST";

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    await fetch(url, {
      method,
      headers,
      body: JSON.stringify(form),
    });

    // Also update local storage if WorknAI hero is saved
    try {
      const saved = localStorage.getItem("worknai_hero_projects_db");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((p: any) =>
          p.id === "worknai"
            ? {
                ...p,
                title: form.title,
                subtitle: form.subtitle,
                videoUrl: form.video_url,
                thumbnail: form.image_url || "/world-map-glow.jpg",
              }
            : p
        );
        localStorage.setItem("worknai_hero_projects_db", JSON.stringify(updated));
        window.dispatchEvent(new Event("worknai_hero_projects_updated"));
      }
    } catch (err) {}

    onSave();

    setForm({
      title: "",
      subtitle: "",
      image_url: "",
      video_url: "",
      button_text: "",
    });
  };

  const isUniverse = form.title?.toLowerCase().includes("universe") || editingHero?.title?.toLowerCase().includes("universe");

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-xl p-6 text-white shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">
              {isUniverse
                ? "🌌 Manage Explore Our Universe Section"
                : editingHero
                ? "Edit Hero Content"
                : "Create Hero Content"}
            </h2>
            {isUniverse && (
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400">
                Universe Section
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isUniverse
              ? "Manage background video, headline, subtitle, and CTA button for the Explore Our Universe section."
              : "Customize the landing page title, subtitle, video, and background map."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">
            {isUniverse ? "Section Title" : "Hero Title"}
          </label>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm focus:border-blue-500 focus:outline-none transition"
            placeholder={isUniverse ? "e.g. Explore Our Universe" : "e.g. WorknAI Media"}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Button Text</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm focus:border-blue-500 focus:outline-none transition"
            placeholder={isUniverse ? "e.g. Explore All Sections" : "e.g. Get Started"}
            value={form.button_text}
            onChange={(e) => setForm({ ...form, button_text: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-300 block mb-1">
          {isUniverse ? "Section Subtitle / Description" : "Hero Subtitle"}
        </label>
        <textarea
          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm focus:border-blue-500 focus:outline-none transition"
          placeholder={
            isUniverse
              ? "e.g. Travel. Create. Innovate. Grow. From real stories to AI tools..."
              : "e.g. AI Powered Digital Growth"
          }
          rows={2}
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          required
        />
      </div>

      {/* Video Upload & URL Section */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
            <span>
              {isUniverse
                ? "🌌 Explore Universe Background Video (Smooth Loop)"
                : "Background Video (Hero Loop)"}
            </span>
            <span className="text-[10px] font-normal text-zinc-400">
              {isUniverse
                ? "(Supports high-definition MP4 videos with smooth 60fps auto-loop)"
                : "(Leave empty to show only glowing world map)"}
            </span>
          </label>
          {form.video_url && !isUniverse && (
            <button
              type="button"
              onClick={() => setForm({ ...form, video_url: "" })}
              className="text-xs text-rose-400 hover:text-rose-300 underline font-medium transition"
            >
              Remove Video (Use Map Only)
            </button>
          )}
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-zinc-400">Quick Presets:</span>
          <button
            type="button"
            onClick={() => setForm({ ...form, video_url: "/videos/universe.mp4" })}
            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
              form.video_url === "/videos/universe.mp4"
                ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            🌌 Universe Video (/videos/universe.mp4)
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, video_url: "/videos/worknai.mp4" })}
            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
              form.video_url === "/videos/worknai.mp4"
                ? "border-blue-400 bg-blue-500/20 text-blue-300"
                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            ⚡ WorknAI Loop (/videos/worknai.mp4)
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* File Upload Button */}
          <label className="relative flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white cursor-pointer transition shadow-lg shadow-blue-600/20 whitespace-nowrap">
            <span>{isUploadingVideo ? "Uploading..." : "Upload Video (.mp4, .webm)"}</span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              className="sr-only"
              disabled={isUploadingVideo}
              onChange={handleVideoUpload}
            />
          </label>

          <span className="text-xs text-zinc-500 font-medium">OR enter direct URL:</span>

          {/* Manual URL input */}
          <input
            className="flex-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs focus:border-blue-500 focus:outline-none transition"
            placeholder="Paste direct MP4 URL or path (e.g. /videos/universe.mp4)"
            value={form.video_url ?? ""}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
          />
        </div>

        {/* Live Video Preview if URL is set */}
        {form.video_url ? (
          <div className="mt-2 rounded-lg overflow-hidden border border-white/10 bg-black/40 p-2">
            <p className="text-[11px] text-emerald-400 font-semibold mb-1">Live Video Preview:</p>
            <video
              src={form.video_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-h-48 object-cover rounded"
            />
          </div>
        ) : (
          <p className="text-[11px] text-zinc-400 italic">
            {isUniverse
              ? "No custom video specified: System will fallback to /videos/universe.mp4."
              : "Currently No Video selected: Landing page will show the 4K luminous glowing world map."}
          </p>
        )}
      </div>

      {/* Background Image / Map Section */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <label className="text-xs font-semibold text-zinc-300 block">
          Background Image / World Map URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <label className="relative flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-zinc-200 cursor-pointer transition whitespace-nowrap">
            <span>{isUploadingImage ? "Uploading..." : "Upload Image"}</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={isUploadingImage}
              onChange={handleImageUpload}
            />
          </label>

          <input
            className="flex-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs focus:border-blue-500 focus:outline-none transition"
            placeholder="/world-map-glow.jpg or custom image URL"
            value={form.image_url ?? ""}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition"
        >
          {editingHero ? "Update" : "Save"}
        </button>

        {editingHero && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-zinc-700 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-600 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
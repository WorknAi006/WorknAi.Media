import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Layers,
  AlertCircle,
  RefreshCw,
  Video,
  Share2,
  Cpu,
  TrendingUp,
  Rocket,
  Wand2,
} from "lucide-react";
import { ServiceItem } from "./types";

interface ServicesFormProps {
  isOpen: boolean;
  service: ServiceItem | null;
  onClose: () => void;
  onSave: (serviceData: Partial<ServiceItem>) => Promise<boolean>;
}

const AVAILABLE_ICONS = [
  { name: "Sparkles", icon: Sparkles },
  { name: "Video", icon: Video },
  { name: "Share2", icon: Share2 },
  { name: "Cpu", icon: Cpu },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Rocket", icon: Rocket },
  { name: "Wand2", icon: Wand2 },
  { name: "Layers", icon: Layers },
];

const CATEGORIES = [
  "AI Production",
  "Social Media Automation",
  "Full-Stack AI",
  "Brand Strategy",
  "Creative Direction",
  "Workflow Automation",
];

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

export default function ServicesForm({
  isOpen,
  service,
  onClose,
  onSave,
}: ServicesFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    category: "AI Production",
    icon: "Video",
    cover_image: "",
    display_order: 0,
    featured: false,
    status: "published",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        slug: service.slug || "",
        short_description: service.short_description || "",
        description: service.description || "",
        category: service.category || "AI Production",
        icon: service.icon || "Video",
        cover_image: service.cover_image || "",
        display_order: service.display_order ?? 0,
        featured: Boolean(service.featured),
        status: service.status || "published",
      });
      setAutoSlug(false);
    } else {
      setFormData({
        title: "",
        slug: "",
        short_description: "",
        description: "",
        category: "AI Production",
        icon: "Video",
        cover_image: "",
        display_order: 0,
        featured: false,
        status: "published",
      });
      setAutoSlug(true);
    }
    setErrorMsg("");
  }, [service, isOpen]);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: autoSlug ? slugify(val) : prev.slug,
    }));
  };

  // Image Upload handler to /api/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, cover_image: json.url }));
      } else {
        setErrorMsg(json.error || "Failed to upload image asset");
      }
    } catch (err: any) {
      setErrorMsg("Upload error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg("Please enter a service title.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const success = await onSave({
        title: formData.title.trim(),
        slug: formData.slug.trim() || slugify(formData.title),
        short_description: formData.short_description.trim(),
        description: formData.description.trim(),
        category: formData.category,
        icon: formData.icon,
        cover_image: formData.cover_image.trim() || null,
        display_order: Number(formData.display_order) || 0,
        featured: formData.featured,
        status: formData.status,
      });

      if (success) {
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1020]/95 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-white my-8"
        >
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  {service ? "Edit Service Offering" : "Create New Agency Service"}
                </h2>
                <p className="text-xs text-zinc-400">
                  Configure solution details, category, icon, display order, and publishing status.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Service Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Service Name / Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Video Production"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Slug */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    URL Slug <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSlug(!autoSlug);
                      if (!autoSlug) {
                        setFormData((p) => ({ ...p, slug: slugify(p.title) }));
                      }
                    }}
                    className="text-[10px] text-cyan-400 hover:underline font-mono"
                  >
                    {autoSlug ? "Auto-synced" : "Custom"}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="ai-video-production"
                  value={formData.slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setFormData({ ...formData, slug: slugify(e.target.value) });
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-[#121829] px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0B1020] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Display Order (Priority)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Select Visual Icon
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVAILABLE_ICONS.map(({ name, icon: IconItem }) => {
                  const isSelected = formData.icon.toLowerCase() === name.toLowerCase();
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: name })}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 transition ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                          : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <IconItem className="h-5 w-5 mb-1" />
                      <span className="text-[10px] font-mono">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cover Image & Upload */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Cover Image / Asset
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="url"
                    placeholder="https://... or upload asset"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{isUploading ? "Uploading..." : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Short Description / Tagline
              </label>
              <input
                type="text"
                placeholder="e.g. Create. Edit. Scale with AI."
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Detailed Service Description
              </label>
              <textarea
                rows={3}
                placeholder="Provide a comprehensive breakdown of deliverables, technical stack, and transformation results..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none resize-none"
              />
            </div>

            {/* Status & Featured */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              {/* Status Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-zinc-300">Publish Status:</span>
                <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "draft" })}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                      formData.status === "draft"
                        ? "bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "published" })}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                      formData.status === "published"
                        ? "bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Published
                  </button>
                </div>
              </div>

              {/* Featured Switch */}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0"
                />
                <span className="text-xs font-semibold text-white">Feature on Home Spotlight</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>{service ? "Update Service" : "Publish Service"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

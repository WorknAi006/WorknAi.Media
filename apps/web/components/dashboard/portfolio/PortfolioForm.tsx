import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Briefcase,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { FeaturedProject } from "./FeaturedPreview";

interface PortfolioFormProps {
  isOpen: boolean;
  project: FeaturedProject | null;
  onClose: () => void;
  onSave: (projectData: Partial<FeaturedProject>) => Promise<boolean>;
}

export default function PortfolioForm({
  isOpen,
  project,
  onClose,
  onSave,
}: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    client_name: "",
    project_title: "",
    category: "AI Videos",
    thumbnail_url: "",
    video_url: "",
    description: "",
    challenge: "",
    solution: "",
    results: "",
    featured: false,
    status: "published",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const categories = [
    "AI Videos",
    "Travel",
    "Logistics",
    "Housing",
    "Branding",
    "Web Apps",
  ];

  useEffect(() => {
    if (project) {
      setFormData({
        client_name: project.client_name || "",
        project_title: project.project_title || "",
        category: project.category || "AI Videos",
        thumbnail_url: project.thumbnail_url || project.thumbnail || "",
        video_url: project.video_url || "",
        description: project.description || "",
        challenge: project.challenge || "",
        solution: project.solution || "",
        results: project.results || "",
        featured: Boolean(project.featured),
        status: project.status || "published",
      });
    } else {
      setFormData({
        client_name: "",
        project_title: "",
        category: "AI Videos",
        thumbnail_url: "",
        video_url: "",
        description: "",
        challenge: "",
        solution: "",
        results: "450K+ Organic Reach • +34% Lead Conversion • 4.2x ROI",
        featured: false,
        status: "published",
      });
    }
    setErrorMsg("");
  }, [project, isOpen]);

  // Direct video file upload handler using existing /api/upload
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
        setFormData((prev) => ({
          ...prev,
          video_url: json.url,
          thumbnail_url: prev.thumbnail_url || json.url,
        }));
      } else {
        setErrorMsg(json.error || "Failed to upload video file");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name.trim() || !formData.project_title.trim()) {
      setErrorMsg("Client name and project title are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const success = await onSave(formData);
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative my-8 w-full max-w-2xl rounded-[28px] border border-white/20 bg-[#0B1020] p-6 sm:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {project ? "Edit Case Study Project" : "Add New Case Study"}
                </h3>
                <p className="text-xs text-zinc-400">
                  {project
                    ? `Updating "${project.project_title}"`
                    : "Create client case study with metrics and media"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Client Name + Project Title */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Client / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Online Go"
                  value={formData.client_name}
                  onChange={(e) =>
                    setFormData({ ...formData, client_name: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Luxury Travel Launch"
                  value={formData.project_title}
                  onChange={(e) =>
                    setFormData({ ...formData, project_title: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Row 2: Category + Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Industry Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#0B1020] px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-[#0B1020]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Publication Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["published", "draft"].map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setFormData({ ...formData, status: st })}
                      className={`rounded-xl border py-2 text-xs font-semibold uppercase tracking-wider transition ${
                        formData.status === st
                          ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                          : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Video URL + Video Upload */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Hero Video URL / Attachment
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="e.g. /videos/universe.mp4 or direct MP4 URL"
                    value={formData.video_url}
                    onChange={(e) =>
                      setFormData({ ...formData, video_url: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{isUploading ? "Uploading..." : "Upload MP4"}</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Row 4: Thumbnail Image URL */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Thumbnail Image URL
              </label>
              <input
                type="text"
                placeholder="e.g. https://images.unsplash.com/... or image path"
                value={formData.thumbnail_url}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail_url: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Row 5: Description */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Case Study Overview / Description
              </label>
              <textarea
                rows={2}
                placeholder="High-level summary of what was accomplished..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none resize-none"
              />
            </div>

            {/* Row 6: Challenge & Solution */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Client Challenge
                </label>
                <textarea
                  rows={2}
                  placeholder="The operational bottleneck or market obstacle..."
                  value={formData.challenge}
                  onChange={(e) =>
                    setFormData({ ...formData, challenge: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  WorknAI Solution
                </label>
                <textarea
                  rows={2}
                  placeholder="The AI media models and automations deployed..."
                  value={formData.solution}
                  onChange={(e) =>
                    setFormData({ ...formData, solution: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Row 7: Measurable Results */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Measurable Results & Telemetry (Views, Leads, ROI)
              </label>
              <input
                type="text"
                placeholder="e.g. 450K+ Organic Reach • +34% Lead Conversion • 4.2x ROI"
                value={formData.results}
                onChange={(e) =>
                  setFormData({ ...formData, results: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <div>
                  <p className="text-xs font-bold text-white">
                    Pin as Spotlight Feature
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Display prominently on top of the Portfolio Manager preview panel
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                <span>{project ? "Save Changes" : "Create Case Study"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

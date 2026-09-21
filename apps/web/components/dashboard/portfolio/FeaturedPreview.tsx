import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Sparkles,
  Eye,
  TrendingUp,
  Target,
  ExternalLink,
  Volume2,
  VolumeX,
  Edit2,
  X,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

export interface FeaturedProject {
  id: number | string;
  client_name: string;
  project_title: string;
  category: string;
  thumbnail_url?: string;
  thumbnail?: string;
  video_url?: string;
  description?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  featured?: boolean;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface FeaturedPreviewProps {
  project: FeaturedProject | null;
  onEdit?: (project: FeaturedProject) => void;
}

export default function FeaturedPreview({
  project,
  onEdit,
}: FeaturedPreviewProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!project) return null;

  const thumbnail =
    project.thumbnail_url ||
    project.thumbnail ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80";

  // Parse results string for metric snippets if formatted as json or key:values
  const resultsText = project.results || "450K+ Organic Reach • +34% Lead Conversion • 4.2x ROI";

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-br from-[#060B1E] via-[#0B132B] to-[#040816] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-600/20 blur-[130px]" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Left Side: Video Preview Player */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20 bg-black/60 shadow-2xl lg:w-1/2">
          {project.video_url ? (
            <video
              ref={videoRef}
              src={project.video_url}
              poster={thumbnail}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover object-center brightness-95"
            />
          ) : (
            <img
              src={thumbnail}
              alt={project.project_title}
              className="h-full w-full object-cover object-center"
            />
          )}

          {/* Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* Top Video Badge & Sound Toggle */}
          <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-black/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
              <Sparkles className="h-2.5 w-2.5 text-cyan-400" />
              <span>Spotlight Feature</span>
            </span>
          </div>

          {/* Center Play Button if Video exists */}
          {project.video_url && (
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="group absolute inset-0 z-20 flex items-center justify-center bg-black/20 transition hover:bg-black/30"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-blue-600/90 text-white shadow-[0_0_30px_rgba(59,130,246,0.6)] backdrop-blur-md transition-all duration-300 group-hover:scale-115 group-hover:bg-blue-500">
                <Play className="h-5 w-5 fill-white pl-0.5" />
              </div>
            </button>
          )}

          {/* Bottom Card Title Banner */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-zinc-300">
            <span className="font-mono text-[10px] text-zinc-400">
              {project.client_name}
            </span>
            <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-zinc-400 backdrop-blur-md">
              Autoplay Preview
            </span>
          </div>
        </div>

        {/* Right Side: Case Study Metadata & Telemetry */}
        <div className="flex flex-1 flex-col justify-between space-y-5 lg:pl-4">
          <div className="space-y-2.5">
            {/* Top Row: Client Monogram + Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 font-bold uppercase text-cyan-300">
                  {project.client_name.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    {project.client_name}
                  </h4>
                  <span className="text-[11px] text-zinc-400">{project.category}</span>
                </div>
              </div>

              <StatusBadge status={project.status} featured={project.featured} />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {project.project_title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3">
              {project.description ||
                "A breakthrough multi-channel media production campaign deployed autonomously with targeted viral distribution and client lead capture."}
            </p>
          </div>

          {/* Results Telemetry Highlights */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-black/40 p-3.5 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-1 text-blue-400 mb-0.5">
                <Eye className="h-3 w-3" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Views</span>
              </div>
              <p className="font-mono text-xs font-bold text-white">450K+</p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-emerald-400 mb-0.5">
                <Target className="h-3 w-3" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Leads</span>
              </div>
              <p className="font-mono text-xs font-bold text-white">+1,280</p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-purple-400 mb-0.5">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[10px] uppercase font-bold tracking-wider">ROI</span>
              </div>
              <p className="font-mono text-xs font-bold text-white">4.2x</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.video_url && (
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition hover:bg-blue-500 active:scale-95"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Watch Preview</span>
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Case Study</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && project.video_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl aspect-video rounded-3xl overflow-hidden border border-white/20 bg-black shadow-2xl"
            >
              <video
                src={project.video_url}
                autoPlay
                controls
                playsInline
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 border border-white/20 text-white hover:bg-red-500/80 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Briefcase,
  Play,
  ArrowRight,
  ExternalLink,
  X,
  Sparkles,
  TrendingUp,
  Eye,
  CheckCircle2,
  Layers,
} from "lucide-react";

export type PortfolioCategory =
  | "All"
  | "Reels"
  | "Travel"
  | "Logistics"
  | "Housing"
  | "AI Projects";

interface ProjectItem {
  id: string;
  title: string;
  client: string;
  category: "Reels" | "Travel" | "Logistics" | "Housing" | "AI Projects";
  thumbnail: string;
  videoUrl?: string;
  metrics: string;
  duration: string;
  tagline: string;
  description: string;
  results: string[];
  techStack: string[];
  website?: string;
}

const CATEGORIES: PortfolioCategory[] = [
  "All",
  "Reels",
  "Travel",
  "Logistics",
  "Housing",
  "AI Projects",
];

const PROJECTS: ProjectItem[] = [
  {
    id: "onlinego-travel",
    title: "Autonomous Travel Discovery Engine",
    client: "OnlineGo Travel",
    category: "Travel",
    thumbnail: "/hero-onlinego.jpg",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-seashore-with-rocks-1090-large.mp4",
    metrics: "+4.2M Reach",
    duration: "4 Weeks",
    tagline: "Drone cinematography & AI route generation for modern travellers.",
    description:
      "Created an automated destination discovery pipeline synthesizing aerial drone visuals, flight pricing hooks, and personalized itinerary carousels distributed across 12 countries.",
    results: [
      "320% increase in organic booking link clicks",
      "Average watch completion rate of 78% on Instagram Reels",
      "Over 45,000 itinerary generation prompts served",
    ],
    techStack: ["Next.js 16", "Diffusion Video", "Mapbox APIs", "Supabase"],
    website: "https://onlinego.in",
  },
  {
    id: "gologix-freight",
    title: "Global Supply Chain Telematics AI",
    client: "GoLogix Logistics",
    category: "Logistics",
    thumbnail: "/hero-gologix.jpg",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-cargo-ship-in-the-sea-42022-large.mp4",
    metrics: "₹18.4Cr Handled",
    duration: "6 Weeks",
    tagline: "Autonomous port tracking & real-time cargo status syndication.",
    description:
      "Deployed automated visual status engines for transcontinental maritime freight, generating video summaries of container shipping routes and dispatch alerts for international shippers.",
    results: [
      "Real-time visibility over 8,400+ maritime TEUs",
      "94% automated customer inquiry resolution rate",
      "Sub-second alert broadcasting across WhatsApp & Email",
    ],
    techStack: ["PostgreSQL", "IoT Telematics", "Video Automation", "Express"],
    website: "https://onlinego.in",
  },
  {
    id: "pginfo-housing",
    title: "Smart Urban Co-Living & Realty OS",
    client: "PG.info",
    category: "Housing",
    thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80",
    metrics: "12,000+ Beds",
    duration: "3 Weeks",
    tagline: "Hyper-localized verified hostel discovery with 3D virtual walkthroughs.",
    description:
      "Developed verified listing syndication for modern students and working professionals, pairing 360-degree room previews with instant owner WhatsApp direct-connect.",
    results: [
      "12,000+ verified bed spaces mapped across Pune & Bengaluru",
      "Zero brokerage friction with 65% faster tenant onboarding",
      "Over 120,000 monthly active house hunters",
    ],
    techStack: ["Next.js", "Virtual Tours", "WhatsApp Cloud API", "Tailwind CSS"],
    website: "https://pginfo.in",
  },
  {
    id: "worknai-cinematic",
    title: "Generative AI Short-form Micro-Reels",
    client: "WorknAI Media Labs",
    category: "Reels",
    thumbnail: "/hero-worknai.jpg",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vertical-portrait-of-a-woman-smiling-at-sunset-41484-large.mp4",
    metrics: "14.8M Views",
    duration: "Continuous",
    tagline: "Algorithmic diffusion micro-content outperforming traditional media ads by 3.8x.",
    description:
      "Engineered an end-to-end prompt-to-reel rendering matrix that ingests brand style tokens, renders 4K cinematic scenes, attaches soundscapes, and dispatches to Instagram and YouTube Shorts.",
    results: [
      "Generated over 1,200 micro-videos autonomously",
      "Average cost-per-video reduced by 88% vs studio shoots",
      "Featured across global tech design publications",
    ],
    techStack: ["Runway AI", "Whisper Audio", "FFmpeg Clusters", "Cloud Workers"],
    website: "https://worknai.media",
  },
  {
    id: "shiftride-ev",
    title: "Urban EV Fleet Ride Management",
    client: "ShiftRide",
    category: "AI Projects",
    thumbnail: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80",
    metrics: "450k+ Rides",
    duration: "5 Weeks",
    tagline: "Predictive demand forecasting & fleet dispatch algorithms.",
    description:
      "Architected real-time vehicle allocation models that anticipate urban commuter clusters and deploy EV scooters dynamically to high-frequency transit hubs.",
    results: [
      "Average passenger pickup wait time reduced to under 3.2 minutes",
      "38% improvement in battery swap depot turnaround speed",
      "CO2 emissions offset of over 420 metric tons",
    ],
    techStack: ["Node.js", "Machine Learning", "WebSocket", "React Native"],
    website: "https://shiftride.in",
  },
  {
    id: "livesale-fitness",
    title: "Interactive Live Commerce Stream Engine",
    client: "LiveSale.Fitness",
    category: "AI Projects",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80",
    metrics: "+280% GMV",
    duration: "4 Weeks",
    tagline: "Real-time AI telemetry overlays for live creator fitness workouts.",
    description:
      "Integrated live heart-rate, rep-counting, and instant checkout overlays into livestream broadcasts, allowing workout enthusiasts to purchase equipment directly during instructor sets.",
    results: [
      "3.4x higher viewer retention during 45-minute live sessions",
      "Over ₹85 Lakhs in flash-sale workout equipment GMV",
      "Zero streaming latency across 15,000 concurrent viewers",
    ],
    techStack: ["WebRTC", "Computer Vision", "Payment Gateway", "Tailwind"],
    website: "https://livesale.fitness",
  },
];

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>("All");
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const filteredProjects =
    selectedCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory);

  const handleOpenContact = () => {
    setActiveProject(null);
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="showcase"
      ref={containerRef}
      className="relative w-full overflow-hidden pt-28 pb-32 scroll-mt-20"
    >
      {/* Subtle Ambient Radial Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 h-[420px] w-[420px] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute bottom-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Proven Ecosystem Deployments</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              Showcase &{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Case Studies
              </span>
            </h2>

            <p className="max-w-xl text-base text-zinc-400">
              Explore real-world case studies powered by our autonomous diffusion models, supply chain telematics, and high-conversion creator channels.
            </p>
          </motion.div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400"
                    : "border border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filterable Project Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                key={project.id}
                onClick={() => setActiveProject(project)}
                className="group cursor-pointer overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-white/[0.06] hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              >
                {/* Image Container with Aspect Ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent opacity-80" />

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-300 backdrop-blur-md shadow-sm">
                      {project.metrics}
                    </span>
                  </div>

                  {/* Play / Inspect Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-[0_0_25px_rgba(59,130,246,0.8)] backdrop-blur-md transform transition-transform group-hover:scale-110">
                      <Play className="h-5 w-5 fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                    {project.client}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.tagline}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5 text-xs text-zinc-400">
                    <span>Click for case study</span>
                    <ArrowRight className="h-3.5 w-3.5 text-blue-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-[#070b1a] p-6 sm:p-8 text-white shadow-2xl backdrop-blur-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-5 right-5 rounded-full border border-white/10 bg-white/5 p-2 text-zinc-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Modal Header */}
              <div className="space-y-1.5 pr-8">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-0.5 text-xs font-bold text-blue-400">
                    {activeProject.category}
                  </span>
                  <span className="text-xs text-zinc-400">• {activeProject.client}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {activeProject.title}
                </h3>
              </div>

              {/* Media Preview (Video or Image) */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 aspect-video w-full bg-zinc-950 relative">
                {activeProject.videoUrl ? (
                  <video
                    src={activeProject.videoUrl}
                    poster={activeProject.thumbnail}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={activeProject.thumbnail}
                    alt={activeProject.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Project Deep Dive Body */}
              <div className="mt-6 space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
                    Executive Overview
                  </h4>
                  <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>

                {/* Key Results */}
                <div>
                  <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
                    Measurable Impact & Results
                  </h4>
                  <div className="mt-2 space-y-2">
                    {activeProject.results.map((res, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Tags */}
                <div>
                  <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
                    Technologies & Pipeline
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={handleOpenContact}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-center text-xs font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-[1.02] transition"
                  >
                    Build A Project Like This
                  </button>

                  {activeProject.website && (
                    <a
                      href={activeProject.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <span>Visit Live Website</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

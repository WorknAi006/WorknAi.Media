"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Video,
  Flame,
  Award,
  Users,
  Star,
  BookOpen,
} from "lucide-react";

interface TrackItem {
  id: string;
  badge: string;
  title: string;
  level: string;
  duration: string;
  description: string;
  modules: string[];
  icon: React.ElementType;
  gradient: string;
  image: string;
  glowColor: string;
  accentColor: string;
  buttonGradient: string;
}

const TRACKS: TrackItem[] = [
  {
    id: "diffusion-cinematography",
    badge: "Track 01 • Video Mastery",
    title: "Generative AI Video & Diffusion Cinematography",
    level: "All Levels",
    duration: "4 Weeks • Live",
    description:
      "Master diffusion tools (Runway Gen-3, Kling, Sora, Midjourney) to produce cinematic, photorealistic 9:16 and 16:9 commercial content.",
    modules: [
      "Prompt tokenization & 35mm camera pathing",
      "Character consistency across multi-scene edits",
      "Audio synthesis, voice cloning & sound design",
      "Color grading, HDR exports & upscaling pipelines",
    ],
    icon: Video,
    gradient: "from-blue-500 to-cyan-400",
    image: "/academy/generative-ai-video.png",
    glowColor: "rgba(6, 182, 212, 0.45)",
    accentColor: "text-cyan-400",
    buttonGradient: "from-blue-600 to-cyan-500",
  },
  {
    id: "algorithmic-distribution",
    badge: "Track 02 • Virality Engine",
    title: "Autonomous Distribution & Algorithmic Growth",
    level: "Intermediate",
    duration: "3 Weeks • Hands-on",
    description:
      "Reverse-engineer short-form algorithms on Instagram, YouTube Shorts and TikTok to achieve predictable organic virality.",
    modules: [
      "First 3-second kinetic retention trigger design",
      "Cross-platform automated queue syndication",
      "Dynamic hashtag cluster & caption vectors",
      "Audience sentiment analysis & community nurture",
    ],
    icon: Flame,
    gradient: "from-purple-500 to-pink-500",
    image: "/academy/autonomous-distribution.jpg",
    glowColor: "rgba(236, 72, 153, 0.45)",
    accentColor: "text-pink-400",
    buttonGradient: "from-purple-600 via-pink-600 to-orange-500",
  },
  {
    id: "media-monetization",
    badge: "Track 03 • Business OS",
    title: "Creator Monetization & AI Media Agency Ops",
    level: "Advanced",
    duration: "4 Weeks • Intensive",
    description:
      "Turn your content into high-ticket inbound clients, brand sponsor retainers, and automated digital media agency workflows.",
    modules: [
      "High-converting inbound WhatsApp funnel setup",
      "Pricing retainers: ₹50k to ₹5L/mo client proposals",
      "Automating client delivery with Supabase & Next.js",
      "Scaling creator teams without burnout",
    ],
    icon: Award,
    gradient: "from-emerald-400 to-teal-500",
    image: "/academy/creator-monetization.jpg",
    glowColor: "rgba(16, 185, 129, 0.45)",
    accentColor: "text-emerald-400",
    buttonGradient: "from-emerald-600 to-teal-500",
  },
];

function TrackCard({
  track,
  idx,
  isInView,
  onApply,
}: {
  track: TrackItem;
  idx: number;
  isInView: boolean;
  onApply: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      key={track.id}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[32px] border border-white/15 bg-[#050816] p-5 sm:p-6 transition-all duration-500 hover:-translate-y-2 hover:border-white/35 hover:shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
        style={{
          boxShadow: isHovered ? `0 0 50px ${track.glowColor}` : `0 10px 30px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Dynamic Cursor-Following Radial Glow */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${track.glowColor}, transparent 65%)`,
          }}
        />

        {/* Top Rim Glass Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative z-10 flex flex-col flex-1">
          {/* 3D Cinematic Artwork Header - 100% Brightness & High Contrast */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-inner">
            <img
              src={track.image}
              alt={track.title}
              className="h-full w-full object-cover object-center brightness-105 contrast-105 saturate-115 transition-all duration-700 ease-out group-hover:scale-105"
            />
            {/* Top Floating Glass Badges */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 pointer-events-none">
              <span className="rounded-full border border-white/20 bg-[#050816]/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-lg">
                {track.badge}
              </span>
              <span className="rounded-full border border-white/20 bg-[#050816]/85 px-2.5 py-1 text-[10px] font-semibold text-zinc-200 backdrop-blur-md shadow-lg">
                {track.duration}
              </span>
            </div>

            {/* Subtle Gradient Transition at bottom of image */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#050816] via-[#050816]/50 to-transparent" />
          </div>

          {/* Title & Description */}
          <div className="mt-5 space-y-2">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-white transition-colors leading-tight">
              {track.title}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-medium">
              {track.description}
            </p>
          </div>

          {/* Curriculum Syllabus */}
          <div className="mt-5 space-y-2 border-t border-white/10 pt-4 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Curriculum Syllabus
            </p>
            <div className="space-y-1.5 pt-1">
              {track.modules.map((mod, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-2 text-xs text-zinc-200 transition-colors hover:border-white/15"
                >
                  <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${track.accentColor}`} />
                  <span className="font-medium leading-tight">{mod}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Apply CTA Button */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={onApply}
            className={`flex w-full items-center justify-between rounded-xl border border-white/20 bg-[#050816]/80 px-4 py-3 text-xs font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-gradient-to-r ${track.buttonGradient} hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] active:scale-95`}
          >
            <span className="tracking-wide">Apply for Cohort Access</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Academy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const handleApplyClick = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="academy"
      ref={containerRef}
      className="relative w-full overflow-hidden pt-28 pb-32 scroll-mt-20"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 h-[440px] w-[440px] rounded-full bg-indigo-600/10 blur-[160px]" />
        <div className="absolute bottom-1/4 left-1/3 h-[420px] w-[420px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section Header */}
        <div className="mb-14 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>WorknAI Creator Academy</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              Learn the Science of{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                AI Media & Virality
              </span>
            </h2>

            <p className="max-w-2xl text-base text-zinc-400">
              Transform from a traditional editor into an autonomous AI media architect. Master generative video pipelines, viral short-form retention, and brand monetization.
            </p>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Enrolled Creators", value: "2,800+", icon: Users },
            { label: "Views Generated", value: "480M+", icon: Flame },
            { label: "Average Rating", value: "4.9 / 5.0", icon: Star },
            { label: "Agency Retainers", value: "₹2.4Cr+", icon: Award },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <Icon className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* 3 Academy Curriculum Tracks */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TRACKS.map((track, idx) => (
            <TrackCard
              key={track.id}
              track={track}
              idx={idx}
              isInView={isInView}
              onApply={handleApplyClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

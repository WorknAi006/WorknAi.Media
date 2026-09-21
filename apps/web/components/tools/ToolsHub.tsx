"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Image as ImageIcon,
  Clapperboard,
  Calendar,
  Mic,
  BarChart3,
  ArrowRight,
  Wand2,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Hash,
  FileText,
} from "lucide-react";

interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  glowColor: string;
  tag: string;
}

interface ToolCardProps {
  tool: ToolItem;
  index: number;
  isInView: boolean;
}

function ToolCard({ tool, index, isInView }: ToolCardProps) {
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
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#050816] transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
        style={{
          boxShadow: isHovered ? `0 0 45px ${tool.glowColor}` : undefined,
        }}
      >
        {/* The 3D Render Image Card */}
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={tool.image}
            alt={tool.title}
            className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
          />
          {/* Subtle Glass Rim & Hover Highlight */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Dynamic Cursor-Following Radial Glow */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[26px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${tool.glowColor}, transparent 65%)`,
          }}
        />

        {/* Top Rim Glass Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>
    </motion.div>
  );
}

export default function ToolsHub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const tools: ToolItem[] = [
    {
      id: "ai-caption-generator",
      title: "AI Caption Generator",
      description: "Produce viral hooks, engaging social captions & dynamic calls-to-action tailored for every platform.",
      icon: Sparkles,
      image: "/tools/ai-caption-generator.png",
      accent: "text-blue-400",
      accentBg: "bg-blue-500/10",
      accentBorder: "border-blue-500/20",
      glowColor: "rgba(59, 130, 246, 0.4)",
      tag: "Viral Hooks",
    },
    {
      id: "reel-script-generator",
      title: "Reel Script Generator",
      description: "Create 30s, 60s & vertical micro-video scripts with visual cues, retention triggers & audio prompts.",
      icon: Clapperboard,
      image: "/tools/reel-script-generator.png",
      accent: "text-cyan-400",
      accentBg: "bg-cyan-500/10",
      accentBorder: "border-cyan-500/20",
      glowColor: "rgba(6, 182, 212, 0.4)",
      tag: "Retention Engine",
    },
    {
      id: "hashtag-generator",
      title: "Hashtag Generator",
      description: "Uncover high-velocity and trending hashtags filtered by domain relevance, competition and reach.",
      icon: Hash,
      image: "/tools/hashtag-generator.png",
      accent: "text-purple-400",
      accentBg: "bg-purple-500/10",
      accentBorder: "border-purple-500/20",
      glowColor: "rgba(168, 85, 247, 0.4)",
      tag: "Reach Multiplier",
    },
    {
      id: "thumbnail-ideas",
      title: "Thumbnail Ideas",
      description: "High-CTR visual concepts, text placement guides and color contrast blueprints designed to maximize clicks.",
      icon: ImageIcon,
      image: "/tools/thumbnail-ideas.png",
      accent: "text-amber-400",
      accentBg: "bg-amber-500/10",
      accentBorder: "border-amber-500/20",
      glowColor: "rgba(245, 158, 11, 0.4)",
      tag: "High CTR Design",
    },
    {
      id: "content-planner",
      title: "Content Planner",
      description: "Plan, organize and auto-schedule multi-channel editorial calendars based on audience activity peaks.",
      icon: Calendar,
      image: "/tools/content-planner.png",
      accent: "text-emerald-400",
      accentBg: "bg-emerald-500/10",
      accentBorder: "border-emerald-500/20",
      glowColor: "rgba(16, 185, 129, 0.4)",
      tag: "Auto Schedule",
    },
    {
      id: "seo-blog-writer",
      title: "SEO Blog Writer",
      description: "Generate deep, keyword-targeted articles, meta descriptions and structured schemas that rank on Google.",
      icon: FileText,
      image: "/tools/seo-blog-writer.png",
      accent: "text-pink-400",
      accentBg: "bg-pink-500/10",
      accentBorder: "border-pink-500/20",
      glowColor: "rgba(236, 72, 153, 0.4)",
      tag: "Search Ranked",
    },
  ];

  return (
    <section id="intelligence" ref={containerRef} className="relative w-full overflow-hidden pt-28 pb-32 scroll-mt-20">
      {/* Subtle Moving Background Particles & Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            x: [-20, 20, -20],
            y: [-15, 15, -15],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/3 top-1/4 h-[460px] w-[460px] rounded-full bg-blue-600/10 blur-[150px]"
        />
        <motion.div
          animate={{
            x: [20, -20, 20],
            y: [15, -15, 15],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-1/4 bottom-1/3 h-[460px] w-[460px] rounded-full bg-purple-600/10 blur-[160px]"
        />
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
              <Wand2 className="h-3.5 w-3.5" />
              <span>AI Tools Hub</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Create Smarter
              </span>
            </h2>

            <p className="max-w-2xl text-base text-zinc-400">
              Generate content, design visuals, schedule posts and automate your entire media workflow from one platform.
            </p>
          </motion.div>
        </div>

        {/* Responsive 2 x 3 Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, idx) => (
            <ToolCard key={tool.id} tool={tool} index={idx} isInView={isInView} />
          ))}
        </div>

        {/* Bottom Full-Width Glass CTA Card with Floating Orb */}
        <div className="relative mt-12">
          {/* Floating Gradient Orb Behind CTA */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[320px] w-[600px] rounded-full bg-gradient-to-r from-blue-600/30 via-indigo-600/25 to-purple-600/30 blur-[120px]" />

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-white/[0.07] p-8 md:p-12 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Top Rim Highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                  <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                  <span>Production-Ready Media OS</span>
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-4xl">
                  Ready to automate your media business?
                </h3>
                <p className="max-w-xl text-sm text-zinc-400">
                  Join 2,800+ media agencies and creators generating automated, high-converting social campaigns daily.
                </p>
              </div>

              {/* Continuously Glowing CTA Button */}
              <div className="relative flex-shrink-0">
                {/* Continuous Ambient Pulsing Glow Aura */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-75 blur-md animate-pulse" />

                <button className="relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-105 active:scale-95">
                  <Sparkles className="h-5 w-5 fill-white text-white" />
                  <span>Launch AI Studio</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

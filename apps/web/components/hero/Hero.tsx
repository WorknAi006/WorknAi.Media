"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import Stats from "./Stats";
import HeroButtons from "./HeroButtons";
import { useHeroProjects, HeroProject } from "./data";

export default function Hero() {
  const { activeProjects } = useHeroProjects();
  const [activeProjectId, setActiveProjectId] = useState<string>("worknai");
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);
  const [liveHero, setLiveHero] = useState<{
    title?: string;
    subtitle?: string;
    button_text?: string;
    image_url?: string;
    video_url?: string;
  } | null>(null);

  // Fetch live Supabase hero settings
  useEffect(() => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";
    fetch(`${apiBase}/hero`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          const item = json.data[0];
          setLiveHero({
            title: item.title,
            subtitle: item.subtitle,
            button_text: item.button_text,
            image_url: item.image_url,
            video_url: item.video_url,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Sync active project if list changes or defaults
  useEffect(() => {
    if (activeProjects.length > 0 && !activeProjects.some((p) => p.id === activeProjectId)) {
      setActiveProjectId(activeProjects[0].id);
    }
  }, [activeProjects, activeProjectId]);

  const rawActiveProject: HeroProject =
    activeProjects.find((p) => p.id === activeProjectId) ||
    activeProjects[0];

  // If WorknAI is active, merge live Supabase headline, subtitle, video and image
  const activeProject: HeroProject = {
    ...rawActiveProject,
    title:
      rawActiveProject.id === "worknai" && liveHero?.title
        ? liveHero.title
        : rawActiveProject.title,
    subtitle:
      rawActiveProject.id === "worknai" && liveHero?.subtitle
        ? liveHero.subtitle
        : rawActiveProject.subtitle,
    videoUrl:
      rawActiveProject.id === "worknai" && liveHero?.video_url
        ? liveHero.video_url
        : rawActiveProject.videoUrl,
    thumbnail:
      rawActiveProject.id === "worknai" && liveHero?.image_url
        ? liveHero.image_url
        : rawActiveProject.thumbnail,
  };

  const handleSelectProject = (id: string) => {
    if (id !== activeProjectId) {
      setIsVideoLoading(true);
      setActiveProjectId(id);
      setTimeout(() => setIsVideoLoading(false), 300);
    }
  };

  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (activeProject.videoUrl && videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [activeProject.videoUrl]);

  const accentColor = activeProject.accentColor || "#3B82F6";
  const gradientClass = activeProject.gradient || "from-blue-400 via-sky-300 to-indigo-500";

  return (
    <section id="home" className="relative min-h-[92vh] overflow-hidden pt-36 pb-24 flex flex-col justify-between scroll-mt-20">
      {/* 1. Full-Screen Autoplay HTML5 MP4 Video Background with Framer Motion Fade */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            {/* If project has video, render video; otherwise render clean static background image */}
            {activeProject.videoUrl ? (
              <video
                ref={videoRef}
                key={activeProject.videoUrl}
                src={activeProject.videoUrl}
                poster={activeProject.thumbnail}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onLoadedData={() => setIsVideoLoading(false)}
                className="absolute inset-0 h-full w-full object-cover object-center will-change-transform transform-gpu opacity-85"
              />
            ) : (
              <img
                src={activeProject.thumbnail}
                alt={activeProject.name}
                className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Loading Skeleton Shimmer while video changes */}
        <AnimatePresence>
          {isVideoLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050816]/60 backdrop-blur-sm z-10 transition-opacity"
            />
          )}
        </AnimatePresence>

        {/* Dynamic Project Blue Radial Glow */}
        <div
          className="absolute inset-0 opacity-30 blur-[130px] transition-colors duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 35%, ${accentColor} 0%, transparent 70%)`,
          }}
        />

        {/* Dark Gradient Overlay for Supreme Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#02040a]/70 via-[#02040a]/30 to-transparent pointer-events-none" />
      </div>

      {/* 2. Premium Ambient Floating Particle Field (18 glowing particles) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
        <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-blue-600/10 blur-[90px]" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px]" />

        {/* 18 Glowing Floating Particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30 - (i % 4) * 6, 0],
              x: [0, (i % 2 === 0 ? 1 : -1) * (10 + (i % 3) * 6), 0],
              opacity: [0.2, 0.85, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5 + (i % 5) * 1.1,
              delay: (i % 6) * 0.35,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-cyan-300 pointer-events-none shadow-[0_0_10px_rgba(6,182,212,0.9)]"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${4 + (i * 5.3) % 92}%`,
              top: `${14 + (i * 4.6) % 76}%`,
            }}
          />
        ))}

        {/* Subtle Glowing World Network SVG at Hero Base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 pointer-events-none opacity-25">
          <svg className="w-full h-full" viewBox="0 0 1000 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M150 180 Q 300 40 450 120 T 750 90 T 900 160"
              stroke="url(#arcGradient)"
              strokeWidth="1.5"
              className="animate-dash-glow"
            />
            <path
              d="M200 220 Q 350 100 550 140 T 850 180"
              stroke="url(#arcGradient2)"
              strokeWidth="1.5"
              className="animate-dash-glow"
            />
            <circle cx="150" cy="180" r="3.5" fill="#38BDF8" className="animate-pulse" />
            <circle cx="450" cy="120" r="4.5" fill="#60A5FA" className="animate-pulse" />
            <circle cx="750" cy="90" r="4" fill="#818CF8" className="animate-pulse" />
            <circle cx="900" cy="160" r="3.5" fill="#34D399" className="animate-pulse" />
            <circle cx="550" cy="140" r="3.5" fill="#F472B6" className="animate-pulse" />

            <defs>
              <linearGradient id="arcGradient" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="0.5" stopColor="#818CF8" stopOpacity="0.8" />
                <stop offset="1" stopColor="#34D399" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="arcGradient2" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" stopOpacity="0.4" />
                <stop offset="1" stopColor="#F472B6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* 3. Main Hero Foreground Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        {/* Dynamic Project Buttons (Controlled from Admin Panel / Data) */}
        <HeroButtons
          projects={activeProjects}
          activeProjectId={activeProject.id}
          onSelectProject={handleSelectProject}
        />

        {/* Dynamic Project Category Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors border-white/15 bg-white/5 text-zinc-200"
              style={{ borderColor: `${accentColor}40` }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: accentColor }} />
              <span>{activeProject.industry || "AI"} Ecosystem</span>
              <span className="text-zinc-500">•</span>
              <span className="font-mono text-white/90">{activeProject.name}</span>
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Hero Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={activeProject.title}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight"
          >
            <span
              className={`bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
            >
              {activeProject.title}
            </span>
          </motion.h1>
        </AnimatePresence>

        {/* Dynamic Active Project Subtitle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeProject.subtitle}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-base sm:text-xl font-medium text-zinc-300 leading-relaxed"
          >
            {activeProject.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* Action Buttons with CTA Glow Pulse */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="/dashboard"
            className="group flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white glow-pulse-cta transition hover:bg-blue-500 shadow-xl shadow-blue-600/30"
          >
            <span>{activeProject.id === "worknai" && liveHero?.button_text ? liveHero.button_text : "Start Free"}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="/dashboard/studio"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-zinc-200 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <Play className="h-4 w-4 text-zinc-400" />
            <span>Launch Studio</span>
          </motion.a>
        </div>

        {/* Existing Stats Grid with Counter Animation */}
        <Stats />
      </div>

      {/* Scroll to Explore Bouncing Mouse Indicator */}
      <div className="absolute bottom-6 right-8 hidden xl:flex items-center gap-2.5 pointer-events-none z-20 opacity-80">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          Scroll to Explore
        </span>
        <div className="flex h-7 w-4 items-start justify-center rounded-full border border-white/30 p-1 backdrop-blur-sm">
          <div className="h-1.5 w-0.5 rounded-full bg-blue-400 animate-mouse-wheel" />
        </div>
      </div>
    </section>
  );
}
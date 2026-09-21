"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

export default function ExploreUniverse() {
  const [isMuted, setIsMuted] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string>("/videos/universe.mp4");
  const videoRef = useRef<HTMLVideoElement>(null);

  const [title, setTitle] = useState("Explore Our\nUniverse");
  const [subtitle, setSubtitle] = useState(
    "Travel. Create. Innovate. Grow.\nFrom real stories to AI tools – everything you need to build, scale, and experience the future of travel media."
  );
  const [buttonText, setButtonText] = useState("Explore All Sections");

  // Fetch live settings strictly from Hero CMS (/users/hero), never from reels
  useEffect(() => {
    let isMounted = true;
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

    fetch(`${apiBase}/hero`)
      .then((r) => r.json())
      .then((json) => {
        if (!isMounted) return;
        if (json.success && json.data && json.data.length > 0) {
          const universeSection = json.data.find(
            (p: any) =>
              p.title?.toLowerCase().includes("universe") ||
              p.title?.toLowerCase().includes("explore")
          );

          if (universeSection) {
            if (universeSection.video_url) {
              setVideoUrl(universeSection.video_url);
            }
            if (universeSection.title) {
              setTitle(universeSection.title);
            }
            if (universeSection.subtitle) {
              setSubtitle(universeSection.subtitle);
            }
            if (universeSection.button_text) {
              setButtonText(universeSection.button_text);
            }
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Ensure buttery smooth 60fps loop playback without audio-sync freezes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = isMuted;
    video.playsInline = true;

    const playVideo = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    };

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener("canplay", playVideo, { once: true });
    }

    // Seamless loop handler to prevent clock stall on boundary
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [videoUrl]);

  // Smooth toggle sound without pausing or interrupting playback
  const toggleSound = () => {
    const video = videoRef.current;
    if (video) {
      const nextMuted = !isMuted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickPills = [
    { label: "AI Tools Hub", id: "intelligence" },
    { label: "Solutions", id: "solutions" },
    { label: "Showcase", id: "showcase" },
    { label: "Creators & Reels", id: "creators" },
    { label: "Creator Academy", id: "academy" },
  ];

  return (
    <section className="relative mt-24 mb-16 overflow-hidden rounded-[32px] border border-white/15 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
      {/* 1. Full Background Auto-Loop Video (Bright, Vibrant, 100% Clear Playback) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          controls={false}
          className="h-full w-full object-cover object-center will-change-transform transform-gpu opacity-100 brightness-100"
        />

        {/* Soft Directional Vignette for Text Readability without hiding the video */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Foreground Content Container */}
      <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[380px] sm:min-h-[420px]">
        {/* Top Sound Control Toggle */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>DISCOVER MORE</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          </span>

          {/* Smooth Non-Interrupting Audio Mute / Unmute Button */}
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? "Unmute Background Sound" : "Mute Background Sound"}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-black/90 active:scale-95"
          >
            {isMuted ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-[11px] text-zinc-300">Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span className="text-[11px] text-cyan-300">Sound On</span>
              </>
            )}
          </button>
        </div>

        {/* Main Section Headline & Details */}
        <div className="max-w-2xl space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md whitespace-pre-line"
          >
            {title.includes("Universe") ? (
              <>
                {title.replace("Universe", "").trim()} <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  Universe
                </span>
              </>
            ) : (
              title
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-zinc-200 leading-relaxed max-w-xl drop-shadow-sm font-medium whitespace-pre-line"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Bottom Actions: CTA + Quick Section Navigation Pills */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin/scheduler"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:bg-blue-500 transition-all hover:scale-105 active:scale-95"
          >
            <span>{buttonText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Quick Anchor Jump Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">Jump to:</span>
            {quickPills.map((pill) => (
              <button
                type="button"
                key={pill.id}
                onClick={() => scrollToSection(pill.id)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-300 backdrop-blur-md transition hover:border-cyan-400/50 hover:bg-white/15 hover:text-white active:scale-95"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

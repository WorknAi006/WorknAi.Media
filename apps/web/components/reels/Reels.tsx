"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Film } from "lucide-react";
import { reels } from "./data";
import ReelCard from "./ReelCard";


// Helper to resolve brand avatar
const resolveBrandAvatar = (brand?: string) => {
  const b = (brand || "").toLowerCase().trim();
  if (b.includes("online")) return "/hero-onlinego.jpg";
  if (b.includes("logix") || b.includes("logistic")) return "/hero-gologix.jpg";
  if (b.includes("pg")) return "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&auto=format&fit=crop&q=80";
  if (b.includes("car")) return "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=120&auto=format&fit=crop&q=80";
  return "/logo.png";
};

// Helper to resolve playable video URL
const resolveVideoUrl = (media_url?: string) => {
  if (!media_url) return "/videos/worknai.mp4";
  const u = media_url.trim();
  if (u.includes("340326")) {
    return "/reels/go-logistic.mp4";
  }
  return u;
};

// Helper to resolve valid thumbnail image
const resolveThumbnailUrl = (thumbnail?: string, brand?: string) => {
  if (thumbnail) {
    const t = thumbnail.trim();
    if (t.includes("340326")) {
      return "/reels/go-logistic.jpg";
    }
    if (!t.endsWith(".mp4")) {
      return t;
    }
  }
  const b = (brand || "").toLowerCase().trim();
  if (b.includes("online")) return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80";
  if (b.includes("logix") || b.includes("logistic")) return "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80";
  if (b.includes("pg")) return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80";
  if (b.includes("car")) return "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80";
  return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80";
};

const mapDbReelToItem = (p: any) => ({
  id: `db-reel-${p.id}`,
  title: p.title,
  category: p.category || "AI Media",
  brand: p.brand || "WorknAI",
  brandAvatar: resolveBrandAvatar(p.brand),
  views: p.views || "2.4K",
  duration: p.duration || "0:30",
  verified: true,
  video: resolveVideoUrl(p.media_url),
  thumbnail: resolveThumbnailUrl(p.thumbnail, p.brand),
  aiBadge:
    p.platforms && p.platforms.length > 0
      ? String(p.platforms[0]).toUpperCase()
      : "Live Reel",
});

const buildReelList = (dbItems: any[] = []) => {
  if (!Array.isArray(dbItems) || dbItems.length === 0) return reels;
  const dynamic = dbItems
    .filter((p: any) => !p.title?.toLowerCase().includes("universe"))
    .map(mapDbReelToItem);
  return [...dynamic, ...reels];
};

interface ReelsProps {
  initialDbReels?: any[];
}

export default function Reels({ initialDbReels = [] }: ReelsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [reelList, setReelList] = useState(() => buildReelList(initialDbReels));

  // Sync if initialDbReels updates
  useEffect(() => {
    if (initialDbReels && initialDbReels.length > 0) {
      setReelList(buildReelList(initialDbReels));
    }
  }, [initialDbReels]);

  const fetchLiveReels = () => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
    if (!rawUrl) return;
    const apiBase = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;
    fetch(`${apiBase}/posts?type=reel&status=published`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setReelList(buildReelList(json.data));
        }
      })
      .catch((err) => console.error("Error loading live reels:", err));
  };

  useEffect(() => {
    fetchLiveReels();
    window.addEventListener("focus", fetchLiveReels);
    return () => window.removeEventListener("focus", fetchLiveReels);
  }, []);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -400 : 400;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="creators" className="relative w-full overflow-hidden pt-28 pb-32 scroll-mt-20">
      {/* Background Ambient Aurora Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute -right-40 top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      {/* 1280px Centered Container */}
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          {/* Section Title slides from left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <Film className="h-3.5 w-3.5" />
              <span>Creators & Short-form Studio</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
                Creators & Reels
              </h2>
              <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-xs font-mono font-medium text-purple-300">
                Live Feeds
              </span>
            </div>

            <p className="text-sm text-zinc-400 max-w-lg">
              Instagram-style cinematic vertical micro-videos generated autonomously with state-of-the-art diffusion models.
            </p>
          </motion.div>

          {/* Right Action: Controls + "View All" Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            {/* Scroll Navigation Buttons */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* View All Button */}
            <button
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-600/15 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95"
            >
              <span className="bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text text-transparent group-hover:text-white">
                View All
              </span>
              <ArrowRight className="h-4 w-4 text-blue-400 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* Horizontal Scroll Track Wrapper with Edge Fade Gradients */}
        <div className="relative -mx-6 px-6">
          {/* Subtle Left & Right edge fade gradients for Apple TV carousel feel */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-[#050816] to-transparent transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-[#050816] to-transparent transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Horizontal Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto pt-4 pb-8 scrollbar-none scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{
              scrollSnapType: "x mandatory",
            }}
          >
            {reelList.map((reel, index) => (
              <div
                key={reel.id}
                style={{ scrollSnapAlign: "start" }}
                className="flex-shrink-0"
              >
                <ReelCard reel={reel} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Eye,
  Sparkles,
  CheckCircle2,
  Clock,
  Heart,
  Share2,
  Maximize2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReelItem } from "./data";

interface ReelCardProps {
  reel: ReelItem;
  index: number;
}

export default function ReelCard({ reel, index }: ReelCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(342 + index * 87);
  const [isMuted, setIsMuted] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isWatchFullOpen, setIsWatchFullOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync video play/pause events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      setIsPlaying(false);
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  // When another reel plays, pause this one
  useEffect(() => {
    const handleOtherPlay = (e: any) => {
      if (e.detail?.id !== reel.id) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }
      }
    };
    window.addEventListener("worknai-play-reel", handleOtherPlay);
    return () => window.removeEventListener("worknai-play-reel", handleOtherPlay);
  }, [reel.id]);

  // Pause playing video only if it completely leaves the viewport
  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!video || !card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio === 0 && !video.paused) {
            video.pause();
            setIsPlaying(false);
            if (audioRef.current && !audioRef.current.paused) {
              audioRef.current.pause();
            }
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const togglePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      // Pause any other playing reel
      window.dispatchEvent(
        new CustomEvent("worknai-play-reel", { detail: { id: reel.id } })
      );

      try {
        video.muted = isMuted;
        await video.play();
        setIsPlaying(true);
        if (!isMuted && audioRef.current) {
          audioRef.current.currentTime = video.currentTime % (audioRef.current.duration || 10);
          audioRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn("Autoplay with sound prevented, falling back to muted play:", err);
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
          setIsPlaying(true);
        } catch (e2) {
          console.error("Video play failed:", e2);
        }
      }
    } else {
      video.pause();
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      if (!nextMuted && isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + "/#creators");
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const handleWatchFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWatchFullOpen(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="flex-shrink-0 select-none"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative w-[220px] sm:w-[240px] md:w-[250px] lg:w-[256px] aspect-[9/16] rounded-[28px] p-[1px] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-[10px] hover:shadow-[0_0_35px_rgba(59,130,246,0.3)] will-change-transform transform-gpu"
          style={{
            background: isHovered
              ? `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.4) 40%, rgba(255, 255, 255, 0.1) 80%)`
              : "rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Inner Glassmorphism Card Container with 28px rounded corners */}
          <div
            onClick={togglePlayPause}
            className="relative h-full w-full overflow-hidden rounded-[27px] bg-[#050816]/95 backdrop-blur-xl border border-white/10"
          >
            {/* Background HTML5 Video with Seamless Loop */}
            <video
              ref={videoRef}
              src={reel.video}
              poster={reel.thumbnail && !reel.thumbnail.endsWith(".mp4") ? reel.thumbnail : undefined}
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Background Synced Audio for AI Reels without embedded audio */}
            <audio ref={audioRef} src="/reels/reel-audio.mp3" loop preload="auto" />

            {/* Dark Cinematic Vignette & Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#02040a]/30 to-black/20 pointer-events-none" />

            {/* Center Play Icon if paused, or Pause on hover if playing */}
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/90 backdrop-blur-md border border-white/40 text-white shadow-[0_0_30px_rgba(59,130,246,0.8)] transform group-hover:scale-110 transition-transform">
                  <Play size={24} className="ml-1 fill-white text-white" />
                </div>
              </div>
            ) : isHovered ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white shadow-lg transform scale-105 transition-transform">
                  <Pause size={20} className="fill-white text-white" />
                </div>
              </div>
            ) : null}

            {/* TOP BAR: Tag & Volume Control */}
            <div className="absolute inset-x-0 top-0 p-4 z-20 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-blue-300 backdrop-blur-md">
                <Sparkles className="h-2.5 w-2.5 text-blue-400" />
                {reel.aiBadge || "Live Reel"}
              </span>

              <button
                onClick={toggleMute}
                title={isMuted ? "Unmute Audio" : "Mute Audio"}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
              >
                {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
            </div>

            {/* RIGHT FLOATING INSTAGRAM-STYLE ACTION DOCK */}
            <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-3">
              {/* Like Button */}
              <button
                onClick={handleLike}
                title="Like Reel"
                className="flex flex-col items-center gap-0.5 group/btn"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
                    isLiked
                      ? "border-rose-500 bg-rose-500/20 text-rose-500 scale-110 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                      : "border-white/20 bg-black/50 text-white hover:bg-black/80 hover:border-white/40"
                  }`}
                >
                  <Heart
                    size={16}
                    className={isLiked ? "fill-rose-500 text-rose-500" : ""}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-white drop-shadow">
                  {likeCount}
                </span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                title="Share Reel Link"
                className="flex flex-col items-center gap-0.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/80 hover:border-white/40">
                  <Share2 size={15} />
                </div>
                <span className="text-[10px] font-mono text-zinc-300 drop-shadow">
                  Share
                </span>
              </button>

              {/* Watch Fullscreen */}
              <button
                onClick={handleWatchFull}
                title="Watch Full Reel"
                className="flex flex-col items-center gap-0.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-blue-600 hover:border-blue-400">
                  <Maximize2 size={14} />
                </div>
                <span className="text-[10px] font-mono text-zinc-300 drop-shadow">
                  Full
                </span>
              </button>
            </div>

            {/* Share Toast */}
            <AnimatePresence>
              {showShareToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-x-3 top-14 z-40 rounded-xl bg-blue-600 px-3 py-1.5 text-center text-[11px] font-bold text-white shadow-lg backdrop-blur-md"
                >
                  Link copied to clipboard!
                </motion.div>
              )}
            </AnimatePresence>

            {/* BOTTOM CONTENT AREA */}
            <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex flex-col justify-end pr-14">
              {/* Reel Title */}
              <h3 className="text-sm font-bold leading-snug text-white line-clamp-2 drop-shadow-sm group-hover:text-blue-100 transition-colors">
                {reel.title}
              </h3>

              {/* Brand Information with Verified Icon */}
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={reel.brandAvatar}
                  alt={reel.brand}
                  className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20"
                />
                <span className="text-xs font-semibold text-zinc-200 truncate">
                  {reel.brand}
                </span>
                {reel.verified && (
                  <CheckCircle2 className="h-3.5 w-3.5 fill-blue-500 text-[#050816] flex-shrink-0" />
                )}
              </div>

              {/* Meta Row: Views Count */}
              <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-blue-400" />
                  <span className="font-mono font-medium text-zinc-300">
                    {reel.views}
                  </span>
                </div>

                <span
                  onClick={handleWatchFull}
                  className="text-[10px] font-semibold text-blue-400 hover:underline cursor-pointer"
                >
                  Watch Full →
                </span>
              </div>

              {/* Bottom Animated Live Video Progress Bar */}
              <div className="mt-2.5 h-[3px] w-full rounded-full bg-white/15 overflow-hidden">
                <motion.div
                  animate={{ x: ["-100%", "0%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 8,
                    ease: "linear",
                  }}
                  className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Full Vertical Video Modal */}
      <AnimatePresence>
        {isWatchFullOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWatchFullOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative aspect-[9/16] max-h-[85vh] w-auto overflow-hidden rounded-[32px] border border-white/20 bg-black shadow-2xl z-10"
            >
              <button
                onClick={() => setIsWatchFullOpen(false)}
                className="absolute top-4 right-4 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-black"
              >
                <X size={18} />
              </button>

              <video
                src={reel.video}
                autoPlay
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
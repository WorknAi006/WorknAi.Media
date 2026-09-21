"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface HubNode {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  size: number;
  color: string;
}

const globalNodes: HubNode[] = [
  { id: "sf", name: "Silicon Valley", x: 16.5, y: 35.5, size: 5, color: "#38BDF8" },
  { id: "nyc", name: "New York", x: 25.5, y: 34.5, size: 4.5, color: "#60A5FA" },
  { id: "ldn", name: "London", x: 47.5, y: 28.5, size: 5, color: "#818CF8" },
  { id: "mumbai", name: "India Hub", x: 67.2, y: 46.5, size: 6, color: "#00F0FF" },
  { id: "sg", name: "Singapore", x: 75.5, y: 56.5, size: 4.5, color: "#38BDF8" },
  { id: "tokyo", name: "Tokyo", x: 83.5, y: 38.0, size: 5, color: "#60A5FA" },
  { id: "syd", name: "Sydney", x: 86.5, y: 74.0, size: 4.5, color: "#34D399" },
  { id: "sp", name: "São Paulo", x: 32.5, y: 71.0, size: 4, color: "#F472B6" },
  { id: "joburg", name: "Johannesburg", x: 54.5, y: 72.0, size: 4, color: "#FBBF24" },
];

export default function WorldMapGlowBackground() {
  const [mounted, setMounted] = useState(false);
  const [bgImage, setBgImage] = useState<string>("/world-map-glow.jpg");

  useEffect(() => {
    setMounted(true);
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";
    fetch(`${apiBase}/hero`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data && json.data.length > 0 && json.data[0].image_url) {
          setBgImage(json.data[0].image_url);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Deep Midnight Base Gradient */}
      <div className="absolute inset-0 bg-[#02040a]" />

      {/* 2. 4K Luminous Digital World Map with Subtle Slow Cinematic Zoom Drift */}
      <motion.div
        initial={{ scale: 1, opacity: 0.70 }}
        animate={{
          scale: [1, 1.035, 1],
          opacity: [0.65, 0.78, 0.65],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 h-full w-full"
      >
        <img
          src={bgImage}
          alt="WorknAI World Map Glow"
          className="h-full w-full object-cover object-center filter brightness-[0.85] contrast-125 saturate-125"
        />
      </motion.div>

      {/* 3. Luminous Glowing World Map Telemetry Arcs (SVG) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-65"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Animated Flying Light Stream Arcs between Global Hubs */}
        {/* SF -> NYC */}
        <path
          d="M 165 213 Q 210 170 255 207"
          stroke="url(#beamGrad1)"
          strokeWidth="1.8"
          className="animate-dash-glow"
        />
        {/* NYC -> London */}
        <path
          d="M 255 207 Q 365 110 475 171"
          stroke="url(#beamGrad2)"
          strokeWidth="2"
          className="animate-dash-glow"
        />
        {/* London -> India (Mumbai) */}
        <path
          d="M 475 171 Q 570 190 672 279"
          stroke="url(#beamGrad3)"
          strokeWidth="2.2"
          className="animate-dash-glow"
        />
        {/* India -> Singapore */}
        <path
          d="M 672 279 Q 715 315 755 339"
          stroke="url(#beamGrad1)"
          strokeWidth="1.8"
          className="animate-dash-glow"
        />
        {/* Singapore -> Tokyo */}
        <path
          d="M 755 339 Q 805 270 835 228"
          stroke="url(#beamGrad2)"
          strokeWidth="1.8"
          className="animate-dash-glow"
        />
        {/* Singapore -> Sydney */}
        <path
          d="M 755 339 Q 820 400 865 444"
          stroke="url(#beamGrad3)"
          strokeWidth="1.8"
          className="animate-dash-glow"
        />

        <defs>
          <linearGradient id="beamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00F0FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="beamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="beamGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00F0FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* 4. Pulsing Cyber City Nodes */}
      {mounted &&
        globalNodes.map((node) => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {/* Outer Expanding Ping Ring */}
            <span
              className="absolute -inset-2 rounded-full animate-ping opacity-75"
              style={{ backgroundColor: node.color, animationDuration: "2.8s" }}
            />
            {/* Soft Ambient Radial Blur Glow */}
            <div
              className="h-8 w-8 -ml-2.5 -mt-2.5 rounded-full blur-md opacity-80"
              style={{ backgroundColor: node.color }}
            />
            {/* Inner Core Bright Dot */}
            <span
              className="relative block rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
              style={{
                width: `${node.size}px`,
                height: `${node.size}px`,
                backgroundColor: "#FFFFFF",
              }}
            />
          </div>
        ))}

      {/* 5. 20 Twinkling Ambient Star Dust Particles */}
      {mounted &&
        Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            animate={{
              opacity: [0.2, 0.85, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 3 + (i % 4) * 1.3,
              repeat: Infinity,
              delay: (i % 5) * 0.5,
              ease: "easeInOut",
            }}
            className="absolute h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.9)]"
            style={{
              left: `${3 + (i * 4.9) % 94}%`,
              top: `${5 + (i * 4.7) % 90}%`,
            }}
          />
        ))}

      {/* 6. Deep Dark Glassmorphic & Vignette Overlay (Guarantees Content Readability & Luxury Dark Mode) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02040a]/50 via-[#02040a]/40 to-[#02040a]/55" />
      {/* Radial vignette on screen borders */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#02040a_92%)]" />
    </div>
  );
}

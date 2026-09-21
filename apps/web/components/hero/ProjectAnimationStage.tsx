"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectShowcaseItem } from "./projectsData";

interface ProjectAnimationStageProps {
  project: ProjectShowcaseItem;
}

export default function ProjectAnimationStage({ project }: ProjectAnimationStageProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="relative h-full w-full"
        >
          {/* Ambient dynamic radial vignette matching active project accent */}
          <div
            className="absolute inset-0 opacity-25 blur-[100px] transition-colors duration-700"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, ${project.accent.primary} 0%, transparent 70%)`,
            }}
          />

          {/* 1. ONLINE GO: Airplane in clouds + Luxury bus on road */}
          {project.animationType === "travel_aviation" && (
            <div className="relative h-full w-full">
              {/* Drifting Clouds (Upper Layer) */}
              <motion.div
                animate={{ x: [-80, 80] }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 18, ease: "easeInOut" }}
                className="absolute top-10 left-1/4 h-28 w-96 rounded-full bg-cyan-500/10 blur-[50px] transform-gpu"
              />
              <motion.div
                animate={{ x: [60, -60] }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 14, ease: "easeInOut" }}
                className="absolute top-24 right-1/4 h-32 w-[420px] rounded-full bg-blue-600/15 blur-[60px] transform-gpu"
              />

              {/* Cloud Layer SVG Silhouettes */}
              <div className="absolute top-16 left-0 right-0 flex justify-between opacity-20 px-8">
                <svg width="260" height="90" viewBox="0 0 260 90" fill="none">
                  <path d="M40 70C20 70 0 55 0 35C0 15 25 5 45 15C60 -5 100 -5 120 15C135 5 160 10 170 25C185 20 210 25 215 45C230 45 250 55 250 70H40Z" fill="url(#cloudGrad1)" />
                  <defs>
                    <linearGradient id="cloudGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="#67E8F9" stopOpacity="0.4" />
                      <stop offset="1" stopColor="#0891B2" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </svg>
                <svg width="240" height="80" viewBox="0 0 240 80" fill="none" className="hidden sm:block">
                  <path d="M30 65C15 65 0 50 0 35C0 20 20 10 35 15C50 0 85 0 105 15C120 5 145 10 155 20C170 15 195 20 200 40C215 40 230 50 230 65H30Z" fill="url(#cloudGrad2)" />
                  <defs>
                    <linearGradient id="cloudGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="#38BDF8" stopOpacity="0.3" />
                      <stop offset="1" stopColor="#1E40AF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Flying Airplane with Contrail */}
              <motion.div
                animate={{
                  x: ["-10vw", "105vw"],
                  y: [40, 10, 45],
                  rotate: [1, -2, 2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 16,
                  ease: "linear",
                }}
                className="absolute top-12 left-0 flex items-center z-10 will-change-transform transform-gpu"
              >
                {/* Airplane Contrail / Jet Stream */}
                <div className="h-[2px] w-64 bg-gradient-to-l from-cyan-400/80 via-blue-500/30 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)]" />

                {/* Sleek Twin-Engine Airliner SVG */}
                <svg width="90" height="42" viewBox="0 0 100 50" fill="none" className="drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]">
                  {/* Fuselage */}
                  <path d="M96 24C98 25 100 25 100 25C96 27 82 28 65 28L25 28L10 36L4 36L12 28L2 28L0 23L5 23L16 23L48 23L78 23C90 23 94 23 96 24Z" fill="#F8FAFC" />
                  {/* Cockpit Window */}
                  <path d="M90 23.5L84 23.5L86 25L91 25Z" fill="#0284C7" />
                  {/* Main Wing */}
                  <path d="M60 25L38 48L30 48L44 26Z" fill="#0EA5E9" />
                  <path d="M54 23L42 2L48 2L64 23Z" fill="#38BDF8" opacity="0.8" />
                  {/* Jet Engine Glow */}
                  <ellipse cx="44" cy="36" rx="6" ry="2.5" fill="#22D3EE" />
                  <ellipse cx="46" cy="36" rx="2" ry="1.5" fill="#FFFFFF" />
                  {/* Navigation Light */}
                  <circle cx="36" cy="48" r="1.5" fill="#38BDF8" className="animate-ping" />
                </svg>
              </motion.div>

              {/* Highway / Road Horizon Layer */}
              <div className="absolute bottom-6 left-0 right-0 h-16 border-t border-white/[0.08] bg-gradient-to-t from-black/60 to-transparent">
                {/* Moving Road Markers */}
                <motion.div
                  animate={{ x: [0, -120] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="absolute bottom-2 left-0 right-0 flex gap-12 opacity-30 transform-gpu"
                >
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="h-0.5 w-8 bg-cyan-400/80 rounded-full flex-shrink-0" />
                  ))}
                </motion.div>

                {/* Luxury Bus Driving Across */}
                <motion.div
                  animate={{
                    x: ["-15vw", "110vw"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 13,
                    ease: "linear",
                    delay: 2,
                  }}
                  className="absolute -top-7 left-0 flex items-center z-10 will-change-transform transform-gpu"
                >
                  {/* Luxury Coach Bus SVG */}
                  <svg width="130" height="42" viewBox="0 0 150 50" fill="none" className="drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                    {/* Headlight Beam */}
                    <polygon points="145,32 240,15 240,48" fill="url(#busLight)" opacity="0.4" />
                    {/* Underglow */}
                    <ellipse cx="75" cy="45" rx="55" ry="3" fill="#22D3EE" opacity="0.6" />
                    {/* Bus Body */}
                    <rect x="15" y="10" width="130" height="30" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                    <rect x="22" y="14" width="118" height="12" rx="2" fill="#0369A1" opacity="0.7" />
                    {/* Tinted Panoramic Windows */}
                    {[26, 42, 58, 74, 90, 106, 122].map((wx, i) => (
                      <rect key={i} x={wx} y="15" width="12" height="10" rx="1.5" fill="#E0F2FE" opacity="0.85" />
                    ))}
                    {/* Accent Stripe */}
                    <path d="M15 28L145 28" stroke="#06B6D4" strokeWidth="2" />
                    {/* Front Headlights */}
                    <circle cx="144" cy="32" r="3" fill="#67E8F9" />
                    <circle cx="144" cy="32" r="1.5" fill="#FFFFFF" />
                    {/* Tail Light */}
                    <circle cx="16" cy="32" r="2.5" fill="#EF4444" />
                    {/* Wheels */}
                    <circle cx="45" cy="40" r="7" fill="#020617" stroke="#64748B" strokeWidth="2" />
                    <circle cx="45" cy="40" r="3" fill="#94A3B8" />
                    <circle cx="115" cy="40" r="7" fill="#020617" stroke="#64748B" strokeWidth="2" />
                    <circle cx="115" cy="40" r="3" fill="#94A3B8" />

                    <defs>
                      <linearGradient id="busLight" x1="0" y1="0" x2="1" y2="0">
                        <stop stopColor="#67E8F9" stopOpacity="0.8" />
                        <stop offset="1" stopColor="#0891B2" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              </div>
            </div>
          )}

          {/* 2. GOLOGIX: Moving Logistics Truck + Smart Supply Route */}
          {project.animationType === "logistics_freight" && (
            <div className="relative h-full w-full">
              {/* Radar Scanner & Route Grid in Sky */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center justify-center opacity-30">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="h-72 w-72 rounded-full border border-dashed border-emerald-500/30 transform-gpu"
                />
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute h-44 w-44 rounded-full border border-emerald-400/40 transform-gpu"
                />
              </div>

              {/* Waypoint Telemetry Indicators */}
              <div className="absolute top-16 left-12 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-black/40 px-3 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-xs text-emerald-300">Route 84: Singapore ➔ Tokyo (In Transit)</span>
              </div>

              {/* Lower Highway Track with Moving Semi-Truck */}
              <div className="absolute bottom-6 left-0 right-0 h-16 border-t border-white/[0.08] bg-gradient-to-t from-black/60 to-transparent">
                {/* Fast Moving Road Track */}
                <motion.div
                  animate={{ x: [0, -120] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="absolute bottom-2 left-0 right-0 flex gap-12 opacity-30 transform-gpu"
                >
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="h-0.5 w-8 bg-emerald-400/80 rounded-full flex-shrink-0" />
                  ))}
                </motion.div>

                {/* Logistics Heavy-Duty Freight Truck */}
                <motion.div
                  animate={{ x: ["-20vw", "110vw"] }}
                  transition={{ repeat: Infinity, duration: 11, ease: "linear" }}
                  className="absolute -top-10 left-0 flex items-center z-10 will-change-transform transform-gpu"
                >
                  <svg width="170" height="52" viewBox="0 0 190 60" fill="none" className="drop-shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                    {/* Headlight Cone */}
                    <polygon points="182,38 270,20 270,55" fill="url(#truckLight)" opacity="0.4" />
                    {/* Underglow */}
                    <ellipse cx="90" cy="54" rx="75" ry="3.5" fill="#10B981" opacity="0.6" />
                    {/* Cargo Container Trailer */}
                    <rect x="10" y="10" width="120" height="38" rx="4" fill="#022C22" stroke="#10B981" strokeWidth="1.5" />
                    {/* Container Ribs */}
                    {[22, 34, 46, 58, 70, 82, 94, 106, 118].map((rx, i) => (
                      <line key={i} x1={rx} y1="12" x2={rx} y2="46" stroke="#059669" strokeWidth="1.2" opacity="0.6" />
                    ))}
                    {/* Branding Pill */}
                    <rect x="35" y="22" width="70" height="14" rx="3" fill="#064E3B" stroke="#34D399" strokeWidth="1" />
                    <text x="44" y="32.5" fill="#A7F3D0" fontSize="8" fontFamily="monospace" fontWeight="bold">GOLOGIX</text>
                    {/* Truck Cab */}
                    <path d="M132 20L155 20L172 32L182 34C184 34 186 36 186 38L186 48L132 48Z" fill="#065F46" stroke="#10B981" strokeWidth="1.5" />
                    {/* Windshield */}
                    <path d="M152 22L168 32L140 32L140 22Z" fill="#6EE7B7" opacity="0.8" />
                    {/* Headlights */}
                    <circle cx="184" cy="40" r="3" fill="#6EE7B7" />
                    <circle cx="184" cy="40" r="1.5" fill="#FFFFFF" />
                    {/* Wheels */}
                    {[25, 42, 100, 116, 150, 172].map((wx, i) => (
                      <g key={i}>
                        <circle cx={wx} cy="50" r="7" fill="#020617" stroke="#475569" strokeWidth="2" />
                        <circle cx={wx} cy="50" r="3" fill="#94A3B8" />
                      </g>
                    ))}
                    <defs>
                      <linearGradient id="truckLight" x1="0" y1="0" x2="1" y2="0">
                        <stop stopColor="#6EE7B7" stopOpacity="0.8" />
                        <stop offset="1" stopColor="#059669" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              </div>
            </div>
          )}

          {/* 3. PG INFO: Premium Apartment with subtle living animation */}
          {project.animationType === "luxury_living" && (
            <div className="relative h-full w-full flex items-center justify-center">
              {/* Ambient Living Penthouse Facade Mockup */}
              <div className="relative w-[340px] sm:w-[460px] h-[280px] rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-black/60 to-black/90 p-5 shadow-[0_0_50px_rgba(245,158,11,0.2)] backdrop-blur-xl">
                {/* Penthouse Balcony Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-bold text-white tracking-wide">PG Info • Sky Residence 42</span>
                  </div>
                  <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-300">
                    Smart Living OS Active
                  </span>
                </div>

                {/* Architectural Windows with Warm Breathing Light */}
                <div className="mt-4 grid grid-cols-3 gap-3 h-36">
                  {[1, 2, 3].map((room) => (
                    <motion.div
                      key={room}
                      animate={{
                        opacity: [0.65, 0.95, 0.65],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3 + room * 0.8,
                        ease: "easeInOut",
                      }}
                      className="relative rounded-xl border border-amber-400/20 bg-gradient-to-t from-amber-500/20 to-amber-200/10 p-2 overflow-hidden flex flex-col justify-between"
                    >
                      {/* Window Reflection Shimmer */}
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ repeat: Infinity, duration: 4.5, delay: room * 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 transform-gpu"
                      />
                      <span className="text-[9px] font-mono text-amber-300/80">Zone 0{room}</span>
                      <div className="flex items-center justify-between">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                        <span className="font-mono text-[10px] text-zinc-300">22.5°C</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Subtle Swaying Luxury Balcony Palm Silhouettes */}
                <motion.div
                  animate={{ rotate: [-1.5, 1.5, -1.5] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute -bottom-2 right-4 transform-gpu"
                >
                  <svg width="60" height="70" viewBox="0 0 60 70" fill="none" className="opacity-40">
                    <path d="M30 70C30 50 25 30 15 15C28 22 35 32 38 42C42 28 50 18 58 10C52 24 45 35 40 50C40 60 35 70 30 70Z" fill="#F59E0B" />
                  </svg>
                </motion.div>

                {/* Ambient Golden Dust Floating Motes */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [-10, -40, -10],
                      x: [0, (i % 2 === 0 ? 15 : -15), 0],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3 + i * 0.5,
                      ease: "easeInOut",
                    }}
                    className="absolute h-1 w-1 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.8)] transform-gpu"
                    style={{
                      left: `${15 + i * 10}%`,
                      top: `${40 + (i % 3) * 15}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 4. WORKNAI: AI Holographic Interface with Floating Particles */}
          {project.animationType === "ai_hologram" && (
            <div className="relative h-full w-full flex items-center justify-center">
              {/* Central Holographic Neural Core */}
              <div className="relative flex items-center justify-center">
                {/* Outer Rotating Cyan-Purple Hologram Rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="h-80 w-80 rounded-full border border-dashed border-purple-500/40 transform-gpu"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                  className="absolute h-60 w-60 rounded-full border border-pink-500/30 border-t-purple-400 transform-gpu"
                />
                <motion.div
                  animate={{ scale: [0.95, 1.08, 0.95] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute h-40 w-40 rounded-full border border-cyan-400/50 bg-purple-600/10 shadow-[0_0_40px_rgba(168,85,247,0.4)] backdrop-blur-md transform-gpu"
                />

                {/* Central AI Glyph */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="h-12 w-12 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px] shadow-[0_0_25px_rgba(168,85,247,0.8)]"
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#050816] p-1.5">
                      <img src="/logo.png" alt="WorknAI" className="h-full w-full object-contain" />
                    </div>
                  </motion.div>
                  <span className="mt-2 font-mono text-[10px] text-purple-300 tracking-widest uppercase">
                    WorknAI OS
                  </span>
                </div>

                {/* Floating Interactive Glowing Particles */}
                {Array.from({ length: 14 }).map((_, i) => {
                  const angle = (i * 360) / 14;
                  const radius = 100 + (i % 3) * 25;
                  return (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [0.7, 1.4, 0.7],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5 + (i % 4) * 0.4,
                        ease: "easeInOut",
                      }}
                      className="absolute h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)] transform-gpu"
                      style={{
                        transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeroProject } from "./data";

interface HeroButtonsProps {
  projects: HeroProject[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
}

export default function HeroButtons({
  projects,
  activeProjectId,
  onSelectProject,
}: HeroButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl shadow-2xl"
    >
      {projects.map((proj) => {
        const isActive = proj.id === activeProjectId;
        const color = proj.accentColor || "#3B82F6";

        return (
          <motion.button
            key={proj.id}
            type="button"
            onClick={() => onSelectProject(proj.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`group relative flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 select-none ${
              isActive
                ? "bg-white/15 text-white shadow-lg shadow-black/40 ring-1"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
            style={{
              borderColor: isActive ? color : undefined,
              boxShadow: isActive ? `0 0 20px ${color}33` : undefined,
            }}
          >
            {/* Brand Logo or Accent Dot */}
            {proj.id === "worknai" ? (
              <img
                src="/logo.png"
                alt="WorknAI"
                className="h-3.5 w-3.5 object-contain"
              />
            ) : proj.thumbnail ? (
              <div className="relative h-3.5 w-3.5 overflow-hidden rounded-full border border-white/20">
                <img
                  src={proj.thumbnail}
                  alt={proj.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <span
                className="h-2 w-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: color,
                  boxShadow: isActive ? `0 0 10px ${color}` : "none",
                }}
              />
            )}

            <span>{proj.name}</span>

            {proj.industry && (
              <span className="hidden sm:inline text-[10px] text-zinc-400 font-normal">
                ({proj.industry})
              </span>
            )}

            {/* Glowing Active Tab Underline */}
            {isActive && (
              <motion.div
                layoutId="activeHeroTab"
                className="absolute -bottom-[2px] left-3 right-3 h-[2px] rounded-full"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 12px ${color}`,
                }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

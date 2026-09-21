"use client";

import React from "react";
import { motion } from "framer-motion";
import { Film, FileText, Megaphone, Image as ImageIcon } from "lucide-react";
import { ContentTypeId } from "./types";
import { contentTypesList } from "./data";

interface ContentTypeSelectorProps {
  selectedType: ContentTypeId;
  onSelectType: (id: ContentTypeId) => void;
}

export default function ContentTypeSelector({
  selectedType,
  onSelectType,
}: ContentTypeSelectorProps) {
  const getIcon = (id: ContentTypeId) => {
    switch (id) {
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        );
      case "reel":
        return <Film className="h-4 w-4" />;
      case "youtube":
        return <FileText className="h-4 w-4" />;
      case "ad":
        return <Megaphone className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          1. Select Content Format
        </label>
        <span className="text-[11px] text-zinc-500">5 AI Multi-Modal Engines</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {contentTypesList.map((item) => {
          const isSelected = selectedType === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectType(item.id)}
              className={`relative flex flex-col justify-between rounded-2xl border p-3 text-left transition-all duration-300 ${
                isSelected
                  ? "border-blue-500/80 bg-gradient-to-b from-blue-500/20 via-purple-500/10 to-transparent shadow-[0_0_24px_rgba(59,130,246,0.25)] ring-1 ring-blue-400/50"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              {/* Top Row: Icon + Badge */}
              <div className="flex items-start justify-between gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? `bg-gradient-to-tr ${item.gradient} text-white shadow-md`
                      : "border border-white/10 bg-white/5 text-zinc-400"
                  }`}
                >
                  {getIcon(item.id)}
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wide ${
                    isSelected
                      ? "bg-blue-400/20 text-blue-300 border border-blue-400/30"
                      : "bg-white/5 text-zinc-500 border border-white/5"
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              {/* Title & Micro description */}
              <div className="mt-3">
                <div
                  className={`text-xs font-bold transition-colors ${
                    isSelected ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {item.label}
                </div>
                <p className="mt-0.5 line-clamp-1 text-[10px] text-zinc-500">
                  {item.description}
                </p>
              </div>

              {/* Active neon bottom bar */}
              {isSelected && (
                <motion.div
                  layoutId="activeContentTypeIndicator"
                  className="absolute -bottom-[1px] left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

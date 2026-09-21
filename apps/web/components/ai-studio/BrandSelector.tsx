"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { Brand } from "./types";
import { brandsList } from "./data";

interface BrandSelectorProps {
  selectedBrand: Brand;
  onSelectBrand: (brand: Brand) => void;
}

export default function BrandSelector({
  selectedBrand,
  onSelectBrand,
}: BrandSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          2. Target Brand & Audience Profile
        </label>
        <span className="text-[11px] text-zinc-500">Connected Knowledge Bases</span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {brandsList.map((brand) => {
          const isSelected = selectedBrand.id === brand.id;

          return (
            <motion.button
              key={brand.id}
              whileHover={{ y: -1.5, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectBrand(brand)}
              className={`group relative flex items-center justify-between rounded-2xl border p-3 text-left transition-all duration-300 ${
                isSelected
                  ? "border-blue-500/70 bg-white/[0.08] shadow-[0_0_20px_rgba(59,130,246,0.18)] ring-1 ring-blue-500/30"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Brand Avatar */}
                <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={brand.avatar}
                    alt={brand.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-bold text-white group-hover:text-blue-200 transition-colors">
                      {brand.name}
                    </span>
                    <ShieldCheck className="h-3 w-3 text-blue-400 flex-shrink-0" />
                  </div>
                  <p className="truncate text-[10px] text-zinc-400">
                    {brand.industry}
                  </p>
                </div>
              </div>

              {/* Selected indicator */}
              <div
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                  isSelected
                    ? "border-blue-400 bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    : "border-white/10 bg-white/5 text-transparent group-hover:border-white/20"
                }`}
              >
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Brand Voice Summary Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-300">Tone of Voice:</span>
          <span className="text-blue-300 font-medium">{selectedBrand.voice}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="font-semibold text-zinc-300">Audience:</span>
          <span className="text-zinc-400 truncate max-w-xs">{selectedBrand.audience}</span>
        </div>
      </div>
    </div>
  );
}

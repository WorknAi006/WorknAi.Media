"use client";

import React from "react";
import { motion } from "framer-motion";
import { History, Sparkles, ExternalLink, Calendar } from "lucide-react";
import { recentCreations, CreationItem } from "./data";

export default function RecentCreations() {
  return (
    <section className="mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Recent AI Creations
            </h3>
            <p className="text-[11px] text-zinc-400">
              Live generation history across connected brands
            </p>
          </div>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-zinc-300">
          {recentCreations.length} items logged
        </span>
      </div>

      {/* Mapped Grid of Recent Creations */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recentCreations.map((item: CreationItem, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"
          >
            <div>
              {/* Media Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Top Badge Overlay */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <span className="rounded-md bg-black/60 px-2 py-0.5 text-[9px] font-semibold text-zinc-200 backdrop-blur-md border border-white/10">
                    {item.contentType}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold backdrop-blur-md ${item.statusColor}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Title & Brand Meta */}
              <div className="mt-3">
                <h4 className="line-clamp-1 text-xs font-bold text-white group-hover:text-blue-200 transition-colors">
                  {item.title}
                </h4>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <span className="font-semibold text-zinc-300">{item.brand}</span>
                  <span>•</span>
                  <span className="font-mono text-[10px] text-zinc-500">{item.date}</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="mt-3.5 flex items-center justify-between border-t border-white/[0.06] pt-2.5 text-[11px]">
              <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                <Calendar className="h-3 w-3 text-blue-400" />
                {item.date}
              </span>

              <button
                type="button"
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Inspect</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

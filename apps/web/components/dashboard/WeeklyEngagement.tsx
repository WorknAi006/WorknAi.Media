"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { weeklyEngagementData } from "./data";

export default function WeeklyEngagement() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                Weekly Engagement
              </h3>
              <p className="text-xs text-zinc-400">Interactions by channel</p>
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-zinc-300">
            142.8K total
          </span>
        </div>

        {/* Progress Bars List */}
        <div className="mt-6 space-y-4">
          {weeklyEngagementData.map((item, idx) => (
            <div key={item.platform} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-200">{item.platform}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-zinc-400">{item.interactions}</span>
                  <span className="font-semibold text-emerald-400">{item.growth}</span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-white/[0.06] pt-3 text-center text-xs text-zinc-400">
        Highest velocity: <span className="font-semibold text-white">Instagram Reels (+28%)</span>
      </div>
    </motion.div>
  );
}

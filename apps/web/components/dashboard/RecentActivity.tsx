"use client";

import React from "react";
import { motion } from "framer-motion";
import { History, Sparkles, Clock } from "lucide-react";
import { recentActivityData } from "./data";

export default function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                Recent Activity
              </h3>
              <p className="text-xs text-zinc-400">Automated operations log</p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Feed
          </span>
        </div>

        {/* Activity Items List */}
        <div className="mt-5 space-y-3">
          {recentActivityData.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-blue-400">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    {activity.action}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {activity.brand}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${activity.statusColor}`}
                >
                  {activity.status}
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">
                  <Clock className="h-2.5 w-2.5" />
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-white/[0.06] pt-3 text-center text-xs text-zinc-400">
        All automated tasks running normally on queue.
      </div>
    </motion.div>
  );
}

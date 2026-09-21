"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Upload,
  CheckCircle2,
  Sparkles,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { TeamActivity } from "./data";

interface ActivityTimelineProps {
  activities: TeamActivity[];
}

export default function ActivityTimeline({
  activities,
}: ActivityTimelineProps) {
  const getActionIcon = (type: TeamActivity["type"]) => {
    switch (type) {
      case "upload":
        return <Upload className="h-3.5 w-3.5" />;
      case "approval":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "ai":
        return <Sparkles className="h-3.5 w-3.5" />;
      case "meeting":
        return <Calendar className="h-3.5 w-3.5" />;
      default:
        return <MessageSquare className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Live Team Activity
              </h3>
              <p className="text-[11px] text-zinc-400">
                Real-time workspace collaboration feed
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live Stream
          </span>
        </div>

        {/* Timeline Items */}
        <div className="space-y-4">
          {activities.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="group relative flex items-start gap-3"
            >
              {/* Avatar with Icon Overlay */}
              <div className="relative shrink-0">
                <div className="h-9 w-9 overflow-hidden rounded-xl border border-white/15 bg-black/40">
                  <img
                    src={item.avatar}
                    alt={item.user}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#0B1020] ${item.badgeColor}`}
                >
                  {getActionIcon(item.type)}
                </div>
              </div>

              {/* Activity description */}
              <div className="flex-1 min-w-0 pb-3 border-b border-white/[0.04]">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-white truncate">
                    {item.user}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                    {item.timestamp}
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-zinc-300 leading-snug">
                  <span className="text-zinc-400">{item.action} </span>
                  <span className="font-semibold text-blue-300">{item.target}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="mt-4 border-t border-white/[0.06] pt-3 text-center text-[11px] text-zinc-500">
        ⚡ Synced across all connected WorknAI agency sub-workspaces.
      </div>
    </div>
  );
}

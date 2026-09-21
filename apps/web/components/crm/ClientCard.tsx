"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  DollarSign,
  Clock,
  ArrowUpRight,
  GripVertical,
} from "lucide-react";
import { Client, priorityMeta } from "./data";

interface ClientCardProps {
  client: Client;
  index: number;
  onSelect: (client: Client) => void;
}

export default function ClientCard({
  client,
  index,
  onSelect,
}: ClientCardProps) {
  const prio = priorityMeta[client.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.15}
      dragSnapToOrigin
      onClick={() => onSelect(client)}
      className="group relative cursor-grab active:cursor-grabbing rounded-[22px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:bg-white/[0.07] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] select-none"
    >
      {/* Top Header: Company Logo, Name, Drag handle */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black/40 shadow-inner">
            <img
              src={client.logo}
              alt={client.company}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white tracking-wide truncate group-hover:text-blue-300 transition-colors">
              {client.company}
            </h4>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 truncate">
              <User className="h-3 w-3 shrink-0 text-zinc-500" />
              <span className="truncate">{client.owner}</span>
            </div>
          </div>
        </div>

        {/* Priority Badge */}
        <span
          className={`shrink-0 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md ${prio.bg} ${prio.border} ${prio.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${prio.dot}`} />
          {client.priority}
        </span>
      </div>

      {/* Service brief */}
      <p className="mt-3 text-xs text-zinc-300 font-medium line-clamp-1">
        {client.service}
      </p>

      {/* Budget & Next Meeting Info */}
      <div className="mt-3.5 space-y-2 border-t border-white/[0.06] pt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] text-zinc-400">Budget / Revenue</span>
          <span className="font-mono font-bold text-white tracking-wide">
            ${client.revenue.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-[11px] text-zinc-400">
            <Calendar className="h-3 w-3 text-blue-400" />
            Next Meeting
          </span>
          <span className="text-[11px] font-medium text-blue-300 truncate max-w-[130px] text-right">
            {client.nextMeeting}
          </span>
        </div>
      </div>

      {/* Drag & Quick View hint overlay */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="flex items-center gap-1">
          <GripVertical className="h-3 w-3 text-zinc-600" />
          Drag to move
        </span>
        <span className="flex items-center gap-0.5 text-blue-400 font-semibold">
          View details
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </motion.div>
  );
}

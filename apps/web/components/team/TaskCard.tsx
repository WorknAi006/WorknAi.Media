"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, CheckCircle2, GripVertical } from "lucide-react";
import { TaskItem, priorityMeta } from "./data";

interface TaskCardProps {
  task: TaskItem;
  index: number;
  onSelect?: (task: TaskItem) => void;
}

export default function TaskCard({ task, index, onSelect }: TaskCardProps) {
  const prio = priorityMeta[task.priority];

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
      onClick={() => onSelect && onSelect(task)}
      className="group relative cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 sm:p-4 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:bg-white/[0.07] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] select-none"
    >
      {/* Top row: Project Tag & Priority Badge */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wide ${task.brandColor}`}
        >
          {task.project}
        </span>

        <span
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${prio.bg} ${prio.border} ${prio.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${prio.dot}`} />
          {task.priority}
        </span>
      </div>

      {/* Task Title */}
      <h4 className="mt-2.5 text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors">
        {task.title}
      </h4>

      {/* Progress Bar & Percentage */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
          <span>Progress</span>
          <span className="font-bold text-zinc-200">{task.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      {/* Footer: Assignee & Due Date */}
      <div className="mt-3.5 flex items-center justify-between border-t border-white/[0.05] pt-2.5">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-white/15 bg-black/40">
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-[11px] font-medium text-zinc-300 truncate max-w-[90px]">
            {task.assignee.name.split(" ")[0]}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
          <Calendar className="h-3 w-3 text-blue-400" />
          <span>{task.dueDate}</span>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus, Kanban, Layers } from "lucide-react";
import TaskCard from "./TaskCard";
import { TaskItem, kanbanColumns, TaskStatus } from "./data";

interface KanbanBoardProps {
  tasks: TaskItem[];
  onSelectTask?: (task: TaskItem) => void;
  onAddTask?: (status: TaskStatus) => void;
}

export default function KanbanBoard({
  tasks,
  onSelectTask,
  onAddTask,
}: KanbanBoardProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
      {/* Board Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/15 text-blue-400">
            <Kanban className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Project Delivery Kanban
            </h3>
            <p className="text-[11px] text-zinc-400">
              Sprint deliverables & multi-agent creative execution
            </p>
          </div>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-zinc-300">
          {tasks.length} Active Tasks
        </span>
      </div>

      {/* 4-Column Responsive Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kanbanColumns.map((col, colIndex) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: colIndex * 0.07 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 backdrop-blur-xl"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${col.accent}`} />
                  <span className="text-xs font-bold text-white tracking-wide">
                    {col.title}
                  </span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[10px] font-mono text-zinc-300">
                    {colTasks.length}
                  </span>
                </div>

                {onAddTask && (
                  <button
                    type="button"
                    onClick={() => onAddTask(col.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition"
                    title={`Add task to ${col.title}`}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Tasks List Drop Area */}
              <div className="flex-1 space-y-3 min-h-[220px]">
                {colTasks.map((task, taskIndex) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={taskIndex}
                    onSelect={onSelectTask}
                  />
                ))}

                {colTasks.length === 0 && (
                  <div className="flex h-28 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-3 text-center">
                    <span className="text-[11px] text-zinc-500">
                      No tasks in {col.title}
                    </span>
                    {onAddTask && (
                      <button
                        type="button"
                        onClick={() => onAddTask(col.id)}
                        className="mt-1 text-[10px] font-semibold text-blue-400 hover:underline"
                      >
                        + Create task
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

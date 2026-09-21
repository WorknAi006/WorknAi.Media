"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { eventsByDayMap } from "./data";
import { ScheduledEvent } from "./types";

interface MonthlyCalendarProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MonthlyCalendar({
  selectedDay,
  onSelectDay,
}: MonthlyCalendarProps) {
  // September 2026 starts on Tuesday (index 1 of Monday=0)
  // Total days in September = 30
  // Previous month trailing days: 1 day (Aug 31)
  // Next month leading days: 4 days (Oct 1, 2, 3, 4) -> 35 total grid cells (5 weeks)
  const calendarCells = [
    { day: 31, isCurrentMonth: false, month: "Aug" },
    ...Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: true,
      month: "Sep",
    })),
    { day: 1, isCurrentMonth: false, month: "Oct" },
    { day: 2, isCurrentMonth: false, month: "Oct" },
    { day: 3, isCurrentMonth: false, month: "Oct" },
    { day: 4, isCurrentMonth: false, month: "Oct" },
  ];

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">September 2026</h3>
              <p className="text-[11px] text-zinc-400">12 multi-platform releases scheduled</p>
            </div>
          </div>

          {/* Month Switcher Controls */}
          <div className="flex items-center gap-1">
            <button
              title="Previous Month"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSelectDay(7)}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Today
            </button>
            <button
              title="Next Month"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days of the week header */}
        <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-zinc-400">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Monthly Calendar Grid */}
        <div className="mt-1.5 grid grid-cols-7 gap-1.5">
          {calendarCells.map((cell, idx) => {
            const isToday = cell.isCurrentMonth && cell.day === 7;
            const isSelected = cell.isCurrentMonth && cell.day === selectedDay;
            const events: ScheduledEvent[] = cell.isCurrentMonth
              ? eventsByDayMap[cell.day] || []
              : [];

            return (
              <motion.button
                key={`${cell.month}-${cell.day}-${idx}`}
                whileHover={{ scale: cell.isCurrentMonth ? 1.05 : 1 }}
                whileTap={{ scale: cell.isCurrentMonth ? 0.96 : 1 }}
                onClick={() => {
                  if (cell.isCurrentMonth) {
                    onSelectDay(cell.day);
                  }
                }}
                disabled={!cell.isCurrentMonth}
                className={`group relative flex min-h-[52px] flex-col items-center justify-between rounded-xl p-1.5 text-xs transition-all duration-200 ${
                  !cell.isCurrentMonth
                    ? "opacity-25 cursor-not-allowed"
                    : isSelected
                    ? "border border-blue-500 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-400"
                    : isToday
                    ? "border border-cyan-500/40 bg-white/10 hover:border-cyan-400 hover:bg-white/15"
                    : "border border-white/[0.05] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                {/* Day Number */}
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`text-[11px] font-mono ${
                      isSelected
                        ? "font-bold text-white"
                        : isToday
                        ? "font-bold text-cyan-400"
                        : "text-zinc-300 group-hover:text-white"
                    }`}
                  >
                    {cell.day}
                  </span>

                  {isToday && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  )}
                </div>

                {/* Event Dots/Pills indicator */}
                <div className="flex w-full items-center justify-center gap-1 py-1">
                  {events.slice(0, 3).map((evt) => (
                    <span
                      key={evt.id}
                      title={`${evt.brand} (${evt.platform}) - ${evt.time}`}
                      className={`h-1.5 w-1.5 rounded-full ${evt.color.dot} ${evt.color.glow}`}
                    />
                  ))}
                  {events.length > 3 && (
                    <span className="text-[9px] font-bold text-zinc-400 leading-none">
                      +{events.length - 3}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="mt-5 flex flex-wrap items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
            <span>Instagram</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span>YouTube</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span>LinkedIn</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            <span>X</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-zinc-500">
          Click any date to preview
        </div>
      </div>
    </div>
  );
}

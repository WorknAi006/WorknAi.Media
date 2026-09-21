"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Radio } from "lucide-react";
import MonthlyCalendar from "./MonthlyCalendar";
import TodayScheduledPosts from "./TodayScheduledPosts";
import { scheduledPostsList, eventsByDayMap } from "./data";

export default function SchedulerSection() {
  const [selectedDay, setSelectedDay] = useState<number>(7); // Default to today (Sep 7)

  // Get posts for the selected day, or fallback to today's posts if none on that day
  const displayedPosts = eventsByDayMap[selectedDay] || [];

  return (
    <section className="mt-8">
      {/* Section Title Header */}
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Content Scheduler</h2>
            <span className="flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400">
              <Radio className="h-2.5 w-2.5 animate-pulse text-blue-400" />
              Live Sync
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Automated multi-brand publishing calendar & real-time dispatch queue
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-zinc-300">
            <Clock className="h-3 w-3 text-blue-400" />
            <span>Timezone: UTC+05:30</span>
          </div>
        </div>
      </div>

      {/* Responsive 2-column layout: Left Monthly Calendar, Right Today's Scheduled Posts */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* Left: Monthly Calendar (7 cols on desktop) */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] lg:col-span-7">
          <MonthlyCalendar
            selectedDay={selectedDay}
            onSelectDay={(day) => setSelectedDay(day)}
          />
        </div>

        {/* Right: Today's Scheduled Posts (5 cols on desktop) */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] lg:col-span-5">
          <TodayScheduledPosts
            selectedDay={selectedDay}
            posts={displayedPosts}
          />
        </div>
      </motion.div>
    </section>
  );
}

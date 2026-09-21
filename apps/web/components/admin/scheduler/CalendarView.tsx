"use client";

import { useState, useMemo } from "react";
import { ScheduledPost } from "./types";
import StatusBadge from "./StatusBadge";

type Props = {
  posts: ScheduledPost[];
  onSelectPost?: (post: ScheduledPost) => void;
};

export default function CalendarView({ posts, onSelectPost }: Props) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Prev / Next month handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Group posts by YYYY-MM-DD
  const postsByDate = useMemo(() => {
    const map = new Map<string, ScheduledPost[]>();
    posts.forEach((post) => {
      if (!post.scheduled_at) return;
      const d = new Date(post.scheduled_at);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(post);
    });
    return map;
  }, [posts]);

  // Calendar cells
  const calendarCells = useMemo(() => {
    const cells: Array<{
      dayNumber: number;
      isCurrentMonth: boolean;
      dateKey: string;
      isToday: boolean;
      dayPosts: ScheduledPost[];
    }> = [];

    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // Leading blanks / previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      cells.push({
        dayNumber: d,
        isCurrentMonth: false,
        dateKey: `prev-${d}`,
        isToday: false,
        dayPosts: [],
      });
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({
        dayNumber: day,
        isCurrentMonth: true,
        dateKey,
        isToday: dateKey === todayKey,
        dayPosts: postsByDate.get(dateKey) || [],
      });
    }

    // Trailing blanks to fill 35 or 42 grid slots
    const totalSlots = cells.length > 35 ? 42 : 35;
    const remaining = totalSlots - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateKey: `next-${i}`,
        isToday: false,
        dayPosts: [],
      });
    }

    return cells;
  }, [year, month, daysInMonth, firstDayIndex, postsByDate]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_0_30px_rgba(59,130,246,0.06)] space-y-5">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            {monthNames[month]} {year}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Click on any scheduled event to inspect details or reschedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
            <button
              onClick={handlePrevMonth}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition"
              title="Previous Month"
            >
              ◀
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition"
              title="Next Month"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 pb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarCells.map((cell, idx) => (
          <div
            key={`${cell.dateKey}-${idx}`}
            className={`min-h-[100px] rounded-xl border p-2 flex flex-col justify-between transition ${
              cell.isCurrentMonth
                ? cell.isToday
                  ? "border-blue-500/60 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  : "border-white/10 bg-black/30 hover:border-white/20"
                : "border-white/5 bg-black/10 opacity-30 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-semibold ${
                  cell.isToday
                    ? "rounded-full bg-blue-600 px-2 py-0.5 text-white shadow-[0_0_8px_#3b82f6]"
                    : cell.isCurrentMonth
                    ? "text-zinc-200"
                    : "text-zinc-600"
                }`}
              >
                {cell.dayNumber}
              </span>
              {cell.dayPosts.length > 0 && (
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/20 rounded-full px-1.5 py-0.2">
                  {cell.dayPosts.length}
                </span>
              )}
            </div>

            {/* Posts container for this day */}
            <div className="mt-1 space-y-1 overflow-y-auto max-h-[70px]">
              {cell.dayPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost?.(post)}
                  className={`group cursor-pointer rounded-lg p-1.5 text-[11px] border transition truncate ${
                    post.status === "published"
                      ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                      : post.publish_error
                      ? "border-red-500/50 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      : "border-blue-500/40 bg-blue-500/15 text-blue-300 hover:bg-blue-500/25"
                  }`}
                  title={`${post.title} [${post.status.toUpperCase()}] (${new Date(post.scheduled_at!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`}
                >
                  <div className="flex items-center gap-1">
                    <span>{post.status === "published" ? "🟢" : post.publish_error ? "⚠️" : post.type === "reel" ? "🎬" : "📝"}</span>
                    <span className="truncate font-medium">{post.title}</span>
                  </div>
                  <div className="text-[9px] text-zinc-400 mt-0.5 flex items-center justify-between">
                    <span>
                      {new Date(post.scheduled_at!).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {post.status === "published" && (
                      <span className="text-[9px] font-bold text-emerald-400">Live</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

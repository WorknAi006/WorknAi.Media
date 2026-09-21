import { ScheduledEvent } from "./types";

export const platformColors: Record<string, {
  badge: string;
  accent: string;
  dot: string;
  glow: string;
  text: string;
  border: string;
}> = {
  Instagram: {
    badge: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    accent: "from-pink-500 to-purple-500",
    dot: "bg-pink-400",
    glow: "shadow-[0_0_12px_rgba(236,72,153,0.3)]",
    text: "text-pink-400",
    border: "border-pink-500/40",
  },
  YouTube: {
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    accent: "from-red-500 to-rose-600",
    dot: "bg-red-500",
    glow: "shadow-[0_0_12px_rgba(239,68,68,0.3)]",
    text: "text-red-400",
    border: "border-red-500/40",
  },
  LinkedIn: {
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    accent: "from-blue-500 to-cyan-500",
    dot: "bg-blue-400",
    glow: "shadow-[0_0_12px_rgba(59,130,246,0.3)]",
    text: "text-blue-400",
    border: "border-blue-500/40",
  },
  "Twitter / X": {
    badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    accent: "from-sky-500 to-indigo-500",
    dot: "bg-sky-400",
    glow: "shadow-[0_0_12px_rgba(14,165,233,0.3)]",
    text: "text-sky-400",
    border: "border-sky-500/40",
  },
  Facebook: {
    badge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    accent: "from-blue-600 to-indigo-600",
    dot: "bg-indigo-400",
    glow: "shadow-[0_0_12px_rgba(99,102,241,0.3)]",
    text: "text-indigo-400",
    border: "border-indigo-500/40",
  },
  TikTok: {
    badge: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    accent: "from-teal-400 to-emerald-500",
    dot: "bg-teal-400",
    glow: "shadow-[0_0_12px_rgba(20,184,166,0.3)]",
    text: "text-teal-400",
    border: "border-teal-500/40",
  },
};

export const statusBadges: Record<string, string> = {
  Scheduled: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Publishing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Queued: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Draft: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  Published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export const scheduledPostsList: ScheduledEvent[] = [
  {
    id: "evt-1",
    brand: "GoAirClass",
    platform: "Instagram",
    time: "10:30 AM",
    date: "2026-09-07",
    dayNumber: 7,
    title: "10 Secret Flight Booking Hacks for Bali Getaways",
    status: "Publishing",
    mediaType: "Reel",
    color: platformColors["Instagram"],
  },
  {
    id: "evt-2",
    brand: "PG Info",
    platform: "LinkedIn",
    time: "01:15 PM",
    date: "2026-09-07",
    dayNumber: 7,
    title: "Future of AI in Enterprise Cloud Architecture",
    status: "Scheduled",
    mediaType: "Article",
    color: platformColors["LinkedIn"],
  },
  {
    id: "evt-3",
    brand: "Logix Parcel",
    platform: "YouTube",
    time: "04:45 PM",
    date: "2026-09-07",
    dayNumber: 7,
    title: "Inside Next-Gen Automated Fulfilment Centers",
    status: "Queued",
    mediaType: "Shorts",
    color: platformColors["YouTube"],
  },
  {
    id: "evt-4",
    brand: "WorknAI Studio",
    platform: "Twitter / X",
    time: "07:00 PM",
    date: "2026-09-07",
    dayNumber: 7,
    title: "5 Autonomous AI Agents Every Agency Needs in 2026",
    status: "Scheduled",
    mediaType: "Feed Post",
    color: platformColors["Twitter / X"],
  },
  // Other days in the month to show rich calendar events
  {
    id: "evt-5",
    brand: "Zenith Tech",
    platform: "YouTube",
    time: "11:00 AM",
    date: "2026-09-03",
    dayNumber: 3,
    title: "Full Setup: Self-Hosted LLMs for Production",
    status: "Published",
    mediaType: "Shorts",
    color: platformColors["YouTube"],
  },
  {
    id: "evt-6",
    brand: "GoAirClass",
    platform: "Instagram",
    time: "03:30 PM",
    date: "2026-09-05",
    dayNumber: 5,
    title: "First Class Luxury Cabin Tour - Airbus A350",
    status: "Published",
    mediaType: "Reel",
    color: platformColors["Instagram"],
  },
  {
    id: "evt-7",
    brand: "Logix Parcel",
    platform: "LinkedIn",
    time: "09:45 AM",
    date: "2026-09-10",
    dayNumber: 10,
    title: "Supply Chain Optimization Metrics Case Study",
    status: "Scheduled",
    mediaType: "Carousel",
    color: platformColors["LinkedIn"],
  },
  {
    id: "evt-8",
    brand: "WorknAI Studio",
    platform: "Instagram",
    time: "02:00 PM",
    date: "2026-09-12",
    dayNumber: 12,
    title: "AI Video Prompt Engineering Guide",
    status: "Scheduled",
    mediaType: "Reel",
    color: platformColors["Instagram"],
  },
  {
    id: "evt-9",
    brand: "PG Info",
    platform: "YouTube",
    time: "05:15 PM",
    date: "2026-09-15",
    dayNumber: 15,
    title: "Top 5 Data Engineering Breakthroughs",
    status: "Draft",
    mediaType: "Shorts",
    color: platformColors["YouTube"],
  },
  {
    id: "evt-10",
    brand: "GoAirClass",
    platform: "Twitter / X",
    time: "06:30 PM",
    date: "2026-09-18",
    dayNumber: 18,
    title: "Weekend Flash Sale: Europe Routes Announced",
    status: "Scheduled",
    mediaType: "Feed Post",
    color: platformColors["Twitter / X"],
  },
  {
    id: "evt-11",
    brand: "Zenith Tech",
    platform: "LinkedIn",
    time: "10:00 AM",
    date: "2026-09-22",
    dayNumber: 22,
    title: "How to Build Production-Ready Multi-Agent Workflows",
    status: "Scheduled",
    mediaType: "Article",
    color: platformColors["LinkedIn"],
  },
  {
    id: "evt-12",
    brand: "Logix Parcel",
    platform: "Instagram",
    time: "04:00 PM",
    date: "2026-09-25",
    dayNumber: 25,
    title: "Behind the Scenes: Zero-Emission Urban Delivery Fleet",
    status: "Scheduled",
    mediaType: "Reel",
    color: platformColors["Instagram"],
  },
];

// Helper to group events by day for quick calendar mapping
export const eventsByDayMap = scheduledPostsList.reduce<Record<number, ScheduledEvent[]>>((acc, event) => {
  if (!acc[event.dayNumber]) {
    acc[event.dayNumber] = [];
  }
  acc[event.dayNumber].push(event);
  return acc;
}, {});

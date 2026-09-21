"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Film,
  Calendar,
  Sparkles,
  BookOpen,
  Briefcase,
  Layers,
  Users2,
  Inbox,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Database,
  RefreshCw,
} from "lucide-react";

type ModuleCard = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: any;
  status: "active" | "ready" | "scheduled";
  statLabel?: string;
  statValue?: string | number;
  gradient: string;
  borderHover: string;
  iconColor: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduled: 0,
    published: 0,
    today: 0,
    heroTitle: "WorknAI Media",
    isLoading: true,
  });

  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";

  const loadOverview = async () => {
    try {
      setStats((prev) => ({ ...prev, isLoading: true }));
      const [schedRes, heroRes] = await Promise.allSettled([
        fetch(`${apiBase}/scheduler/overview`).then((r) => r.json()),
        fetch(`${apiBase}/users/hero`).then((r) => r.json()),
      ]);

      let schedStats = { total: 0, scheduled: 0, published: 0, today: 0 };
      let heroTitle = "WorknAI Media";

      if (schedRes.status === "fulfilled" && schedRes.value.success) {
        schedStats = schedRes.value.stats || schedStats;
      }
      if (heroRes.status === "fulfilled" && heroRes.value.data?.[0]) {
        heroTitle = heroRes.value.data[0].title || heroTitle;
      }

      setStats({
        totalPosts: schedStats.total,
        scheduled: schedStats.scheduled,
        published: schedStats.published,
        today: schedStats.today,
        heroTitle,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to load dashboard overview:", err);
      setStats((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const modules: ModuleCard[] = [
    {
      id: "reels",
      title: "Reels CMS",
      subtitle: "Short-Form Video Hub",
      description:
        "Manage, publish, and schedule vertical video reels. Auto-slug generation, media preview, and status controls.",
      href: "/admin/reels",
      icon: Film,
      status: "active",
      statLabel: "Total Reels",
      statValue: stats.totalPosts,
      gradient: "from-purple-500/10 via-blue-500/10 to-transparent",
      borderHover: "hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    },
    {
      id: "scheduler",
      title: "Auto-Publish Scheduler",
      subtitle: "1-Min Automated Engine",
      description:
        "Interactive monthly calendar, today's queue, upcoming scheduled posts, and manual auto-publish trigger engine.",
      href: "/admin/scheduler",
      icon: Calendar,
      status: "scheduled",
      statLabel: "In Queue",
      statValue: stats.scheduled,
      gradient: "from-blue-500/10 via-cyan-500/10 to-transparent",
      borderHover: "hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    },
    {
      id: "hero",
      title: "Hero CMS",
      subtitle: "Landing Page Showcase",
      description:
        "Live control over homepage main headline, subtitle, video cover background, and primary action button.",
      href: "/admin/hero",
      icon: Sparkles,
      status: "active",
      statLabel: "Live Headline",
      statValue: stats.heroTitle,
      gradient: "from-amber-500/10 via-orange-500/10 to-transparent",
      borderHover: "hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "blog",
      title: "Blog CMS",
      subtitle: "Articles & Editorial",
      description:
        "Write, schedule, and publish SEO-optimized articles, cover art thumbnails, category tags, and author insights.",
      href: "/admin/blog",
      icon: BookOpen,
      status: "ready",
      statLabel: "Engine Ready",
      statValue: "Supabase",
      gradient: "from-emerald-500/10 via-teal-500/10 to-transparent",
      borderHover: "hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "portfolio",
      title: "Portfolio CMS",
      subtitle: "Client Deliverables",
      description:
        "Showcase completed brand transformations, AI videos, client deliverables, and categorized project reels.",
      href: "/admin/portfolio",
      icon: Briefcase,
      status: "ready",
      statLabel: "Table",
      statValue: "portfolio",
      gradient: "from-pink-500/10 via-rose-500/10 to-transparent",
      borderHover: "hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]",
      iconColor: "text-pink-400 bg-pink-500/10 border-pink-500/30",
    },
    {
      id: "services",
      title: "Services CMS",
      subtitle: "Agency Solutions",
      description:
        "Manage services list: AI Video Production, Reels Creation, Digital Branding, Automation, and Growth Strategy.",
      href: "/admin/services",
      icon: Layers,
      status: "ready",
      statLabel: "Table",
      statValue: "services",
      gradient: "from-indigo-500/10 via-blue-500/10 to-transparent",
      borderHover: "hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]",
      iconColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    },
    {
      id: "clients",
      title: "Clients & Partners",
      subtitle: "Brand Social Proof",
      description:
        "Curate trusted client brand logos, partner website links, and collaborative client testimonials.",
      href: "/admin/clients",
      icon: Users2,
      status: "ready",
      statLabel: "Table",
      statValue: "clients",
      gradient: "from-cyan-500/10 via-sky-500/10 to-transparent",
      borderHover: "hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      id: "contact",
      title: "Leads & Inquiries",
      subtitle: "CRM Inbound Queue",
      description:
        "Review inbound business inquiries, client project requirements, email contacts, and phone callbacks.",
      href: "/admin/contact",
      icon: Inbox,
      status: "ready",
      statLabel: "Table",
      statValue: "leads",
      gradient: "from-violet-500/10 via-purple-500/10 to-transparent",
      borderHover: "hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
      iconColor: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    },
    {
      id: "opportunities",
      title: "Careers & Opportunities",
      subtitle: "Talent Acquisition",
      description:
        "Post video editor jobs, prompt engineering roles, and creator intern positions for WorknAI Media.",
      href: "/admin/opportunities",
      icon: Award,
      status: "ready",
      statLabel: "Table",
      statValue: "careers",
      gradient: "from-yellow-500/10 via-amber-500/10 to-transparent",
      borderHover: "hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]",
      iconColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/40 via-purple-950/20 to-black p-8 sm:p-10 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <Sparkles className="h-3 w-3" />
              WorknAI Media Operations
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Admin CMS Control Center
            </h1>
            <p className="text-sm text-zinc-300">
              Directly control all content, video reels, scheduling cron engines, client portfolios, and inquiries from one unified dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOverview}
              disabled={stats.isLoading}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${stats.isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/admin/scheduler"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:brightness-110 transition"
            >
              <Calendar className="h-3.5 w-3.5" />
              Open Scheduler
            </Link>
          </div>
        </div>

        {/* Live Metrics Quick Row */}
        <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
              Total Content
            </div>
            <p className="text-2xl font-black text-white">{stats.totalPosts}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              Queued / Scheduled
            </div>
            <p className="text-2xl font-black text-blue-400">{stats.scheduled}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Published Live
            </div>
            <p className="text-2xl font-black text-emerald-400">{stats.published}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              Database Tables
            </div>
            <p className="text-2xl font-black text-cyan-300">9 Active</p>
          </div>
        </div>
      </div>

      {/* Grid of All CMS Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white">CMS Modules</h2>
            <p className="text-xs text-zinc-400">
              Select a module below to manage and publish that section of your website.
            </p>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {modules.length} modules available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => {
            const Icon = m.icon;

            return (
              <Link
                key={m.id}
                href={m.href}
                className={`group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 bg-gradient-to-b ${m.gradient} backdrop-blur-md p-6 transition-all duration-300 ${m.borderHover}`}
              >
                <div className="space-y-4">
                  {/* Top card bar: Icon + Status Pill */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-12 w-12 rounded-xl border p-2.5 flex items-center justify-center transition-transform group-hover:scale-110 ${m.iconColor}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        m.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : m.status === "scheduled"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/30"
                      }`}
                    >
                      {m.status === "active" ? "● Connected" : m.status === "scheduled" ? "● 1m Cron" : "Ready"}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition">
                      {m.title}
                    </h3>
                    <p className="text-xs font-medium text-blue-400/80">
                      {m.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                {/* Bottom Card Footer with Stat & Arrow */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <div>
                    {m.statLabel && (
                      <span className="text-[10px] text-zinc-500 block">
                        {m.statLabel}
                      </span>
                    )}
                    <span className="font-semibold text-zinc-200">
                      {m.statValue ?? "—"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-blue-400 group-hover:translate-x-1 transition">
                    <span>Open</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

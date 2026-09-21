"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Calendar,
  Sparkles,
  BookOpen,
  Briefcase,
  Layers,
  Users2,
  Inbox,
  Award,
  ExternalLink,
  BarChart3,
  Globe,
  Menu,
  X,
  Shield,
  Share2,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState<number>(0);

  React.useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const count = json.data.filter((l: any) => l.status === "new").length;
          setNewLeadsCount(count || json.data.length);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/integrations", label: "Integrations", icon: Share2 },
    { href: "/admin/users", label: "User Management", icon: Users2 },
    { href: "/admin/hero", label: "Hero CMS", icon: Sparkles },
    { href: "/admin/reels", label: "Reels CMS", icon: Film },
    { href: "/admin/scheduler", label: "Scheduler", icon: Calendar },
    { href: "/admin/blog", label: "Blog CMS", icon: BookOpen },
    { href: "/admin/portfolio", label: "Portfolio CMS", icon: Briefcase },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/services", label: "Services", icon: Layers },
    { href: "/admin/clients", label: "Brands & URLs", icon: Globe },
    { href: "/admin/contact", label: "Leads CRM", icon: Inbox },
    { href: "/admin/opportunities", label: "Careers CMS", icon: Award },
  ];

  const currentModule = navItems.find((item) => item.href === pathname)?.label || "Control Hub";

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      {/* 1. Left Admin Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 border-r border-white/10 bg-[#0B1020] p-5 flex-col justify-between h-screen sticky top-0 overflow-y-auto scrollbar-none flex-shrink-0 z-40">
        <div>
          {/* Brand Header */}
          <Link href="/admin" className="flex items-center gap-3 mb-6 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] p-1.5 backdrop-blur-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="WorknAI"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="block text-lg font-bold text-white tracking-wide group-hover:text-blue-300 transition-colors">
                WorknAI<span className="text-blue-400">.media</span>
              </span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Admin Master
                </span>
                <span className="rounded bg-amber-400/15 px-1 py-0.2 text-[8px] font-bold text-amber-400 border border-amber-400/30">
                  Root
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 pb-1">
              Admin Modules
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isContact = item.href === "/admin/contact";

              return (
                <Link key={item.href} href={item.href} className="block">
                  <div
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs transition ${
                      isActive
                        ? "bg-blue-600/20 text-white border border-blue-500/30 font-semibold shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isActive ? "text-blue-400" : "text-zinc-400"} />
                      <span>{item.label}</span>
                    </div>
                    {isContact && newLeadsCount > 0 && (
                      <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300 animate-pulse">
                        {newLeadsCount}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Quick Links */}
        <div className="pt-4 border-t border-white/10 mt-6 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 text-blue-300 text-xs font-semibold transition"
          >
            <span>Team Workspace ↗</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="block text-center text-[11px] text-zinc-500 hover:text-zinc-300 transition"
          >
            View Public Site ↗
          </Link>
        </div>
      </aside>

      {/* 2. Main Content & Topbar Column */}
      <div className="flex flex-1 flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/10 bg-[#050816]/85 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-300 lg:hidden hover:text-white"
              aria-label="Toggle admin menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-semibold text-zinc-400">
                Admin Control Hub
              </span>
              <span className="hidden sm:inline-block text-zinc-600">/</span>
              <h1 className="text-sm font-bold text-white tracking-wide">
                {currentModule}
              </h1>
            </div>
          </div>

          {/* Right: Supabase Live, Workspace, Live Site */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Supabase Live
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500/20 hover:text-white transition"
            >
              <span>Workspace</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition"
            >
              <span>Live Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-white/10 bg-[#0B1020] p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <div
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs ${
                      isActive
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Main Content (Takes full available width & height, no dead space) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

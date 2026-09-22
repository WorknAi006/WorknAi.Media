"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Sparkles,
  Users,
  Film,
  BookOpen,
  Briefcase,
  Shield,
  LogOut,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { clearSession } from "@/app/lib/session";

// Standard Workspace menus for team members
const employeeMenus = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Brands & URLs", icon: Globe, href: "/dashboard/clients" },
  { name: "Reels CMS", icon: Film, href: "/dashboard/reels" },
  { name: "Hero CMS", icon: Sparkles, href: "/dashboard/hero" },
  { name: "Scheduler", icon: Calendar, href: "/dashboard/scheduler" },
  { name: "Blog CMS", icon: BookOpen, href: "/dashboard/blog" },
  { name: "Portfolio", icon: Briefcase, href: "/dashboard/portfolio" },
  { name: "CRM Leads", icon: Users, href: "/dashboard/crm" },
  { name: "AI Studio", icon: Sparkles, href: "/dashboard/studio" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string>("admin");
  const [userName, setUserName] = useState<string>("User");
  const [newLeadsCount, setNewLeadsCount] = useState<number>(0);

  useEffect(() => {
    // Read active role from cookie or localStorage
    const match = document.cookie.match(/worknai_role=([^;]+)/);
    const storedUser = localStorage.getItem("worknai_user");

    if (match && match[1]) {
      setRole(match[1]);
    }

    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.name) setUserName(u.name);
        if (u.role) setRole(u.role);
      } catch (e) {}
    }

    // Fetch incoming project directives count
    fetch("/api/leads")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const newCount = json.data.filter((l: any) => l.status === "new").length;
          setNewLeadsCount(newCount || json.data.length);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    clearSession();
    window.location.href = "/login";
  };

  const isAdmin = role === "admin";

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0B1020] p-5 flex flex-col justify-between h-screen sticky top-0 overflow-y-auto scrollbar-none">
      <div>
        {/* Brand Header */}
        <Link href="/dashboard" className="flex items-center gap-3 mb-6 group">
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
            <span className="block text-[10px] text-zinc-400 font-medium -mt-0.5">
              Business Media OS
            </span>
          </div>
        </Link>

        {/* Navigation Sections */}
        <nav className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 pb-1">
            Workspace
          </p>
          {employeeMenus.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isCrm = item.href === "/dashboard/crm";

            return (
              <Link key={item.name} href={item.href} className="block">
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition ${
                    isActive
                      ? "bg-blue-600/20 text-white border border-blue-500/30 font-semibold shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className={isActive ? "text-blue-400" : ""} />
                    <span>{item.name}</span>
                  </div>
                  {isCrm && newLeadsCount > 0 && (
                    <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300 animate-pulse">
                      {newLeadsCount}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer & Logout */}
      <div className="pt-6 border-t border-white/10 mt-6">
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 mb-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-300 text-xs font-semibold transition shadow-[0_0_15px_rgba(245,158,11,0.1)]"
          >
            <Shield size={14} className="text-amber-400" />
            <span>Switch to Admin Portal ↗</span>
          </Link>
        )}

        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 border border-white/10 mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${isAdmin ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
              {userName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{userName}</p>
              <p className="text-[10px] text-zinc-400 capitalize">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="h-7 w-7 rounded-lg hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-zinc-400 transition"
          >
            <LogOut size={14} />
          </button>
        </div>

        <Link
          href="/"
          className="block text-center text-[11px] text-zinc-500 hover:text-zinc-300 transition"
        >
          View Public Site ↗
        </Link>
      </div>
    </aside>
  );
}
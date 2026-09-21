"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, LogOut } from "lucide-react";

export default function UnauthorizedPage() {
  const handleLogout = () => {
    document.cookie = "worknai_role=; path=/; max-age=0";
    document.cookie = "worknai_user=; path=/; max-age=0";
    localStorage.removeItem("worknai_user");
    window.location.href = "/login";
  };

  const handleSwitchToAdmin = () => {
    const adminUser = {
      name: "Admin User",
      email: "admin@worknai.media",
      role: "admin",
    };
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `worknai_role=admin; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `worknai_user=${encodeURIComponent(JSON.stringify(adminUser))}; path=/; max-age=${maxAge}; SameSite=Lax`;
    localStorage.setItem("worknai_user", JSON.stringify(adminUser));
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#030712] text-white">
      <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white/5 p-8 text-center backdrop-blur-2xl shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-bold text-white">403 — Access Restricted</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Your current role (Employee) does not have permission to access Admin-only modules (Hero CMS, User Management, Settings).
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={handleSwitchToAdmin}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-bold text-black hover:from-amber-400 hover:to-orange-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition active:scale-95"
          >
            <span>Switch to Admin Account (Full Access) ↗</span>
          </button>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Employee Dashboard</span>
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10 transition"
          >
            <Home className="h-4 w-4" />
            <span>Go to Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500/10 transition mt-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign In with Different Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, UserCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#030712] text-white">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-zinc-400 backdrop-blur-2xl">
            Loading authentication...
          </div>
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuthCookies = (user: { name: string; email: string; role: string }, token?: string) => {
    // Set 7-day cookie for Next.js middleware and client
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `worknai_role=${user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `worknai_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
    if (token) {
      document.cookie = `worknai_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      localStorage.setItem("worknai_token", token);
    }
    localStorage.setItem("worknai_user", JSON.stringify(user));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const endpoint = apiBase
        ? (apiBase.endsWith("/api") ? `${apiBase}/auth/login` : `${apiBase}/api/auth/login`)
        : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid login credentials");
        setLoading(false);
        return;
      }

      setAuthCookies(data.user, data.token);

      // Redirect appropriately
      if (redirect) {
        router.push(redirect);
      } else if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("Failed to connect to authentication server");
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: "admin" | "employee") => {
    if (role === "admin") {
      setEmail("admin@worknai.media");
      setPassword("admin123");
    } else {
      setEmail("employee@worknai.media");
      setPassword("employee123");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#030712] text-white">
      {/* Background Radial Glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/30 mb-2">
            <div className="h-full w-full rounded-[14px] bg-[#050816] flex items-center justify-center text-blue-400">
              <Shield className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            WorknAI <span className="text-blue-400">Media OS</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in to access unified role-based CMS & Dashboard
          </p>
        </div>

        {/* Quick Demo Login Chips */}
        <div className="mb-6 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 text-center">
            Quick 1-Click Role Login
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Demo Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("employee")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/20"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Demo Employee</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@worknai.media"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to WorknAI</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs text-zinc-400 hover:text-white transition inline-flex items-center gap-1"
          >
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}

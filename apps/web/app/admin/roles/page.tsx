"use client";

import React, { useEffect, useState } from "react";
import { Shield, Users, Check, X, Lock } from "lucide-react";

export default function RolesAdminPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";
    const token = typeof window !== "undefined" ? (localStorage.getItem("worknai_token") || "") : "";
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${apiBase}/users`, {
      headers,
    })
      .then((r) => r.json())
      .then((res) => {
        const list = res.data || res;
        if (Array.isArray(list)) setUsers(list);
      })
      .catch(() => {});
  }, []);

  const matrix = [
    { module: "Public Website", client: true, employee: true, admin: true },
    { module: "Dashboard Overview", client: false, employee: true, admin: true },
    { module: "Reels CMS", client: false, employee: true, admin: true },
    { module: "Blog CMS", client: false, employee: true, admin: true },
    { module: "Scheduler & Calendar", client: false, employee: true, admin: true },
    { module: "Analytics Hub", client: false, employee: true, admin: true },
    { module: "CRM & Leads", client: false, employee: true, admin: true },
    { module: "Hero CMS", client: false, employee: false, admin: true },
    { module: "User Management", client: false, employee: false, admin: true },
    { module: "Role & Permission Control", client: false, employee: false, admin: true },
    { module: "Global Settings", client: false, employee: false, admin: true },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400 mb-2">
          <Shield className="h-3.5 w-3.5" />
          <span>Role-Based Access Control (RBAC)</span>
        </div>
        <h1 className="text-3xl font-black text-white">Role & Access Matrix</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configured security boundaries separating Public Clients, Staff Employees, and System Administrators.
        </p>
      </div>

      {/* Permission Matrix Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/10 text-zinc-300">
            <tr>
              <th className="p-4 font-semibold">Module Name</th>
              <th className="p-4 text-center font-semibold">Client (Public)</th>
              <th className="p-4 text-center font-semibold text-purple-300">Employee</th>
              <th className="p-4 text-center font-semibold text-amber-300">Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {matrix.map((row) => (
              <tr key={row.module} className="hover:bg-white/[0.02] transition">
                <td className="p-4 font-medium text-white">{row.module}</td>
                <td className="p-4 text-center">
                  {row.client ? (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                      <X className="h-3.5 w-3.5" />
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {row.employee ? (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                      <X className="h-3.5 w-3.5" />
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {row.admin ? (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                      <X className="h-3.5 w-3.5" />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Active System Accounts */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-1">Active Accounts ({users.length})</h2>
        <p className="text-xs text-zinc-400 mb-4">
          All accounts authenticated against the Supabase `public.users` table with designated role permissions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-black/30"
            >
              <div>
                <p className="text-sm font-semibold text-white">{u.name}</p>
                <p className="text-xs text-zinc-400">{u.email}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  u.role === "admin"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                }`}
              >
                {u.role || "employee"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

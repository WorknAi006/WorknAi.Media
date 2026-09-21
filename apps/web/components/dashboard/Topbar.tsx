"use client";

import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-[#050816]/80 px-8 backdrop-blur-xl">

      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
        <Search size={18} className="text-gray-400"/>
        <input
          placeholder="Search anything..."
          className="bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-full bg-white/5 p-3">
          <Bell size={18}/>
        </button>

        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 p-1 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <img src="/logo.png" alt="WorknAI" className="h-full w-full object-contain" />
        </div>
      </div>

    </header>
  );
}
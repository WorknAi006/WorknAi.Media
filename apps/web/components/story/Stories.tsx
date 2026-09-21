"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Brand = {
  id: string;
  name: string;
  website?: string;
  logo?: string;
  renderLogo?: React.ReactNode;
};

// User-specified ecosystem brands with distinct modern visual logos
const defaultBrands: Brand[] = [
  {
    id: "onlinego",
    name: "OnlineGo",
    website: "https://onlinego.in",
    renderLogo: (
      <div className="flex items-center gap-2.5 font-bold text-lg sm:text-xl tracking-tight text-white">
        <span className="font-extrabold text-zinc-100">online</span>
        <span className="rounded-md bg-gradient-to-r from-blue-500 to-cyan-400 px-2.5 py-0.5 text-xs sm:text-sm font-black text-white shadow-[0_0_14px_rgba(6,182,212,0.6)]">
          go
        </span>
      </div>
    ),
  },
  {
    id: "logistic",
    name: "Logistic",
    website: "https://onlinego.in",
    renderLogo: (
      <div className="flex items-center gap-2.5 font-bold text-lg sm:text-xl tracking-tight text-amber-400">
        <svg className="w-6 h-6 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span className="text-white font-black tracking-tight text-lg sm:text-xl">LOGISTIC</span>
      </div>
    ),
  },
  {
    id: "pginfo",
    name: "PG.info",
    website: "https://pginfo.in",
    renderLogo: (
      <div className="flex items-center gap-2 font-extrabold text-lg sm:text-xl tracking-tight">
        <span className="rounded-md bg-violet-600/30 border border-violet-500/50 px-2.5 py-0.5 text-violet-300 text-xs sm:text-sm font-black">
          PG
        </span>
        <span className="text-white font-bold text-lg sm:text-xl">.info</span>
        <span className="h-2.5 w-2.5 rounded-full bg-violet-400 animate-pulse" />
      </div>
    ),
  },
  {
    id: "carhub",
    name: "CarHub",
    website: "https://carhub.in",
    renderLogo: (
      <div className="flex items-center gap-2.5 font-black text-lg sm:text-xl tracking-tight">
        <span className="text-rose-500 text-2xl">🏎</span>
        <span className="text-white font-extrabold text-lg sm:text-xl">Car<span className="text-rose-500 font-black">Hub</span></span>
      </div>
    ),
  },
  {
    id: "livesale-fitness",
    name: "LiveSale.Fitness",
    website: "https://livesale.fitness",
    renderLogo: (
      <div className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight">
        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 text-xs uppercase font-black">
          LIVE
        </span>
        <span className="text-white font-extrabold text-base sm:text-lg">Sale</span>
        <span className="text-emerald-400 font-bold text-sm sm:text-base">.Fitness</span>
      </div>
    ),
  },
  {
    id: "aitourism",
    name: "AITourism",
    website: "https://aitourism.in",
    renderLogo: (
      <div className="flex items-center gap-2.5 font-bold text-lg sm:text-xl tracking-tight">
        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md px-2.5 py-0.5 text-xs sm:text-sm font-black tracking-wider uppercase shadow-[0_0_12px_rgba(59,130,246,0.6)]">
          AI
        </span>
        <span className="text-white font-extrabold text-lg sm:text-xl">Tourism</span>
      </div>
    ),
  },
  {
    id: "businessexperts-asia",
    name: "BusinessExperts.Asia",
    website: "https://businessexperts.asia",
    renderLogo: (
      <div className="flex flex-col text-left leading-tight">
        <span className="text-base sm:text-lg font-black text-amber-300 tracking-tight">
          BusinessExperts
        </span>
        <span className="text-xs sm:text-sm font-bold text-zinc-400 tracking-widest uppercase mt-0.5">
          .ASIA
        </span>
      </div>
    ),
  },
  {
    id: "mobilepay-cafe",
    name: "MobilePay.cafe",
    website: "https://mobilepay.cafe",
    renderLogo: (
      <div className="flex items-center gap-2 font-bold text-base sm:text-lg tracking-tight">
        <div className="h-6 w-6 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xs sm:text-sm text-cyan-300 font-black">
          ₹
        </div>
        <span className="text-white font-bold">MobilePay</span>
        <span className="text-cyan-400 font-semibold text-sm sm:text-base">.cafe</span>
      </div>
    ),
  },
  {
    id: "lovenzea",
    name: "Lovenzea",
    website: "https://lovenzea.com",
    renderLogo: (
      <div className="flex items-center gap-2 font-serif text-lg sm:text-xl font-bold tracking-wider">
        <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 bg-clip-text text-transparent font-black">
          Lovenzea
        </span>
        <span className="text-pink-400 text-base sm:text-lg">✨</span>
      </div>
    ),
  },
  {
    id: "worknai-hrms",
    name: "WorknAi HRMS",
    website: "https://worknaihrms.online",
    renderLogo: (
      <div className="flex items-center gap-2 font-bold text-base sm:text-lg tracking-tight">
        <span className="text-blue-400 font-black tracking-tight">WorknAI</span>
        <span className="rounded-md bg-blue-600/30 border border-blue-500/40 px-2 py-0.5 text-xs sm:text-sm font-extrabold text-blue-300 uppercase">
          HRMS
        </span>
      </div>
    ),
  },
  {
    id: "worknai-crm",
    name: "WorknAi.CRM",
    website: "https://billpay.business",
    renderLogo: (
      <div className="flex items-center gap-2 font-bold text-base sm:text-lg tracking-tight">
        <span className="text-blue-400 font-black tracking-tight">WorknAI</span>
        <span className="rounded-md bg-purple-600/30 border border-purple-500/40 px-2 py-0.5 text-xs sm:text-sm font-extrabold text-purple-300 uppercase">
          CRM
        </span>
      </div>
    ),
  },
  {
    id: "shiftride",
    name: "ShiftRide",
    website: "https://shiftride.in",
    renderLogo: (
      <div className="flex items-center gap-2 font-black text-lg sm:text-xl tracking-tight text-white">
        <span className="text-amber-400 font-black italic">⚡ Shift</span>
        <span className="text-zinc-200 font-extrabold">Ride</span>
      </div>
    ),
  },
  {
    id: "goairclass",
    name: "GoAirClass",
    website: "https://goairclass.com",
    renderLogo: (
      <div className="flex items-center gap-2.5 font-bold text-lg sm:text-xl tracking-tight text-white">
        <svg className="w-6 h-6 text-sky-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        <span className="font-extrabold">GoAir<span className="text-sky-400 font-black">Class</span></span>
      </div>
    ),
  },
  {
    id: "itjibx",
    name: "ITJIBX",
    website: "https://itjobx.com",
    renderLogo: (
      <div className="flex items-center gap-2 font-mono font-black text-lg sm:text-xl tracking-wide text-emerald-400">
        <span className="text-zinc-500 font-bold">&lt;</span>
        <span className="font-extrabold text-emerald-400">ITJIBX</span>
        <span className="text-zinc-500 font-bold">/&gt;</span>
      </div>
    ),
  },
  {
    id: "raktdaan",
    name: "Raktdaan",
    website: "https://raktdaan.online",
    renderLogo: (
      <div className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight text-white">
        <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-xs text-white font-black shadow-[0_0_12px_rgba(239,68,68,0.8)]">
          +
        </div>
        <span className="text-red-500 font-black">Rakt</span>
        <span className="text-white font-bold">daan</span>
      </div>
    ),
  },
];

export default function Stories() {
  const [brands, setBrands] = useState<Brand[]>(defaultBrands);

  // Fetch live clients from backend and dynamically merge their official website URLs
  useEffect(() => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";
    fetch(`${apiBase}/clients`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          const dbClients: any[] = json.data;

          // Merge live DB website URLs into default visual brands
          const mergedBrands = defaultBrands.map((defBrand) => {
            const cleanDefName = defBrand.name.toLowerCase().replace(/[^a-z0-9]/g, "");
            const match = dbClients.find((c) => {
              const cleanDbName = c.name.toLowerCase().replace(/[^a-z0-9]/g, "");
              return cleanDbName === cleanDefName || cleanDefName.includes(cleanDbName) || cleanDbName.includes(cleanDefName);
            });

            return {
              ...defBrand,
              website: match?.website || defBrand.website,
            };
          });

          // Check if there are completely new custom clients created in Admin CMS not in default
          const extraClients: Brand[] = dbClients
            .filter((c) => {
              const cleanDbName = c.name.toLowerCase().replace(/[^a-z0-9]/g, "");
              return !defaultBrands.some((def) => {
                const cleanDef = def.name.toLowerCase().replace(/[^a-z0-9]/g, "");
                return cleanDef === cleanDbName || cleanDef.includes(cleanDbName);
              });
            })
            .map((c) => ({
              id: String(c.id),
              name: c.name,
              website: c.website,
              logo: c.logo,
              renderLogo: c.logo ? (
                <img src={c.logo} alt={c.name} className="h-8 max-w-[110px] object-contain" />
              ) : (
                <span className="font-bold text-base sm:text-lg text-white">{c.name}</span>
              ),
            }));

          setBrands([...mergedBrands, ...extraClients]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="mt-20">
      {/* Header with blue left border accent matching reference image */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="border-l-4 border-blue-500 pl-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trending Brands
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Trusted across our media ecosystem & digital ventures (Click to explore)
          </p>
        </div>

        <Link
          href="/dashboard/clients"
          className="group flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition"
        >
          <span>Manage Brands</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Infinite Brand Marquee with edge gradient fade and hover-pause matching motion spec */}
      <div className="relative overflow-hidden py-4 sm:py-6">
        {/* Subtle Edge Fade Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-[#02040a] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-[#02040a] to-transparent z-10" />

        <div className="animate-marquee flex items-center gap-5 sm:gap-6">
          {[...brands, ...brands].map((brand, idx) => (
            <a
              key={`${brand.id}-${idx}`}
              href={brand.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              title={`Visit ${brand.name} → ${brand.website || ""}`}
              className="group flex h-[76px] sm:h-[84px] min-w-[175px] sm:min-w-[200px] flex-shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] px-6 sm:px-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:bg-white/10 hover:shadow-[0_0_28px_rgba(59,130,246,0.35)] cursor-pointer select-none"
            >
              {brand.renderLogo || (
                <span className="font-extrabold text-lg sm:text-xl text-white">{brand.name}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from "react";
import { motion } from "framer-motion";
import { Layers, Sparkles, CheckCircle2, FileEdit } from "lucide-react";

interface ServicesStatsProps {
  stats: {
    totalServices: number;
    publishedServices: number;
    draftServices: number;
    featuredServices: number;
  };
}

export default function ServicesStats({ stats }: ServicesStatsProps) {
  const cards = [
    {
      id: "total",
      label: "Total Solutions",
      value: stats.totalServices,
      icon: Layers,
      color: "text-blue-400",
      glowColor: "from-blue-600/20 to-indigo-600/10",
      border: "border-blue-500/20",
      badge: "Full Catalogue",
    },
    {
      id: "published",
      label: "Live on Website",
      value: stats.publishedServices,
      icon: CheckCircle2,
      color: "text-emerald-400",
      glowColor: "from-emerald-600/20 to-teal-600/10",
      border: "border-emerald-500/20",
      badge: "Public Deliverables",
    },
    {
      id: "featured",
      label: "Featured Highlights",
      value: stats.featuredServices,
      icon: Sparkles,
      color: "text-cyan-400",
      glowColor: "from-cyan-600/20 to-blue-600/10",
      border: "border-cyan-500/20",
      badge: "Spotlight Priority",
    },
    {
      id: "drafts",
      label: "Draft Solutions",
      value: stats.draftServices,
      icon: FileEdit,
      color: "text-amber-400",
      glowColor: "from-amber-600/20 to-yellow-600/10",
      border: "border-amber-500/20",
      badge: "In Staging",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-2xl border ${card.border} bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}
          >
            {/* Ambient Background Gradient Glow */}
            <div
              className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${card.glowColor} blur-2xl`}
            />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                {card.label}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="relative z-10 mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black tracking-tight text-white font-mono">
                {card.value}
              </span>
              <span className="text-[10px] font-medium text-zinc-500">
                {card.badge}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

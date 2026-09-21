"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock, TrendingUp, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { InsightItem } from "./data";

interface AIInsightsProps {
  insights: InsightItem[];
}

export default function AIInsights({ insights }: AIInsightsProps) {
  const getIcon = (type: InsightItem["type"]) => {
    switch (type) {
      case "timing":
        return <Clock className="h-4 w-4" />;
      case "platform":
        return <TrendingUp className="h-4 w-4" />;
      case "frequency":
        return <Zap className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              AI Algorithmic Insights & Recommendations
            </h3>
            <p className="text-[11px] text-zinc-400">
              Autonomous machine learning signals detected across multi-brand audience engagement
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          3 Active Signals
        </span>
      </div>

      {/* 3 Mapped Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {insights.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl transition-all duration-300 hover:border-purple-500/40 hover:bg-white/[0.06] hover:shadow-[0_10px_35px_rgba(168,85,247,0.15)]"
          >
            {/* Top row: Icon + Impact Badge */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-purple-400 group-hover:border-purple-500/30 group-hover:text-white transition-colors">
                  {getIcon(item.type)}
                </div>

                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md ${item.badgeColor}`}
                >
                  {item.impact}
                </span>
              </div>

              {/* Title & Narrative */}
              <h4 className="mt-3.5 text-sm font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                {item.title}
              </h4>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Recommended Action Callout */}
            <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-[11px]">
              <span className="font-bold text-zinc-400 block mb-1">
                Recommended Action:
              </span>
              <p className="text-zinc-200 font-medium leading-normal flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item.recommendedAction}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

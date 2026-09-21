"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { KPIData } from "./data";

interface KPIGridProps {
  kpis: KPIData[];
}

function useCountUp(endVal: number, duration: number = 1600, trigger: boolean = true) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTimestamp: number | null = null;
    let reqId: number;

    const step = (now: number) => {
      if (!startTimestamp) startTimestamp = now;
      const progress = Math.min((now - startTimestamp) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(ease * endVal);

      if (progress < 1) {
        reqId = requestAnimationFrame(step);
      }
    };

    reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  }, [endVal, duration, trigger]);

  return val;
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 40;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });

  const polylineStr = points.join(" ");
  const fillPath = `M 0,${height} L ${points.join(" L ")} L ${width},${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#grad-${color})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polylineStr}
      />
      {/* End point glow */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].split(",")[0]}
          cy={points[points.length - 1].split(",")[1]}
          r="3"
          fill={color}
          className="animate-pulse"
        />
      )}
    </svg>
  );
}

function KPICard({ item, index }: { item: KPIData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Determine display number
  let displayTarget = item.value;
  if (item.suffix === "M") {
    displayTarget = item.value / 1000000;
  } else if (item.suffix === "K") {
    displayTarget = item.value / 1000;
  }

  const animatedVal = useCountUp(displayTarget, 1600, inView);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
    >
      {/* Cursor-tracked ambient radial glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[26px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${item.glowColor}, transparent 70%)`,
        }}
      />

      {/* Top row: Title + percentage growth badge */}
      <div className="relative flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          {item.title}
        </span>

        <div className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          <span>+{item.change}%</span>
        </div>
      </div>

      {/* Main Stat & Sparkline Row */}
      <div className="relative mt-4 flex items-end justify-between gap-2">
        <div>
          <div className="flex items-baseline font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
            {item.prefix && <span>{item.prefix}</span>}
            <span>
              {item.decimals !== undefined && item.decimals > 0
                ? animatedVal.toFixed(item.decimals)
                : Math.round(animatedVal).toLocaleString()}
            </span>
            {item.suffix && (
              <span className="ml-0.5 text-lg font-bold text-zinc-400">
                {item.suffix}
              </span>
            )}
          </div>
          <span className="mt-1 block text-[11px] text-zinc-500">
            vs. previous 30-day cycle
          </span>
        </div>

        {/* Mini Sparkline graph */}
        <div className="shrink-0">
          <MiniSparkline data={item.sparkline} color={item.color} />
        </div>
      </div>
    </motion.div>
  );
}

export default function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <KPICard key={kpi.id} item={kpi} index={index} />
      ))}
    </div>
  );
}

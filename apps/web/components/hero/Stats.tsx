
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plane, Film, Brain, Users } from "lucide-react";

function Counter({
  value,
  suffix = "",
  decimals = 0,
  duration = 1.5,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // easeOutExpo for premium fluid deceleration
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(ease * value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();
  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
}

const stats = [
  {
    title: "Projects",
    num: 12,
    suffix: "+",
    decimals: 0,
    subtitle: "Global Integrations",
    icon: Plane,
    color: "from-blue-600 to-cyan-500",
  },
  {
    title: "Reels",
    num: 148,
    suffix: "",
    decimals: 0,
    subtitle: "Creator Stories",
    icon: Film,
    color: "from-indigo-600 to-blue-500",
  },
  {
    title: "AI Posts",
    num: 2.8,
    suffix: "K",
    decimals: 1,
    subtitle: "Smart Insights",
    icon: Brain,
    color: "from-purple-600 to-indigo-500",
  },
  {
    title: "Clients",
    num: 86,
    suffix: "",
    decimals: 0,
    subtitle: "Business Partners",
    icon: Users,
    color: "from-cyan-600 to-teal-500",
  },
];

export default function Stats() {
  return (
    <div className="relative mt-20">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40 text-left flex items-center gap-4"
            >
              <div
                className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex-shrink-0`}
              >
                <div className="h-full w-full rounded-[14px] bg-[#050816]/70 backdrop-blur-sm flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-zinc-400">{item.title}</p>
                <h3 className="mt-0.5 text-2xl sm:text-3xl font-black text-white">
                  <Counter
                    value={item.num}
                    suffix={item.suffix}
                    decimals={item.decimals}
                    duration={1.5}
                  />
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">{item.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Handwritten "Explore More" arrow on the right matching reference */}
      <div className="hidden xl:flex absolute -right-24 top-1/2 -translate-y-1/2 flex-col items-center pointer-events-none opacity-80">
        <span className="font-serif italic text-sm text-zinc-400 rotate-[-12deg] tracking-wide">
          Explore
          <br />
          More
        </span>
        <svg
          className="w-10 h-10 text-zinc-400 -mt-1 rotate-12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  );
}
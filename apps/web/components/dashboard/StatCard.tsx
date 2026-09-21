"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Props = {
  title: string;
  value: string;
  icon: string;
  color: string;
  delay: number;
};

// Helper to parse numeric, prefix, suffix, and decimal precision from value string dynamically
function parseValueString(val: string) {
  const match = val.match(/^([^\d.]*)([\d.]+)(.*)$/);
  if (!match) return { prefix: "", num: 0, suffix: val, decimals: 0 };
  const prefix = match[1] || "";
  const numStr = match[2];
  const suffix = match[3] || "";
  const num = parseFloat(numStr) || 0;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { prefix, num, suffix, decimals };
}

export default function StatCard({
  title,
  value,
  icon,
  color,
  delay,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-20px" });

  const { prefix, num, suffix, decimals } = parseValueString(value);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1600; // ms
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo for ultra-smooth deceleration
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayCount(ease * num);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayCount(num);
      }
    };

    // Align count-up start with the card stagger delay
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, num, delay]);

  const formattedValue =
    prefix +
    (decimals > 0 ? displayCount.toFixed(decimals) : Math.round(displayCount).toString()) +
    suffix;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center text-2xl`}
      >
        {icon}
      </div>

      <h2 className="mt-5 text-4xl font-bold font-mono">{formattedValue}</h2>

      <p className="text-gray-400 mt-1">{title}</p>
    </motion.div>
  );
}
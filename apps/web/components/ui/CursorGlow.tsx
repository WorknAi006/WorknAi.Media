"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Raw cursor position motion values
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Ambient background glow spring
  const ambientSpring = { damping: 30, stiffness: 180, mass: 0.8 };
  const ambientX = useSpring(mouseX, ambientSpring);
  const ambientY = useSpring(mouseY, ambientSpring);

  // Smooth trailing outer orb physics
  const trailingSpring = { damping: 22, stiffness: 180, mass: 0.6 };
  const trailX = useSpring(mouseX, trailingSpring);
  const trailY = useSpring(mouseY, trailingSpring);

  // Precise inner dot physics (snappy follow)
  const dotSpring = { damping: 38, stiffness: 500, mass: 0.15 };
  const dotX = useSpring(mouseX, dotSpring);
  const dotY = useSpring(mouseY, dotSpring);

  useEffect(() => {
    if (!isLandingPage) return;

    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest("button, a, input, textarea, select, [role='button'], .cursor-pointer");
        setIsHovered(!!interactive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible, isLandingPage]);

  if (!mounted || !isLandingPage) return null;

  return (
    <>
      {/* 1. Large Ambient Background Aurora Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          style={{
            x: ambientX,
            y: ambientY,
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(139,92,246,0.12) 45%, transparent 70%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ opacity: { duration: 0.3 } }}
          className="pointer-events-none absolute h-[650px] w-[650px] rounded-full blur-[120px] will-change-transform transform-gpu"
        />
      </div>

      {/* 2. Custom Glowing Orb Cursor with Smooth Trailing Effect (Desktop only) */}
      <div
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block"
        aria-hidden="true"
      >
        {/* Outer Trailing Glowing Ring */}
        <motion.div
          style={{
            x: trailX,
            y: trailY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            scale: isHovered ? 1.6 : 1,
          }}
          transition={{
            scale: { type: "spring", stiffness: 350, damping: 25 },
            opacity: { duration: 0.2 },
          }}
          className={`pointer-events-none absolute rounded-full border transition-colors duration-200 will-change-transform transform-gpu ${
            isHovered
              ? "h-10 w-10 border-blue-400/80 bg-blue-500/15 shadow-[0_0_25px_rgba(59,130,246,0.6)]"
              : "h-8 w-8 border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_18px_rgba(34,211,238,0.45)]"
          }`}
        />

        {/* Inner Glowing Core Dot */}
        <motion.div
          style={{
            x: dotX,
            y: dotY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            scale: isHovered ? 0.75 : 1,
          }}
          transition={{ opacity: { duration: 0.2 } }}
          className="pointer-events-none absolute h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)] will-change-transform transform-gpu"
        />
      </div>
    </>
  );
}

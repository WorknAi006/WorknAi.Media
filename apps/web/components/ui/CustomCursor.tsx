"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on public landing page (/); normal arrow cursor everywhere else (admin, dashboard)
    if (!isLandingPage) {
      document.documentElement.classList.remove("cursor-none");
      document.body.classList.remove("cursor-none");
      return;
    }

    // Check if device has a fine pointer (mouse), not touch-only
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    // Hide default system cursor ONLY on landing page
    document.documentElement.classList.add("cursor-none");
    document.body.classList.add("cursor-none");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Mouse coordinates
    let mouseX = -100;
    let mouseY = -100;
    let isVisible = false;
    let isHovered = false;

    // Current interpolated positions
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;

    // Ring size interpolation for smooth expansion on hover
    let currentRingSize = 36;
    let targetRingSize = 36;

    let animFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      // Check if hovering over interactive targets
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "button, a, input, textarea, select, [role='button'], .cursor-pointer, [class*='card'], [class*='Card']"
        );
        isHovered = !!interactive;
        targetRingSize = isHovered ? 52 : 36;
      }
    };

    const onMouseDown = () => {
      targetRingSize = isHovered ? 44 : 28;
    };

    const onMouseUp = () => {
      targetRingSize = isHovered ? 52 : 36;
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    // Smooth 60fps RAF loop with trailing lerp physics (Zero React re-renders)
    const loop = () => {
      // Snappy follow for center dot (16px)
      dotX += (mouseX - dotX) * 0.38;
      dotY += (mouseY - dotY) * 0.38;

      // Trailing follow for outer ring (slight delay)
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      // Smooth size expansion for outer ring
      currentRingSize += (targetRingSize - currentRingSize) * 0.2;

      // Apply GPU-accelerated translate3d
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) ${
        isHovered ? "scale(1.2)" : "scale(1)"
      }`;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      ring.style.width = `${currentRingSize}px`;
      ring.style.height = `${currentRingSize}px`;

      if (isHovered) {
        ring.style.borderColor = "rgba(0, 240, 255, 0.9)";
        ring.style.boxShadow = "0 0 25px rgba(0, 240, 255, 0.6), inset 0 0 12px rgba(0, 240, 255, 0.3)";
        dot.style.boxShadow = "0 0 22px rgba(0, 240, 255, 1), 0 0 10px rgba(255, 255, 255, 0.9)";
      } else {
        ring.style.borderColor = "rgba(0, 240, 255, 0.4)";
        ring.style.boxShadow = "0 0 15px rgba(0, 240, 255, 0.25)";
        dot.style.boxShadow = "0 0 14px rgba(0, 240, 255, 0.8)";
      }

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      cancelAnimationFrame(animFrameId);
      document.documentElement.classList.remove("cursor-none");
      document.body.classList.remove("cursor-none");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isLandingPage]);

  if (!isLandingPage) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none hidden md:block"
      aria-hidden="true"
    >
      {/* Outer Ring: 36px default -> 52px on hover with blur & screen blending */}
      <div
        ref={ringRef}
        style={{
          width: "36px",
          height: "36px",
          opacity: 0,
          willChange: "transform, width, height",
        }}
        className="pointer-events-none fixed left-0 top-0 rounded-full border border-cyan-400/40 bg-cyan-400/10 backdrop-blur-[2px] shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-opacity duration-200 mix-blend-screen transform-gpu"
      />

      {/* Main Cursor: 16px glowing cyan/blue orb */}
      <div
        ref={dotRef}
        style={{
          width: "16px",
          height: "16px",
          opacity: 0,
          willChange: "transform",
        }}
        className="pointer-events-none fixed left-0 top-0 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-300 to-blue-500 shadow-[0_0_14px_rgba(0,240,255,0.8)] transition-opacity duration-200 mix-blend-screen transform-gpu"
      />
    </div>
  );
}

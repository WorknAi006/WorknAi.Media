"use client";

import React, { useEffect, useRef } from "react";
import { LOOP_DURATION_SECONDS, videoProjectsConfig, globalHubNodes } from "./data";

export default function HeroVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let startTime: number | null = null;

    // Handle high-DPI scaling (up to 4K responsive)
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for optimal 60fps
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate static deep-space starfield
    const STAR_COUNT = 160;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 3 + 1,
    }));

    // Generate floating neural particles
    const PARTICLE_COUNT = 45;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      orbitAngle: Math.random() * Math.PI * 2,
      orbitRadius: 180 + Math.random() * 260,
      orbitSpeed: (Math.random() * 0.6 + 0.7) * (Math.random() > 0.5 ? 1 : -1),
      yOffset: (Math.random() - 0.5) * 120,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? "#00F0FF" : "#8B5CF6",
    }));

    // History trail for Online Go airplane contrail
    const airplaneTrail: { x: number; y: number; alpha: number }[] = [];
    const MAX_TRAIL_LENGTH = 55;

    // Render loop
    const render = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000;
      // Seamless normalized loop progress [0, 1] over 14.0 seconds
      const loopProgress = (elapsed % LOOP_DURATION_SECONDS) / LOOP_DURATION_SECONDS;
      const loopAngle = loopProgress * Math.PI * 2;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Subtle cinematic camera drift (smooth breathing scale)
      const cameraScale = 1 + Math.sin(loopAngle) * 0.035;
      const cameraPanY = Math.sin(loopAngle) * (height * 0.012);

      ctx.save();
      ctx.translate(cx, cy + cameraPanY);
      ctx.scale(cameraScale, cameraScale);
      ctx.translate(-cx, -cy);

      // 1. Deep Space Navy & Midnight Canvas
      const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, width * 0.75);
      bgGrad.addColorStop(0, "#070E24");
      bgGrad.addColorStop(0.45, "#04091A");
      bgGrad.addColorStop(0.85, "#02050E");
      bgGrad.addColorStop(1, "#010206");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Starfield with Twinkle
      stars.forEach((star) => {
        const sx = star.x * width;
        const sy = star.y * height;
        const twinkle = Math.sin(elapsed * star.twinkleSpeed + star.x * 10) * 0.25 + 0.75;
        ctx.fillStyle = `rgba(224, 242, 254, ${star.alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Volumetric Atmospheric Earth Glow (Center Backdrop)
      const earthRadius = Math.min(width, height) * 0.22;
      const atmosGlow = ctx.createRadialGradient(cx, cy, earthRadius * 0.6, cx, cy, earthRadius * 1.9);
      atmosGlow.addColorStop(0, "rgba(0, 240, 255, 0.16)");
      atmosGlow.addColorStop(0.4, "rgba(59, 130, 246, 0.12)");
      atmosGlow.addColorStop(0.7, "rgba(139, 92, 246, 0.05)");
      atmosGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = atmosGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadius * 1.9, 0, Math.PI * 2);
      ctx.fill();

      // 4. Rotating Digital Earth Wireframe & Meridians
      const earthRotation = loopAngle; // 1 full 360 rotation per 14s

      // Earth Body Dark Sphere Core
      const earthSphereGrad = ctx.createRadialGradient(
        cx - earthRadius * 0.35,
        cy - earthRadius * 0.35,
        earthRadius * 0.1,
        cx,
        cy,
        earthRadius
      );
      earthSphereGrad.addColorStop(0, "#0D1B3E");
      earthSphereGrad.addColorStop(0.65, "#060B1C");
      earthSphereGrad.addColorStop(1, "#02050E");
      ctx.fillStyle = earthSphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Earth Longitude Ellipses (rotating)
      const meridianCount = 10;
      ctx.lineWidth = 1;
      for (let i = 0; i < meridianCount; i++) {
        const offset = (i / meridianCount) * Math.PI + earthRotation;
        const currentWidth = Math.cos(offset) * earthRadius;
        const isFacing = Math.sin(offset) > 0;

        ctx.strokeStyle = isFacing ? "rgba(56, 189, 248, 0.25)" : "rgba(30, 58, 138, 0.12)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(currentWidth), earthRadius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Earth Latitude Rings
      const latitudes = [-0.65, -0.35, 0, 0.35, 0.65];
      latitudes.forEach((latRatio) => {
        const r = Math.sqrt(1 - latRatio * latRatio) * earthRadius;
        const yPos = cy + latRatio * earthRadius;
        ctx.strokeStyle = "rgba(56, 189, 248, 0.18)";
        ctx.beginPath();
        ctx.ellipse(cx, yPos, r, r * 0.22, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Digital Continents (clusters of luminous particle points on globe)
      const dotCount = 80;
      for (let i = 0; i < dotCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / dotCount);
        const theta = Math.sqrt(dotCount * Math.PI) * phi + earthRotation;

        // 3D to 2D projection on globe
        const gx = Math.cos(theta) * Math.sin(phi);
        const gy = Math.cos(phi);
        const gz = Math.sin(theta) * Math.sin(phi);

        if (gz > 0) { // Only render front-facing side
          const projX = cx + gx * earthRadius;
          const projY = cy + gy * earthRadius;
          const brightness = gz * 0.85;

          ctx.fillStyle = `rgba(0, 240, 255, ${brightness})`;
          ctx.beginPath();
          ctx.arc(projX, projY, 1.4 * gz + 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. PG Info Smart Building Hubs & Network Beacons on Globe
      globalHubNodes.forEach((node) => {
        const nodeRot = node.lon + earthRotation;
        const nx = Math.cos(nodeRot) * Math.cos(node.lat);
        const ny = Math.sin(node.lat);
        const nz = Math.sin(nodeRot) * Math.cos(node.lat);

        if (nz > 0.1) {
          const px = cx + nx * earthRadius;
          const py = cy + ny * earthRadius;
          const pulse = Math.sin(elapsed * 4 + node.pulsePhase) * 0.4 + 0.6;

          // Glowing Node Ring
          ctx.strokeStyle = `rgba(245, 158, 11, ${pulse * nz})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, node.size + pulse * 3, 0, Math.PI * 2);
          ctx.stroke();

          // Core Light
          ctx.fillStyle = `rgba(255, 237, 213, ${nz})`;
          ctx.beginPath();
          ctx.arc(px, py, node.size * 0.6, 0, Math.PI * 2);
          ctx.fill();

          // Vertical Smart Building Beacon Light Beam (rising outward from planet)
          const beamLength = 28 * nz;
          const bx = px + nx * beamLength;
          const by = py + ny * beamLength;

          const beamGrad = ctx.createLinearGradient(px, py, bx, by);
          beamGrad.addColorStop(0, "rgba(245, 158, 11, 0.8)");
          beamGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
          ctx.strokeStyle = beamGrad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      });

      // 6. GoLogix Autonomous Coach on Terrestrial Illuminated Route Line
      const routeAngle = earthRotation * 1.5;
      const rx = cx + Math.cos(routeAngle) * (earthRadius * 1.02);
      const ry = cy + Math.sin(routeAngle * 0.8) * (earthRadius * 0.6);

      // Glowing route arc
      ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, earthRadius * 1.08, earthRadius * 0.55, 0.3, 0, Math.PI * 2);
      ctx.stroke();

      // GoLogix Coach dot with glow & headlight beam
      ctx.fillStyle = "#10B981";
      ctx.shadowColor = "#10B981";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Headlight sweep
      const hx = rx + Math.cos(routeAngle + 0.2) * 22;
      const hy = ry + Math.sin(routeAngle + 0.2) * 22;
      const coachLight = ctx.createLinearGradient(rx, ry, hx, hy);
      coachLight.addColorStop(0, "rgba(52, 211, 153, 0.7)");
      coachLight.addColorStop(1, "rgba(52, 211, 153, 0)");
      ctx.strokeStyle = coachLight;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(hx, hy);
      ctx.stroke();

      // 7. WorknAI Holographic AI Interface & Orbital Data Rings
      const holoRadiusX = earthRadius * 1.55;
      const holoRadiusY = earthRadius * 0.68;
      const holoAngle = -0.4; // tilt

      // Outer holographic data ring
      ctx.strokeStyle = "rgba(168, 85, 247, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, holoRadiusX, holoRadiusY, holoAngle, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Inner data ring counter-rotating
      ctx.strokeStyle = "rgba(236, 72, 153, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, holoRadiusX * 0.85, holoRadiusY * 0.85, holoAngle - 0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Floating holographic UI panels along orbit
      const panelCount = 3;
      for (let p = 0; p < panelCount; p++) {
        const pTheta = loopAngle + (p * Math.PI * 2) / panelCount;
        const panelX = cx + Math.cos(pTheta) * holoRadiusX;
        const panelY = cy + Math.sin(pTheta) * holoRadiusY;
        const pScale = (Math.sin(pTheta) + 1.2) * 0.45; // Depth scaling

        // Glass UI telemetry panel
        ctx.fillStyle = "rgba(168, 85, 247, 0.12)";
        ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(panelX - 18 * pScale, panelY - 12 * pScale, 36 * pScale, 24 * pScale, 4 * pScale);
        ctx.fill();
        ctx.stroke();

        // Mini telemetry lines inside panel
        ctx.fillStyle = "rgba(216, 180, 254, 0.8)";
        ctx.fillRect(panelX - 12 * pScale, panelY - 5 * pScale, 18 * pScale, 2 * pScale);
        ctx.fillRect(panelX - 12 * pScale, panelY + 1 * pScale, 24 * pScale, 2 * pScale);
      }

      // 8. Online Go Airplane Orbiting with Cyan Light Ribbon Contrail
      const planeRadiusX = earthRadius * 1.38;
      const planeRadiusY = earthRadius * 0.52;
      const planeTilt = -0.38;

      // Current plane position along smooth elliptical orbit
      const planeTheta = loopAngle; // 1 full revolution per 14s loop
      const rawPlaneX = Math.cos(planeTheta) * planeRadiusX;
      const rawPlaneY = Math.sin(planeTheta) * planeRadiusY;

      // Apply tilt rotation matrix
      const planeX = cx + rawPlaneX * Math.cos(planeTilt) - rawPlaneY * Math.sin(planeTilt);
      const planeY = cy + rawPlaneX * Math.sin(planeTilt) + rawPlaneY * Math.cos(planeTilt);

      // Add to trail history
      airplaneTrail.unshift({ x: planeX, y: planeY, alpha: 1.0 });
      if (airplaneTrail.length > MAX_TRAIL_LENGTH) {
        airplaneTrail.pop();
      }

      // Render Soft Cyan Light Ribbon Trail
      if (airplaneTrail.length > 2) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let t = 0; t < airplaneTrail.length - 1; t++) {
          const p1 = airplaneTrail[t];
          const p2 = airplaneTrail[t + 1];
          const progressDecay = 1 - t / airplaneTrail.length;

          ctx.strokeStyle = `rgba(0, 240, 255, ${progressDecay * 0.8})`;
          ctx.lineWidth = Math.max(1, 4 * progressDecay);
          ctx.shadowColor = "#00F0FF";
          ctx.shadowBlur = 10 * progressDecay;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        ctx.shadowBlur = 0; // reset shadow
      }

      // Render Airplane Icon Glyph
      // Velocity vector for heading angle
      const nextTheta = planeTheta + 0.05;
      const nextRawX = Math.cos(nextTheta) * planeRadiusX;
      const nextRawY = Math.sin(nextTheta) * planeRadiusY;
      const nextX = cx + nextRawX * Math.cos(planeTilt) - nextRawY * Math.sin(planeTilt);
      const nextY = cy + nextRawX * Math.sin(planeTilt) + nextRawY * Math.cos(planeTilt);
      const headingAngle = Math.atan2(nextY - planeY, nextX - planeX);

      ctx.save();
      ctx.translate(planeX, planeY);
      ctx.rotate(headingAngle);

      // Stylized Sleek Jet Silhouette
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      // Fuselage & Wings
      ctx.moveTo(10, 0);
      ctx.lineTo(-4, -8);
      ctx.lineTo(-2, -2);
      ctx.lineTo(-8, -4);
      ctx.lineTo(-10, -1);
      ctx.lineTo(-7, 0);
      ctx.lineTo(-10, 1);
      ctx.lineTo(-8, 4);
      ctx.lineTo(-2, 2);
      ctx.lineTo(-4, 8);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      // 9. Floating Neural Particles Drift
      particles.forEach((pt) => {
        const pTheta = pt.orbitAngle + elapsed * pt.orbitSpeed * 0.15;
        const px = cx + Math.cos(pTheta) * pt.orbitRadius;
        const py = cy + Math.sin(pTheta) * (pt.orbitRadius * 0.5) + pt.yOffset;
        const pAlpha = (Math.sin(elapsed * 2 + pt.orbitAngle) * 0.3 + 0.7) * 0.8;

        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = pAlpha;
        ctx.beginPath();
        ctx.arc(px, py, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      });

      // 10. Earth Atmosphere Rim Fresnel Halo (Foreground Limb)
      ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 11. Center Negative Space Gradient for Headline Readability
      const centerMask = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.5);
      centerMask.addColorStop(0, "rgba(5, 8, 22, 0.72)");
      centerMask.addColorStop(0.4, "rgba(5, 8, 22, 0.55)");
      centerMask.addColorStop(0.8, "rgba(5, 8, 22, 0.15)");
      centerMask.addColorStop(1, "rgba(5, 8, 22, 0.0)");
      ctx.fillStyle = centerMask;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover will-change-transform transform-gpu"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

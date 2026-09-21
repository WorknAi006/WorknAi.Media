import { OrbitingProject, NetworkNode } from "./types";

export const LOOP_DURATION_SECONDS = 14; // Seamless 14-second loop cycle

export const videoProjectsConfig: OrbitingProject[] = [
  {
    id: "online-go",
    name: "Online Go",
    icon: "✈️",
    color: "#00F0FF",
    glowColor: "rgba(0, 240, 255, 0.8)",
    orbitRadiusX: 380,
    orbitRadiusY: 140,
    tiltAngle: -22,
    speed: 1, // 1 complete cycle in 14s
  },
  {
    id: "gologix",
    name: "GoLogix",
    icon: "🚌",
    color: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.8)",
    orbitRadiusX: 310,
    orbitRadiusY: 90,
    tiltAngle: 18,
    speed: 1,
  },
  {
    id: "pg-info",
    name: "PG Info",
    icon: "🏠",
    color: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.8)",
    orbitRadiusX: 250,
    orbitRadiusY: 170,
    tiltAngle: -6,
    speed: 1,
  },
  {
    id: "worknai",
    name: "WorknAI",
    icon: "🤖",
    color: "#A855F7",
    glowColor: "rgba(168, 85, 247, 0.8)",
    orbitRadiusX: 430,
    orbitRadiusY: 190,
    tiltAngle: 35,
    speed: 1,
  },
];

export const globalHubNodes: NetworkNode[] = [
  { lat: 0.35, lon: 0.12, size: 4, label: "Online Go Hub", pulsePhase: 0 },
  { lat: 0.42, lon: 0.85, size: 3.5, label: "GoLogix Route", pulsePhase: 1.2 },
  { lat: -0.15, lon: 0.45, size: 4, label: "PG Info Living", pulsePhase: 2.4 },
  { lat: 0.22, lon: -0.65, size: 5, label: "WorknAI Core", pulsePhase: 3.6 },
  { lat: -0.28, lon: -0.2, size: 3, label: "Tokyo Node", pulsePhase: 4.8 },
  { lat: 0.55, lon: -0.1, size: 3.5, label: "London Hub", pulsePhase: 5.4 },
];

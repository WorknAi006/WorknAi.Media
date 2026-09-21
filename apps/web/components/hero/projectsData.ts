export interface HeroProject {
  id: string;
  name: string;
  title?: string;
  video: string;
  category: string;
  tagline: string;
  description: string;
  animationType?: string;
  accent: {
    primary: string;
    text: string;
    badge: string;
    glow: string;
    gradient: string;
    border: string;
  };
  metrics: {
    stat: string;
    label: string;
  };
}

export type ProjectShowcaseItem = HeroProject;
export type ProjectAnimationType = string;

export const projects: HeroProject[] = [
  {
    id: "go",
    name: "Online Go",
    video: "/videos/go.mp4",
    category: "Travel & Smart Mobility",
    tagline: "Autonomous Airline Ticketing & Intercity Fleet Transit",
    description:
      "A unified travel infrastructure powering seamless flight reservations, private jet charters, and premium intercity coach mobility across 48+ metropolitan hubs.",
    accent: {
      primary: "#06B6D4",
      text: "text-cyan-400",
      badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
      glow: "shadow-[0_0_30px_rgba(6,182,212,0.25)]",
      gradient: "from-cyan-400 via-blue-500 to-indigo-600",
      border: "border-cyan-500/40",
    },
    metrics: {
      stat: "1.4M+",
      label: "Active Passengers Dispatched",
    },
  },
  {
    id: "logix",
    name: "GoLogix",
    video: "/videos/logix.mp4",
    category: "Autonomous Freight & Logistics",
    tagline: "Dynamic Cross-Border Fleet Routing & Telematics",
    description:
      "Enterprise supply chain intelligence automating heavy vehicle dispatch, warehouse robotics, and temperature-controlled freight logistics with real-time GPS tracking.",
    accent: {
      primary: "#10B981",
      text: "text-emerald-400",
      badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      glow: "shadow-[0_0_30px_rgba(16,185,129,0.25)]",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      border: "border-emerald-500/40",
    },
    metrics: {
      stat: "99.8%",
      label: "On-Time Dispatch Velocity",
    },
  },
  {
    id: "pg",
    name: "PG Info",
    video: "/videos/pg.mp4",
    category: "Premium Real Estate & Living",
    tagline: "Architectural Penthouse Living & IoT Automation",
    description:
      "High-end residential ecosystem connecting luxury serviced suites, biometric entry systems, and automated ambient living controls for modern urban professionals.",
    accent: {
      primary: "#F59E0B",
      text: "text-amber-400",
      badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      glow: "shadow-[0_0_30px_rgba(245,158,11,0.25)]",
      gradient: "from-amber-400 via-orange-500 to-rose-600",
      border: "border-amber-500/40",
    },
    metrics: {
      stat: "450+",
      label: "Smart Luxury Suites",
    },
  },
  {
    id: "ai",
    name: "WorknAI",
    video: "/videos/worknai.mp4",
    category: "AI Media Operating System",
    tagline: "Holographic Neural Mesh & Multimodal Generation",
    description:
      "The all-in-one AI production control plane orchestrating viral video scripts, photorealistic image diffusion, automated scheduling, and multi-brand analytics.",
    accent: {
      primary: "#A855F7",
      text: "text-purple-400",
      badge: "border-purple-500/30 bg-purple-500/10 text-purple-300",
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.25)]",
      gradient: "from-purple-400 via-pink-500 to-indigo-600",
      border: "border-purple-500/40",
    },
    metrics: {
      stat: "10x",
      label: "Content Generation Velocity",
    },
  },
];

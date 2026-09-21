"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Video,
  Share2,
  Cpu,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Rocket,
  Wand2,
} from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  image: string;
  gradient: string;
  accentColor: string;
  glowColor: string;
  badge: string;
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
  deliverables: string[];
}

const SERVICES: ServiceItem[] = [
  {
    id: "video-production",
    title: "AI Video Production",
    subtitle: "Create. Edit. Scale with AI.",
    description:
      "Transform ideas into cinematic 4K reels with AI-powered editing, captions, smart cuts, and multi-platform publishing.",
    icon: Video,
    image: "/solutions/ai-video-production.jpg",
    gradient: "from-blue-500 to-cyan-400",
    accentColor: "text-cyan-400",
    glowColor: "rgba(6, 182, 212, 0.4)",
    badge: "Diffusion Studio",
    badgeBorder: "border-cyan-500/40",
    badgeBg: "bg-cyan-500/15",
    badgeText: "text-cyan-300",
    deliverables: [
      "4K Vertical Reel Production",
      "AI Script to Video",
      "Smart Captions & Cuts",
      "Multi-platform Export",
    ],
  },
  {
    id: "social-management",
    title: "Social Media Management",
    subtitle: "One Content. Unlimited Reach.",
    description:
      "Plan once, distribute everywhere, and grow your audience with real-time analytics across every social platform.",
    icon: Share2,
    image: "/solutions/social-media-management.jpg",
    gradient: "from-purple-500 via-fuchsia-500 to-cyan-400",
    accentColor: "text-purple-300",
    glowColor: "rgba(168, 85, 247, 0.4)",
    badge: "Omnichannel Growth",
    badgeBorder: "border-purple-500/40",
    badgeBg: "bg-purple-500/15",
    badgeText: "text-purple-300",
    deliverables: [
      "Automated Cross Posting",
      "Instagram • YouTube • LinkedIn",
      "Live Analytics Dashboard",
      "Engagement Optimization",
    ],
  },
  {
    id: "web-automation",
    title: "Web & AI Automation",
    subtitle: "Human Creativity. AI Execution.",
    description:
      "Automate content, workflows, scheduling, and analytics through one intelligent business ecosystem.",
    icon: Cpu,
    image: "/solutions/web-ai-automation.jpg",
    gradient: "from-blue-600 to-indigo-500",
    accentColor: "text-blue-400",
    glowColor: "rgba(59, 130, 246, 0.4)",
    badge: "Full-Stack Automation",
    badgeBorder: "border-blue-500/40",
    badgeBg: "bg-blue-500/15",
    badgeText: "text-blue-300",
    deliverables: [
      "AI Workflow Engine",
      "Web & App Automation",
      "Smart Scheduling",
      "Business Analytics",
    ],
  },
  {
    id: "growth-strategy",
    title: "Brand Growth Strategy",
    subtitle: "From Content to Revenue.",
    description:
      "Data-driven strategy that turns reach into leads, engagement into customers, and creativity into measurable growth.",
    icon: TrendingUp,
    image: "/solutions/brand-growth-strategy.jpg",
    gradient: "from-amber-400 to-orange-500",
    accentColor: "text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.4)",
    badge: "Growth Strategy",
    badgeBorder: "border-amber-500/40",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-300",
    deliverables: [
      "Audience Insights",
      "Conversion Funnel",
      "ROI Content Strategy",
      "Scalable Campaigns",
    ],
  },
];

function ServiceCard({
  service,
  index,
  isInView,
  onSelectService,
}: {
  service: ServiceItem;
  index: number;
  isInView: boolean;
  onSelectService: (serviceName: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const IconComponent = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex h-full min-h-[480px] flex-col justify-between overflow-hidden rounded-[28px] border border-white/15 bg-[#050816] p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02] hover:border-white/35 hover:shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
        style={{
          boxShadow: isHovered ? `0 0 50px ${service.glowColor}` : `0 10px 30px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Background Cinematic Image - Bright, High Opacity, Vibrant & Sharp */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover object-center opacity-90 group-hover:opacity-100 brightness-115 contrast-110 saturate-125 transition-all duration-700 ease-out group-hover:scale-105"
          />
          {/* Subtle directional gradient so text and HUD chips stand out while image shines brightly */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/60 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050816]/75 via-[#050816]/20 to-transparent" />
        </div>

        {/* Dynamic Cursor-Following Radial Glow on Hover */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${service.glowColor}, transparent 65%)`,
          }}
        />

        {/* Top Rim Glass Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative z-10">
          {/* Header row: Icon & Frosted Badge at top-right */}
          <div className="flex items-center justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} p-0.5 shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-transform duration-300 group-hover:scale-110`}
            >
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#050816]/90 backdrop-blur-md">
                <IconComponent className={`h-5 w-5 ${service.accentColor}`} />
              </div>
            </div>

            <span
              className={`rounded-full border ${service.badgeBorder} ${service.badgeBg} px-3.5 py-1.5 text-xs font-bold ${service.badgeText} backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
            >
              {service.badge}
            </span>
          </div>

          {/* Title & Tagline & Description with drop-shadows */}
          <div className="mt-6 space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {service.title}
            </h3>
            <p className={`text-xs sm:text-sm font-extrabold tracking-wider uppercase ${service.accentColor} drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`}>
              {service.subtitle}
            </p>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-200 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {service.description}
            </p>
          </div>

          {/* Core Capabilities List - Sleek Frosted HUD Chips */}
          <div className="mt-6 space-y-2.5 border-t border-white/15 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Core Capabilities
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {service.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#050816]/80 px-3 py-1.5 backdrop-blur-md text-xs text-white shadow-sm transition-colors hover:border-white/25"
                >
                  <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 ${service.accentColor}`} />
                  <span className="font-semibold tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button at Bottom */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15">
          <button
            onClick={() => onSelectService(service.title)}
            className="group/btn flex w-full items-center justify-between rounded-xl border border-white/20 bg-[#050816]/80 px-4 py-3 text-xs font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] active:scale-95"
          >
            <span className="tracking-wide">Request Directive & Scope</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const getIconComponent = (iconName?: string): React.ElementType => {
  switch (iconName?.toLowerCase()) {
    case "video":
      return Video;
    case "share2":
    case "share":
      return Share2;
    case "cpu":
      return Cpu;
    case "trendingup":
    case "trending":
      return TrendingUp;
    case "rocket":
      return Rocket;
    case "wand2":
    case "wand":
      return Wand2;
    case "layers":
      return Layers;
    default:
      return Sparkles;
  }
};

const THEME_PRESETS = [
  {
    gradient: "from-blue-500 to-cyan-400",
    accentColor: "text-cyan-400",
    glowColor: "rgba(6, 182, 212, 0.4)",
    badgeBorder: "border-cyan-500/40",
    badgeBg: "bg-cyan-500/15",
    badgeText: "text-cyan-300",
    image: "/solutions/ai-video-production.jpg",
  },
  {
    gradient: "from-purple-500 via-fuchsia-500 to-cyan-400",
    accentColor: "text-purple-300",
    glowColor: "rgba(168, 85, 247, 0.4)",
    badgeBorder: "border-purple-500/40",
    badgeBg: "bg-purple-500/15",
    badgeText: "text-purple-300",
    image: "/solutions/social-media-management.jpg",
  },
  {
    gradient: "from-blue-600 to-indigo-500",
    accentColor: "text-blue-400",
    glowColor: "rgba(59, 130, 246, 0.4)",
    badgeBorder: "border-blue-500/40",
    badgeBg: "bg-blue-500/15",
    badgeText: "text-blue-300",
    image: "/solutions/web-ai-automation.jpg",
  },
  {
    gradient: "from-amber-400 to-orange-500",
    accentColor: "text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.4)",
    badgeBorder: "border-amber-500/40",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-300",
    image: "/solutions/brand-growth-strategy.jpg",
  },
];

export default function Solutions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES);

  useEffect(() => {
    async function loadPublishedServices() {
      try {
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const apiBase = rawUrl ? (rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`) : "/api";
        const res = await fetch(`${apiBase}/services?status=published`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: ServiceItem[] = json.data.map((item: any, idx: number) => {
            const theme = THEME_PRESETS[idx % THEME_PRESETS.length];
            const Icon = getIconComponent(item.icon);

            let deliverables: string[] = [];
            if (item.description && item.description.includes("\n")) {
              deliverables = item.description
                .split("\n")
                .map((s: string) => s.replace(/^[•\-\*]\s*/, "").trim())
                .filter(Boolean)
                .slice(0, 4);
            }
            if (deliverables.length === 0) {
              deliverables = [
                `${item.title} Pipeline`,
                "Algorithmic Content Strategy",
                "Full-Stack Automation",
                "Multi-Channel Distribution",
              ];
            }

            return {
              id: item.id || item.slug || `service-${idx}`,
              title: item.title,
              subtitle: item.short_description || "Scale with AI.",
              description: item.description || item.short_description || "",
              icon: Icon,
              image: item.cover_image || theme.image,
              gradient: theme.gradient,
              accentColor: theme.accentColor,
              glowColor: theme.glowColor,
              badge: item.category || "Solution",
              badgeBorder: theme.badgeBorder,
              badgeBg: theme.badgeBg,
              badgeText: theme.badgeText,
              deliverables,
            };
          });
          setServicesList(mapped);
        }
      } catch (err) {
        console.warn("Failed to load dynamic services:", err);
      }
    }
    loadPublishedServices();
  }, []);

  const handleSelectService = (serviceName: string) => {
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="solutions"
      ref={containerRef}
      className="relative w-full overflow-hidden pt-20 pb-24 scroll-mt-20"
    >
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[380px] w-[380px] rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-2.5"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full-Stack Media Architecture</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              Solutions Engineered for{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Exponential Reach
              </span>
            </h2>

            <p className="max-w-2xl text-sm text-zinc-400">
              Transforming businesses with autonomous AI video generation, omni-channel publishing networks, and high-conversion creator ecosystems.
            </p>
          </motion.div>
        </div>

        {/* Premium Service Cards (2x2 Grid on desktop) */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {servicesList.map((service, idx) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={idx}
              isInView={isInView}
              onSelectService={handleSelectService}
            />
          ))}
        </div>

        {/* Full Agency Matrix: WE BUILD & WE GROW */}
        <div className="mt-16 rounded-[28px] border border-white/10 bg-white/[0.02] p-8 sm:p-10 backdrop-blur-xl">
          <div className="mb-10 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#ff5722] font-mono">
              END-TO-END CAPABILITIES
            </span>
            <h3 className="mt-1 text-2xl sm:text-3xl font-black text-white">
              Complete Digital Engineering & Growth Suite
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-xl">
              From enterprise software engineering to algorithmic organic customer acquisition, we build your platforms and scale your business.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Column 1: WE BUILD */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="h-2 w-2 rounded-full bg-[#ff5722]" />
                <h4 className="text-sm font-black uppercase tracking-widest text-[#ff5722]">
                  WE BUILD
                </h4>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "Website Development",
                    desc: "Fast, SEO-ready websites that turn visitors into enquiries.",
                  },
                  {
                    title: "Web Application Development",
                    desc: "Custom portals, dashboards and SaaS — proven at enterprise scale.",
                  },
                  {
                    title: "eCommerce Development",
                    desc: "Stores built for Indian reality: UPI, GST, Shiprocket-ready.",
                  },
                  {
                    title: "Mobile App Development",
                    desc: "Android, iOS and Flutter apps people actually keep.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectService(item.title)}
                    className="group cursor-pointer space-y-1 rounded-2xl border border-transparent p-3 transition hover:border-white/10 hover:bg-white/[0.03]"
                  >
                    <h5 className="text-base font-bold text-white transition group-hover:text-orange-300">
                      {item.title}
                    </h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: WE GROW */}
            <div className="space-y-6 md:border-l md:border-white/10 md:pl-10">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="h-2 w-2 rounded-full bg-[#ff5722]" />
                <h4 className="text-sm font-black uppercase tracking-widest text-[#ff5722]">
                  WE GROW
                </h4>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "Digital Marketing",
                    desc: "Local SEO, advertising and content measured in enquiries and sales.",
                  },
                  {
                    title: "Social Media Management",
                    desc: "Content and ads measured in enquiries, not likes.",
                  },
                  {
                    title: "Content Creation",
                    desc: "Writing, photo and video that Google finds and customers believe.",
                  },
                  {
                    title: "Graphic Design & Branding",
                    desc: "Logos and identities designed to be remembered.",
                  },
                  {
                    title: "Website Security & Maintenance",
                    desc: "Malware removal, backups and AMC plans. Sleep well.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectService(item.title)}
                    className="group cursor-pointer space-y-1 rounded-2xl border border-transparent p-3 transition hover:border-white/10 hover:bg-white/[0.03]"
                  >
                    <h5 className="text-base font-bold text-white transition group-hover:text-blue-300">
                      {item.title}
                    </h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

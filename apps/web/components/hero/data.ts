import { useState, useEffect } from "react";

export interface HeroProject {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  thumbnail: string;
  isActive: boolean;
  updatedAt: string;
  accentColor?: string;
  gradient?: string;
  industry?: string;
}

export const defaultHeroProjects: HeroProject[] = [
  {
    id: "worknai",
    name: "WorknAI",
    industry: "AI Media",
    title: "Create. Schedule. Dominate.",
    subtitle: "AI Media Operating System designed for exponential brand reach and automated content publishing.",
    videoUrl: "",
    thumbnail: "/hero-worknai.jpg",
    isActive: true,
    updatedAt: "2026-09-07T12:00:00Z",
    accentColor: "#3B82F6",
    gradient: "from-blue-400 via-cyan-300 to-indigo-500",
  },
  {
    id: "go",
    name: "Online Go",
    industry: "Travel",
    title: "Autonomous Airline Ticketing",
    subtitle: "Flights, Bus & Smart Mobility with zero-friction booking telematics.",
    videoUrl: "",
    thumbnail: "/hero-onlinego.jpg",
    isActive: true,
    updatedAt: "2026-09-07T12:00:00Z",
    accentColor: "#00F0FF",
    gradient: "from-cyan-400 via-sky-300 to-blue-500",
  },
  {
    id: "pg",
    name: "PG Info",
    industry: "Housing",
    title: "Premium Student Living",
    subtitle: "Verified PG Ecosystem & Co-Living Spaces across tier-1 university tech hubs.",
    videoUrl: "",
    thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&auto=format&fit=crop&q=80",
    isActive: true,
    updatedAt: "2026-09-07T12:00:00Z",
    accentColor: "#F59E0B",
    gradient: "from-amber-400 via-orange-300 to-rose-500",
  },
  {
    id: "logix",
    name: "GoLogix",
    industry: "Logistics",
    title: "AI Freight Intelligence",
    subtitle: "Parcel & Multi-Corridor Transport Network with automated fleet dispatch.",
    videoUrl: "",
    thumbnail: "/hero-gologix.jpg",
    isActive: true,
    updatedAt: "2026-09-07T12:00:00Z",
    accentColor: "#10B981",
    gradient: "from-emerald-400 via-teal-300 to-green-500",
  },
];

const STORAGE_KEY = "worknai_hero_projects_db";
const EVENT_KEY = "worknai_hero_projects_updated";

/**
 * Reads hero projects from local database (localStorage with memory fallback).
 */
export function getHeroProjects(): HeroProject[] {
  if (typeof window === "undefined") {
    return defaultHeroProjects;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => {
          if (p.videoUrl && (p.videoUrl.includes("mixkit.co") || p.videoUrl.includes("hero-loop.mp4") || p.videoUrl.includes("go.mp4") || p.videoUrl.includes("logix.mp4") || p.videoUrl.includes("pg.mp4"))) {
            return {
              ...p,
              videoUrl: "",
            };
          }
          return p;
        });
      }
    }
  } catch (e) {
    console.error("Failed to read hero projects from storage:", e);
  }
  return defaultHeroProjects;
}

/**
 * Saves or updates a hero project in storage and dispatches update event.
 */
export function saveHeroProject(project: HeroProject): HeroProject[] {
  const current = getHeroProjects();
  const exists = current.some((p) => p.id === project.id);
  const updated = exists
    ? current.map((p) => (p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p))
    : [...current, { ...project, updatedAt: new Date().toISOString() }];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch (e) {
      console.error("Failed to save hero project:", e);
    }
  }
  return updated;
}

/**
 * Deletes a hero project by ID.
 */
export function deleteHeroProject(id: string): HeroProject[] {
  const current = getHeroProjects();
  const updated = current.filter((p) => p.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch (e) {
      console.error("Failed to delete hero project:", e);
    }
  }
  return updated;
}

/**
 * React hook to subscribe to real-time Hero project changes.
 */
export function useHeroProjects(): {
  projects: HeroProject[];
  activeProjects: HeroProject[];
  reload: () => void;
} {
  const [projectsList, setProjectsList] = useState<HeroProject[]>(defaultHeroProjects);

  const loadData = () => {
    setProjectsList(getHeroProjects());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const activeProjects = projectsList.filter((p) => p.isActive);

  return {
    projects: projectsList,
    activeProjects: activeProjects.length > 0 ? activeProjects : projectsList,
    reload: loadData,
  };
}

// Backward compatibility alias
export const projects = defaultHeroProjects;
export type ProjectItem = HeroProject;

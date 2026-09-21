export type ContentTypeId = "instagram" | "reel" | "youtube" | "ad" | "image";

export interface Brand {
  id: string;
  name: string;
  handle: string;
  industry: string;
  voice: string;
  avatar: string;
  color: string;
  audience: string;
}

export interface ContentTypeConfig {
  id: ContentTypeId;
  label: string;
  badge: string;
  description: string;
  icon: string;
  gradient: string;
  glow: string;
  defaultPrompt: string;
  promptSuggestions: string[];
}

export interface GeneratedContent {
  id: string;
  type: ContentTypeId;
  brand: Brand;
  title: string;
  timestamp: string;
  body: string;
  hook?: string;
  cta?: string;
  hashtags?: string[];
  scriptScenes?: {
    timestamp: string;
    visual: string;
    audio: string;
  }[];
  mediaUrl?: string;
  aspectRatio?: string;
  metricsEstimated?: {
    reach: string;
    engagement: string;
    viralScore: number;
  };
}

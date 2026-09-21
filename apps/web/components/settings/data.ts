import {
  SettingsTabItem,
  ProfileSettings,
  BrandSettings,
  AIPerferenceItem,
  NotificationItem,
  TeamMember,
  ThemeOption,
  SecuritySession,
  APIKeyItem,
} from "./types";

export const settingsTabs: SettingsTabItem[] = [
  {
    id: "profile",
    label: "Profile",
    description: "Personal account, public credentials & timezone",
  },
  {
    id: "brand",
    label: "Brand Identity",
    description: "Default brand DNA, guidelines & color palette",
    badge: "Connected",
  },
  {
    id: "ai",
    label: "AI Preferences",
    description: "LLM models, creativity temperature & auto-approval rules",
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Email summaries, pipeline alerts & dispatch webhooks",
  },
  {
    id: "team",
    label: "Team Members",
    description: "Role-based access, permissions & collaborator invites",
    badge: "4 Active",
  },
  {
    id: "theme",
    label: "Theme & Display",
    description: "Dark glass aesthetic, accent palette & motion settings",
  },
  {
    id: "security",
    label: "Security & API",
    description: "2FA, active sessions, passkeys & programmatic keys",
    badge: "2FA Active",
  },
];

export const initialProfileData: ProfileSettings = {
  fullName: "Alexander Wright",
  email: "alexander@worknai.media",
  role: "Head of Creative & AI Operations",
  bio: "Overseeing automated multi-brand media distribution, fine-tuning generative models, and scaling organic brand reach across social channels.",
  timezone: "UTC+05:30 (Asia/Kolkata)",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
};

export const initialBrandData: BrandSettings = {
  activeBrand: "GoAirClass",
  brandVoice: "Sophisticated, Adventurous, Exclusive",
  targetDemographic: "Affluent travelers (ages 26-48), luxury seekers, frequent business flyers",
  primaryColor: "#3B82F6",
  accentColor: "#8B5CF6",
  guidelineSummary: "Always highlight luxury convenience, transparent upgrades, and breathtaking destinations. Maintain clean typography and high-contrast visuals.",
  autoWatermark: true,
};

export const aiModelsList = [
  {
    id: "deepmedia-v4",
    name: "DeepMedia-V4 Omni (Recommended)",
    badge: "Fastest & Multimodal",
    desc: "Optimized for Instagram reels, YouTube hooks, and high-retention social copy.",
  },
  {
    id: "claude-3-7",
    name: "Claude 3.7 Sonnet Thoughtful",
    badge: "Deep Reasoning",
    desc: "Best for comprehensive research scripts, in-depth blogs, and thought leadership.",
  },
  {
    id: "gpt-4o-media",
    name: "GPT-4o Creative Studio",
    badge: "Direct Response",
    desc: "Engineered for high-converting Meta and TikTok paid advertising copy.",
  },
];

export const aiPreferenceToggles: AIPerferenceItem[] = [
  {
    id: "auto-approval",
    label: "Auto-Approve High-Confidence Generations",
    description: "Automatically push posts with a Viral Index > 90 directly to the queue.",
    enabled: false,
  },
  {
    id: "hashtag-clustering",
    label: "Dynamic Trend-Based Hashtag Clustering",
    description: "Inject real-time trending platform tags based on live algorithm velocity.",
    enabled: true,
  },
  {
    id: "safety-guardrails",
    label: "Strict Brand Safety & Compliance Filter",
    description: "Block controversial topics, verify trademark usage, and filter profanity.",
    enabled: true,
  },
  {
    id: "retention-pacing",
    label: "3-Second Retention Hook Optimization",
    description: "Restructure vertical video scripts to maximize initial swipe-away resistance.",
    enabled: true,
  },
];

export const notificationsList: NotificationItem[] = [
  {
    id: "post-published",
    title: "Post Dispatch Confirmation",
    description: "Receive instant ping whenever an automated post is published to social channels.",
    email: true,
    push: true,
    category: "operations",
  },
  {
    id: "generation-ready",
    title: "Batch AI Generation Complete",
    description: "Notification when asynchronous bulk reels or carousel renders finish processing.",
    email: false,
    push: true,
    category: "content",
  },
  {
    id: "weekly-digest",
    title: "Weekly Organic Growth Digest",
    description: "Weekly executive summary of reach, velocity gains, and top-performing brands.",
    email: true,
    push: false,
    category: "operations",
  },
  {
    id: "queue-empty",
    title: "Queue Depletion Warning",
    description: "Alert when scheduled posts in queue drop below 3 days of upcoming content.",
    email: true,
    push: true,
    category: "operations",
  },
  {
    id: "security-alerts",
    title: "New Device Sign-In & Security Alerts",
    description: "Immediate high-priority notification if your account is accessed from an unfamiliar IP.",
    email: true,
    push: true,
    category: "security",
  },
];

export const teamMembersList: TeamMember[] = [
  {
    id: "tm-1",
    name: "Alexander Wright",
    email: "alexander@worknai.media",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
    status: "Active",
    lastActive: "Now",
  },
  {
    id: "tm-2",
    name: "Elena Rostova",
    email: "elena@worknai.media",
    role: "Creative Director",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80",
    status: "Active",
    lastActive: "24m ago",
  },
  {
    id: "tm-3",
    name: "Marcus Vance",
    email: "marcus@logixparcel.com",
    role: "Editor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
    status: "Active",
    lastActive: "2h ago",
  },
  {
    id: "tm-4",
    name: "Sophia Chen",
    email: "sophia@goairclass.com",
    role: "Viewer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80",
    status: "Pending",
    lastActive: "Invited yesterday",
  },
];

export const themeOptions: ThemeOption[] = [
  {
    id: "futuristic-cyan",
    name: "Deep Cyber Cyan (Default)",
    description: "Deep space obsidian with vibrant cyan & electric blue neon accents.",
    previewGradient: "from-blue-600 via-indigo-600 to-cyan-400",
    accentHex: "#3B82F6",
  },
  {
    id: "midnight-purple",
    name: "Midnight Ultraviolet",
    description: "Dark violet glass with cosmic purple and magenta luminescence.",
    previewGradient: "from-purple-600 via-pink-600 to-indigo-500",
    accentHex: "#8B5CF6",
  },
  {
    id: "emerald-matrix",
    name: "Emerald Horizon",
    description: "Sleek tactical slate with neon jade and emerald glow.",
    previewGradient: "from-emerald-500 via-teal-600 to-cyan-500",
    accentHex: "#10B981",
  },
];

export const activeSessionsList: SecuritySession[] = [
  {
    id: "sess-1",
    device: "MacBook Pro 16\" (Chrome 128)",
    location: "Bengaluru, India",
    ip: "103.141.52.88",
    lastActive: "Current Session",
    isCurrent: true,
  },
  {
    id: "sess-2",
    device: "iPhone 16 Pro (Mobile App)",
    location: "Bengaluru, India",
    ip: "103.141.52.92",
    lastActive: "42m ago",
    isCurrent: false,
  },
  {
    id: "sess-3",
    device: "Windows 11 Workstation (Edge)",
    location: "Singapore",
    ip: "165.225.112.4",
    lastActive: "2 days ago",
    isCurrent: false,
  },
];

export const apiKeysList: APIKeyItem[] = [
  {
    id: "key-1",
    name: "Production Dispatch Webhook",
    prefix: "wnai_live_8f7b...3c29",
    created: "Aug 14, 2026",
    lastUsed: "5 mins ago",
  },
  {
    id: "key-2",
    name: "Zapier Automated Pipeline",
    prefix: "wnai_live_21a9...94df",
    created: "Sep 01, 2026",
    lastUsed: "Yesterday",
  },
];

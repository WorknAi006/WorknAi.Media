export interface KPIData {
  id: string;
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  change: number; // percentage e.g. +24.8
  sparkline: number[];
  color: string;
  glowColor: string;
  accent: string;
}

export interface PerformanceDataPoint {
  date: string;
  Instagram: number;
  Facebook: number;
  YouTube: number;
  LinkedIn: number;
}

export interface TopContentItem {
  id: string | number;
  title: string;
  brand: string;
  platform: "Instagram" | "Facebook" | "YouTube" | "LinkedIn";
  thumbnail: string;
  reach: string;
  engagement: string;
  watchTime: string;
  date: string;
}

export interface InsightItem {
  id: string;
  type: "timing" | "platform" | "frequency";
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  impact: string;
  recommendedAction: string;
}

export interface AudienceMetric {
  label: string;
  percentage: number;
  count?: string;
  color?: string;
}

export interface AudienceData {
  gender: AudienceMetric[];
  ageGroups: AudienceMetric[];
  cities: AudienceMetric[];
}

export const analytics = {
  kpis: [
    {
      id: "reach",
      title: "Total Reach",
      value: 1845200,
      prefix: "",
      suffix: "M",
      decimals: 2,
      change: 24.8,
      sparkline: [32, 45, 40, 58, 62, 75, 88, 95],
      color: "#3B82F6",
      glowColor: "rgba(59,130,246,0.35)",
      accent: "from-blue-500/20 to-indigo-500/10",
    },
    {
      id: "engagement",
      title: "Engagement",
      value: 342600,
      prefix: "",
      suffix: "K",
      decimals: 1,
      change: 18.2,
      sparkline: [22, 28, 35, 30, 48, 52, 60, 68],
      color: "#EC4899",
      glowColor: "rgba(236,72,153,0.35)",
      accent: "from-pink-500/20 to-rose-500/10",
    },
    {
      id: "leads",
      title: "Leads Generated",
      value: 4892,
      prefix: "",
      suffix: "",
      decimals: 0,
      change: 32.4,
      sparkline: [15, 20, 28, 38, 35, 50, 62, 74],
      color: "#10B981",
      glowColor: "rgba(16,185,129,0.35)",
      accent: "from-emerald-500/20 to-teal-500/10",
    },
    {
      id: "revenue",
      title: "Revenue",
      value: 482500,
      prefix: "$",
      suffix: "K",
      decimals: 1,
      change: 27.5,
      sparkline: [20, 30, 38, 45, 58, 70, 82, 92],
      color: "#8B5CF6",
      glowColor: "rgba(139,92,246,0.35)",
      accent: "from-purple-500/20 to-violet-500/10",
    },
  ] as KPIData[],

  performance: [
    { date: "Aug 01", Instagram: 42, Facebook: 28, YouTube: 55, LinkedIn: 20 },
    { date: "Aug 08", Instagram: 58, Facebook: 32, YouTube: 62, LinkedIn: 28 },
    { date: "Aug 15", Instagram: 51, Facebook: 35, YouTube: 70, LinkedIn: 34 },
    { date: "Aug 22", Instagram: 69, Facebook: 30, YouTube: 78, LinkedIn: 45 },
    { date: "Aug 29", Instagram: 78, Facebook: 38, YouTube: 84, LinkedIn: 52 },
    { date: "Sep 05", Instagram: 92, Facebook: 44, YouTube: 96, LinkedIn: 64 },
    { date: "Sep 07", Instagram: 108, Facebook: 46, YouTube: 112, LinkedIn: 72 },
  ] as PerformanceDataPoint[],

  topContent: [
    {
      id: 1,
      title: "Monsoon Goa Flight Secrets (Save $800)",
      brand: "Online Go",
      platform: "Instagram",
      thumbnail: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
      reach: "482K",
      engagement: "14.2%",
      watchTime: "1,240 hrs",
      date: "Sep 02",
    },
    {
      id: 2,
      title: "Autonomous Fleet Routing Whitepaper",
      brand: "GoLogix",
      platform: "LinkedIn",
      thumbnail: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80",
      reach: "215K",
      engagement: "8.6%",
      watchTime: "680 hrs",
      date: "Aug 29",
    },
    {
      id: 3,
      title: "Pune Tech Student Co-Living Room Tour",
      brand: "PG Info",
      platform: "YouTube",
      thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
      reach: "394K",
      engagement: "11.8%",
      watchTime: "3,120 hrs",
      date: "Sep 04",
    },
    {
      id: 4,
      title: "WorknAI Media OS: Agentic Content Engine",
      brand: "WorknAI",
      platform: "LinkedIn",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      reach: "560K",
      engagement: "16.4%",
      watchTime: "2,450 hrs",
      date: "Sep 06",
    },
  ] as TopContentItem[],

  insights: [
    {
      id: "ins-1",
      type: "timing",
      title: "Best Posting Time Detected",
      description:
        "Audience resonance peaks between 7:30 PM and 8:45 PM IST across Instagram & YouTube, generating 42% higher retention and comment velocity.",
      badge: "High Impact",
      badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-400",
      impact: "+38% Engagement",
      recommendedAction: "Lock 7:45 PM as default auto-schedule slot in Scheduler.",
    },
    {
      id: "ins-2",
      type: "platform",
      title: "Instagram Outperforming Facebook",
      description:
        "Instagram Reels generated 2.4x higher organic conversions and 3.8x watch completion compared to Facebook feed image ads in the last 30 days.",
      badge: "Growth Engine",
      badgeColor: "border-pink-500/30 bg-pink-500/10 text-pink-400",
      impact: "2.4x ROI Ratio",
      recommendedAction: "Reallocate 25% of static Facebook ad budget to vertical reels.",
    },
    {
      id: "ins-3",
      type: "frequency",
      title: "Suggested Reel Frequency",
      description:
        "Publishing 5 to 7 reels per week maintains algorithmic freshness for Online Go and PG Info, minimizing viewer fatigue while maximizing Discovery tab impressions.",
      badge: "Cadence Recommendation",
      badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-400",
      impact: "+52% Discovery Views",
      recommendedAction: "Generate batch scripts weekly via AI Content Studio.",
    },
  ] as InsightItem[],

  audience: {
    gender: [
      { label: "Male", percentage: 56, count: "1.03M", color: "#3B82F6" },
      { label: "Female", percentage: 44, count: "812K", color: "#EC4899" },
    ],
    ageGroups: [
      { label: "18-24", percentage: 38, count: "701K", color: "#8B5CF6" },
      { label: "25-34", percentage: 42, count: "775K", color: "#06B6D4" },
      { label: "35-44", percentage: 14, count: "258K", color: "#10B981" },
      { label: "45+", percentage: 6, count: "110K", color: "#F59E0B" },
    ],
    cities: [
      { label: "Mumbai", percentage: 32, count: "590K", color: "#3B82F6" },
      { label: "Pune", percentage: 26, count: "480K", color: "#8B5CF6" },
      { label: "Bangalore", percentage: 21, count: "387K", color: "#06B6D4" },
      { label: "Delhi NCR", percentage: 13, count: "240K", color: "#EC4899" },
      { label: "Hyderabad", percentage: 8, count: "148K", color: "#10B981" },
    ],
  } as AudienceData,
};

export const filterOptions = {
  dateRanges: ["Last 7 Days", "Last 30 Days", "Q3 2026", "Year to Date"],
  brands: ["All Brands", "Online Go", "GoLogix", "PG Info", "WorknAI"],
  platforms: ["All Platforms", "Instagram", "Facebook", "YouTube", "LinkedIn"],
};

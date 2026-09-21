export interface TrendingTopic {
  id: string;
  name: string;
  category: string;
  growth: number;
  volume: string;
  sentiment: "Bullish" | "Explosive" | "Steady";
  accent: string;
}

export interface CompetitorData {
  id: string;
  name: string;
  logo: string;
  industry: string;
  followers: string;
  engagement: string;
  postingFrequency: string;
  bestPlatform: string;
  strengthScore: number;
  radar: {
    label: string;
    value: number; // 0 - 100
  }[];
  keyWeakness: string;
  topStrategy: string;
}

export interface ViralReelIdea {
  id: string | number;
  thumbnail: string;
  hook: string;
  concept: string;
  duration: string;
  expectedReach: string;
  category: string;
  soundTrend: string;
}

export interface ResearchReportData {
  query: string;
  generatedDate: string;
  confidenceScore: number;
  marketOpportunity: string;
  competitorGap: string;
  suggestedStrategy: string[];
  recommendedHashtags: string[];
  bestPostingTime: {
    window: string;
    peakDay: string;
    projectedBoost: string;
  };
}

export const trendingTopics: TrendingTopic[] = [
  {
    id: "ai",
    name: "AI & Autonomous Media OS",
    category: "Deep Tech",
    growth: 148,
    volume: "2.4M searches",
    sentiment: "Explosive",
    accent: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400",
  },
  {
    id: "tourism",
    name: "Luxury Tourism & Flight Hacks",
    category: "Travel",
    growth: 84,
    volume: "1.8M searches",
    sentiment: "Bullish",
    accent: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-400",
  },
  {
    id: "logistics",
    name: "Autonomous Logistics & Freight",
    category: "Supply Chain",
    growth: 62,
    volume: "890K searches",
    sentiment: "Steady",
    accent: "from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "pg-business",
    name: "Student PG & Micro Co-Living",
    category: "Real Estate",
    growth: 95,
    volume: "1.2M searches",
    sentiment: "Bullish",
    accent: "from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-400",
  },
  {
    id: "marketing",
    name: "Agentic Performance Marketing",
    category: "AdTech",
    growth: 112,
    volume: "3.1M searches",
    sentiment: "Explosive",
    accent: "from-purple-500/20 to-fuchsia-500/10 border-purple-500/30 text-purple-400",
  },
];

export const competitorDatabase: Record<string, CompetitorData> = {
  MakeMyTrip: {
    id: "comp-1",
    name: "MakeMyTrip",
    logo: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200&auto=format&fit=crop&q=80",
    industry: "Online Travel Agency (OTA)",
    followers: "1.4M",
    engagement: "4.8%",
    postingFrequency: "14 posts/wk",
    bestPlatform: "Instagram Reels",
    strengthScore: 88,
    radar: [
      { label: "Content Quality", value: 85 },
      { label: "SEO Dominance", value: 92 },
      { label: "Video Reach", value: 88 },
      { label: "Engagement", value: 68 },
      { label: "Post Frequency", value: 82 },
    ],
    keyWeakness: "Under-indexing on hyperlocal vernacular reels (Hindi & Marathi).",
    topStrategy: "Heavy celebrity endorsement with generic luxury destination promos.",
  },
  Delhivery: {
    id: "comp-2",
    name: "Delhivery",
    logo: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&auto=format&fit=crop&q=80",
    industry: "Express Logistics & Freight",
    followers: "640K",
    engagement: "3.2%",
    postingFrequency: "8 posts/wk",
    bestPlatform: "LinkedIn B2B",
    strengthScore: 79,
    radar: [
      { label: "Content Quality", value: 72 },
      { label: "SEO Dominance", value: 88 },
      { label: "Video Reach", value: 60 },
      { label: "Engagement", value: 74 },
      { label: "Post Frequency", value: 70 },
    ],
    keyWeakness: "Lacks engaging video hooks explaining technical supply chain advantages.",
    topStrategy: "Corporate PR announcements and quarterly financial milestones.",
  },
  "Zolo Stays": {
    id: "comp-3",
    name: "Zolo Stays",
    logo: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&auto=format&fit=crop&q=80",
    industry: "Student Housing & Co-Living",
    followers: "380K",
    engagement: "5.4%",
    postingFrequency: "10 posts/wk",
    bestPlatform: "Instagram & YouTube Shorts",
    strengthScore: 82,
    radar: [
      { label: "Content Quality", value: 80 },
      { label: "SEO Dominance", value: 74 },
      { label: "Video Reach", value: 86 },
      { label: "Engagement", value: 82 },
      { label: "Post Frequency", value: 78 },
    ],
    keyWeakness: "Limited presence in emerging tier-2 university clusters.",
    topStrategy: "Humorous student roommate sketches and raw room tours.",
  },
};

export const viralReelIdeas: ViralReelIdea[] = [
  {
    id: "v-1",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    hook: "“Stop booking flights on weekends. Here’s the 3 AM stealth hack airlines don't want you to see...”",
    concept: "Fast-paced screen recording showing price drops during off-peak algorithmic clearing.",
    duration: "0:24",
    expectedReach: "450K - 1.2M",
    category: "Online Go Travel",
    soundTrend: "Dramatic Orchestral Pulse (48K uses)",
  },
  {
    id: "v-2",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
    hook: "“How this AI dispatched 1,200 trucks across 4 states without a single phone call...”",
    concept: "Cinematic logistics b-roll with telematics overlay showing automated route optimization.",
    duration: "0:32",
    expectedReach: "280K - 650K",
    category: "GoLogix Freight",
    soundTrend: "Cyberpunk Tech Wave (22K uses)",
  },
  {
    id: "v-3",
    thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
    hook: "“Pune techies are ditching 1BHK rents for this all-inclusive private studio...”",
    concept: "POV room walkthrough comparing ₹35,000 apartment costs vs ₹14,000 smart PG suite.",
    duration: "0:28",
    expectedReach: "600K - 1.5M",
    category: "PG Info Living",
    soundTrend: "Lo-Fi Chill Lifestyle Beat (110K uses)",
  },
  {
    id: "v-4",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    hook: "“We replaced our 5-person agency production team with this single multi-agent OS...”",
    concept: "Behind-the-scenes UI capture demonstrating 1-click generation from prompt to 4 social channels.",
    duration: "0:35",
    expectedReach: "750K - 2.1M",
    category: "WorknAI Media OS",
    soundTrend: "Deep Cinematic Sub-Bass (85K uses)",
  },
];

export const defaultResearchReport: ResearchReportData = {
  query: "Autonomous Travel & Experience Booking 2026",
  generatedDate: "September 07, 2026",
  confidenceScore: 94,
  marketOpportunity:
    "High-converting demand for autonomous, dynamic pricing alerts and curated weekend departures. 68% of tech professionals aged 22-35 prefer automated ticket reservation bundles with executive coach connection.",
  competitorGap:
    "Major competitors (MakeMyTrip, Yatra) focus primarily on static search engines and discount coupons, neglecting vertical short-form narrative videos and direct WhatsApp concierge booking flows.",
  suggestedStrategy: [
    "Produce 5-7 vertical high-velocity reels per week spotlighting secret departure deals saving >30%.",
    "Deploy multi-lingual audio hooks across Hindi and Marathi targeting tier-1 & tier-2 regional travelers.",
    "Embed instantaneous WhatsApp CTA prompts in bio and captions to capture warm leads within 120 seconds.",
    "Showcase autonomous booking telematics to establish enterprise reliability and brand trust.",
  ],
  recommendedHashtags: [
    "#OnlineGo",
    "#LuxuryTravelIndia",
    "#FlightHacks2026",
    "#AutonomousBooking",
    "#WeekendGetaway",
    "#SmartMobility",
    "#BusinessTravelHacks",
  ],
  bestPostingTime: {
    window: "7:30 PM – 8:45 PM IST",
    peakDay: "Thursday & Friday Departures",
    projectedBoost: "+42% Conversion Velocity",
  },
};

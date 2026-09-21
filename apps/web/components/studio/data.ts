export interface CreationItem {
  id: string;
  title: string;
  brand: "Online Go" | "GoLogix" | "PG Info" | "WorknAI";
  contentType: string;
  thumbnail: string;
  date: string;
  status: "Published" | "Scheduled" | "Draft" | "Ready";
  statusColor: string;
}

export const brands = [
  { id: "online-go", name: "Online Go", industry: "Travel & Mobility", color: "from-cyan-500 to-blue-600" },
  { id: "gologix", name: "GoLogix", industry: "Logistics & Fleet", color: "from-emerald-500 to-teal-600" },
  { id: "pg-info", name: "PG Info", industry: "Student & Co-Living", color: "from-amber-500 to-orange-600" },
  { id: "worknai", name: "WorknAI", industry: "AI Media OS", color: "from-purple-500 to-indigo-600" },
] as const;

export const contentTypes = [
  "Instagram Post",
  "Reel Script",
  "YouTube Script",
  "Poster",
  "Ad Copy",
  "WhatsApp SMS",
] as const;

export const tones = [
  "Professional",
  "Luxury",
  "Friendly",
  "Sales",
  "Emotional",
] as const;

export const languages = [
  "English",
  "Hindi",
  "Marathi",
] as const;

export interface GeneratedResults {
  caption: string;
  hashtags: string[];
  cta: string;
}

export const defaultResultsByBrand: Record<string, GeneratedResults> = {
  "Online Go": {
    caption:
      "✈️ Experience seamless luxury travel across 48+ metropolitan hubs. From instant flight ticket reservations to private jet charters and premium executive coach transfers, Online Go connects every journey with real-time autonomous telematics and zero booking friction. Where is your next departure taking you?",
    hashtags: [
      "#OnlineGo",
      "#LuxuryTravel2026",
      "#FlightHacks",
      "#BusinessClass",
      "#TravelIndia",
      "#SmartMobility",
    ],
    cta: "Book your VIP flight or intercity luxury coach now at onlinego.media and unlock 25% early departure rewards.",
  },
  GoLogix: {
    caption:
      "🚚 Delivering supply chain intelligence with 99.8% on-time dispatch precision. GoLogix combines predictive AI fleet dispatch, cross-border freight telematics, and automated warehouse routing so your parcels move with maximum velocity and zero latency.",
    hashtags: [
      "#GoLogix",
      "#LogisticsTech",
      "#SmartFleet",
      "#SupplyChainAI",
      "#FreightForwarding",
      "#ExpressDelivery",
    ],
    cta: "Track your freight in real-time or request an enterprise corporate delivery demo today.",
  },
  "PG Info": {
    caption:
      "🏠 Modern student and executive living redefined in Pune. Fully furnished air-conditioned suites, high-speed fiber internet, biometric security, chef-curated meals, and a thriving co-working community all in one verified ecosystem.",
    hashtags: [
      "#PGInfo",
      "#PuneStudentLiving",
      "#LuxuryCoLiving",
      "#VerifiedStay",
      "#CampusHousing",
      "#StudentLifePune",
    ],
    cta: "Schedule your free virtual walkthrough or reserve your suite today with zero brokerage fees.",
  },
  WorknAI: {
    caption:
      "🤖 Autonomous AI Media Operating System built for visionary business brands. Transform one strategic prompt into viral reels, multi-channel scripts, marketing carousels, and programmatic posting on complete autopilot.",
    hashtags: [
      "#WorknAI",
      "#AIMediaOS",
      "#ContentAutomation",
      "#MultiModalAI",
      "#MarketingEngine",
      "#ScaleMedia",
    ],
    cta: "Launch your autonomous media engine today at worknai.media and dominate your organic category reach.",
  },
};

export const recentCreations: CreationItem[] = [
  {
    id: "rec-1",
    title: "Monsoon Goa Weekend Getaway Reel",
    brand: "Online Go",
    contentType: "Reel Script",
    thumbnail: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format&fit=crop&q=80",
    date: "12m ago",
    status: "Published",
    statusColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  {
    id: "rec-2",
    title: "Cross-Border Fleet Telematics Case Study",
    brand: "GoLogix",
    contentType: "Ad Copy",
    thumbnail: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&auto=format&fit=crop&q=80",
    date: "45m ago",
    status: "Ready",
    statusColor: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  },
  {
    id: "rec-3",
    title: "Viman Nagar Student Suite Launch Poster",
    brand: "PG Info",
    contentType: "Poster",
    thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=80",
    date: "2h ago",
    status: "Scheduled",
    statusColor: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  },
  {
    id: "rec-4",
    title: "Multi-Agent Media OS Announcement",
    brand: "WorknAI",
    contentType: "Instagram Post",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    date: "5h ago",
    status: "Draft",
    statusColor: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  },
];

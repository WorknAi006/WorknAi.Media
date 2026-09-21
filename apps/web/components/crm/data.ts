export type ClientStatus = "Lead" | "Discussion" | "Active" | "Completed";
export type PriorityLevel = "High" | "Medium" | "Low";
export type PaymentStatus = "Paid" | "Invoiced" | "Pending" | "Overdue";

export interface AttachedFile {
  name: string;
  size: string;
  type: string;
  date: string;
}

export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  done: boolean;
}

export interface Client {
  id: number;
  company: string;
  logo: string;
  owner: string;
  role: string;
  email: string;
  phone: string;
  service: string;
  status: ClientStatus;
  revenue: number;
  priority: PriorityLevel;
  nextMeeting: string;
  lastUpdated: string;
  paymentStatus: PaymentStatus;
  notes: string;
  files: AttachedFile[];
  timeline: TimelineEvent[];
}

export const pipelineColumns: {
  id: ClientStatus;
  title: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  glowColor: string;
}[] = [
  {
    id: "Lead",
    title: "Lead",
    color: "blue",
    badgeBg: "bg-blue-500/15",
    badgeBorder: "border-blue-500/30",
    badgeText: "text-blue-400",
    glowColor: "rgba(59,130,246,0.3)",
  },
  {
    id: "Discussion",
    title: "Discussion",
    color: "purple",
    badgeBg: "bg-purple-500/15",
    badgeBorder: "border-purple-500/30",
    badgeText: "text-purple-400",
    glowColor: "rgba(168,85,247,0.3)",
  },
  {
    id: "Active",
    title: "Active",
    color: "emerald",
    badgeBg: "bg-emerald-500/15",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-400",
    glowColor: "rgba(16,185,129,0.3)",
  },
  {
    id: "Completed",
    title: "Completed",
    color: "cyan",
    badgeBg: "bg-cyan-500/15",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-400",
    glowColor: "rgba(6,182,212,0.3)",
  },
];

export const priorityMeta: Record<
  PriorityLevel,
  { bg: string; border: string; text: string; dot: string }
> = {
  High: {
    bg: "bg-red-500/15",
    border: "border-red-500/30",
    text: "text-red-400",
    dot: "bg-red-500",
  },
  Medium: {
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    text: "text-amber-400",
    dot: "bg-amber-500",
  },
  Low: {
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    text: "text-blue-400",
    dot: "bg-blue-500",
  },
};

export const paymentMeta: Record<
  PaymentStatus,
  { bg: string; border: string; text: string }
> = {
  Paid: {
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
  },
  Invoiced: {
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
  Pending: {
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    text: "text-amber-400",
  },
  Overdue: {
    bg: "bg-red-500/15",
    border: "border-red-500/30",
    text: "text-red-400",
  },
};

export const clients: Client[] = [
  {
    id: 1,
    company: "Online Go",
    logo: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200&auto=format&fit=crop&q=80",
    owner: "Salim Patel",
    role: "VP Marketing",
    email: "salim.patel@onlinego.media",
    phone: "+91 98201 44521",
    service: "Travel Platform & Autonomous Ticketing",
    status: "Active",
    revenue: 250000,
    priority: "High",
    nextMeeting: "Sep 10, 3:30 PM",
    lastUpdated: "2h ago",
    paymentStatus: "Paid",
    notes:
      "Scaling AI content generation across 12 airline routes. Scheduled launch of dynamic Instagram video ad campaigns next Monday.",
    files: [
      { name: "Brand_Design_Tokens_v4.pdf", size: "3.4 MB", type: "PDF", date: "Sep 02" },
      { name: "Master_Service_Agreement_2026.pdf", size: "1.2 MB", type: "PDF", date: "Aug 28" },
      { name: "Q3_Target_Creative_Matrix.xlsx", size: "840 KB", type: "Spreadsheet", date: "Sep 04" },
    ],
    timeline: [
      { title: "Contract Executed", date: "Aug 20, 2026", description: "Annual media OS retainer finalized.", done: true },
      { title: "AI Studio Automation", date: "Aug 29, 2026", description: "Integrated flight API with generative copy engine.", done: true },
      { title: "Fleet Telematics Campaign", date: "Sep 10, 2026", description: "Review and approve Southeast Asia creative rollouts.", done: false },
      { title: "Q4 Performance Review", date: "Oct 15, 2026", description: "Conversion audit and CAC attribution.", done: false },
    ],
  },
  {
    id: 2,
    company: "GoLogix",
    logo: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&auto=format&fit=crop&q=80",
    owner: "Vikram Singhania",
    role: "Chief Operations Officer",
    email: "vikram@gologix.ai",
    phone: "+91 99304 88192",
    service: "AI Freight & Supply Chain Media",
    status: "Discussion",
    revenue: 180000,
    priority: "High",
    nextMeeting: "Sep 09, 11:00 AM",
    lastUpdated: "5h ago",
    paymentStatus: "Invoiced",
    notes:
      "Finalizing enterprise pilot for automated LinkedIn B2B thought leadership articles and supply chain dispatch infographics.",
    files: [
      { name: "GoLogix_Logistics_Case_Study.pdf", size: "5.8 MB", type: "PDF", date: "Sep 01" },
      { name: "Enterprise_SOW_Draft.docx", size: "420 KB", type: "DOC", date: "Sep 05" },
    ],
    timeline: [
      { title: "Discovery Call", date: "Aug 25, 2026", description: "Outlined multi-channel freight syndication requirements.", done: true },
      { title: "Technical Demo", date: "Sep 02, 2026", description: "Live preview of automated route dispatch reels.", done: true },
      { title: "Board Approval", date: "Sep 09, 2026", description: "Final contract signature with executive committee.", done: false },
    ],
  },
  {
    id: 3,
    company: "PG Info",
    logo: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&auto=format&fit=crop&q=80",
    owner: "Ananya Deshmukh",
    role: "Head of Growth",
    email: "ananya@pginfo.co.in",
    phone: "+91 97652 11029",
    service: "Student Co-Living Media Engine",
    status: "Active",
    revenue: 140000,
    priority: "Medium",
    nextMeeting: "Sep 12, 4:00 PM",
    lastUpdated: "1d ago",
    paymentStatus: "Paid",
    notes:
      "Viman Nagar and Hinjewadi property tours launched. Reel view engagement up 62% in the student tech corridor.",
    files: [
      { name: "Student_Living_Guidelines.pdf", size: "2.1 MB", type: "PDF", date: "Aug 15" },
      { name: "Pune_Campus_Expansion_Plan.pdf", size: "4.5 MB", type: "PDF", date: "Sep 03" },
    ],
    timeline: [
      { title: "Onboarding Complete", date: "Aug 10, 2026", description: "Imported 45 verified PG listings.", done: true },
      { title: "Viral Reels Launch", date: "Aug 28, 2026", description: "Distributed student room tour reels.", done: true },
      { title: "WhatsApp Direct Booking", date: "Sep 12, 2026", description: "Integrate autonomous chatbot responses.", done: false },
    ],
  },
  {
    id: 4,
    company: "WorknAI Labs",
    logo: "/logo.png",
    owner: "Kavita Rao",
    role: "Director of Product",
    email: "kavita@worknai.media",
    phone: "+91 98810 55430",
    service: "Autonomous Media OS & AI Studio",
    status: "Completed",
    revenue: 320000,
    priority: "High",
    nextMeeting: "Completed",
    lastUpdated: "3d ago",
    paymentStatus: "Paid",
    notes:
      "Internal flagship deployment. All agentic workflow pipelines live in production across 4 media channels.",
    files: [
      { name: "WorknAI_Architecture_Whitepaper.pdf", size: "8.2 MB", type: "PDF", date: "Jul 22" },
      { name: "Autonomous_OS_Changelog.md", size: "120 KB", type: "Markdown", date: "Sep 06" },
    ],
    timeline: [
      { title: "Sprint Alpha", date: "Jul 15, 2026", description: "Architecture specification and model tuning.", done: true },
      { title: "Beta Release", date: "Aug 12, 2026", description: "Multi-agent dispatch deployed to production.", done: true },
      { title: "General Availability", date: "Sep 01, 2026", description: "Agency Operating System release.", done: true },
    ],
  },
  {
    id: 5,
    company: "FinFlow Technologies",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=80",
    owner: "Rohan Mehta",
    role: "Chief Marketing Officer",
    email: "rohan@finflow.io",
    phone: "+91 98233 49012",
    service: "Fintech Compliance & Content Engine",
    status: "Lead",
    revenue: 95000,
    priority: "Medium",
    nextMeeting: "Sep 08, 2:00 PM",
    lastUpdated: "Just now",
    paymentStatus: "Pending",
    notes:
      "Requested AI content compliance filters for algorithmic financial ad copy. Exploring 6-month trial.",
    files: [
      { name: "FinFlow_Audit_Report.pdf", size: "1.9 MB", type: "PDF", date: "Sep 07" },
    ],
    timeline: [
      { title: "Inbound Request", date: "Sep 06, 2026", description: "Submitted contact inquiry through Let's Talk.", done: true },
      { title: "Initial Consultation", date: "Sep 08, 2026", description: "Review compliance constraints and workflow.", done: false },
    ],
  },
  {
    id: 6,
    company: "CloudScale Infra",
    logo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=200&auto=format&fit=crop&q=80",
    owner: "Siddharth Verma",
    role: "VP Engineering",
    email: "siddharth@cloudscale.net",
    phone: "+91 99201 33419",
    service: "DevOps Content & Technical Documentation",
    status: "Discussion",
    revenue: 165000,
    priority: "Low",
    nextMeeting: "Sep 11, 5:00 PM",
    lastUpdated: "6h ago",
    paymentStatus: "Pending",
    notes:
      "Needs automated generation of technical tutorials, YouTube code-along reels, and Kubernetes case studies.",
    files: [
      { name: "DevOps_Content_Matrix.pdf", size: "2.7 MB", type: "PDF", date: "Sep 04" },
    ],
    timeline: [
      { title: "Scoping Call", date: "Sep 03, 2026", description: "Reviewed tech stack and markdown export requirements.", done: true },
      { title: "Trial Setup", date: "Sep 11, 2026", description: "Connect GitHub documentation repo to AI studio.", done: false },
    ],
  },
];

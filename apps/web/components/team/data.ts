export type TaskStatus = "Todo" | "In Progress" | "Review" | "Done";
export type PriorityLevel = "High" | "Medium" | "Low";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  isOnline: boolean;
  tasksCount: number;
}

export interface TaskItem {
  id: string | number;
  title: string;
  project: string;
  brandColor: string;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  priority: PriorityLevel;
  dueDate: string;
  progress: number; // 0 to 100
  status: TaskStatus;
}

export interface TeamActivity {
  id: string | number;
  user: string;
  avatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: "upload" | "approval" | "ai" | "meeting" | "comment";
  badgeColor: string;
}

export interface MeetingItem {
  id: string | number;
  title: string;
  time: string;
  date: string;
  platform: string;
  participants: string[];
  link: string;
}

export interface SharedNote {
  id: string | number;
  title: string;
  author: string;
  date: string;
  snippet: string;
  tags: string[];
}

export interface AttachedTeamFile {
  id: string | number;
  name: string;
  size: string;
  uploadedBy: string;
  date: string;
  type: string;
}

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

export const kanbanColumns: {
  id: TaskStatus;
  title: string;
  accent: string;
  borderAccent: string;
}[] = [
  { id: "Todo", title: "Todo", accent: "bg-zinc-500", borderAccent: "border-zinc-500/30" },
  { id: "In Progress", title: "In Progress", accent: "bg-blue-500", borderAccent: "border-blue-500/30" },
  { id: "Review", title: "Review", accent: "bg-purple-500", borderAccent: "border-purple-500/30" },
  { id: "Done", title: "Done", accent: "bg-emerald-500", borderAccent: "border-emerald-500/30" },
];

export const team = {
  workspaces: ["WorknAI Global Media OS", "Online Go Ecosystem", "PG Info Living", "GoLogix Operations"],

  members: [
    {
      id: "m-1",
      name: "Sneha Patil",
      role: "Lead Creative Producer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      email: "sneha@worknai.media",
      isOnline: true,
      tasksCount: 6,
    },
    {
      id: "m-2",
      name: "Salim Patel",
      role: "Executive Campaign Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      email: "salim@worknai.media",
      isOnline: true,
      tasksCount: 4,
    },
    {
      id: "m-3",
      name: "Kavita Rao",
      role: "AI Prompt & Media Architect",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      email: "kavita@worknai.media",
      isOnline: true,
      tasksCount: 8,
    },
    {
      id: "m-4",
      name: "Vikram Singhania",
      role: "Operations & Freight Strategist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      email: "vikram@gologix.ai",
      isOnline: false,
      tasksCount: 3,
    },
    {
      id: "m-5",
      name: "Ananya Deshmukh",
      role: "Head of Growth & Outreach",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      email: "ananya@pginfo.co.in",
      isOnline: true,
      tasksCount: 5,
    },
  ] as TeamMember[],

  tasks: [
    {
      id: "t-1",
      title: "Synthesize 5 Luxury Flight Reels for Weekend Goa Campaign",
      project: "Online Go",
      brandColor: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
      assignee: {
        name: "Sneha Patil",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        role: "Lead Creative Producer",
      },
      priority: "High",
      dueDate: "Today, 6 PM",
      progress: 40,
      status: "In Progress",
    },
    {
      id: "t-2",
      title: "Autonomous Fleet Dispatch Infographics for LinkedIn",
      project: "GoLogix",
      brandColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
      assignee: {
        name: "Vikram Singhania",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        role: "Operations Strategist",
      },
      priority: "Medium",
      dueDate: "Tomorrow",
      progress: 75,
      status: "Review",
    },
    {
      id: "t-3",
      title: "Viman Nagar Student Suite Launch Poster & Ad Copy",
      project: "PG Info",
      brandColor: "border-orange-500/40 text-orange-400 bg-orange-500/10",
      assignee: {
        name: "Ananya Deshmukh",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
        role: "Head of Growth",
      },
      priority: "High",
      dueDate: "Sep 09",
      progress: 100,
      status: "Done",
    },
    {
      id: "t-4",
      title: "Train Fine-Tuned Marathi Translation Model for YouTube Shorts",
      project: "WorknAI",
      brandColor: "border-purple-500/40 text-purple-400 bg-purple-500/10",
      assignee: {
        name: "Kavita Rao",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
        role: "AI Prompt Architect",
      },
      priority: "High",
      dueDate: "Sep 11",
      progress: 20,
      status: "Todo",
    },
    {
      id: "t-5",
      title: "Q3 Agency SOW & Multi-Channel Deliverables Audit",
      project: "Online Go",
      brandColor: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
      assignee: {
        name: "Salim Patel",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        role: "Campaign Director",
      },
      priority: "Medium",
      dueDate: "Sep 12",
      progress: 10,
      status: "Todo",
    },
    {
      id: "t-6",
      title: "Cross-Corridor Freight Case Study Slide Deck",
      project: "GoLogix",
      brandColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
      assignee: {
        name: "Vikram Singhania",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        role: "Operations Strategist",
      },
      priority: "Low",
      dueDate: "Sep 14",
      progress: 90,
      status: "Review",
    },
  ] as TaskItem[],

  activities: [
    {
      id: "act-1",
      user: "Sneha Patil",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      action: "uploaded a Reel",
      target: "“Goa Weekend Flight Secrets v2”",
      timestamp: "12m ago",
      type: "upload",
      badgeColor: "border-pink-500/30 bg-pink-500/10 text-pink-400",
    },
    {
      id: "act-2",
      user: "Salim Patel",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      action: "approved content",
      target: "GoLogix Express Freight Carousels",
      timestamp: "38m ago",
      type: "approval",
      badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    {
      id: "act-3",
      user: "WorknAI Engine",
      avatar: "/logo.png",
      action: "AI generated poster",
      target: "PG Info Hinjewadi Tech Student Suite",
      timestamp: "1h ago",
      type: "ai",
      badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    },
    {
      id: "act-4",
      user: "Ananya Deshmukh",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      action: "client meeting scheduled",
      target: "Online Go Q4 Strategy Sync with Salim",
      timestamp: "2h ago",
      type: "meeting",
      badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    },
    {
      id: "act-5",
      user: "Kavita Rao",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      action: "reviewed prompt pipeline",
      target: "Multi-Language DeepMedia v4 Tokenizer",
      timestamp: "4h ago",
      type: "comment",
      badgeColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    },
  ] as TeamActivity[],

  meetings: [
    {
      id: "m-1",
      title: "Autonomous Content SOW Sync",
      time: "3:30 PM - 4:15 PM",
      date: "Today",
      platform: "Google Meet",
      participants: ["Salim Patel", "Sneha Patil", "Kavita Rao"],
      link: "https://meet.google.com/xyz-worknai",
    },
    {
      id: "m-2",
      title: "GoLogix Fleet Telematics Rollout",
      time: "11:00 AM - 11:45 AM",
      date: "Tomorrow",
      platform: "Zoom",
      participants: ["Vikram S.", "Salim Patel"],
      link: "https://zoom.us/j/gologix-sync",
    },
  ] as MeetingItem[],

  notes: [
    {
      id: "n-1",
      title: "Q3 High-Retention Hook Principles",
      author: "Sneha Patil",
      date: "Sep 05",
      snippet:
        "Every Instagram reel must incorporate visual movement within 0.8s. For travel content, open with off-peak flight hack prices rather than scenic transitions.",
      tags: ["Reel Hooks", "Retention", "Online Go"],
    },
    {
      id: "n-2",
      title: "Hyperlocal Vernacular Model Constraints",
      author: "Kavita Rao",
      date: "Sep 06",
      snippet:
        "Ensure Hindi & Marathi outputs maintain conversational tone without stiff dictionary phrasing. Prioritize regional youth slang for student co-living ads.",
      tags: ["AI Prompts", "Languages", "PG Info"],
    },
  ] as SharedNote[],

  files: [
    {
      id: "f-1",
      name: "Master_Agency_Sprint_Roadmap_Q3.pdf",
      size: "4.8 MB",
      uploadedBy: "Salim Patel",
      date: "Sep 06",
      type: "PDF",
    },
    {
      id: "f-2",
      name: "Video_Soundtrack_Stems_Pack.zip",
      size: "142 MB",
      uploadedBy: "Sneha Patil",
      date: "Sep 07",
      type: "ZIP",
    },
    {
      id: "f-3",
      name: "Brand_Design_Tokens_v4.fig",
      size: "18.4 MB",
      uploadedBy: "Kavita Rao",
      date: "Sep 04",
      type: "Figma",
    },
  ] as AttachedTeamFile[],
};

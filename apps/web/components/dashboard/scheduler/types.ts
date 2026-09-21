export type Platform = "Instagram" | "YouTube" | "LinkedIn" | "Twitter / X" | "Facebook" | "TikTok";

export type PostStatus = "Scheduled" | "Publishing" | "Queued" | "Draft" | "Published";

export interface ScheduledEvent {
  id: string;
  brand: string;
  platform: Platform;
  time: string;
  date: string; // "YYYY-MM-DD"
  dayNumber: number;
  title: string;
  status: PostStatus;
  mediaType: "Reel" | "Shorts" | "Carousel" | "Article" | "Feed Post";
  color: {
    badge: string;
    accent: string;
    dot: string;
    glow: string;
    text: string;
    border: string;
  };
}

export interface DayEventsMap {
  [day: number]: ScheduledEvent[];
}

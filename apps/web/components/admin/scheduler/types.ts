export type PostStatus = "draft" | "scheduled" | "published";
export type PostType = "reel" | "blog";

export type ScheduledPost = {
  id: number;
  title: string;
  slug: string;
  type: PostType;
  content: string;
  media_url: string | null;
  thumbnail: string | null;
  status: PostStatus;
  scheduled_at: string | null;
  created_at?: string;
  meta_post_id?: string | null;
  publish_error?: string | null;
};

export type SchedulerStats = {
  total: number;
  scheduled: number;
  published: number;
  today: number;
  draft: number;
};

export type PostStatus = "draft" | "scheduled" | "published";
export type PostType = "reel" | "blog";

export type SocialPlatform = "instagram" | "facebook" | "linkedin" | "youtube" | "twitter";

export type ReelPost = {
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
  brand?: string | null;
  platforms?: string[];
};

export type ReelFormData = Omit<ReelPost, "id" | "created_at">;

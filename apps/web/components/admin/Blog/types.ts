export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  media_url?: string | null;
  thumbnail?: string | null;
  cover_url?: string | null;
  status: "published" | "scheduled" | "draft";
  scheduled_at?: string | null;
  created_at: string;
  updated_at?: string;
  type: "blog";
  // Parsed / dynamic fields
  category?: string;
  tags?: string[];
  reading_time?: string;
  seo_description?: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  cover_url: string;
  category: string;
  tags: string;
  seo_description: string;
  status: "published" | "scheduled" | "draft";
  scheduled_date: string;
  scheduled_time: string;
}

export function parseBlogContent(rawContent: string) {
  let body = rawContent || "";
  let category = "AI Technology";
  let tags: string[] = ["AI", "Media"];
  let seoDescription = "";

  if (!rawContent) {
    return { body: "", category, tags, seoDescription };
  }

  const match = rawContent.match(/^---\s*(\{[\s\S]*?\})\s*---\s*([\s\S]*)$/);
  if (match) {
    try {
      const meta = JSON.parse(match[1]);
      category = meta.category || "AI Technology";
      tags = Array.isArray(meta.tags) ? meta.tags : [];
      seoDescription = meta.seoDescription || "";
      body = match[2];
    } catch (e) {
      body = rawContent;
    }
  }

  return { body, category, tags, seoDescription };
}

export function serializeBlogContent(body: string, category: string, tags: string[], seoDescription: string) {
  const meta = {
    category: category || "AI Technology",
    tags: tags || [],
    seoDescription: seoDescription || "",
  };
  return `---\n${JSON.stringify(meta, null, 2)}\n---\n${body.trim()}`;
}

export function calculateReadingTime(text: string): string {
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

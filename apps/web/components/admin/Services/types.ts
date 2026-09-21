export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  category?: string;
  icon?: string;
  cover_image?: string | null;
  featured?: boolean;
  status?: "draft" | "published" | string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

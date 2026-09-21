export interface ReelItem {
  id: number | string;
  title: string;
  brand: string;
  brandAvatar: string;
  category: string;
  views: string;
  duration: string;
  video: string;
  thumbnail: string;
  aiBadge: string;
  verified?: boolean;
}

export const reels: ReelItem[] = [
  {
    id: 1,
    title: "Weekend Goa Escape",
    brand: "Online Go",
    brandAvatar: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=80",
    category: "Travel",
    views: "128K",
    duration: "0:24",
    video: "/reels/goa.mp4",
    thumbnail: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
    aiBadge: "Sora 2",
    verified: true,
  },
  {
    id: 2,
    title: "Autonomous Fleet Telematics",
    brand: "GoLogix",
    brandAvatar: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&auto=format&fit=crop&q=80",
    category: "Logistics",
    views: "94K",
    duration: "0:18",
    video: "/reels/logix.mp4",
    thumbnail: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80",
    aiBadge: "Runway Gen-3",
    verified: true,
  },
  {
    id: 3,
    title: "Smart Luxury Penthouse Living",
    brand: "PG Info",
    brandAvatar: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&auto=format&fit=crop&q=80",
    category: "Real Estate",
    views: "215K",
    duration: "0:30",
    video: "/reels/pg.mp4",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    aiBadge: "Midjourney v6",
    verified: true,
  },
  {
    id: 4,
    title: "Holographic AI Media OS Launch",
    brand: "WorknAI",
    brandAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    category: "AI Tech",
    views: "340K",
    duration: "0:45",
    video: "/reels/worknai.mp4",
    thumbnail: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
    aiBadge: "Kling 1.5",
    verified: true,
  },
  {
    id: 5,
    title: "Bioluminescent Ancient Rainforest",
    brand: "Online Go",
    brandAvatar: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=80",
    category: "Nature",
    views: "182K",
    duration: "0:22",
    video: "/reels/goa.mp4",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    aiBadge: "Pika 2.1",
    verified: true,
  },
  {
    id: 6,
    title: "Cyberpunk EV Urban Run",
    brand: "GoLogix",
    brandAvatar: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&auto=format&fit=crop&q=80",
    category: "3D Motion",
    views: "112K",
    duration: "0:28",
    video: "/reels/logix.mp4",
    thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80",
    aiBadge: "Hailuo AI",
    verified: true,
  },
];
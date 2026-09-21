import Navbar from "../components/navbar/Navbar";
import Hero from "../components/hero/Hero";
import Stories from "../components/story/Stories";
import ExploreUniverse from "../components/universe/ExploreUniverse";
import ToolsHub from "../components/tools/ToolsHub";
import Solutions from "../components/solutions/Solutions";
import Showcase from "../components/showcase/Showcase";
import Academy from "../components/academy/Academy";
import Reels from "../components/reels/Reels";
import Testimonials from "../components/testimonials/Testimonials";
import ContactSection from "../components/contact/ContactSection";
import Pricing from "../components/pricing/Pricing";

async function getPublishedReels() {
  try {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!rawUrl) return [];
    const apiBase = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;
    const res = await fetch(`${apiBase}/posts?type=reel&status=published`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    console.error("Failed to load SSR published reels:", err);
  }
  return [];
}

export default async function Home() {
  const publishedReels = await getPublishedReels();

  return (
    <main className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/30 selection:text-white">
      {/* Dynamic Role & Section Aware Glass Navbar */}
      <Navbar />

      {/* 1. Hero Section (id="home") */}
      <Hero />

      {/* 2. Trending Brands Marquee & Universe Overview */}
      <div className="mx-auto max-w-[1280px] px-6">
        <Stories />
        <ExploreUniverse />
      </div>

      {/* 3. Intelligence — AI Tools Hub (id="intelligence") */}
      <ToolsHub />

      {/* 4. Solutions — 4 Premium Services (id="solutions") */}
      <Solutions />

      {/* 5. Showcase — Filterable Portfolio & Case Studies (id="showcase") */}
      <Showcase />

      {/* 6. Creator Academy (id="academy") */}
      <Academy />

      {/* 7. Creators — Vertical Reels Studio (id="creators") */}
      <Reels initialDbReels={publishedReels} />

      {/* 8. Success Stories & Testimonials */}
      <Testimonials />

      {/* 10. Let's Talk — Contact & Lead Directive (id="contact") */}
      <ContactSection />

      {/* Pricing & Final Retainer Tiers -- Ready to enable when needed */}
      {/* <Pricing /> */}
    </main>
  );
}
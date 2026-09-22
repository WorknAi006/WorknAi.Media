import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/ui/CursorGlow";
import CustomCursor from "@/components/ui/CustomCursor";
import WorldMapGlowBackground from "@/components/background/WorldMapGlowBackground";
import AuthSync from "@/components/auth/AuthSync";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WorknAI.media - AI Business Media Platform",
  description: "AI Powered Business Media OS",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${outfit.variable} ${plusJakarta.className} h-full antialiased scroll-smooth`}
    >
      <body className={`${plusJakarta.className} min-h-full flex flex-col relative bg-[#02040a] text-white overflow-x-hidden font-sans`}>
        <AuthSync />

        {/* Full-Page Fixed Luminous World Map Glow Background */}
        <WorldMapGlowBackground />

        {/* Global fixed cursor-follow glow background */}
        <CursorGlow />

        {/* Premium custom glowing orb cursor */}
        <CustomCursor />

        {/* Website content layer */}
        <div className="relative z-10 flex min-h-full flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}

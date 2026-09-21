import { Metadata } from "next";
import { AIStudioWorkspace } from "@/components/ai-studio";

export const metadata: Metadata = {
  title: "AI Studio | WorknAI Media",
  description:
    "Autonomous multi-modal generation studio for Instagram posts, Reels, YouTube scripts, high-converting Ads, and 4K photorealistic images.",
};

export default function AIStudioPage() {
  return (
    <div className="w-full">
      <AIStudioWorkspace />
    </div>
  );
}

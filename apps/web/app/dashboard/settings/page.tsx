import { Metadata } from "next";
import { SettingsWorkspace } from "@/components/settings";

export const metadata: Metadata = {
  title: "Settings & Preferences | WorknAI Media",
  description:
    "Manage brand identity, AI model preferences, notifications, team access, themes, and security settings.",
};

export default function SettingsPage() {
  return (
    <div className="w-full">
      <SettingsWorkspace />
    </div>
  );
}

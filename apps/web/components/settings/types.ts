export type SettingsSectionId =
  | "profile"
  | "brand"
  | "ai"
  | "notifications"
  | "team"
  | "theme"
  | "security";

export interface SettingsTabItem {
  id: SettingsSectionId;
  label: string;
  description: string;
  badge?: string;
}

export interface ProfileSettings {
  fullName: string;
  email: string;
  role: string;
  bio: string;
  timezone: string;
  avatar: string;
}

export interface BrandSettings {
  activeBrand: string;
  brandVoice: string;
  targetDemographic: string;
  primaryColor: string;
  accentColor: string;
  guidelineSummary: string;
  autoWatermark: boolean;
}

export interface AIPerferenceItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  category: "operations" | "content" | "security";
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Creative Director" | "Editor" | "Viewer";
  avatar: string;
  status: "Active" | "Pending";
  lastActive: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  previewGradient: string;
  accentHex: string;
}

export interface SecuritySession {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface APIKeyItem {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
}

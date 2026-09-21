import ReelsCMS from "@/components/admin/Reels/ReelsCMS";

export const metadata = {
  title: "Draft Reels | WorknAI Dashboard",
};

export default function DashboardDraftReelsPage() {
  return <ReelsCMS basePath="/dashboard/reels" status="draft" />;
}

import ReelsCMS from "@/components/admin/Reels/ReelsCMS";

export const metadata = {
  title: "All Reels | WorknAI Dashboard",
};

export default function DashboardReelsPage() {
  return <ReelsCMS basePath="/dashboard/reels" status="all" />;
}

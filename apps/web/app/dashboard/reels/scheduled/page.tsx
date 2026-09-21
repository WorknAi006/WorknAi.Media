import ReelsCMS from "@/components/admin/Reels/ReelsCMS";

export const metadata = {
  title: "Scheduled Reels | WorknAI Dashboard",
};

export default function DashboardScheduledReelsPage() {
  return <ReelsCMS basePath="/dashboard/reels" status="scheduled" />;
}

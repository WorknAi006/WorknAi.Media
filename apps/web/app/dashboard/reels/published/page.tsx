import ReelsCMS from "@/components/admin/Reels/ReelsCMS";

export const metadata = {
  title: "Published Reels | WorknAI Dashboard",
};

export default function DashboardPublishedReelsPage() {
  return <ReelsCMS basePath="/dashboard/reels" status="published" />;
}

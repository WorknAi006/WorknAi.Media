import ReelsCMS from "@/components/admin/Reels/ReelsCMS";

export const metadata = {
  title: "Scheduled Reels | WorknAI Admin CMS",
};

export default function AdminScheduledReelsPage() {
  return <ReelsCMS basePath="/admin/reels" status="scheduled" />;
}

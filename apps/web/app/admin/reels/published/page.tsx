import ReelsCMS from "@/components/admin/Reels/ReelsCMS";

export const metadata = {
  title: "Published Reels | WorknAI Admin CMS",
};

export default function AdminPublishedReelsPage() {
  return <ReelsCMS basePath="/admin/reels" status="published" />;
}

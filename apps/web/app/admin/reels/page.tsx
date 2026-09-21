import ReelsCMS from "@/components/admin/Reels/ReelsCMS";

export const metadata = {
  title: "All Reels | WorknAI Admin CMS",
};

export default function ReelsAdminPage() {
  return <ReelsCMS basePath="/admin/reels" status="all" />;
}

import ReelsCMS from "@/components/admin/Reels/ReelsCMS";

export const metadata = {
  title: "Draft Reels | WorknAI Admin CMS",
};

export default function AdminDraftReelsPage() {
  return <ReelsCMS basePath="/admin/reels" status="draft" />;
}

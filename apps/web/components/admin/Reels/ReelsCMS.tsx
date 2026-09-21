"use client";

import ReelsPageLayout from "./ReelsPageLayout";
import { ReelFilterStatus } from "./useReels";

interface Props {
  basePath?: string;
  status?: ReelFilterStatus;
}

export default function ReelsCMS({
  basePath = "/admin/reels",
  status = "all",
}: Props) {
  return <ReelsPageLayout basePath={basePath} status={status} />;
}

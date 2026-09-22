"use client";

import { useEffect } from "react";
import { syncSessionFromCookies } from "@/app/lib/session";

/**
 * Keeps localStorage in step with the shared session cookies so a login on
 * worknai.media also works on admin.worknai.media (and vice versa).
 */
export default function AuthSync() {
  useEffect(() => {
    syncSessionFromCookies();
  }, []);

  return null;
}

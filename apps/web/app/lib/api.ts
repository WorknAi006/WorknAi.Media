export function getApiBase(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || "";
  if (!url) return "";
  return url.endsWith("/api") ? url : `${url}/api`;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  // Try localStorage first
  const stored = localStorage.getItem("worknai_token");
  if (stored) return stored;

  // Fallback to cookie
  const match = document.cookie.match(/(?:^|; )worknai_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function getAuthHeaders(extraHeaders?: HeadersInit): HeadersInit {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (extraHeaders) {
    Object.assign(headers, extraHeaders);
  }
  return headers;
}

export async function getUsers() {
  const API = getApiBase();
  const res = await fetch(`${API}/users`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });

  return res.json();
}

export async function createUser(data: {
  name: string;
  email: string;
}) {
  const API = getApiBase();
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
}
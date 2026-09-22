/**
 * Client-side session cookie helpers.
 *
 * In production the public site (worknai.media) and the admin panel
 * (admin.worknai.media) are different hosts, so auth cookies are scoped to
 * NEXT_PUBLIC_COOKIE_DOMAIN (e.g. ".worknai.media") to be shared by both.
 */

const SESSION_COOKIES = ["worknai_token", "worknai_role", "worknai_user"];
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function cookieAttributes(): string {
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "";
  const onDomain =
    domain && window.location.hostname.endsWith(domain.replace(/^\./, ""));
  const secure = window.location.protocol === "https:";
  return `; path=/${onDomain ? `; domain=${domain}` : ""}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

export function setSessionCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; max-age=${MAX_AGE}${cookieAttributes()}`;
}

export function clearSession(): void {
  const attrs = cookieAttributes();
  for (const name of SESSION_COOKIES) {
    // Clear both the domain-wide cookie and any legacy host-only cookie
    document.cookie = `${name}=; max-age=0${attrs}`;
    document.cookie = `${name}=; path=/; max-age=0`;
  }
  localStorage.removeItem("worknai_token");
  localStorage.removeItem("worknai_user");
}

/**
 * Copies the shared session cookies into this origin's localStorage.
 * Needed after logging in on one subdomain and landing on the other,
 * because many CMS components read the token from localStorage.
 */
export function syncSessionFromCookies(): void {
  const read = (name: string) => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const token = read("worknai_token");
  const user = read("worknai_user");

  if (token && localStorage.getItem("worknai_token") !== token) {
    localStorage.setItem("worknai_token", token);
  }
  if (user && !localStorage.getItem("worknai_user")) {
    localStorage.setItem("worknai_user", user);
  }
}

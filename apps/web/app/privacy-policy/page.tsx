import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - WorknAI.media",
  description: "How WorknAI.media collects, uses and deletes data, including connected Instagram accounts.",
};

const CONTACT_EMAIL = "worknaiintern1@gmail.com";
const LAST_UPDATED = "September 23, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 text-zinc-300 leading-relaxed">
      <Link href="/" className="text-sm text-blue-400 hover:underline">
        ← Back to WorknAI.media
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated: {LAST_UPDATED}</p>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-white">1. Who we are</h2>
        <p>
          WorknAI.media (&quot;we&quot;, &quot;us&quot;) operates the website worknai.media and an internal
          dashboard that our team uses to create, schedule and publish content (reels, posts and blogs)
          for brands we manage.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">2. Information we collect</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Contact details you submit through our forms (name, email, phone, message).</li>
          <li>Account details of our team members who log in to the dashboard.</li>
          <li>
            When an Instagram Business or Creator account is connected through Instagram Login: the
            Instagram account ID, username, display name, profile picture and an access token issued by
            Meta.
          </li>
        </ul>
        <p>We never ask for or store Instagram passwords. Login happens directly on Instagram.</p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">3. How we use Instagram data</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>To show which Instagram account is connected to which brand in our dashboard.</li>
          <li>To publish and schedule reels and posts that our team prepares for that account.</li>
          <li>To read and reply to comments and messages on that account when our team manages them.</li>
        </ul>
        <p>
          We do not sell Instagram data, use it for advertising, or share it with third parties other than
          Meta when publishing content.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">4. Storage and security</h2>
        <p>
          Data is stored in our database hosted with Supabase. Instagram access tokens are encrypted
          before storage and refreshed automatically before they expire.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">5. Data retention</h2>
        <p>
          Connected account data is kept only while the account stays connected. When an account is
          disconnected or deleted from our dashboard, its access token is no longer used, and deleted
          accounts are removed from our database.
        </p>
      </section>

      <section id="data-deletion" className="mt-8 space-y-3 scroll-mt-20">
        <h2 className="text-xl font-semibold text-white">6. Data deletion instructions</h2>
        <p>You can remove your Instagram data from WorknAI.media at any time:</p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>
            Open Instagram → Settings → <strong>Apps and websites</strong>, find WorknAI Media and tap{" "}
            <strong>Remove</strong>. This revokes our access immediately.
          </li>
          <li>
            Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:underline">{CONTACT_EMAIL}</a>{" "}
            with the subject &quot;Data deletion request&quot; and your Instagram username. We delete all
            stored data for that account within 30 days and confirm by email.
          </li>
        </ol>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">7. Contact</h2>
        <p>
          Questions about this policy:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:underline">{CONTACT_EMAIL}</a>
        </p>
      </section>
    </main>
  );
}

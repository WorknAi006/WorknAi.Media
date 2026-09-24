import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - WorknAI.media",
  description: "Terms for using the WorknAI.media website and dashboard.",
};

const CONTACT_EMAIL = "worknaiintern1@gmail.com";
const LAST_UPDATED = "September 23, 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 text-zinc-300 leading-relaxed">
      <Link href="/" className="text-sm text-blue-400 hover:underline">
        ← Back to WorknAI.media
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated: {LAST_UPDATED}</p>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-white">1. Acceptance</h2>
        <p>
          By using worknai.media or the WorknAI.media dashboard, you agree to these terms. If you do not
          agree, please do not use the service.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">2. The service</h2>
        <p>
          WorknAI.media provides a dashboard for our team to create, schedule and publish content such as
          reels, posts and blogs to Instagram accounts of brands we manage, using the official Instagram
          API provided by Meta.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">3. Connected Instagram accounts</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>You may only connect Instagram accounts you own or are authorized to manage.</li>
          <li>Content published through the dashboard must follow Instagram&apos;s Terms of Use and Community Guidelines.</li>
          <li>You can revoke access at any time from Instagram → Settings → Apps and websites.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">4. Dashboard accounts</h2>
        <p>
          Dashboard access is given only to our admins and employees. You are responsible for keeping your
          login details private and for actions taken with your account.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">5. Availability and liability</h2>
        <p>
          We aim to keep the service running but do not guarantee uninterrupted availability, for example
          when Meta changes or limits its API. To the extent permitted by law, WorknAI.media is not liable
          for indirect losses arising from use of the service.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">6. Privacy</h2>
        <p>
          How we handle data is described in our{" "}
          <Link href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">7. Contact</h2>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-400 hover:underline">{CONTACT_EMAIL}</a>
        </p>
      </section>
    </main>
  );
}

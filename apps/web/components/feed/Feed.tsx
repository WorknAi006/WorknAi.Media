"use client";

import { posts } from "./data";
import PostCard from "./PostCard";

export default function Feed() {
  return (
    <section className="mt-24">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Trending Feed</h2>
        <button className="text-blue-400">View All</button>
      </div>

     <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
  {posts.map((post, index) => (
    <div
      key={post.id}
      className="animate-[fadeIn_.5s_ease]"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <PostCard {...post} />
    </div>
  ))}
</div>
    </section>
  );
}
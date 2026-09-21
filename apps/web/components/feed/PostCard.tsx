"use client";

import { motion } from "framer-motion";
import { Heart, Eye, CheckCircle } from "lucide-react";

type PostProps = {
  company: string;
  category: string;
  image: string;
  caption: string;
  likes: number;
  views: string;
  verified: boolean;
};

export default function PostCard({
  company,
  category,
  image,
  caption,
  likes,
  views,
  verified,
}: PostProps) {
  return (
    <motion.article
      whileHover={{ y: -10 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={company}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Category Badge */}
        <span className="absolute left-4 top-4 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-medium">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{company}</h3>

          {verified && (
            <CheckCircle size={18} className="fill-blue-500 text-blue-500" />
          )}
        </div>

        <p className="text-sm leading-6 text-zinc-300">{caption}</p>

        <div className="flex items-center gap-6 border-t border-white/10 pt-3 text-sm text-zinc-400">
          <button className="flex items-center gap-1 transition hover:text-red-500">
            <Heart size={18} />
            {likes}
          </button>

          <span className="flex items-center gap-1">
            <Eye size={18} />
            {views}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
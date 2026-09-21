import React from "react";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  counts?: Record<string, number>;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  counts = {},
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
      {categories.map((category) => {
        const isSelected =
          selectedCategory.toLowerCase() === category.toLowerCase();
        const count = counts[category.toLowerCase()] ?? counts[category];

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`group relative flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
              isSelected
                ? "border border-cyan-400/50 bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                : "border border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{category}</span>
            {count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                  isSelected
                    ? "bg-black/30 text-cyan-200"
                    : "bg-white/10 text-zinc-400 group-hover:text-white"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

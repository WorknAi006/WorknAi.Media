"use client";

type StoryProps = {
  name: string;
  category: string;
  color: string;
};

export default function StoryCard({
  name,
  category,
  color,
}: StoryProps) {
  return (
    <div className="flex min-w-[92px] flex-col items-center gap-2">
      <div
        className={`h-20 w-20 rounded-full ${color} p-[3px] transition hover:scale-105`}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#050816] text-xl font-bold">
          {name.charAt(0)}
        </div>
      </div>

      <p className="text-sm font-medium">{name}</p>
      <span className="text-xs text-zinc-500">{category}</span>
    </div>
  );
}
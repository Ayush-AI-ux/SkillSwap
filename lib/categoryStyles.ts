import { Clapperboard, Palette, Music2, PenLine, Megaphone, Sparkles, type LucideIcon } from "lucide-react";

type Tint = { icon: LucideIcon; bg: string; fg: string };

const MAP: Record<string, Tint> = {
  "Video Editing": { icon: Clapperboard, bg: "bg-rose-50", fg: "text-rose-500" },
  "Graphic Design": { icon: Palette, bg: "bg-orange-50", fg: "text-orange-500" },
  "Music & Audio": { icon: Music2, bg: "bg-sky-50", fg: "text-sky-500" },
  Writing: { icon: PenLine, bg: "bg-violet-50", fg: "text-violet-500" },
  "Social Media": { icon: Megaphone, bg: "bg-emerald-50", fg: "text-emerald-500" },
};

const FALLBACK: Tint = { icon: Sparkles, bg: "bg-indigo-50", fg: "text-indigo-500" };

export const categoryStyle = (category: string): Tint => MAP[category] ?? FALLBACK;
export const iconFor = (category: string): LucideIcon => categoryStyle(category).icon;
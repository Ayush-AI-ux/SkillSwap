import { Clapperboard, Palette, Music2, PenLine, Megaphone, Sparkles, type LucideIcon } from "lucide-react";

export type CategoryStyle = {
  icon: LucideIcon;
  bg: string;
  fg: string;
  gradient: string;
  badgeBg: string;
  badgeFg: string;
  accentBorder: string;
  glow: string;
  tag: string;
  avgDelivery: string;
};

const MAP: Record<string, CategoryStyle> = {
  "Video Editing": {
    icon: Clapperboard,
    bg: "bg-rose-50",
    fg: "text-rose-500",
    gradient: "from-rose-500 via-pink-500 to-rose-600",
    badgeBg: "bg-rose-500/10 text-rose-700 border-rose-200/60",
    badgeFg: "text-rose-600",
    accentBorder: "border-rose-200 hover:border-rose-400",
    glow: "shadow-rose-500/15",
    tag: "🔥 High Demand",
    avgDelivery: "24-48 hrs",
  },
  "Graphic Design": {
    icon: Palette,
    bg: "bg-orange-50",
    fg: "text-orange-500",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    badgeBg: "bg-orange-500/10 text-orange-700 border-orange-200/60",
    badgeFg: "text-orange-600",
    accentBorder: "border-orange-200 hover:border-orange-400",
    glow: "shadow-orange-500/15",
    tag: "🎨 Top Rated",
    avgDelivery: "1-2 days",
  },
  "Music & Audio": {
    icon: Music2,
    bg: "bg-sky-50",
    fg: "text-sky-500",
    gradient: "from-cyan-500 via-sky-500 to-indigo-500",
    badgeBg: "bg-sky-500/10 text-sky-700 border-sky-200/60",
    badgeFg: "text-sky-600",
    accentBorder: "border-sky-200 hover:border-sky-400",
    glow: "shadow-sky-500/15",
    tag: "🎧 Audio Pro",
    avgDelivery: "2-3 days",
  },
  Writing: {
    icon: PenLine,
    bg: "bg-violet-50",
    fg: "text-violet-500",
    gradient: "from-violet-500 via-purple-500 to-indigo-600",
    badgeBg: "bg-violet-500/10 text-violet-700 border-violet-200/60",
    badgeFg: "text-violet-600",
    accentBorder: "border-violet-200 hover:border-violet-400",
    glow: "shadow-violet-500/15",
    tag: "✍️ SEO Ready",
    avgDelivery: "24 hrs",
  },
  "Social Media": {
    icon: Megaphone,
    bg: "bg-emerald-50",
    fg: "text-emerald-500",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    badgeBg: "bg-emerald-500/10 text-emerald-700 border-emerald-200/60",
    badgeFg: "text-emerald-600",
    accentBorder: "border-emerald-200 hover:border-emerald-400",
    glow: "shadow-emerald-500/15",
    tag: "🚀 Viral Growth",
    avgDelivery: "1-2 days",
  },
};

const FALLBACK: CategoryStyle = {
  icon: Sparkles,
  bg: "bg-indigo-50",
  fg: "text-indigo-500",
  gradient: "from-violet-500 to-indigo-600",
  badgeBg: "bg-indigo-500/10 text-indigo-700 border-indigo-200/60",
  badgeFg: "text-indigo-600",
  accentBorder: "border-indigo-200 hover:border-indigo-400",
  glow: "shadow-indigo-500/15",
  tag: "⭐ Featured",
  avgDelivery: "1-3 days",
};

export const categoryStyle = (category: string): CategoryStyle => MAP[category] ?? FALLBACK;
export const iconFor = (category: string): LucideIcon => categoryStyle(category).icon;
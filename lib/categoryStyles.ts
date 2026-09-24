import { Clapperboard, Palette, Music2, PenLine, Share2, Sparkles, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "Video Editing": Clapperboard,
  "Graphic Design": Palette,
  "Music & Audio": Music2,
  Writing: PenLine,
  "Social Media": Share2,
};

export const iconFor = (category: string): LucideIcon => ICONS[category] ?? Sparkles;
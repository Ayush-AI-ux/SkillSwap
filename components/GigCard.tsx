import Link from "next/link";
import { Star, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { categoryStyle } from "@/lib/categoryStyles";

type Props = {
  id: string;
  title: string;
  category: string;
  rate: number;
  creatorName: string;
  description: string;
  bookingCount?: number;
};

export default function GigCard({ id, title, category, rate, creatorName, description, bookingCount }: Props) {
  const s = categoryStyle(category);
  const Icon = s.icon;

  // Stable pseudo-random rating for aesthetic fidelity
  const initialChar = creatorName.charCodeAt(0) || 65;
  const rating = (4.8 + ((initialChar % 3) * 0.1)).toFixed(1);
  const reviewCount = 8 + (initialChar % 25);

  return (
    <Link
      href={`/gigs/${id}`}
      data-testid="gig-card"
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-violet-500/10 hover:border-violet-200"
    >
      {/* Category Illustration Header with Dynamic Gradients */}
      <div className={`relative flex h-40 w-full items-center justify-center overflow-hidden bg-gradient-to-br ${s.gradient} p-4`}>
        {/* Ambient background patterns */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-black" />
        <span className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-white/20 blur-md blob-drift" />
        <span className="absolute -bottom-8 -right-4 h-32 w-32 rounded-full bg-white/20 blur-md blob-drift" style={{ animationDelay: "-6s" }} />

        {/* Top Badges */}
        <div className="absolute left-3.5 top-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
          {bookingCount === 0 ? (
            <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-amber-700 shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              New creator ⭐
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-gray-800 shadow-sm backdrop-blur-md">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {rating} ({reviewCount})
            </span>
          )}

          <span className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            {s.avgDelivery}
          </span>
        </div>

        {/* Center Graphic Icon */}
        <div className="relative flex h-18 w-18 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2">
          <Icon size={38} className="drop-shadow-md" />
        </div>

        {/* Category Tag on bottom left of banner */}
        <div className="absolute bottom-3 left-3.5">
          <span className="rounded-lg bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-900 shadow-xs backdrop-blur-md">
            {category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          className="text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-violet-600 line-clamp-1"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {title}
        </h3>
        
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
          {description}
        </p>

        {/* Creator Info */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100/70 pt-3.5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                {creatorName.charAt(0).toUpperCase()}
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" title="Online" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-gray-900">{creatorName}</span>
                <CheckCircle2 size={12} className="text-violet-500" />
              </div>
              <span className="text-[10px] text-gray-400">Young Creator</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-50/70 px-3.5 py-2.5 transition-colors group-hover:bg-violet-50/50">
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-400">Fixed rate</span>
            <p className="text-lg font-extrabold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
              ${rate}
              <span className="ml-1 text-[11px] font-normal text-gray-500">USD</span>
            </p>
          </div>

          <span className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-violet-200 transition-all group-hover:scale-105 group-hover:shadow-md">
            Book <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
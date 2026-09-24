import Link from "next/link";
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
  return (
    <Link
      href={`/gigs/${id}`}
      data-testid="gig-card"
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className={`relative flex h-32 items-center justify-center overflow-hidden ${s.bg}`}>
        <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/50" />
        <span className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-white/50" />
        <Icon size={46} className={`relative ${s.fg} transition group-hover:scale-110`} />
        {bookingCount === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-600 shadow-sm">
            New creator
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">{category}</p>
        <h3 className="mt-1 text-base font-bold leading-snug text-gray-900">{title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">{description}</p>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
            {creatorName.charAt(0).toUpperCase()}
          </span>
          {creatorName}
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="text-lg font-extrabold text-gray-900">
            ${rate}
            <span className="text-xs font-medium text-gray-400"> / gig</span>
          </p>
          <span className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-violet-700">
            Book now
          </span>
        </div>
      </div>
    </Link>
  );
}
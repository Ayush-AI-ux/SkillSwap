import Link from "next/link";
import { iconFor } from "@/lib/categoryStyles";

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
  const Icon = iconFor(category);
  return (
    <Link
      href={`/gigs/${id}`}
      data-testid="gig-card"
      className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
          <Icon size={20} />
        </span>
        {bookingCount === 0 && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            New creator
          </span>
        )}
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-500">{category}</p>
      <h3 className="mt-1 text-base font-semibold leading-snug text-gray-900">{title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{description}</p>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 mt-5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
            {creatorName.charAt(0).toUpperCase()}
          </span>
          {creatorName}
        </div>
        <span className="text-base font-semibold text-gray-900">${rate}</span>
      </div>
    </Link>
  );
}
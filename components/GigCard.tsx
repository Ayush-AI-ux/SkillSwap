import Link from "next/link";

type Props = {
  id: string;
  title: string;
  category: string;
  rate: number;
  creatorName: string;
  description: string;
};

export default function GigCard({ id, title, category, rate, creatorName, description }: Props) {
  return (
    <Link
      href={`/gigs/${id}`}
      data-testid="gig-card"
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <span className="text-xs font-medium text-indigo-600">{category}</span>
      <h3 className="mt-1 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{description}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-500">by {creatorName}</span>
        <span className="font-semibold text-gray-900">${rate}</span>
      </div>
    </Link>
  );
}
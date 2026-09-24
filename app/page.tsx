import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import { recommendedScore } from "@/lib/ranking";
import GigCard from "@/components/GigCard";

export const dynamic = "force-dynamic"; // always show fresh data

type SearchParams = Promise<{ q?: string; category?: string; sort?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { q = "", category = "", sort = "recommended" } = await searchParams;

  const gigs = await prisma.gig.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { _count: { select: { bookings: true } } },
  });

  const sorted = [...gigs].sort((a, b) => {
    if (sort === "newest") return b.createdAt.getTime() - a.createdAt.getTime();
    if (sort === "price-asc") return a.rate - b.rate;
    if (sort === "price-desc") return b.rate - a.rate;
    return (
      recommendedScore(b.createdAt, b._count.bookings) -
      recommendedScore(a.createdAt, a._count.bookings)
    );
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Find a creator for your project</h1>

      <form method="GET" className="mt-6 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search gigs..."
          aria-label="Search gigs"
          data-testid="search-input"
          className="min-w-[200px] flex-1 rounded-lg border px-3 py-2"
        />
        <select name="category" defaultValue={category} aria-label="Category" data-testid="category-filter" className="rounded-lg border px-3 py-2">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} aria-label="Sort" data-testid="sort-select" className="rounded-lg border px-3 py-2">
          <option value="recommended">Recommended (new creators boosted)</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <button type="submit" data-testid="search-button" className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700">
          Search
        </button>
      </form>

      {sorted.length === 0 ? (
        <p data-testid="empty-state" className="mt-10 text-center text-gray-500">
          No gigs found. Try a different search or category.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((g) => (
            <GigCard key={g.id} {...g} />
          ))}
        </div>
      )}
    </div>
  );
}
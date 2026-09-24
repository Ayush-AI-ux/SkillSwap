import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import { recommendedScore } from "@/lib/ranking";
import GigCard from "@/components/GigCard";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; category?: string; sort?: string }>;

const field =
  "rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100";

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

  const chipHref = (c: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (sort !== "recommended") p.set("sort", sort);
    if (c) p.set("category", c);
    const s = p.toString();
    return s ? `/?${s}` : "/";
  };

  return (
    <div>
      <section className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Find a creator for your project
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Book young creators for editing, design, music, writing and more.
        </p>
      </section>

      <form method="GET" className="mt-8 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search gigs..."
            aria-label="Search gigs"
            autoComplete="off"
            data-testid="search-input"
            className={`${field} w-full pl-10`}
          />
        </div>
        <select name="category" defaultValue={category} aria-label="Category" autoComplete="off" data-testid="category-filter" className={field}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} aria-label="Sort" autoComplete="off" data-testid="sort-select" className={field}>
          <option value="recommended">Recommended (new creators boosted)</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <button
          type="submit"
          data-testid="search-button"
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {["", ...CATEGORIES].map((c) => (
          <Link
            key={c || "all"}
            href={chipHref(c)}
            className={`rounded-full border px-3.5 py-1.5 font-medium transition ${
              category === c
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
            }`}
          >
            {c || "All"}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
        <span>{sorted.length} gig{sorted.length === 1 ? "" : "s"}</span>
        {sort === "recommended" && (
          <span>Recommended ranking boosts new creators so newcomers get seen.</span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div data-testid="empty-state" className="mt-6 rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
          No gigs found. Try a different search or category.
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((g) => (
            <GigCard key={g.id} {...g} bookingCount={g._count.bookings} />
          ))}
        </div>
      )}
    </div>
  );
}
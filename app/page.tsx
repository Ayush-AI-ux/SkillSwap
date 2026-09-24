import Link from "next/link";
import { ArrowRight, Search, Clapperboard, Palette, Music2, CheckCircle2, Sparkles, CalendarCheck, Bell, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import { categoryStyle } from "@/lib/categoryStyles";
import { recommendedScore } from "@/lib/ranking";
import GigCard from "@/components/GigCard";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; category?: string; sort?: string; min?: string; max?: string }>;

const field =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { q = "", category = "", sort = "recommended", min = "", max = "" } = await searchParams;

  const minN = parseInt(min, 10);
  const maxN = parseInt(max, 10);
  const rate = {
    ...(Number.isFinite(minN) ? { gte: minN } : {}),
    ...(Number.isFinite(maxN) ? { lte: maxN } : {}),
  };

  const gigs = await prisma.gig.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(Object.keys(rate).length ? { rate } : {}),
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

  const grouped = await prisma.gig.groupBy({ by: ["category"], _count: { _all: true } });
  const counts: Record<string, number> = Object.fromEntries(grouped.map((g) => [g.category, g._count._all]));
  const creatorCount = (await prisma.gig.findMany({ distinct: ["creatorName"], select: { creatorName: true } })).length;

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
    <div className="space-y-14">
      {/* Hero */}
      <section className="relative grid items-center gap-10 md:grid-cols-2">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3.5 py-1.5 text-xs font-semibold text-violet-700">
            <Sparkles size={14} /> The marketplace for young creators
          </span>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-gray-900 md:text-6xl">
            Turn your skills
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">into income</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-500">
            Post a gig in a minute. Clients find you, book you, and you decide who to say yes to.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#browse" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700">
              Explore gigs <ArrowRight size={16} />
            </a>
            <Link href="/gigs/new" className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300">
              Post a gig
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {["A", "M", "K", "R"].map((l, i) => (
                <span key={l} className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${["bg-violet-500", "bg-rose-400", "bg-sky-500", "bg-emerald-500"][i]}`}>
                  {l}
                </span>
              ))}
            </div>
            <p><strong className="text-gray-900">{creatorCount}+ creators</strong> already earning on SkillSwap</p>
          </div>
        </div>

        <div className="relative hidden h-[26rem] md:block">
          <div className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-br from-violet-200 via-indigo-100 to-pink-100" />
          <div className="absolute -right-2 top-4 h-40 w-40 rounded-full bg-violet-300/40 blur-3xl" />

          <div className="float absolute left-2 top-10 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500"><Clapperboard size={22} /></span>
            <div><p className="text-sm font-bold">Video editing</p><p className="text-xs text-gray-500">From $35</p></div>
          </div>

          <div className="float-slow absolute right-0 top-24 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Bell size={20} /></span>
            <div><p className="text-sm font-bold">New booking!</p><p className="text-xs text-gray-500">Sam wants Logo design</p></div>
          </div>

          <div className="absolute left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-[40%] rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500"><Palette size={24} /></span>
              <div>
                <p className="font-bold">Logo design</p>
                <p className="text-xs text-gray-500">by Kabir</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-2xl font-extrabold">$80</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Accepted
              </span>
            </div>
          </div>

          <div className="float absolute bottom-6 left-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-500 shadow-xl"><Music2 size={26} /></div>
        </div>
      </section>

      {/* Fairness banner (DP3, visible) */}
      <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600"><ShieldCheck size={24} /></span>
        <div className="flex-1">
          <p className="font-bold">Fresh voices get seen first</p>
          <p className="text-sm text-gray-500">Our Recommended ranking boosts new gigs and creators with few bookings, so newcomers are not buried by early listers.</p>
        </div>
      </section>

      {/* Popular categories */}
      <section>
        <h2 className="text-xl font-bold">Popular categories</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
          {CATEGORIES.map((c) => {
            const s = categoryStyle(c);
            const Icon = s.icon;
            return (
              <Link
                key={c}
                href={`/?category=${encodeURIComponent(c)}#browse`}
                className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} ${s.fg}`}>
                  <Icon size={22} />
                </span>
                <p className="mt-3 text-sm font-semibold">{c}</p>
                <p className="text-xs text-gray-400">{counts[c] ?? 0} gigs</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Browse */}
      <section id="browse" className="scroll-mt-24">
        <h2 className="text-2xl font-bold">Browse gigs</h2>
        <p className="mt-1 text-gray-500">Find the perfect creator for your needs.</p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          <form method="GET" action="/#browse" className="h-fit space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search gigs..."
                aria-label="Search gigs"
                autoComplete="off"
                data-testid="search-input"
                className={`${field} pl-10`}
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Category</label>
              <select id="category" name="category" defaultValue={category} autoComplete="off" data-testid="category-filter" className={field}>
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Price range ($)</p>
              <div className="flex gap-2">
                <input name="min" type="number" min={0} defaultValue={min} placeholder="Min" aria-label="Minimum price" autoComplete="off" data-testid="min-price" className={field} />
                <input name="max" type="number" min={0} defaultValue={max} placeholder="Max" aria-label="Maximum price" autoComplete="off" data-testid="max-price" className={field} />
              </div>
            </div>

            <div>
              <label htmlFor="sort" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Sort by</label>
              <select id="sort" name="sort" defaultValue={sort} autoComplete="off" data-testid="sort-select" className={field}>
                <option value="recommended">Recommended (new creators boosted)</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>

            <button type="submit" data-testid="search-button" className="w-full rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700">
              Search
            </button>
            <Link href="/#browse" className="block text-center text-sm text-gray-500 hover:text-gray-900">Clear filters</Link>
          </form>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
              <span><strong className="text-gray-900">{sorted.length}</strong> gig{sorted.length === 1 ? "" : "s"} found</span>
              {sort === "recommended" && <span>Recommended boosts new creators so newcomers get seen.</span>}
            </div>

            {sorted.length === 0 ? (
              <div data-testid="empty-state" className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
                No gigs found. Try a different search or category.
              </div>
            ) : (
              <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {sorted.map((g) => (
                  <GigCard key={g.id} {...g} bookingCount={g._count.bookings} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-center text-2xl font-bold">How SkillSwap works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "1. Post a gig", text: "List your service with a title, category, rate and description." },
            { icon: CalendarCheck, title: "2. Get booked", text: "Clients send requests and can see how many are already waiting." },
            { icon: CheckCircle2, title: "3. Accept or decline", text: "You choose. Declines come with a reason so clients can move on fast." },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><Icon size={26} /></span>
                <h3 className="mt-4 font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{s.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-700 p-10 text-white shadow-xl md:p-14">
        <span className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <span className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" />
        <h2 className="relative text-3xl font-extrabold">Got a skill? Start earning today.</h2>
        <p className="relative mt-2 max-w-lg text-violet-100">Post your first gig in under a minute. No account needed.</p>
        <Link href="/gigs/new" className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-violet-700 transition hover:-translate-y-0.5">
          Post a gig <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
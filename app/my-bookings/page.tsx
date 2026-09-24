import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { categoryStyle } from "@/lib/categoryStyles";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

type SP = Promise<{ email?: string; status?: string }>;
const TABS = ["All", "Pending", "Accepted", "Declined"];

export default async function MyBookings({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const email = (sp.email ?? "").trim();
  const tab = TABS.includes(sp.status ?? "") ? (sp.status as string) : "All";

  const all = email
    ? await prisma.booking.findMany({
        where: { clientEmail: { equals: email, mode: "insensitive" } },
        include: { gig: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const pendingAll = all.length
    ? await prisma.booking.findMany({
        where: { gigId: { in: all.map((b) => b.gigId) }, status: "Pending" },
        select: { gigId: true, createdAt: true },
      })
    : [];

  const bookings = tab === "All" ? all : all.filter((b) => b.status === tab);
  const tabCount = (t: string) => (t === "All" ? all.length : all.filter((b) => b.status === t).length);
  const tabHref = (t: string) => `/my-bookings?email=${encodeURIComponent(email)}${t === "All" ? "" : `&status=${t}`}`;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight">My bookings</h1>
      <p className="mt-1 text-gray-500">Enter the email you used when booking to track your gigs and their status.</p>

      <form method="GET" className="mt-6 flex flex-wrap gap-3">
        <label htmlFor="email" className="sr-only">Your email</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={email}
          autoComplete="off"
          placeholder="you@example.com"
          data-testid="email-input"
          className="min-w-[240px] flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
        <button type="submit" data-testid="lookup-button" className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
          Show my bookings
        </button>
      </form>
      <p className="mt-2 text-sm text-gray-400">Demo tip: try sam@example.com</p>

      {email && (
        <div className="mt-6 flex flex-wrap gap-2 text-sm font-medium">
          {TABS.map((t) => (
            <Link
              key={t}
              href={tabHref(t)}
              className={`rounded-full px-4 py-1.5 transition ${
                tab === t ? "bg-violet-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-violet-300"
              }`}
            >
              {t} ({tabCount(t)})
            </Link>
          ))}
        </div>
      )}

      {!email ? null : bookings.length === 0 ? (
        <p data-testid="empty-state" className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
          {all.length === 0 ? `No bookings found for ${email}.` : `No ${tab.toLowerCase()} bookings.`}
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {bookings.map((b) => {
            const samePending = pendingAll.filter((p) => p.gigId === b.gigId);
            const position = samePending.filter((p) => p.createdAt < b.createdAt).length + 1;
            const s = categoryStyle(b.gig.category);
            const Icon = s.icon;
            return (
              <div key={b.id} data-testid="my-booking-item" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.fg}`}><Icon size={22} /></span>
                    <div>
                      <Link href={`/gigs/${b.gigId}`} className="text-base font-bold hover:text-violet-700">{b.gig.title}</Link>
                      <p className="text-sm text-gray-500">
                        {b.gig.category} · ${b.gig.rate} · by {b.gig.creatorName}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                {b.status === "Pending" && (
                  <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800" data-testid="queue-position">
                    Waiting for {b.gig.creatorName} to respond. You are #{position} of {samePending.length} pending request{samePending.length === 1 ? "" : "s"} for this gig.
                  </p>
                )}

                {b.status === "Accepted" && (
                  <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{b.gig.creatorName} accepted your request.</p>
                )}

                {b.status === "Declined" && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm" data-testid="declined-panel">
                    <p className="text-gray-700">
                      {b.gig.creatorName} couldn&apos;t take this one.
                      {b.declineReason && <> Reason: <strong>{b.declineReason}</strong>.</>}
                    </p>
                    <div className="mt-3 flex gap-3">
                      <Link href={`/?category=${encodeURIComponent(b.gig.category)}#browse`} data-testid="find-similar" className="rounded-lg bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-700">
                        Find similar gigs
                      </Link>
                      <Link href={`/gigs/${b.gigId}`} className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-semibold">
                        Request again
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
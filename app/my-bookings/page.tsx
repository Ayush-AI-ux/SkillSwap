import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

type SP = Promise<{ email?: string }>;

export default async function MyBookings({ searchParams }: { searchParams: SP }) {
  const email = ((await searchParams).email ?? "").trim();

  const bookings = email
    ? await prisma.booking.findMany({
        where: { clientEmail: { equals: email, mode: "insensitive" } },
        include: { gig: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const pendingAll = bookings.length
    ? await prisma.booking.findMany({
        where: { gigId: { in: bookings.map((b) => b.gigId) }, status: "Pending" },
        select: { gigId: true, createdAt: true },
      })
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold">My bookings</h1>
      <p className="mt-2 text-gray-600">Enter the email you used when booking.</p>

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
          className="min-w-[240px] flex-1 rounded-lg border bg-white px-3 py-2"
        />
        <button type="submit" data-testid="lookup-button" className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700">
          Show my bookings
        </button>
      </form>
      <p className="mt-2 text-sm text-gray-400">Demo tip: try sam@example.com</p>

      {!email ? null : bookings.length === 0 ? (
        <p data-testid="empty-state" className="mt-10 text-center text-gray-500">
          No bookings found for {email}.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((b) => {
            const samePending = pendingAll.filter((p) => p.gigId === b.gigId);
            const position = samePending.filter((p) => p.createdAt < b.createdAt).length + 1;
            return (
              <div key={b.id} data-testid="my-booking-item" className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/gigs/${b.gigId}`} className="text-lg font-semibold hover:underline">{b.gig.title}</Link>
                    <p className="text-sm text-gray-500">
                      {b.gig.category} · ${b.gig.rate} · by {b.gig.creatorName}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                {b.status === "Pending" && (
                  <p className="mt-3 text-sm text-gray-600" data-testid="queue-position">
                    Waiting for {b.gig.creatorName} to respond. You are #{position} of {samePending.length} pending request{samePending.length === 1 ? "" : "s"} for this gig.
                  </p>
                )}

                {b.status === "Accepted" && (
                  <p className="mt-3 text-sm text-green-700">{b.gig.creatorName} accepted your request.</p>
                )}

                {b.status === "Declined" && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-4 text-sm" data-testid="declined-panel">
                    <p className="text-gray-700">
                      {b.gig.creatorName} couldn&apos;t take this one.
                      {b.declineReason && <> Reason: <strong>{b.declineReason}</strong>.</>}
                    </p>
                    <div className="mt-3 flex gap-3">
                      <Link
                        href={`/?category=${encodeURIComponent(b.gig.category)}`}
                        data-testid="find-similar"
                        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white"
                      >
                        Find similar gigs
                      </Link>
                      <Link href={`/gigs/${b.gigId}`} className="rounded-lg border bg-white px-4 py-2 font-medium">
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
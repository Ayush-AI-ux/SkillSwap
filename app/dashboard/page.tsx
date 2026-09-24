import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DECLINE_REASONS } from "@/lib/categories";
import { acceptBooking, declineBooking } from "@/app/actions";
import StatusBadge from "@/components/StatusBadge";
import SubmitButton from "@/components/SubmitButton";

export const dynamic = "force-dynamic";

type SP = Promise<{ creator?: string }>;
const ORDER: Record<string, number> = { Pending: 0, Accepted: 1, Declined: 2 };

export default async function Dashboard({ searchParams }: { searchParams: SP }) {
  const { creator = "" } = await searchParams;

  const creators = await prisma.gig.findMany({
    distinct: ["creatorName"],
    select: { creatorName: true },
    orderBy: { creatorName: "asc" },
  });

  const found = await prisma.booking.findMany({
    where: creator ? { gig: { creatorName: creator } } : {},
    include: { gig: true },
    orderBy: { createdAt: "desc" },
  });
  const bookings = [...found].sort((a, b) => ORDER[a.status] - ORDER[b.status]);

  const count = (s: string) => bookings.filter((b) => b.status === s).length;
  const acceptedGigs = new Set(bookings.filter((b) => b.status === "Accepted").map((b) => b.gigId));
  const pendingPerGig: Record<string, number> = {};
  bookings.filter((b) => b.status === "Pending").forEach((b) => {
    pendingPerGig[b.gigId] = (pendingPerGig[b.gigId] ?? 0) + 1;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Creator dashboard</h1>
      <p className="mt-2 text-gray-600">Review booking requests and accept or decline them.</p>

      <form method="GET" className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="creator" className="block text-sm font-medium">Creator</label>
          <select id="creator" name="creator" defaultValue={creator} autoComplete="off" data-testid="creator-select" className="mt-1 rounded-lg border bg-white px-3 py-2">
            <option value="">All creators</option>
            {creators.map((c) => (
              <option key={c.creatorName} value={c.creatorName}>{c.creatorName}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700">
          View dashboard
        </button>
      </form>

      <div className="mt-6 flex gap-3 text-sm">
        <span className="rounded-lg bg-amber-100 px-3 py-1">Pending: {count("Pending")}</span>
        <span className="rounded-lg bg-green-100 px-3 py-1">Accepted: {count("Accepted")}</span>
        <span className="rounded-lg bg-red-100 px-3 py-1">Declined: {count("Declined")}</span>
      </div>

      {bookings.length === 0 ? (
        <p data-testid="empty-state" className="mt-10 text-center text-gray-500">No bookings yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((b) => {
            const others = (pendingPerGig[b.gigId] ?? 0) - 1;
            return (
              <div key={b.id} data-testid="booking-item" className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/gigs/${b.gigId}`} className="text-lg font-semibold hover:underline">{b.gig.title}</Link>
                    <p className="text-sm text-gray-500">
                      {b.clientName} ({b.clientEmail}) · {b.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {b.message && <p className="mt-2 text-gray-700">&ldquo;{b.message}&rdquo;</p>}
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                {b.status === "Pending" && (
                  <div className="mt-4 space-y-3">
                    {others > 0 && (
                      <p className="text-sm text-indigo-700" data-testid="queue-note">
                        {others} other pending request{others === 1 ? "" : "s"} for this gig.
                      </p>
                    )}
                    {acceptedGigs.has(b.gigId) && (
                      <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800" data-testid="conflict-warning">
                        Heads up: you already accepted another request for this gig. Accepting this one too could double-book you.
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                      <form action={acceptBooking}>
                        <input type="hidden" name="id" value={b.id} />
                        <SubmitButton variant="success" pendingText="Accepting..." testId="accept-button">Accept</SubmitButton>
                      </form>
                      <form action={declineBooking} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={b.id} />
                        <select name="reason" aria-label="Decline reason" autoComplete="off" data-testid="decline-reason" className="rounded-lg border bg-white px-3 py-2 text-sm">
                          {DECLINE_REASONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <SubmitButton variant="danger" pendingText="Declining..." testId="decline-button">Decline</SubmitButton>
                      </form>
                    </div>
                  </div>
                )}

                {b.status === "Declined" && b.declineReason && (
                  <p className="mt-3 text-sm text-gray-500">Reason given: {b.declineReason}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
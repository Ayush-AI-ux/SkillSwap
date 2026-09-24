import Link from "next/link";
import { Inbox, Clock, CheckCircle2, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DECLINE_REASONS } from "@/lib/categories";
import { categoryStyle } from "@/lib/categoryStyles";
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

  const stats = [
    { label: "Total bookings", value: bookings.length, icon: Inbox, bg: "bg-violet-50", fg: "text-violet-600" },
    { label: "Pending", value: count("Pending"), icon: Clock, bg: "bg-amber-50", fg: "text-amber-600" },
    { label: "Accepted", value: count("Accepted"), icon: CheckCircle2, bg: "bg-emerald-50", fg: "text-emerald-600" },
    { label: "Declined", value: count("Declined"), icon: XCircle, bg: "bg-red-50", fg: "text-red-600" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Creator dashboard</h1>
          <p className="mt-1 text-gray-500">Review booking requests and accept or decline them.</p>
        </div>
        <form method="GET" className="flex items-end gap-2">
          <div>
            <label htmlFor="creator" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Creator</label>
            <select id="creator" name="creator" defaultValue={creator} autoComplete="off" data-testid="creator-select" className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm">
              <option value="">All creators</option>
              {creators.map((c) => (
                <option key={c.creatorName} value={c.creatorName}>{c.creatorName}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
            View dashboard
          </button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg} ${s.fg}`}><Icon size={20} /></span>
              <div>
                <p className="text-2xl font-extrabold leading-none">{s.value}</p>
                <p className="mt-1 text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-10 text-lg font-bold">Incoming bookings</h2>

      {bookings.length === 0 ? (
        <p data-testid="empty-state" className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
          No bookings yet.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {bookings.map((b) => {
            const others = (pendingPerGig[b.gigId] ?? 0) - 1;
            const s = categoryStyle(b.gig.category);
            const Icon = s.icon;
            return (
              <div key={b.id} data-testid="booking-item" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.fg}`}><Icon size={22} /></span>
                    <div>
                      <Link href={`/gigs/${b.gigId}`} className="text-base font-bold hover:text-violet-700">{b.gig.title}</Link>
                      <p className="text-sm text-gray-500">
                        {b.clientName} ({b.clientEmail}) · {b.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      {b.message && <p className="mt-2 text-sm text-gray-700">&ldquo;{b.message}&rdquo;</p>}
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                {b.status === "Pending" && (
                  <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                    {others > 0 && (
                      <p className="text-sm text-violet-700" data-testid="queue-note">
                        {others} other pending request{others === 1 ? "" : "s"} for this gig.
                      </p>
                    )}
                    {acceptedGigs.has(b.gigId) && (
                      <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800" data-testid="conflict-warning">
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
                        <select name="reason" aria-label="Decline reason" autoComplete="off" data-testid="decline-reason" className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm">
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
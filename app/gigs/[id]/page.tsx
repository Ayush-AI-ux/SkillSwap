import Link from "next/link";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { iconFor } from "@/lib/categoryStyles";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type SP = Promise<{ posted?: string }>;

export default async function GigPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { id } = await params;
  const { posted } = await searchParams;

  const gig = await prisma.gig.findUnique({ where: { id } });
  if (!gig) notFound();

  const pending = await prisma.booking.count({ where: { gigId: id, status: "Pending" } });
  const Icon = iconFor(gig.category);

  return (
    <div>
      {posted && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800" data-testid="posted-banner">
          Your gig is live!{" "}
          <Link className="font-semibold underline" href={`/dashboard?creator=${encodeURIComponent(gig.creatorName)}`}>
            Go to your creator dashboard
          </Link>
        </div>
      )}

      <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">&larr; Back to all gigs</Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
              <Icon size={22} />
            </span>
            <span className="text-sm font-medium uppercase tracking-wide text-gray-500">{gig.category}</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight" data-testid="gig-detail-title">{gig.title}</h1>

          <div className="mt-5 flex items-center justify-between border-y border-gray-200 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
                {gig.creatorName.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="font-medium">{gig.creatorName}</p>
                <p className="text-xs text-gray-500">Creator</p>
              </div>
            </div>
            <p className="text-2xl font-bold">${gig.rate}</p>
          </div>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-500">About this gig</h2>
          <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-700">{gig.description}</p>
        </div>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Book this gig</h2>

          <p className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-700" data-testid="pending-note">
            <Users size={16} className="mt-0.5 shrink-0 text-gray-500" />
            <span>
              {pending === 0
                ? "No pending requests. You would be first in line."
                : `${pending} other pending request${pending === 1 ? "" : "s"} for this gig. You can still book, and you'll see your place in the queue under My bookings.`}
            </span>
          </p>

          <div className="mt-5">
            <BookingForm gigId={gig.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
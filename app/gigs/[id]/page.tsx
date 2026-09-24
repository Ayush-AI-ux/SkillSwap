import Link from "next/link";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { categoryStyle } from "@/lib/categoryStyles";
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
  const s = categoryStyle(gig.category);
  const Icon = s.icon;

  return (
    <div>
      {posted && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800" data-testid="posted-banner">
          Your gig is live!{" "}
          <Link className="font-semibold underline" href={`/dashboard?creator=${encodeURIComponent(gig.creatorName)}`}>
            Go to your creator dashboard
          </Link>
        </div>
      )}

      <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">&larr; Back to all gigs</Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className={`relative flex h-44 items-center justify-center overflow-hidden ${s.bg}`}>
            <span className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/50" />
            <span className="absolute -bottom-12 right-6 h-44 w-44 rounded-full bg-white/50" />
            <Icon size={64} className={`relative ${s.fg}`} />
          </div>
          <div className="p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">{gig.category}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight" data-testid="gig-detail-title">{gig.title}</h1>

            <div className="mt-5 flex items-center justify-between border-y border-gray-100 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                  {gig.creatorName.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold">{gig.creatorName}</p>
                  <p className="text-xs text-gray-500">Creator</p>
                </div>
              </div>
              <p className="text-3xl font-extrabold">${gig.rate}<span className="text-sm font-medium text-gray-400"> / gig</span></p>
            </div>

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-400">About this gig</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-700">{gig.description}</p>
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Book this gig</h2>

          <p className="mt-3 flex items-start gap-2 rounded-xl bg-violet-50 p-3 text-sm text-violet-800" data-testid="pending-note">
            <Users size={16} className="mt-0.5 shrink-0" />
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
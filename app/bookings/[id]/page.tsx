import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function BookingConfirmation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id }, include: { gig: true } });
  if (!booking) notFound();

  const ahead = await prisma.booking.count({
    where: { gigId: booking.gigId, status: "Pending", createdAt: { lt: booking.createdAt } },
  });

  return (
    <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 text-center shadow-sm" data-testid="confirmation">
      <h1 className="text-2xl font-bold text-green-700">Booking request sent!</h1>
      <p className="mt-2 text-gray-600">
        {booking.gig.creatorName} will review your request for <strong>{booking.gig.title}</strong>.
      </p>

      <div className="mt-6 space-y-2 rounded-lg bg-gray-50 p-4 text-left text-sm">
        <p>Reference: <strong data-testid="booking-ref">{booking.id.slice(-8).toUpperCase()}</strong></p>
        <p>Name: {booking.clientName}</p>
        <p>Email: {booking.clientEmail}</p>
        <p className="flex items-center gap-2">Status: <StatusBadge status={booking.status} /></p>
        <p>Your place in the queue: #{ahead + 1}</p>
      </div>

      <div className="mt-6 flex justify-center gap-4 text-sm font-medium">
        <Link className="rounded-lg bg-indigo-600 px-4 py-2 text-white" href={`/my-bookings?email=${encodeURIComponent(booking.clientEmail)}`}>
          View my bookings
        </Link>
        <Link className="rounded-lg border px-4 py-2" href="/">Browse more gigs</Link>
      </div>
    </div>
  );
}
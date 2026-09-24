import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, Mail, User, Hash } from "lucide-react";
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

  const rows = [
    { icon: Hash, label: "Reference", value: <strong data-testid="booking-ref">{booking.id.slice(-8).toUpperCase()}</strong> },
    { icon: User, label: "Name", value: booking.clientName },
    { icon: Mail, label: "Email", value: booking.clientEmail },
  ];

  return (
    <div className="fade-up mx-auto max-w-xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl" data-testid="confirmation">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 px-8 py-10 text-center text-white">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
          <CheckCircle2 size={36} />
        </span>
        <h1 className="mt-4 text-3xl font-extrabold">Booking request sent!</h1>
        <p className="mt-2 text-emerald-50">
          {booking.gig.creatorName} will review your request for <strong>{booking.gig.title}</strong>.
        </p>
      </div>

      <div className="p-8">
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
          {rows.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.label} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="flex items-center gap-2 text-gray-500"><Icon size={16} /> {r.label}</span>
                <span className="text-gray-900">{r.value}</span>
              </div>
            );
          })}
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="flex items-center gap-2 text-gray-500"><Clock size={16} /> Status</span>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        <p className="mt-4 rounded-xl bg-violet-50 p-3 text-center text-sm text-violet-800">
          Your place in the queue: <strong>#{ahead + 1}</strong>
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-semibold">
          <Link className="rounded-xl bg-violet-600 px-5 py-2.5 text-white shadow-md shadow-violet-200 hover:bg-violet-700" href={`/my-bookings?email=${encodeURIComponent(booking.clientEmail)}`}>
            View my bookings
          </Link>
          <Link className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 hover:border-violet-300" href="/">
            Browse more gigs
          </Link>
        </div>
      </div>
    </div>
  );
}
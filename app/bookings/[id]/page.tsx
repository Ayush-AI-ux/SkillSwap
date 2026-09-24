import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Sparkles, Clock, ArrowRight, User, Mail, Calendar, Compass, ShieldCheck } from "lucide-react";
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
    <div className="fade-up mx-auto max-w-xl py-4" data-testid="confirmation">
      {/* Main card */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 sm:p-10 shadow-xl shadow-violet-100/50 text-center">
        {/* Top gradient celebratory stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-violet-600" />

        {/* Ambient glow in background */}
        <div className="pointer-events-none absolute -top-12 left-1/2 h-36 w-72 -translate-x-1/2 rounded-full bg-emerald-100/60 blur-3xl" />

        {/* Animated celebratory checkmark icon */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-200 ring-8 ring-emerald-50">
          <CheckCircle2 size={44} className="stroke-[2.5]" />
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-white shadow-sm">
            <Sparkles size={14} />
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-3xl font-extrabold tracking-tight text-gray-900"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Booking Request Sent!
        </h1>
        <p className="mt-2.5 text-base text-gray-600">
          <span className="font-semibold text-gray-900">{booking.gig.creatorName}</span> has received your request for{" "}
          <strong className="text-violet-700 font-semibold">{booking.gig.title}</strong>.
        </p>

        {/* Queue position & steps indicator */}
        <div className="mt-8 rounded-2xl border border-violet-100/80 bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/30 p-5 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-violet-100/60">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-violet-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Queue Position</span>
            </div>
            <span className="rounded-full bg-violet-600 px-3 py-0.5 text-xs font-bold text-white shadow-sm">
              #{ahead + 1} in queue
            </span>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            {ahead === 0
              ? "You're first in line! The creator will review your request shortly."
              : `There are ${ahead} other pending ${ahead === 1 ? "request" : "requests"} ahead of you.`}
          </p>

          {/* Simple step visualizer */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-violet-100/70 p-2.5 font-semibold text-violet-900 ring-1 ring-violet-300">
              <span className="block text-[10px] text-violet-600 font-bold uppercase tracking-wider">Step 1</span>
              <span>Requested ✓</span>
            </div>
            <div className="rounded-xl bg-amber-50 p-2.5 font-semibold text-amber-900 ring-1 ring-amber-200">
              <span className="block text-[10px] text-amber-600 font-bold uppercase tracking-wider">Step 2</span>
              <span>Reviewing</span>
            </div>
            <div className="rounded-xl bg-gray-50 p-2.5 font-medium text-gray-400">
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Step 3</span>
              <span>Confirmed</span>
            </div>
          </div>
        </div>

        {/* Booking details card */}
        <div className="mt-6 divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-gray-50/60 text-left text-sm">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs font-medium text-gray-500">Reference code</span>
            <strong
              data-testid="booking-ref"
              className="font-mono text-sm font-bold tracking-wider text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-lg ring-1 ring-violet-200"
            >
              {booking.id.slice(-8).toUpperCase()}
            </strong>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <User size={13} className="text-gray-400" /> Client name
            </span>
            <span className="font-semibold text-gray-900">{booking.clientName}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Mail size={13} className="text-gray-400" /> Client email
            </span>
            <span className="font-medium text-gray-800">{booking.clientEmail}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs font-medium text-gray-500">Current status</span>
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            className="btn-press focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:shadow-xl hover:shadow-violet-300"
            href={`/my-bookings?email=${encodeURIComponent(booking.clientEmail)}`}
          >
            <span>View my bookings</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            className="btn-press focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 hover:border-gray-300"
            href="/"
          >
            <Compass size={16} className="text-gray-500" />
            <span>Browse more gigs</span>
          </Link>
        </div>

        {/* Safe notice */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>No credit card required. Free direct booking.</span>
        </div>
      </div>
    </div>
  );
}
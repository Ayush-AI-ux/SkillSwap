import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, ArrowLeft, Star, Clock, CheckCircle2, ShieldCheck, Sparkles, FileCheck, MessageSquare } from "lucide-react";
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

  const initialChar = gig.creatorName.charAt(0).toUpperCase();

  return (
    <div className="fade-up mx-auto max-w-5xl space-y-6">
      {/* Live Posted Celebration Banner */}
      {posted && (
        <div
          className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 text-sm text-emerald-900 shadow-sm"
          data-testid="posted-banner"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold shadow-xs">
              ✓
            </span>
            <div>
              <p className="font-bold">Your gig is now live on the marketplace!</p>
              <p className="text-xs text-emerald-700">New gigs receive our DP3 fairness boost automatically.</p>
            </div>
          </div>
          <Link
            className="btn-press rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
            href={`/dashboard?creator=${encodeURIComponent(gig.creatorName)}`}
          >
            Go to creator dashboard →
          </Link>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-violet-600"
        >
          <ArrowLeft size={14} /> Back to all gigs
        </Link>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          Category: <strong className="text-gray-900">{gig.category}</strong>
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Gig Details & Creator Story */}
        <div className="space-y-6 lg:col-span-7">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            {/* Category Hero Banner */}
            <div className={`relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br ${s.gradient} p-6 text-white`}>
              <span className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-md blob-drift" />
              <span className="absolute -bottom-14 right-6 h-48 w-48 rounded-full bg-white/20 blur-md blob-drift" style={{ animationDelay: "-8s" }} />

              <div className="relative flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-white backdrop-blur-md shadow-xl">
                  <Icon size={48} className="drop-shadow-md" />
                </div>
                <span className="mt-3 rounded-full bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  {gig.category}
                </span>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-6 sm:p-8">
              <span className="inline-block rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
                {s.tag}
              </span>

              <h1
                className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900"
                style={{ fontFamily: "var(--font-outfit)" }}
                data-testid="gig-detail-title"
              >
                {gig.title}
              </h1>

              {/* Creator Spotlight Strip */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-extrabold text-white shadow-md">
                      {initialChar}
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
                        {gig.creatorName}
                      </p>
                      <CheckCircle2 size={14} className="text-violet-500" />
                    </div>
                    <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" /> 5.0 Rating · Verified Young Creator
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total rate</span>
                  <p className="text-2xl font-extrabold text-gray-900 leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                    ${gig.rate}
                    <span className="ml-1 text-xs font-normal text-gray-400">USD</span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">About this gig</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{gig.description}</p>
              </div>

              {/* Deliverables Checklist */}
              <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/40 p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">Standard with this service</h3>
                <div className="grid gap-2.5 sm:grid-cols-2 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    <span>Direct creator 1-on-1 communication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck size={15} className="text-emerald-500" />
                    <span>Full commercial & personal rights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-emerald-500" />
                    <span>Estimated {s.avgDelivery} delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-emerald-500" />
                    <span>Revisions included until satisfied</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card & Queue Info */}
        <div className="lg:col-span-5">
          <div className="gradient-border overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-lg lg:sticky lg:top-24 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
                Book This Gig
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">Send your request directly to {gig.creatorName}.</p>
            </div>

            {/* Transparent Queue Note (Decision Point 2) */}
            <div
              className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 via-indigo-50/40 to-white p-4 text-xs text-violet-900"
              data-testid="pending-note"
            >
              <Users size={18} className="mt-0.5 shrink-0 text-violet-600" />
              <div className="space-y-1">
                <span className="font-bold">Transparent Queue Position (DP2)</span>
                <p className="text-[11px] leading-relaxed text-violet-800/90">
                  {pending === 0
                    ? "No pending requests right now. You will be #1 in line!"
                    : `${pending} other pending request${pending === 1 ? "" : "s"} for this gig. You can book now, and your position will be tracked in My Bookings.`}
                </p>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>Creator fixed rate</span>
                <span className="font-semibold text-gray-900">${gig.rate}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Platform commission</span>
                <span className="font-bold text-emerald-600">$0.00 (FREE)</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200/80 pt-1.5 font-bold text-gray-900 text-sm">
                <span>Total to pay upon completion</span>
                <span className="text-violet-700">${gig.rate}</span>
              </div>
            </div>

            {/* Booking Form */}
            <BookingForm gigId={gig.id} />

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Safe booking · No upfront payment required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
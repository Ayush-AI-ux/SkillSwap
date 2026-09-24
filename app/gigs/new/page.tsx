import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import PostGigForm from "@/components/PostGigForm";

export default function NewGigPage() {
  return (
    <div className="fade-up mx-auto max-w-5xl space-y-6">
      {/* Navigation & Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-violet-600"
        >
          <ArrowLeft size={14} /> Back to Browse
        </Link>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
              Create a Creator Gig
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              List your creative service. Zero fees, instant public listing, and algorithmic boost for new creators.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3.5 py-1.5 border border-emerald-200/60 text-xs font-bold text-emerald-700">
            <ShieldCheck size={16} />
            <span>0% Commission · Instant Setup</span>
          </div>
        </div>
      </div>

      {/* Main Form + Live Preview Card */}
      <div className="gradient-border overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
        <PostGigForm />
      </div>
    </div>
  );
}
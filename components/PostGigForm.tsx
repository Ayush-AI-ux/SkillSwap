"use client";

import { useActionState, useState } from "react";
import { Sparkles, Star, Zap, CheckCircle2, ArrowRight, Lightbulb, Type, BadgeDollarSign } from "lucide-react";
import { createGig } from "@/app/actions";
import { CATEGORIES } from "@/lib/categories";
import { categoryStyle } from "@/lib/categoryStyles";
import type { FormState } from "@/lib/types";
import SubmitButton from "./SubmitButton";

const input = "input-base text-sm";
const errorText = "mt-1.5 text-xs font-semibold text-red-600";

export default function PostGigForm() {
  const [state, formAction] = useActionState<FormState, FormData>(createGig, {});
  const v = state.values ?? {};
  const e = state.errors ?? {};

  // Interactive live state for preview
  const [title, setTitle] = useState(v.title || "");
  const [category, setCategory] = useState(v.category || "");
  const [rate, setRate] = useState(v.rate || "");
  const [description, setDescription] = useState(v.description || "");
  const [creatorName, setCreatorName] = useState(v.creatorName || "");

  const s = categoryStyle(category || "Video Editing");
  const Icon = s.icon;
  const initialChar = (creatorName.trim().charAt(0) || "Y").toUpperCase();

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Left Column: Form */}
      <div className="lg:col-span-7">
        <form action={formAction} noValidate className="space-y-6" data-testid="post-gig-form">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Gig Title
              </label>
              <span className="text-[11px] text-gray-400">Clear & specific</span>
            </div>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="gig-title"
              className={input}
              placeholder="e.g. YouTube & TikTok Video Editing"
              maxLength={100}
            />
            {e.title && <p className={errorText} data-testid="error-title">{e.title}</p>}
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Category
              </label>
              <span className="text-[11px] text-gray-400">Where clients discover you</span>
            </div>

            {/* Quick Category Selector Pills */}
            <div className="mb-2 flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                    category === c
                      ? "bg-violet-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              data-testid="gig-category"
              className={input}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {e.category && <p className={errorText} data-testid="error-category">{e.category}</p>}
          </div>

          {/* Rate */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="rate" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Fixed Rate ($USD)
              </label>
              <span className="text-[11px] text-gray-400">0% platform commission</span>
            </div>

            {/* Quick Price Benchmarks */}
            <div className="mb-2 flex gap-2">
              {[25, 45, 75, 120].map((amount) => (
                <button
                  type="button"
                  key={amount}
                  onClick={() => setRate(String(amount))}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    rate === String(amount)
                      ? "bg-violet-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
              <input
                id="rate"
                name="rate"
                type="number"
                min={1}
                step={1}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                data-testid="gig-rate"
                className={`${input} pl-8`}
                placeholder="50"
              />
            </div>
            {e.rate && <p className={errorText} data-testid="error-rate">{e.rate}</p>}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Description & Deliverables
              </label>
              <span className="text-[11px] text-gray-400">{description.length}/1000 chars</span>
            </div>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="gig-description"
              className={input}
              placeholder="What software do you use? How fast is turnaround? What revisions are included?"
              maxLength={1000}
            />
            {e.description && <p className={errorText} data-testid="error-description">{e.description}</p>}
          </div>

          {/* Creator Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="creatorName" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Your Display Name
              </label>
              <span className="text-[11px] text-gray-400">Used for your creator profile</span>
            </div>
            <input
              id="creatorName"
              name="creatorName"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              data-testid="gig-creator"
              className={input}
              placeholder="e.g. Maya or Maya K."
            />
            {e.creatorName && <p className={errorText} data-testid="error-creatorName">{e.creatorName}</p>}
          </div>

          <div className="pt-2">
            <SubmitButton pendingText="Publishing your gig..." testId="post-gig-submit">
              Publish Gig Now
            </SubmitButton>
          </div>
        </form>
      </div>

      {/* Right Column: Live Real-time Card Preview & Tips */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" /> Live Marketplace Preview
            </span>
            <span className="text-[11px] font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
              Updates as you type
            </span>
          </div>

          {/* Live Card Preview (Visual clone of GigCard) */}
          <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-500/10 transition-all">
            {/* Header Artwork */}
            <div className={`relative flex h-40 w-full items-center justify-center overflow-hidden bg-gradient-to-br ${s.gradient} p-4 transition-colors`}>
              <span className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-white/20 blur-md" />
              <span className="absolute -bottom-8 -right-4 h-32 w-32 rounded-full bg-white/20 blur-md" />

              <div className="absolute left-3.5 top-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-amber-700 shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  New creator ⭐
                </span>
                <span className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  {s.avgDelivery}
                </span>
              </div>

              <div className="relative flex h-18 w-18 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md shadow-lg">
                <Icon size={38} className="drop-shadow-md" />
              </div>

              <div className="absolute bottom-3 left-3.5">
                <span className="rounded-lg bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-900 shadow-xs">
                  {category || "Category"}
                </span>
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-5">
              <h3 className="text-base font-bold leading-snug text-gray-900 line-clamp-1" style={{ fontFamily: "var(--font-outfit)" }}>
                {title || "Your Gig Title Will Appear Here"}
              </h3>
              <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                {description || "Describe what makes your service stand out. Clients love knowing turnaround times and deliverables."}
              </p>

              {/* Creator row */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                      {initialChar}
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-gray-900">{creatorName || "Your Name"}</span>
                      <CheckCircle2 size={12} className="text-violet-500" />
                    </div>
                    <span className="text-[10px] text-gray-400">Young Creator</span>
                  </div>
                </div>
              </div>

              {/* Price Row */}
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-50/70 px-3.5 py-2.5">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Fixed rate</span>
                  <p className="text-lg font-extrabold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
                    ${rate || "50"}
                    <span className="ml-1 text-[11px] font-normal text-gray-500">USD</span>
                  </p>
                </div>
                <span className="flex items-center gap-1 rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs">
                  Book <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Creator Tips Sidebar */}
        <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/50 to-indigo-50/30 p-6 text-xs text-gray-600 space-y-3">
          <div className="flex items-center gap-2 text-violet-900 font-bold text-sm">
            <Lightbulb size={16} className="text-amber-500" /> Creator Success Tips
          </div>
          <p className="leading-relaxed">
            • <strong>DP3 Boost:</strong> Your gig will automatically receive a Recommended score boost so you compete fairly with earlier creators.
          </p>
          <p className="leading-relaxed">
            • <strong>Instant Notifications:</strong> When clients book, requests land directly in your Creator Dashboard.
          </p>
          <p className="leading-relaxed">
            • <strong>100% Earnings:</strong> SkillSwap charges zero commission to young creators.
          </p>
        </div>
      </div>
    </div>
  );
}
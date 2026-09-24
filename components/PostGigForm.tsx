"use client";

import { useActionState } from "react";
import { createGig } from "@/app/actions";
import { CATEGORIES } from "@/lib/categories";
import type { FormState } from "@/lib/types";
import SubmitButton from "./SubmitButton";

const input = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";
const errorText = "mt-1 text-sm text-red-600";

export default function PostGigForm() {
  const [state, formAction] = useActionState<FormState, FormData>(createGig, {});
  const v = state.values ?? {};
  const e = state.errors ?? {};

  return (
    <form action={formAction} noValidate className="mt-6 max-w-xl space-y-4" data-testid="post-gig-form">
      <div>
        <label htmlFor="title" className="font-medium">Title</label>
        <input id="title" name="title" defaultValue={v.title} data-testid="gig-title" className={input} />
        {e.title && <p className={errorText} data-testid="error-title">{e.title}</p>}
      </div>

      <div>
        <label htmlFor="category" className="font-medium">Category</label>
        <select id="category" name="category" defaultValue={v.category ?? ""} data-testid="gig-category" className={input}>
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {e.category && <p className={errorText} data-testid="error-category">{e.category}</p>}
      </div>

      <div>
        <label htmlFor="rate" className="font-medium">Rate (USD)</label>
        <input id="rate" name="rate" type="number" min={1} step={1} defaultValue={v.rate} data-testid="gig-rate" className={input} />
        {e.rate && <p className={errorText} data-testid="error-rate">{e.rate}</p>}
      </div>

      <div>
        <label htmlFor="description" className="font-medium">Description</label>
        <textarea id="description" name="description" rows={4} defaultValue={v.description} data-testid="gig-description" className={input} />
        {e.description && <p className={errorText} data-testid="error-description">{e.description}</p>}
      </div>

      <div>
        <label htmlFor="creatorName" className="font-medium">Your name (creator)</label>
        <input id="creatorName" name="creatorName" defaultValue={v.creatorName} data-testid="gig-creator" className={input} />
        {e.creatorName && <p className={errorText} data-testid="error-creatorName">{e.creatorName}</p>}
      </div>

      <SubmitButton pendingText="Posting..." testId="post-gig-submit">Post gig</SubmitButton>
    </form>
  );
}
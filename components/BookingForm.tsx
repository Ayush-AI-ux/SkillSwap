"use client";

import { useActionState } from "react";
import { createBooking } from "@/app/actions";
import type { FormState } from "@/lib/types";
import SubmitButton from "./SubmitButton";

const input = "mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100";
const errorText = "mt-1 text-sm text-red-600";

export default function BookingForm({ gigId }: { gigId: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(createBooking, {});
  const v = state.values ?? {};
  const e = state.errors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-4" data-testid="booking-form">
      <input type="hidden" name="gigId" value={gigId} />

      {e.form && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" data-testid="error-form">{e.form}</p>
      )}

      <div>
        <label htmlFor="clientName" className="font-medium">Your name</label>
        <input id="clientName" name="clientName" defaultValue={v.clientName} data-testid="client-name" className={input} />
        {e.clientName && <p className={errorText} data-testid="error-clientName">{e.clientName}</p>}
      </div>

      <div>
        <label htmlFor="clientEmail" className="font-medium">Your email</label>
        <input id="clientEmail" name="clientEmail" type="email" defaultValue={v.clientEmail} data-testid="client-email" className={input} />
        {e.clientEmail && <p className={errorText} data-testid="error-clientEmail">{e.clientEmail}</p>}
      </div>

      <div>
        <label htmlFor="message" className="font-medium">Message to the creator (optional)</label>
        <textarea id="message" name="message" rows={3} defaultValue={v.message} data-testid="client-message" className={input} />
        {e.message && <p className={errorText} data-testid="error-message">{e.message}</p>}
      </div>

      <SubmitButton pendingText="Sending..." testId="book-submit">Book this gig</SubmitButton>
    </form>
  );
}
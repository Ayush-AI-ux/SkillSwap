"use client";

import { useActionState, useState } from "react";
import { createBooking } from "@/app/actions";
import type { FormState } from "@/lib/types";
import SubmitButton from "./SubmitButton";

const input = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";
const errorText = "mt-1 text-sm text-red-600";

export default function BookingForm({ gigId }: { gigId: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(createBooking, {});
  const v = state.values ?? {};
  const e = state.errors ?? {};
  const suggestion = v.suggestion;

  // When the person picks a fix, we control the email field directly
  const [override, setOverride] = useState<{ forState: unknown; value: string } | null>(null);
  const emailValue = override && override.forState === state ? override.value : v.clientEmail;

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
        <input
          id="clientEmail"
          name="clientEmail"
          type="email"
          key={`${emailValue ?? ""}-${suggestion ?? ""}`}
          defaultValue={emailValue}
          data-testid="client-email"
          className={input}
        />
        {e.clientEmail && <p className={errorText} data-testid="error-clientEmail">{e.clientEmail}</p>}

        {suggestion && (
          <div className="mt-2 flex flex-wrap gap-2" data-testid="email-suggestion">
            <button
              type="button"
              onClick={() => setOverride({ forState: state, value: suggestion })}
              className="rounded-lg bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700 hover:bg-violet-100"
            >
              Use {suggestion}
            </button>
            <SubmitButton pendingText="Sending..." testId="keep-email">Keep as typed</SubmitButton>
            <input type="hidden" name="confirmEmail" value={v.clientEmail ?? ""} />
          </div>
        )}
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
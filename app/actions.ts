"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, DECLINE_REASONS } from "@/lib/categories";
import { isValidEmail, suggestEmail } from "@/lib/email";
import type { FormState } from "@/lib/types";

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

// ---------- Feature 1: Post a gig ----------
export async function createGig(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = {
    title: text(formData, "title"),
    category: text(formData, "category"),
    rate: text(formData, "rate"),
    description: text(formData, "description"),
    creatorName: text(formData, "creatorName"),
  };
  const errors: Record<string, string> = {};

  if (!values.title) errors.title = "Title is required.";
  else if (values.title.length > 100) errors.title = "Title must be 100 characters or fewer.";

  if (!CATEGORIES.includes(values.category)) errors.category = "Please choose a category.";

  const rate = Number(values.rate);
  if (!values.rate || !Number.isInteger(rate) || rate <= 0) {
    errors.rate = "Rate must be a whole number greater than 0.";
  } else if (rate > 100000) {
    errors.rate = "Rate is too high.";
  }

  if (!values.description) errors.description = "Description is required.";
  else if (values.description.length > 1000) errors.description = "Description must be 1000 characters or fewer.";

  if (!values.creatorName) errors.creatorName = "Your name is required.";

  if (Object.keys(errors).length > 0) return { errors, values };

  const gig = await prisma.gig.create({
    data: {
      title: values.title,
      category: values.category,
      rate,
      description: values.description,
      creatorName: values.creatorName,
    },
  });

  revalidatePath("/");
  redirect(`/gigs/${gig.id}?posted=1`);
}

// ---------- Feature 3: Book a gig ----------
export async function createBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  const gigId = text(formData, "gigId");
  const values = {
    clientName: text(formData, "clientName"),
    clientEmail: text(formData, "clientEmail").toLowerCase(),
    message: text(formData, "message"),
  };
  const errors: Record<string, string> = {};

  if (!values.clientName) errors.clientName = "Your name is required.";

  if (!values.clientEmail) {
    errors.clientEmail = "Your email is required.";
  } else if (!isValidEmail(values.clientEmail)) {
    errors.clientEmail = "Please enter a valid email address, like name@example.com.";
  } else {
    // Typo catch: suggest a fix, but let the person keep what they typed
    const suggestion = suggestEmail(values.clientEmail);
    const confirmed = text(formData, "confirmEmail").toLowerCase() === values.clientEmail;
    if (suggestion && !confirmed) {
      errors.clientEmail = `Did you mean ${suggestion}? Click "Use ${suggestion}" or "Keep as typed".`;
      // Only the name/message errors are checked below, so return the suggestion right away
      return { errors, values: { ...values, suggestion } };
    }
  }

  if (values.message.length > 500) errors.message = "Message must be 500 characters or fewer.";

  if (Object.keys(errors).length > 0) return { errors, values };

  const gig = await prisma.gig.findUnique({ where: { id: gigId } });
  if (!gig) return { errors: { form: "This gig no longer exists." }, values };

  // Stop accidental double-submits by the same client
  const duplicate = await prisma.booking.findFirst({
    where: { gigId, status: "Pending", clientEmail: values.clientEmail },
  });
  if (duplicate) {
    return {
      errors: { form: "You already have a pending request for this gig. Check My bookings." },
      values,
    };
  }

  const booking = await prisma.booking.create({
    data: {
      gigId,
      clientName: values.clientName,
      clientEmail: values.clientEmail,
      message: values.message || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/my-bookings");
  redirect(`/bookings/${booking.id}`);
}

// ---------- Feature 4: Accept / Decline ----------
export async function acceptBooking(formData: FormData): Promise<void> {
  const id = text(formData, "id");
  await prisma.booking.updateMany({
    where: { id, status: "Pending" },
    data: { status: "Accepted", declineReason: null },
  });
  revalidatePath("/dashboard");
  revalidatePath("/my-bookings");
}

export async function declineBooking(formData: FormData): Promise<void> {
  const id = text(formData, "id");
  const reason = text(formData, "reason");
  await prisma.booking.updateMany({
    where: { id, status: "Pending" },
    data: {
      status: "Declined",
      declineReason: DECLINE_REASONS.includes(reason) ? reason : "Other",
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/my-bookings");
}
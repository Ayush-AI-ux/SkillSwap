"use client";

import { useFormStatus } from "react-dom";

const styles = {
  primary: "bg-indigo-600 hover:bg-indigo-700",
  success: "bg-green-600 hover:bg-green-700",
  danger: "bg-red-600 hover:bg-red-700",
};

type Props = {
  children: React.ReactNode;
  pendingText?: string;
  variant?: keyof typeof styles;
  testId?: string;
};

export default function SubmitButton({ children, pendingText = "Saving...", variant = "primary", testId }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      data-testid={testId}
      className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${styles[variant]}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
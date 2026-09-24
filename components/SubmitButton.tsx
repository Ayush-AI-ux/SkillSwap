"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

const variantStyles = {
  primary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200 hover:shadow-violet-300",
  success: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-200",
  danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-200",
};

type Props = {
  children: React.ReactNode;
  pendingText?: string;
  variant?: keyof typeof variantStyles;
  testId?: string;
};

export default function SubmitButton({ children, pendingText = "Saving...", variant = "primary", testId }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      data-testid={testId}
      className={`btn-press focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed ${variantStyles[variant]}`}
    >
      {pending && <Loader2 size={16} className="animate-spin" />}
      {pending ? pendingText : children}
    </button>
  );
}
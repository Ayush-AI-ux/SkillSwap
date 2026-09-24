const styles: Record<string, { pill: string; dot: string; dotClass: string }> = {
  Pending: { pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60", dot: "bg-amber-500", dotClass: "pulse-dot" },
  Accepted: { pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60", dot: "bg-emerald-500", dotClass: "" },
  Declined: { pill: "bg-red-50 text-red-700 ring-1 ring-red-200/60", dot: "bg-red-500", dotClass: "" },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = styles[status] ?? { pill: "bg-gray-100 text-gray-700", dot: "bg-gray-400", dotClass: "" };
  return (
    <span
      data-testid="status-badge"
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${s.pill}`}
    >
      <span className={`h-2 w-2 rounded-full ${s.dot} ${s.dotClass}`} />
      {status}
    </span>
  );
}
const styles: Record<string, { pill: string; dot: string }> = {
  Pending: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Accepted: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  Declined: { pill: "bg-red-50 text-red-700", dot: "bg-red-500" },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = styles[status] ?? { pill: "bg-gray-100 text-gray-700", dot: "bg-gray-400" };
  return (
    <span
      data-testid="status-badge"
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
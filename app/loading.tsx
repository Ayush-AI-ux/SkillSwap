export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-2/3 rounded-xl bg-gray-200" />
      <div className="h-5 w-1/2 rounded-lg bg-gray-200" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
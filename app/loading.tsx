export default function Loading() {
  return (
    <div className="space-y-8 fade-up">
      {/* Title skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-2/3 rounded-xl shimmer" />
        <div className="h-5 w-1/2 rounded-lg shimmer" style={{ animationDelay: "0.1s" }} />
      </div>
      {/* Cards skeleton */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="h-36 shimmer" style={{ animationDelay: `${i * 0.08}s` }} />
            <div className="space-y-3 p-5">
              <div className="h-3 w-16 rounded shimmer" />
              <div className="h-5 w-3/4 rounded-lg shimmer" />
              <div className="h-4 w-full rounded shimmer" />
              <div className="flex items-center justify-between pt-3">
                <div className="h-6 w-16 rounded shimmer" />
                <div className="h-9 w-24 rounded-xl shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
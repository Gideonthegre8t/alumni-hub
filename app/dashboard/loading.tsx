export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <div className="h-14 w-72 mx-auto rounded-2xl bg-gradient-to-r from-indigo-400/30 to-purple-400/30 animate-pulse mb-6" />
          <div className="h-6 w-96 mx-auto rounded-xl bg-gray-200/50 animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="flex justify-center gap-4 mb-16">
          <div className="h-10 w-28 rounded-2xl bg-white/40 backdrop-blur animate-pulse" />
          <div className="h-10 w-36 rounded-2xl bg-emerald-200/30 animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 animate-pulse"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-indigo-400/20 to-purple-400/20" />
              <div className="h-6 w-3/4 mx-auto rounded-xl bg-gray-200/50 mb-3" />
              <div className="h-5 w-1/2 mx-auto rounded-xl bg-gray-200/30 mb-6" />
              <div className="space-y-3">
                <div className="h-12 rounded-2xl bg-gray-200/30" />
                <div className="h-12 rounded-2xl bg-gray-200/30" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

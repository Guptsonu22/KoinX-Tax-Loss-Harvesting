// ─── Card Skeleton ────────────────────────────────────────────────────────────

export function CardSkeleton() {
  return (
    <div className="bg-[#0c1520] border border-kx-border rounded-2xl p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 bg-kx-border rounded-lg w-32" />
        <div className="h-4 bg-kx-border rounded-full w-16" />
      </div>

      {/* Section label */}
      <div className="h-2.5 bg-kx-border/60 rounded w-28 mb-4" />

      {/* Rows */}
      {[1, 2].map((i) => (
        <div key={i} className="flex justify-between items-center py-1.5">
          <div className="h-3 bg-kx-border rounded w-16" />
          <div className="h-3 bg-kx-border rounded w-24" />
        </div>
      ))}
      <div className="border-t border-kx-border my-3" />
      <div className="flex justify-between items-center">
        <div className="h-3.5 bg-kx-border rounded w-28" />
        <div className="h-3.5 bg-kx-border rounded w-20" />
      </div>

      <div className="border-t border-kx-border my-4" />

      {/* Second section */}
      <div className="h-2.5 bg-kx-border/60 rounded w-24 mb-4" />
      {[1, 2].map((i) => (
        <div key={i} className="flex justify-between items-center py-1.5">
          <div className="h-3 bg-kx-border rounded w-16" />
          <div className="h-3 bg-kx-border rounded w-20" />
        </div>
      ))}
      <div className="border-t border-kx-border my-3" />
      <div className="flex justify-between items-center">
        <div className="h-3.5 bg-kx-border rounded w-28" />
        <div className="h-3.5 bg-kx-border rounded w-20" />
      </div>

      {/* Realised gains box */}
      <div className="mt-5 bg-kx-border/20 border border-kx-border/30 rounded-xl p-4 flex justify-between">
        <div className="h-4 bg-kx-border rounded w-36" />
        <div className="h-5 bg-kx-border rounded w-28" />
      </div>
    </div>
  );
}

// ─── Table Skeleton ───────────────────────────────────────────────────────────

export function TableSkeleton() {
  return (
    <div className="bg-kx-card border border-kx-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-kx-border flex items-center justify-between">
        <div>
          <div className="h-4 bg-kx-border rounded w-24 animate-pulse mb-1.5" />
          <div className="h-3 bg-kx-border/60 rounded w-32 animate-pulse" />
        </div>
      </div>

      {/* Desktop table skeleton (hidden on mobile) */}
      <div className="hidden md:block">
        {/* Column headers */}
        <div className="px-5 py-3 grid grid-cols-7 gap-4 border-b border-kx-border">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-2.5 bg-kx-border/60 rounded animate-pulse" />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 5 }).map((_, row) => (
          <div
            key={row}
            className="px-5 py-4 flex items-center gap-4 border-b border-kx-border last:border-0"
            style={{ animationDelay: `${row * 0.1}s` }}
          >
            {/* Checkbox placeholder */}
            <div className="w-4 h-4 bg-kx-border rounded animate-pulse flex-shrink-0" />
            {/* Logo + name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-kx-border animate-pulse flex-shrink-0" />
              <div className="space-y-1.5 min-w-0">
                <div className="h-3.5 bg-kx-border rounded w-14 animate-pulse" />
                <div className="h-2.5 bg-kx-border/60 rounded w-24 animate-pulse" />
              </div>
            </div>
            {/* Other columns */}
            {Array.from({ length: 4 }).map((_, col) => (
              <div key={col} className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-kx-border rounded animate-pulse" />
                <div className="h-2.5 bg-kx-border/60 rounded w-3/4 animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-kx-border p-4 animate-pulse"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-kx-border flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 bg-kx-border rounded w-20" />
                <div className="h-2.5 bg-kx-border/60 rounded w-32" />
              </div>
              <div className="w-5 h-5 rounded bg-kx-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <div className="h-2 bg-kx-border/60 rounded w-16" />
                  <div className="h-3.5 bg-kx-border rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

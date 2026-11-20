/**
 * Placeholder for a story list while the request-time part of a page streams
 * in (Cache Components: anything reading `searchParams` lives inside a
 * `<Suspense>` boundary, so the shell around it stays prerendered).
 *
 * Fixed heights only — the skeleton occupies exactly the space the first
 * stories will, so the swap costs no layout shift.
 */
export function StoryListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="mb-6 grid gap-5 md:grid-cols-[1.25fr_1fr] md:gap-[22px]">
        <div>
          <div className="mb-3 h-[200px] rounded-[5px] bg-soft md:h-[240px] lg:h-[280px]" />
          <div className="mb-2 h-5 w-3/4 rounded bg-soft" />
          <div className="h-4 w-1/2 rounded bg-soft" />
        </div>
        <div>
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_104px] gap-3 border-b border-line py-3"
            >
              <div>
                <div className="mb-2 h-4 w-1/3 rounded bg-soft" />
                <div className="h-4 w-full rounded bg-soft" />
              </div>
              <div className="h-[70px] rounded-[4px] bg-soft" />
            </div>
          ))}
        </div>
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-6">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_104px] gap-3 border-b border-line py-3"
          >
            <div>
              <div className="mb-2 h-4 w-1/3 rounded bg-soft" />
              <div className="h-4 w-full rounded bg-soft" />
            </div>
            <div className="h-[70px] rounded-[4px] bg-soft" />
          </div>
        ))}
      </div>
    </div>
  );
}

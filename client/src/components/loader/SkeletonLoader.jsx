import React from 'react'

const SkeletonLoader = () => {
  return (
    <div role="status" aria-label="Preparing your explanation" className="space-y-6">
      <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
        Preparing your explanation
      </p>
      {[0, 1].map((section) => (
        <div key={section} className="space-y-3">
          <div className="skeleton-shimmer h-5 w-2/5 rounded" />
          <div className="space-y-2.5">
            <div className="skeleton-shimmer h-3 w-full rounded" />
            <div className="skeleton-shimmer h-3 w-11/12 rounded" />
            <div className="skeleton-shimmer h-3 w-10/12 rounded" />
            <div className="skeleton-shimmer h-3 w-3/4 rounded" />
          </div>
          {section === 0 && (
            <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
              <div className="skeleton-shimmer h-3 w-4/5 rounded" />
              <div className="skeleton-shimmer mt-2 h-3 w-3/5 rounded" />
            </div>
          )}
        </div>
      ))}
      <span className="sr-only">Loading</span>
    </div>
  )
}

export default SkeletonLoader

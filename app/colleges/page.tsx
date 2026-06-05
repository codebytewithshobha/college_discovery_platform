"use client"

import { useState } from 'react'
import { useColleges } from '@/hooks/use-colleges'
import { FilterPanel } from '@/components/college/filter-panel'
import { CollegeCard } from '@/components/college/college-card'
import { Pagination } from '@/components/college/pagination'
import { DataGuideBanner } from '@/components/college/data-guide-banner'
import { CollegeFilters } from '@/types'
import { Loader2, AlertCircle } from 'lucide-react'

export default function CollegesPage() {
  const [filters, setFilters] = useState<CollegeFilters>({ page: 1, limit: 12 })
  const { data, isLoading, isFetching, error } = useColleges(filters)

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const colleges = data?.data || []
  const pagination = data?.pagination
  const showInitialLoader = isLoading && !data
  const showResultsLoader = isFetching && !!data

  return (
    <div className="page-gradient min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Browse Colleges</h1>
          <p className="text-muted-foreground mt-2">
            Discover and compare colleges across India — save favorites and compare up to 3 side by side.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-4">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
            <DataGuideBanner />
          </aside>

          <main className="lg:col-span-3 relative">
            {error && !data ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 rounded-xl border bg-card p-8">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-lg text-muted-foreground">
                  Failed to load colleges. Please try again later.
                </p>
              </div>
            ) : showInitialLoader ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : colleges.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 rounded-xl border bg-card p-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  No colleges found matching your filters
                </p>
                <button
                  onClick={() => setFilters({ page: 1, limit: 12 })}
                  className="text-primary hover:underline font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {showResultsLoader && (
                  <div className="absolute inset-0 z-10 flex items-start justify-center pt-24 bg-background/50 rounded-xl">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {pagination && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Showing {colleges.length} of {pagination.total} colleges
                  </p>
                )}
                <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-4 mb-6">
                  {colleges.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

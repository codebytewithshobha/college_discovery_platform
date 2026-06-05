'use client'

import Link from 'next/link'
import { useQueries } from '@tanstack/react-query'
import { useSavedCollegesStore } from '@/lib/store/saved-colleges'
import { CollegeCard } from '@/components/college/college-card'
import { Button } from '@/components/ui/button'
import { Bookmark, Loader2 } from 'lucide-react'
import type { CollegeListItem } from '@/types'

async function fetchCollege(id: string) {
  const res = await fetch(`/api/colleges/${id}`)
  if (!res.ok) throw new Error('Failed to fetch')
  const json = await res.json()
  return json.data as CollegeListItem & { description: string }
}

export default function SavedCollegesPage() {
  const { savedCollegeIds, clearSaved, removeSaved } = useSavedCollegesStore()

  const queries = useQueries({
    queries: savedCollegeIds.map((id) => ({
      queryKey: ['college', id],
      queryFn: () => fetchCollege(id),
    })),
  })

  const isLoading = queries.some((q) => q.isLoading)
  const colleges = queries
    .map((q) => q.data)
    .filter(Boolean) as (CollegeListItem & { description: string })[]

  if (savedCollegeIds.length === 0) {
    return (
      <div className="page-gradient min-h-[60vh]">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
          <Bookmark className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-3xl font-bold">No saved colleges yet</h1>
          <p className="text-muted-foreground max-w-md">
            Tap the bookmark icon on any college card to save it here for quick access.
          </p>
          <Link href="/colleges">
            <Button>Browse Colleges</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-gradient min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Saved Colleges</h1>
            <p className="text-muted-foreground mt-1">
              {savedCollegeIds.length} college{savedCollegeIds.length !== 1 ? 's' : ''} saved on this device
            </p>
          </div>
          <Button variant="outline" onClick={clearSaved}>
            Clear all
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {colleges.map((college) => (
              <div key={college.id} className="relative">
                <CollegeCard college={college} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-xs"
                  onClick={() => removeSaved(college.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

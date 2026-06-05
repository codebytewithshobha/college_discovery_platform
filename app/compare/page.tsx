'use client'

import Link from 'next/link'
import { useComparisonStore } from '@/lib/store/comparison'
import { useCollege } from '@/hooks/use-colleges'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, GitCompare, X, MapPin } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ComparePage() {
  const { selectedColleges, clearComparison, removeCollege } = useComparisonStore()

  const { data: d1, isLoading: l1 } = useCollege(selectedColleges[0] || '')
  const { data: d2, isLoading: l2 } = useCollege(selectedColleges[1] || '')
  const { data: d3, isLoading: l3 } = useCollege(selectedColleges[2] || '')

  const slots = [
    { id: selectedColleges[0], data: d1?.data, loading: l1 },
    { id: selectedColleges[1], data: d2?.data, loading: l2 },
    { id: selectedColleges[2], data: d3?.data, loading: l3 },
  ].filter((s) => s.id)

  const colleges = slots.map((s) => s.data).filter(Boolean)

  if (selectedColleges.length === 0) {
    return (
      <div className="page-gradient min-h-[60vh]">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
          <GitCompare className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Compare Colleges</h1>
          <p className="text-muted-foreground max-w-md">
            Add up to 3 colleges from Browse using the compare button, then view them side by side here.
          </p>
          <Link href="/colleges">
            <Button>Browse Colleges</Button>
          </Link>
        </div>
      </div>
    )
  }

  const rows = [
    { label: 'Rating', get: (c: NonNullable<(typeof colleges)[0]>) => c.rating?.toFixed(1) ?? '—' },
    { label: 'Ranking', get: (c: NonNullable<(typeof colleges)[0]>) => (c.ranking ? `#${c.ranking}` : '—') },
    { label: 'Fees / year', get: (c: NonNullable<(typeof colleges)[0]>) => formatCurrency(c.fees) },
    {
      label: 'Avg package',
      get: (c: NonNullable<(typeof colleges)[0]>) =>
        c.averagePackage ? formatCurrency(c.averagePackage) : '—',
    },
    {
      label: 'Highest package',
      get: (c: NonNullable<(typeof colleges)[0]>) =>
        c.highestPackage ? formatCurrency(c.highestPackage) : '—',
    },
    { label: 'Established', get: (c: NonNullable<(typeof colleges)[0]>) => String(c.establishmentYear) },
    { label: 'Courses', get: (c: NonNullable<(typeof colleges)[0]>) => String(c._count?.courses ?? '—') },
    { label: 'Reviews', get: (c: NonNullable<(typeof colleges)[0]>) => String(c._count?.reviews ?? '—') },
  ]

  return (
    <div className="page-gradient min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Compare Colleges</h1>
            <p className="text-muted-foreground mt-1">{selectedColleges.length}/3 selected</p>
          </div>
          <div className="flex gap-2">
            <Link href="/colleges">
              <Button variant="outline">Add More</Button>
            </Link>
            <Button variant="outline" onClick={clearComparison}>
              Clear All
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-primary/10 shadow-md mb-8">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left p-4 font-semibold min-w-[140px] sticky left-0 bg-muted/40 z-10">
                    Feature
                  </th>
                  {slots.map((slot) => (
                    <th key={slot.id} className="p-4 min-w-[220px] align-top">
                      {slot.loading || !slot.data ? (
                        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-semibold text-left text-sm leading-snug">
                              {slot.data.name}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="shrink-0 h-8 w-8"
                              onClick={() => removeCollege(slot.id!)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground text-left">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {slot.data.location}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="p-4 font-medium text-muted-foreground sticky left-0 bg-card z-10">
                      {row.label}
                    </td>
                    {slots.map((slot) => (
                      <td key={slot.id} className="p-4">
                        {slot.data ? row.get(slot.data) : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {colleges.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4">
            {colleges.map((college) => (
              <Card key={college.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{college.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {college.description}
                  </p>
                  <Link href={`/colleges/${college.id}`}>
                    <Button variant="outline" className="w-full">
                      Full Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

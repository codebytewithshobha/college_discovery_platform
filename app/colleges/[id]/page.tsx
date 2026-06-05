'use client'

import { useCollege } from '@/hooks/use-colleges'
import { CollegeActions } from '@/components/college/college-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  AlertCircle,
  Star,
  MapPin,
  GraduationCap,
  DollarSign,
  Building2,
  Calendar,
  ExternalLink,
  Users,
  Briefcase,
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

function formatLabel(value: string) {
  return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function CollegeDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading, error } = useCollege(params.id)

  if (isLoading) {
    return (
      <div className="page-gradient flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="page-gradient container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="text-lg text-muted-foreground mb-4">College not found</p>
        <Link href="/colleges">
          <Button>Browse All Colleges</Button>
        </Link>
      </div>
    )
  }

  const college = data.data

  return (
    <div className="page-gradient min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/colleges"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
        >
          ← Back to Colleges
        </Link>

        <div className="rounded-2xl hero-gradient p-6 md:p-8 text-white shadow-xl mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">{college.name}</h1>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="h-5 w-5 shrink-0" />
                <span>{college.location}</span>
              </div>
              {college.ranking && (
                <p className="mt-2 text-sm text-white/80">National rank #{college.ranking}</p>
              )}
            </div>
            {college.rating > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 backdrop-blur">
                <Star className="h-6 w-6 fill-amber-300 text-amber-300" />
                <span className="text-2xl font-bold">{college.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{college.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Established
                    </div>
                    <p className="font-semibold">{college.establishmentYear}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      Fees / year
                    </div>
                    <p className="font-semibold">{formatCurrency(college.fees)}</p>
                  </div>
                  {college._count && (
                    <>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                          <GraduationCap className="h-3.5 w-3.5" />
                          Courses
                        </div>
                        <p className="font-semibold">{college._count.courses}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                          <Users className="h-3.5 w-3.5" />
                          Reviews
                        </div>
                        <p className="font-semibold">{college._count.reviews}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {college.courses && college.courses.length > 0 && (
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Courses Offered ({college.courses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {college.courses.map((course: { id: string; name: string; type: string; duration: string; fees: number }) => (
                      <div
                        key={course.id}
                        className="flex flex-wrap items-center justify-between gap-2 p-4 rounded-xl border bg-card hover:border-primary/30 transition-colors"
                      >
                        <div>
                          <h4 className="font-semibold">{course.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatLabel(course.type)} · {formatLabel(course.duration)}
                          </p>
                        </div>
                        <p className="font-semibold text-primary">{formatCurrency(course.fees)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {(college.averagePackage || college.highestPackage) && (
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-accent" />
                    Placements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {college.averagePackage && (
                      <div className="p-4 rounded-xl border-2 border-accent/20 bg-accent/5">
                        <p className="text-sm text-muted-foreground mb-1">Average Package</p>
                        <p className="text-2xl font-bold text-accent">
                          {formatCurrency(college.averagePackage)}
                        </p>
                      </div>
                    )}
                    {college.highestPackage && (
                      <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5">
                        <p className="text-sm text-muted-foreground mb-1">Highest Package</p>
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(college.highestPackage)}
                        </p>
                      </div>
                    )}
                  </div>
                  {college.recruiters && college.recruiters.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-medium mb-3">Top Recruiters</p>
                      <div className="flex flex-wrap gap-2">
                        {college.recruiters.map((recruiter: { id: string; name: string }) => (
                          <span
                            key={recruiter.id}
                            className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
                          >
                            {recruiter.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {college.reviews && college.reviews.length > 0 && (
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {college.reviews.map((review: { id: string; reviewerName: string; rating: number; comment: string }) => (
                      <div key={review.id} className="p-4 rounded-xl border bg-muted/30">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center font-semibold text-primary">
                            {review.reviewerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{review.reviewerName}</p>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < review.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-muted-foreground/30'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <CollegeActions
                  collegeId={college.id}
                  collegeName={college.name}
                  layout="stack"
                />
                {college.website && (
                  <Button className="w-full mt-2" variant="secondary" asChild>
                    <a href={college.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-dashed bg-muted/30">
              <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
                <p className="font-medium text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Want richer data?
                </p>
                <p>
                  Run <code className="text-xs bg-background px-1 rounded">npm run db:seed</code> after
                  editing <code className="text-xs bg-background px-1 rounded">prisma/seed.ts</code>, or
                  connect a production database with real college records.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

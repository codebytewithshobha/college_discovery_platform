'use client'

import Link from 'next/link'
import { Star, MapPin, GraduationCap, DollarSign, GitCompare, Bookmark, BookmarkCheck } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CollegeListItem } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useCollegeActions } from '@/hooks/use-college-actions'
import { cn } from '@/lib/utils'

interface CollegeCardProps {
  college: CollegeListItem
}

export function CollegeCard({ college }: CollegeCardProps) {
  const { addToCompare, saveCollege, isSaved, canAddCollege, selectedColleges } =
    useCollegeActions()
  const saved = isSaved(college.id)
  const inCompare = selectedColleges.includes(college.id)

  return (
    <Card className="group overflow-hidden border-border/80 bg-card/90 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {college.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 shrink-0 text-accent" />
              <span className="line-clamp-1">{college.location}</span>
            </div>
          </div>
          {college.rating > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 shrink-0">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                {college.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {college.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>Est. {college.establishmentYear}</span>
          </div>
          {college.ranking && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Rank:</span>
              <span className="font-medium">#{college.ranking}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{formatCurrency(college.fees)}/yr</span>
          </div>
          {college.averagePackage && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Avg:</span>
              <span className="font-medium">{formatCurrency(college.averagePackage)}</span>
            </div>
          )}
        </div>

        {college._count && college._count.reviews > 0 && (
          <div className="mt-3 text-sm text-muted-foreground">
            {college._count.reviews} review{college._count.reviews !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-0 sm:flex-row">
        <Link href={`/colleges/${college.id}`} className="w-full sm:flex-1">
          <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
            View Details
          </Button>
        </Link>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            size="icon"
            variant="outline"
            onClick={() => addToCompare(college.id, college.name)}
            disabled={!canAddCollege(college.id) && !inCompare}
            title={inCompare ? 'In compare list' : 'Add to compare'}
            className={cn(inCompare && 'border-primary bg-primary/10')}
          >
            <GitCompare className={cn('h-4 w-4', inCompare && 'text-primary')} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => saveCollege(college.id, college.name)}
            title={saved ? 'Remove from saved' : 'Save college'}
            className={cn(saved && 'border-primary bg-primary/10')}
          >
            {saved ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

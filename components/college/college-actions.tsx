'use client'

import { GitCompare, Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCollegeActions } from '@/hooks/use-college-actions'
import { cn } from '@/lib/utils'

interface CollegeActionsProps {
  collegeId: string
  collegeName?: string
  layout?: 'row' | 'stack'
  className?: string
}

export function CollegeActions({
  collegeId,
  collegeName,
  layout = 'row',
  className,
}: CollegeActionsProps) {
  const { addToCompare, saveCollege, isSaved, canAddCollege, selectedColleges } =
    useCollegeActions()
  const saved = isSaved(collegeId)
  const inCompare = selectedColleges.includes(collegeId)
  const canCompare = canAddCollege(collegeId)

  return (
    <div
      className={cn(
        layout === 'stack' ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2',
        className
      )}
    >
      <Button
        type="button"
        variant="outline"
        className={layout === 'stack' ? 'w-full justify-start' : 'flex-1'}
        onClick={() => saveCollege(collegeId, collegeName)}
      >
        {saved ? (
          <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
        ) : (
          <Bookmark className="h-4 w-4 mr-2" />
        )}
        {saved ? 'Saved' : 'Save College'}
      </Button>
      <Button
        type="button"
        variant={inCompare ? 'secondary' : 'default'}
        className={layout === 'stack' ? 'w-full justify-start' : 'flex-1'}
        onClick={() => addToCompare(collegeId, collegeName)}
        disabled={!canCompare && !inCompare}
        title={
          inCompare
            ? 'Already in compare list'
            : canCompare
              ? 'Add to compare'
              : 'Compare list full (max 3)'
        }
      >
        <GitCompare className="h-4 w-4 mr-2" />
        {inCompare ? 'In Compare' : 'Add to Compare'}
      </Button>
    </div>
  )
}

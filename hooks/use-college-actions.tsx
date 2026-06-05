'use client'

import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useComparisonStore } from '@/lib/store/comparison'
import { useSavedCollegesStore } from '@/lib/store/saved-colleges'

export function useCollegeActions() {
  const router = useRouter()
  const { toast } = useToast()
  const { addCollege, canAddCollege, selectedColleges } = useComparisonStore()
  const { toggleSaved, isSaved, addSaved, removeSaved } = useSavedCollegesStore()

  const addToCompare = (collegeId: string, collegeName?: string) => {
    if (selectedColleges.includes(collegeId)) {
      toast({
        title: 'Already in compare',
        description: `${collegeName ?? 'This college'} is already on your compare list.`,
      })
      return
    }

    if (!canAddCollege(collegeId)) {
      toast({
        title: 'Compare list full',
        description: 'Remove a college from Compare to add another (max 3).',
        action: (
          <button
            type="button"
            className="text-sm font-medium underline"
            onClick={() => router.push('/compare')}
          >
            Open Compare
          </button>
        ),
      })
      return
    }

    addCollege(collegeId)
    const count = selectedColleges.length + 1
    toast({
      title: 'Added to compare',
      description: `${collegeName ?? 'College'} added (${count}/3).`,
      action: (
        <button
          type="button"
          className="text-sm font-medium underline"
          onClick={() => router.push('/compare')}
        >
          View Compare
        </button>
      ),
    })
  }

  const saveCollege = (collegeId: string, collegeName?: string) => {
    const wasSaved = isSaved(collegeId)
    toggleSaved(collegeId)
    toast({
      title: wasSaved ? 'Removed from saved' : 'College saved',
      description: wasSaved
        ? `${collegeName ?? 'College'} removed from your list.`
        : `${collegeName ?? 'College'} added to Saved Colleges.`,
      action: wasSaved ? undefined : (
        <button
          type="button"
          className="text-sm font-medium underline"
          onClick={() => router.push('/saved')}
        >
          View Saved
        </button>
      ),
    })
  }

  return {
    addToCompare,
    saveCollege,
    isSaved,
    addSaved,
    removeSaved,
    compareCount: selectedColleges.length,
    selectedColleges,
    canAddCollege,
  }
}

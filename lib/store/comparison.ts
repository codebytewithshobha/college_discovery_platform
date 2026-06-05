import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ComparisonState {
  selectedColleges: string[]
  addCollege: (collegeId: string) => void
  removeCollege: (collegeId: string) => void
  clearComparison: () => void
  canAddCollege: (collegeId: string) => boolean
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      selectedColleges: [],
      addCollege: (collegeId) => {
        const { selectedColleges } = get()
        if (selectedColleges.length >= 3) return
        if (selectedColleges.includes(collegeId)) return
        set({ selectedColleges: [...selectedColleges, collegeId] })
      },
      removeCollege: (collegeId) => {
        set({ selectedColleges: get().selectedColleges.filter((id) => id !== collegeId) })
      },
      clearComparison: () => set({ selectedColleges: [] }),
      canAddCollege: (collegeId) => {
        const { selectedColleges } = get()
        return selectedColleges.length < 3 && !selectedColleges.includes(collegeId)
      },
    }),
    {
      name: 'comparison-storage',
    }
  )
)

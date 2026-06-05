import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SavedCollegesState {
  savedCollegeIds: string[]
  addSaved: (collegeId: string) => void
  removeSaved: (collegeId: string) => void
  toggleSaved: (collegeId: string) => void
  isSaved: (collegeId: string) => boolean
  clearSaved: () => void
}

export const useSavedCollegesStore = create<SavedCollegesState>()(
  persist(
    (set, get) => ({
      savedCollegeIds: [],
      addSaved: (collegeId) => {
        const { savedCollegeIds } = get()
        if (savedCollegeIds.includes(collegeId)) return
        set({ savedCollegeIds: [...savedCollegeIds, collegeId] })
      },
      removeSaved: (collegeId) => {
        set({
          savedCollegeIds: get().savedCollegeIds.filter((id) => id !== collegeId),
        })
      },
      toggleSaved: (collegeId) => {
        if (get().isSaved(collegeId)) {
          get().removeSaved(collegeId)
        } else {
          get().addSaved(collegeId)
        }
      },
      isSaved: (collegeId) => get().savedCollegeIds.includes(collegeId),
      clearSaved: () => set({ savedCollegeIds: [] }),
    }),
    { name: 'saved-colleges-storage' }
  )
)

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import type { CollegeFilters, CollegeListItem, PaginatedResponse } from '@/types'

const API_BASE = '/api'

export function useColleges(filters: CollegeFilters) {
  const queryParams = new URLSearchParams()
  
  if (filters.search) queryParams.set('search', filters.search)
  if (filters.location) queryParams.set('location', filters.location)
  if (filters.minRating !== undefined) queryParams.set('minRating', filters.minRating.toString())
  if (filters.minFees !== undefined) queryParams.set('minFees', filters.minFees.toString())
  if (filters.maxFees !== undefined) queryParams.set('maxFees', filters.maxFees.toString())
  queryParams.set('page', (filters.page || 1).toString())
  queryParams.set('limit', (filters.limit || 12).toString())

  return useQuery<PaginatedResponse<CollegeListItem>>({
    queryKey: ['colleges', filters],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/colleges?${queryParams.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch colleges')
      return response.json()
    },
    placeholderData: keepPreviousData,
  })
}

export function useCollege(id: string) {
  return useQuery({
    queryKey: ['college', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/colleges/${id}`)
      if (!response.ok) throw new Error('Failed to fetch college')
      return response.json()
    },
    enabled: !!id,
  })
}

export function useSaveCollege() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ collegeId, userId }: { collegeId: string; userId: string }) => {
      const response = await fetch(`${API_BASE}/saved`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId, userId }),
      })
      if (!response.ok) throw new Error('Failed to save college')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-colleges'] })
    },
  })
}

export function useRemoveSavedCollege() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const response = await fetch(`${API_BASE}/saved/${id}?userId=${userId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to remove saved college')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-colleges'] })
    },
  })
}

export function useSavedColleges(userId?: string) {
  return useQuery({
    queryKey: ['saved-colleges', userId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/saved?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch saved colleges')
      return response.json()
    },
    enabled: !!userId,
  })
}

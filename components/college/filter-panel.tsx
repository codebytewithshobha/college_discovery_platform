'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, MapPin, Star, DollarSign } from 'lucide-react'
import { getCitySuggestions } from '@/lib/india-locations'
import { CollegeFilters } from '@/types'

interface FilterPanelProps {
  filters: CollegeFilters
  onFiltersChange: (filters: CollegeFilters) => void
}

type DraftFilters = {
  search: string
  location: string
  minRating: string
  minFees: string
  maxFees: string
}

function filtersToDraft(filters: CollegeFilters): DraftFilters {
  return {
    search: filters.search ?? '',
    location: filters.location ?? '',
    minRating: filters.minRating !== undefined ? String(filters.minRating) : '',
    minFees: filters.minFees !== undefined ? String(filters.minFees) : '',
    maxFees: filters.maxFees !== undefined ? String(filters.maxFees) : '',
  }
}

function draftToFilters(draft: DraftFilters, base: CollegeFilters): CollegeFilters {
  const parseOptionalNumber = (value: string) => {
    if (value === '') return undefined
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  return {
    ...base,
    page: 1,
    search: draft.search || undefined,
    location: draft.location || undefined,
    minRating: parseOptionalNumber(draft.minRating),
    minFees: parseOptionalNumber(draft.minFees),
    maxFees: parseOptionalNumber(draft.maxFees),
  }
}

const DEBOUNCE_MS = 300

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const [draft, setDraft] = useState<DraftFilters>(() => filtersToDraft(filters))
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const filtersRef = useRef(filters)

  filtersRef.current = filters

  // Sync when filters are cleared or updated externally (e.g. pagination only)
  useEffect(() => {
    const externalDraft = filtersToDraft(filters)
    const hasFilterValues =
      filters.search ||
      filters.location ||
      filters.minRating !== undefined ||
      filters.minFees !== undefined ||
      filters.maxFees !== undefined

    if (!hasFilterValues) {
      setDraft(externalDraft)
    }
  }, [filters])

  const scheduleApply = (nextDraft: DraftFilters) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onFiltersChange(draftToFilters(nextDraft, filtersRef.current))
    }, DEBOUNCE_MS)
  }

  const updateDraft = (key: keyof DraftFilters, value: string) => {
    const nextDraft = { ...draft, [key]: value }
    setDraft(nextDraft)
    scheduleApply(nextDraft)
  }

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const empty = filtersToDraft({ page: 1, limit: filters.limit ?? 12 })
    setDraft(empty)
    onFiltersChange({ page: 1, limit: filters.limit ?? 12 })
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const citySuggestions = getCitySuggestions(draft.location || draft.search)

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-primary">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="College name, city, or state..."
              value={draft.search}
              onChange={(e) => updateDraft('search', e.target.value)}
              list="india-city-suggestions"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="City or state (e.g. Jaipur, Kerala)"
              value={draft.location}
              onChange={(e) => updateDraft('location', e.target.value)}
              list="india-city-suggestions"
              className="pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {citySuggestions.length} cities available. Try Bengaluru, Gurgaon, or a state name.
          </p>
        </div>

        <datalist id="india-city-suggestions">
          {citySuggestions.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>

        <div className="space-y-2">
          <Label htmlFor="minRating">Minimum Rating</Label>
          <div className="relative">
            <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="minRating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="0.0"
              value={draft.minRating}
              onChange={(e) => updateDraft('minRating', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Fees Range (INR/year)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                placeholder="Min"
                value={draft.minFees}
                onChange={(e) => updateDraft('minFees', e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                placeholder="Max"
                value={draft.maxFees}
                onChange={(e) => updateDraft('maxFees', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="w-full text-sm text-muted-foreground hover:text-foreground underline"
        >
          Clear all filters
        </button>
      </CardContent>
    </Card>
  )
}

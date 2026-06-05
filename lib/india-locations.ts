/** Major Indian cities used for seeding and location search normalization */

export type IndianCity = {
  city: string
  state: string
}

export function formatLocation({ city, state }: IndianCity): string {
  return `${city}, ${state}`
}

/** Common alternate spellings and old city names */
export const CITY_ALIASES: Record<string, string[]> = {
  bengaluru: ['bangalore'],
  bangalore: ['bengaluru'],
  mumbai: ['bombay'],
  bombay: ['mumbai'],
  chennai: ['madras'],
  madras: ['chennai'],
  kolkata: ['calcutta'],
  calcutta: ['kolkata'],
  delhi: ['new delhi', 'ncr'],
  'new delhi': ['delhi'],
  prayagraj: ['allahabad'],
  allahabad: ['prayagraj'],
  gurugram: ['gurgaon'],
  gurgaon: ['gurugram'],
  guwahati: ['gauhati'],
  thiruvananthapuram: ['trivandrum'],
  trivandrum: ['thiruvananthapuram'],
  kochi: ['cochin'],
  cochin: ['kochi'],
  pune: ['poona'],
  varanasi: ['banaras', 'kashi'],
  mysuru: ['mysore'],
  mysore: ['mysuru'],
  visakhapatnam: ['vizag'],
  vizag: ['visakhapatnam'],
  hubballi: ['hubli'],
  hubli: ['hubballi'],
  vadodara: ['baroda'],
  baroda: ['vadodara'],
  noida: ['greater noida'],
  mohali: ['sas nagar'],
  tiruchirappalli: ['trichy'],
  trichy: ['tiruchirappalli'],
  surathkal: ['mangalore'],
}

export const INDIAN_CITIES: IndianCity[] = [
  // Tier 1 Metros (2-3 colleges each)
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  // Tier 2 Major Cities
  { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Kochi', state: 'Kerala' },
  { city: 'Surat', state: 'Gujarat' },
  { city: 'Vadodara', state: 'Gujarat' },
  { city: 'Chandigarh', state: 'Chandigarh' },
  { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Thiruvananthapuram', state: 'Kerala' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  // Tier 3 Educational Hubs
  { city: 'Mysore', state: 'Karnataka' },
  { city: 'Madurai', state: 'Tamil Nadu' },
  { city: 'Trichy', state: 'Tamil Nadu' },
  { city: 'Vellore', state: 'Tamil Nadu' },
  { city: 'Kanpur', state: 'Uttar Pradesh' },
  { city: 'Varanasi', state: 'Uttar Pradesh' },
  { city: 'Allahabad', state: 'Uttar Pradesh' },
  { city: 'Agra', state: 'Uttar Pradesh' },
  { city: 'Noida', state: 'Uttar Pradesh' },
  { city: 'Gurugram', state: 'Haryana' },
  { city: 'Faridabad', state: 'Haryana' },
  { city: 'Guwahati', state: 'Assam' },
  { city: 'Patna', state: 'Bihar' },
  { city: 'Ranchi', state: 'Jharkhand' },
  { city: 'Jamshedpur', state: 'Jharkhand' },
  { city: 'Gwalior', state: 'Madhya Pradesh' },
  { city: 'Jabalpur', state: 'Madhya Pradesh' },
  { city: 'Raipur', state: 'Chhattisgarh' },
  { city: 'Bhubaneswar', state: 'Odisha' },
  { city: 'Cuttack', state: 'Odisha' },
  { city: 'Jodhpur', state: 'Rajasthan' },
  { city: 'Udaipur', state: 'Rajasthan' },
  { city: 'Kota', state: 'Rajasthan' },
  { city: 'Rajkot', state: 'Gujarat' },
  { city: 'Mangalore', state: 'Karnataka' },
  { city: 'Hubli', state: 'Karnataka' },
  { city: 'Belgaum', state: 'Karnataka' },
  { city: 'Kozhikode', state: 'Kerala' },
  { city: 'Thrissur', state: 'Kerala' },
  { city: 'Vijayawada', state: 'Andhra Pradesh' },
  { city: 'Guntur', state: 'Andhra Pradesh' },
  { city: 'Tirupati', state: 'Andhra Pradesh' },
  { city: 'Warangal', state: 'Telangana' },
  { city: 'Amritsar', state: 'Punjab' },
  { city: 'Ludhiana', state: 'Punjab' },
  { city: 'Patiala', state: 'Punjab' },
  { city: 'Dehradun', state: 'Uttarakhand' },
  { city: 'Salem', state: 'Tamil Nadu' },
  { city: 'Nashik', state: 'Maharashtra' },
]

/** Expand a user search term into location substrings to match against DB */
export function expandLocationSearchTerms(term: string): string[] {
  const trimmed = term.trim()
  if (!trimmed) return []

  const terms = new Set<string>([trimmed])
  const lower = trimmed.toLowerCase()

  for (const alias of CITY_ALIASES[lower] ?? []) {
    terms.add(alias)
  }

  const exactCity = INDIAN_CITIES.find((c) => c.city.toLowerCase() === lower)
  if (exactCity) {
    terms.add(exactCity.city)
    return Array.from(terms)
  }

  const partialCities = INDIAN_CITIES.filter((c) => c.city.toLowerCase().includes(lower))
  if (partialCities.length > 0) {
    for (const { city } of partialCities) {
      terms.add(city)
    }
    return Array.from(terms)
  }

  const matchingStates = [
    ...new Set(
      INDIAN_CITIES.map((c) => c.state).filter((state) => state.toLowerCase().includes(lower))
    ),
  ]
  for (const state of matchingStates) {
    terms.add(state)
  }

  return Array.from(terms)
}

/** Build Prisma OR conditions for location / search matching */
export function buildLocationWhereConditions(term: string) {
  const searchTerms = expandLocationSearchTerms(term)
  const conditions: Array<{ location: { contains: string; mode?: 'insensitive' } }> = []

  for (const t of searchTerms) {
    conditions.push({ location: { contains: t, mode: 'insensitive' } })
  }

  return conditions
}

export function getCitySuggestions(query?: string): string[] {
  const cities = INDIAN_CITIES.map((c) => c.city)
  if (!query?.trim()) return cities

  const q = query.trim().toLowerCase()
  const expanded = new Set(expandLocationSearchTerms(query).map((t) => t.toLowerCase()))

  return cities.filter((city) => {
    const lower = city.toLowerCase()
    return (
      lower.includes(q) ||
      expanded.has(lower) ||
      INDIAN_CITIES.some(
        (c) =>
          c.city === city &&
          (c.state.toLowerCase().includes(q) || expanded.has(c.state.toLowerCase()))
      )
    )
  })
}

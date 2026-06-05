'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Award, TrendingUp, Search } from 'lucide-react'

const EXAM_OPTIONS = ['JEE Main', 'NEET', 'CUET', 'GATE', 'Other']

type Recommendation = {
  id: string
  name: string
  location: string
  ranking: number | null
  rating: number
  fees: number
  thumbnail: string | null
  averagePackage: number | null
  _count: {
    reviews: number
  }
}

export default function PredictorPage() {
  const [exam, setExam] = useState('JEE Main')
  const [rank, setRank] = useState('')
  const [results, setResults] = useState<Recommendation[]>([])
  const [predictionMeta, setPredictionMeta] = useState<{
    exam: string
    rank: number
    maxRanking: number
    usedFallback: boolean
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setResults([])
    setPredictionMeta(null)

    const parsedRank = Number(rank)
    if (!parsedRank || parsedRank <= 0) {
      setError('Please enter a valid rank greater than 0.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam, rank: parsedRank }),
      })

      const payload = await response.json()

      if (!response.ok) {
        setError(payload?.message || 'Unable to generate recommendations.')
      } else {
        setResults(payload.data.recommendations)
        setPredictionMeta({
          exam: payload.data.exam,
          rank: payload.data.rank,
          maxRanking: payload.data.maxRanking,
          usedFallback: payload.data.usedFallback,
        })
      }
    } catch (fetchError) {
      setError('Unable to connect to the predictor service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-gradient min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary shadow-sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Predictor Tool
          </div>
          <h1 className="text-4xl font-bold tracking-tight">College Predictor</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Enter your exam name and rank to get a recommended college shortlist based on your results.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle>Predict a fit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exam">Exam</Label>
                  <select
                    id="exam"
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary"
                  >
                    {EXAM_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rank">Rank</Label>
                  <Input
                    id="rank"
                    type="number"
                    min={1}
                    placeholder="Enter your rank"
                    value={rank}
                    onChange={(event) => setRank(event.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Generating
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Search className="h-4 w-4" /> Recommend Colleges
                    </span>
                  )}
                </Button>

                {error && <p className="text-sm text-destructive">{error}</p>}
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {predictionMeta ? (
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle>Prediction summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Based on your <strong>{predictionMeta.exam}</strong> rank of <strong>{predictionMeta.rank}</strong>,
                    this tool recommends colleges with rankings up to <strong>{predictionMeta.maxRanking}</strong>.
                  </p>
                  {predictionMeta.usedFallback && (
                    <p className="text-sm text-muted-foreground">
                      No exact ranking matches were found in the local dataset, so we returned highly rated colleges instead.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-primary/10 shadow-sm">
                <CardHeader>
                  <CardTitle>How it works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    The predictor combines your exam and rank with the available college rankings.
                  </p>
                  <p>
                    It filters to the best-fit colleges from the local dataset and returns a shortlist for your profile.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Recommended colleges</h2>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-muted p-10 text-center text-muted-foreground">
              Enter an exam and rank to see recommendations.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((college) => (
                <Card key={college.id} className="border-primary/10 shadow-sm">
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-lg font-semibold">{college.name}</div>
                      <div className="text-sm text-muted-foreground">{college.location}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>
                        <div className="text-xs uppercase tracking-wide">Rank</div>
                        <div className="font-medium">{college.ranking ?? 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide">Rating</div>
                        <div className="font-medium">{college.rating.toFixed(1)}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>
                        <div className="text-xs uppercase tracking-wide">Fees</div>
                        <div className="font-medium">₹{college.fees.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide">Reviews</div>
                        <div className="font-medium">{college._count.reviews}</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Avg package: {college.averagePackage ? `₹${college.averagePackage.toLocaleString()}` : 'Not available'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

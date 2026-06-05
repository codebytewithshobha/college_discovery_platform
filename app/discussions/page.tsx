'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, MessageCircle, MessageSquare, PlusCircle } from 'lucide-react'

interface DiscussionAnswer {
  id: string
  body: string
  authorName: string | null
  createdAt: string
}

interface DiscussionQuestion {
  id: string
  title: string
  body: string
  authorName: string | null
  createdAt: string
  answers: DiscussionAnswer[]
}

export default function DiscussionsPage() {
  const [questions, setQuestions] = useState<DiscussionQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newQuestion, setNewQuestion] = useState({ title: '', body: '', authorName: '' })
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, { body: string; authorName: string }>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/discussions')
      const payload = await response.json()

      if (!response.ok) {
        setError(payload?.message || 'Unable to load discussions.')
        return
      }

      setQuestions(payload.data)
    } catch (fetchError) {
      setError('Unable to connect to discussion service.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      })
      const payload = await response.json()

      if (!response.ok) {
        setError(payload?.message || 'Unable to post question.')
      } else {
        setQuestions((current) => [payload.data, ...current])
        setNewQuestion({ title: '', body: '', authorName: '' })
      }
    } catch (fetchError) {
      setError('Unable to connect to discussion service.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAnswerSubmit = async (questionId: string) => {
    const draft = answerDrafts[questionId]
    if (!draft?.body?.trim()) {
      setError('Please enter an answer.')
      return
    }

    setError(null)
    setSubmitting(true)

    try {
      const response = await fetch(`/api/discussions/${questionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const payload = await response.json()

      if (!response.ok) {
        setError(payload?.message || 'Unable to post answer.')
      } else {
        setQuestions((current) =>
          current.map((question) =>
            question.id === questionId
              ? { ...question, answers: [...question.answers, payload.data] }
              : question
          )
        )
        setAnswerDrafts((prev) => ({ ...prev, [questionId]: { body: '', authorName: '' } }))
      }
    } catch (fetchError) {
      setError('Unable to connect to discussion service.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-gradient min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary shadow-sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Discussion Board
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Ask questions and join conversations</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Post a question, answer other users, and browse active discussions about college selection and admissions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section>
            <Card className="border-primary/10 shadow-sm mb-6">
              <CardHeader>
                <CardTitle>Ask a question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleQuestionSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question-title">Title</Label>
                    <Input
                      id="question-title"
                      placeholder="What do you want to ask?"
                      value={newQuestion.title}
                      onChange={(event) => setNewQuestion((prev) => ({ ...prev, title: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question-body">Question</Label>
                    <textarea
                      id="question-body"
                      rows={5}
                      value={newQuestion.body}
                      onChange={(event) => setNewQuestion((prev) => ({ ...prev, body: event.target.value }))}
                      className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary"
                      placeholder="Describe your question in detail"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question-author">Your name (optional)</Label>
                    <Input
                      id="question-author"
                      placeholder="Anonymous"
                      value={newQuestion.authorName}
                      onChange={(event) => setNewQuestion((prev) => ({ ...prev, authorName: event.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Posting
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" /> Post question
                      </span>
                    )}
                  </Button>
                </form>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </CardContent>
            </Card>

            {loading ? (
              <div className="rounded-2xl border border-dashed border-muted p-10 text-center text-muted-foreground">
                <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" /> Loading discussions...
              </div>
            ) : questions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-muted p-10 text-center text-muted-foreground">
                No discussion questions yet. Ask the first question now.
              </div>
            ) : (
              questions.map((question) => (
                <Card key={question.id} className="border-primary/10 shadow-sm mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-xl font-semibold">{question.title}</h2>
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {question.answers.length} answers
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{question.body}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>Asked by {question.authorName || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {question.answers.length > 0 && (
                      <div className="space-y-3 rounded-2xl border border-muted/30 bg-muted/20 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <MessageSquare className="h-4 w-4" /> Answers
                        </div>
                        {question.answers.map((answer) => (
                          <div key={answer.id} className="rounded-xl border border-border bg-background p-4">
                            <p className="text-sm leading-relaxed text-muted-foreground">{answer.body}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>{answer.authorName || 'Anonymous'}</span>
                              <span>•</span>
                              <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor={`answer-${question.id}`}>Your answer</Label>
                      <textarea
                        id={`answer-${question.id}`}
                        rows={4}
                        value={answerDrafts[question.id]?.body ?? ''}
                        onChange={(event) =>
                          setAnswerDrafts((prev) => ({
                            ...prev,
                            [question.id]: {
                              ...(prev[question.id] ?? { body: '', authorName: '' }),
                              body: event.target.value,
                            },
                          }))
                        }
                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary"
                        placeholder="Write your answer here"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`answer-author-${question.id}`}>Your name (optional)</Label>
                      <Input
                        id={`answer-author-${question.id}`}
                        placeholder="Anonymous"
                        value={answerDrafts[question.id]?.authorName ?? ''}
                        onChange={(event) =>
                          setAnswerDrafts((prev) => ({
                            ...prev,
                            [question.id]: {
                              ...(prev[question.id] ?? { body: '', authorName: '' }),
                              authorName: event.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() => handleAnswerSubmit(question.id)}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Posting
                          </span>
                        ) : (
                          'Submit answer'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </section>

          <aside className="space-y-4">
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Discussion guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Ask clear questions, share useful admissions insights, and keep answers focused on colleges and exams.</p>
                <p>Use a real name or remain anonymous if you prefer.</p>
                <p>Questions and answers appear instantly for others to browse.</p>
              </CardContent>
            </Card>
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Need tips?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Try asking about your exam rank range, college cutoffs, or program specializations.</p>
                <p>Answers are saved in the app and visible immediately.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

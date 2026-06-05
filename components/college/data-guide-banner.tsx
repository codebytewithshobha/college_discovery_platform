import { Database, FileSpreadsheet, PlusCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DataGuideBanner() {
  return (
    <Card className="border-dashed border-primary/30 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Need more college details?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          This app uses a local demo database. To add more colleges, courses, and reviews:
        </p>
        <ul className="space-y-2 list-none">
          <li className="flex gap-2">
            <PlusCircle className="h-4 w-4 shrink-0 text-accent mt-0.5" />
            <span>
              Edit <code className="text-xs bg-muted px-1 rounded">lib/india-locations.ts</code> and{' '}
              <code className="text-xs bg-muted px-1 rounded">prisma/seed.ts</code>, then run{' '}
              <code className="text-xs bg-muted px-1 rounded">npm run db:seed</code>
            </span>
          </li>
          <li className="flex gap-2">
            <FileSpreadsheet className="h-4 w-4 shrink-0 text-accent mt-0.5" />
            <span>
              For production: import a CSV/API into PostgreSQL and update{' '}
              <code className="text-xs bg-muted px-1 rounded">DATABASE_URL</code> in{' '}
              <code className="text-xs bg-muted px-1 rounded">.env</code>
            </span>
          </li>
        </ul>
        <p>
          Click <strong className="text-foreground">View Details</strong> on any college for full courses,
          placements, recruiters, and reviews.
        </p>
      </CardContent>
    </Card>
  )
}

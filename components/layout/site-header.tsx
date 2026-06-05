'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, GitCompare, Bookmark, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useComparisonStore } from '@/lib/store/comparison'
import { useSavedCollegesStore } from '@/lib/store/saved-colleges'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/colleges', label: 'Browse', icon: Search },
  { href: '/compare', label: 'Compare', icon: GitCompare, badge: 'compare' as const },
  { href: '/saved', label: 'Saved', icon: Bookmark, badge: 'saved' as const },
]

export function SiteHeader() {
  const pathname = usePathname()
  const compareCount = useComparisonStore((s) => s.selectedColleges.length)
  const savedCount = useSavedCollegesStore((s) => s.savedCollegeIds.length)

  const isHome = pathname === '/'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-md',
        isHome
          ? 'border-white/20 bg-white/70'
          : 'border-border/60 bg-background/85'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CollegeHub
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            const count = badge === 'compare' ? compareCount : badge === 'saved' ? savedCount : 0
            return (
              <Link key={href} href={href}>
                <Button
                  variant={active ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn('gap-2', active && 'bg-primary/10 text-primary')}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {count > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {count}
                    </span>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="shadow-sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const hiddenTaskKeys = useMemo(() => new Set(['classified', 'profile']), [])
  const taskLinks = useMemo(
    () => SITE_CONFIG.tasks
      .filter((task) => task.enabled && !hiddenTaskKeys.has(task.key))
      .map((task) => ({ label: task.label, href: task.route })),
    [hiddenTaskKeys]
  )

  const menuLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find Category', href: taskLinks[0]?.href || '/' },
    { label: 'All Articles', href: '/article' },
    { label: 'Contact Us', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-white">
      <div className="mx-auto flex max-w-[var(--editable-container)] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-end gap-3">
          <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-warm)] p-2 shadow-[0_10px_25px_rgba(136,98,90,0.08)] sm:h-[4.5rem] sm:w-[4.5rem]">
            <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-full w-full object-contain" />
          </span>
          <span className="pb-1">
            <span className="editable-display block text-[3rem] font-semibold leading-[0.9] text-[var(--slot4-page-text)] sm:text-[3.6rem]">
              {SITE_CONFIG.name.replace(/\.[^/.]+$/, '')}
            </span>
            <span className="mt-2 inline-flex rounded-md bg-[var(--slot4-accent-fill)] px-3 py-1 text-[0.92rem] font-semibold uppercase tracking-[0.38em] text-white">
              Articles
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="border border-[var(--editable-border)] p-2 text-[var(--slot4-page-text)] lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <nav className="bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)]">
        <div className="mx-auto flex max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="hidden items-center lg:flex">
            {menuLinks.map((item, index) => {
              const active = isActive(pathname, item.href)
              const withCaret = index === 1 || index === 2
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1 px-5 py-4 text-sm font-semibold transition ${
                    active ? 'bg-white/10 text-white' : 'text-white hover:bg-white/8'
                  }`}
                >
                  {item.label}
                  {withCaret ? <ChevronDown className="h-4 w-4" /> : null}
                </Link>
              )
            })}
          </div>

          <form action="/search" className="ml-auto hidden items-center gap-2 lg:flex">
            <button type="submit" className="p-2 text-white" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="hidden items-center gap-3 py-3 lg:flex">
            {session ? (
              <>
                <Link href="/create" className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                  <PlusCircle className="h-4 w-4" /> Submit Article
                </Link>
                <button type="button" onClick={logout} className="rounded-sm border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-black/35 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/20">
                  <UserPlus className="h-4 w-4" /> Join
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-white px-4 py-5 lg:hidden">
          <form action="/search" className="mb-4 flex items-center gap-3 rounded-md border border-[var(--editable-border)] bg-[var(--slot4-lavender)] px-4 py-3">
            <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
            <input
              name="q"
              type="search"
              placeholder={pagesPlaceholder()}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
          </form>
          <div className="grid gap-2">
            {[...menuLinks, ...taskLinks, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-4 py-3 text-sm font-semibold ${
                    active ? 'bg-[var(--slot4-lavender)] text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-gray)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button type="button" onClick={logout} className="rounded-md px-4 py-3 text-left text-sm font-semibold text-[var(--slot4-page-text)] hover:bg-[var(--slot4-gray)]">
                Logout
              </button>
            ) : null}
          </div>
          <p className="mt-4 text-sm text-[var(--slot4-muted-text)]">{globalContent.nav.tagline}</p>
        </div>
      ) : null}
    </header>
  )
}

function pagesPlaceholder() {
  return 'Search articles, listings, profiles...'
}

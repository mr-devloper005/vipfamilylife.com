'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'classified' && task.key !== 'profile').slice(0, 5)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 text-center sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex flex-col items-center">
          <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.75rem] border border-[var(--editable-border)] bg-white p-3 shadow-[0_12px_30px_rgba(136,98,90,0.08)]">
            <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-full w-full object-contain" />
          </span>
          <span className="editable-display mt-4 text-[4.6rem] font-semibold leading-none text-[var(--slot4-accent)] sm:text-[5.4rem]">
            {SITE_CONFIG.name.replace(/\.[^/.]+$/, '')}
          </span>
          <span className="mt-2 inline-flex rounded-md bg-[var(--slot4-accent-fill)] px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.42em] text-white">
            Articles
          </span>
        </Link>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[var(--slot4-page-text)]">
          {globalContent.footer.description}
        </p>
        <div className="mt-12 border-t border-[var(--editable-border)] pt-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-base">
            {taskLinks.map((task) => (
              <Link key={task.key} href={task.route} className="font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">
                {task.label}
              </Link>
            ))}
            <Link href="/about" className="font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">About</Link>
            <Link href="/contact" className="font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Contact</Link>
            {session ? (
              <>
                <Link href="/create" className="font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Create</Link>
                <button type="button" onClick={logout} className="font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Login</Link>
                <Link href="/signup" className="font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--editable-border)] pt-8 text-sm text-[var(--slot4-muted-text)] lg:flex-row lg:items-center lg:justify-between">
          <p>Copyright {year} {SITE_CONFIG.name}. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link href="/about" className="hover:text-[var(--slot4-accent)]">Disclaimer</Link>
            <Link href="/contact" className="hover:text-[var(--slot4-accent)]">Terms and Conditions</Link>
            <Link href="/contact" className="hover:text-[var(--slot4-accent)]">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-[var(--slot4-accent)]">Refund Policy</Link>
            <Link href="/contact" className="hover:text-[var(--slot4-accent)]">Publishing Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Cormorant Garamond', Georgia, serif"
const BODY_FONT = "'Source Sans 3', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#fffaf7',
  surface: '#ffffff',
  raised: '#fff2ed',
  text: '#1f1a17',
  muted: '#6f625e',
  line: '#ead9d3',
  accent: '#B5828C',
  accentSoft: '#FFCDB2',
  onAccent: '#ffffff',
  glow: 'rgba(181,130,140,0.14)',
  radius: '1.4rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Articles', note: 'Clear reads, practical ideas, and stories with room to breathe.' },
  listing: { ...base, kicker: 'Directory', note: 'A polished browse of services, studios, and trusted business profiles.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Useful offers and opportunities presented in a cleaner browse.' },
  image: { ...base, kicker: 'Gallery', note: 'A visual stream with a softer editorial frame.' },
  sbm: { ...base, kicker: 'Resources', note: 'Saved links and references worth opening later.' },
  pdf: { ...base, kicker: 'Library', note: 'Guides and downloadable files arranged like a tidy archive.' },
  profile: { ...base, kicker: 'Profiles', note: 'People and business pages presented with a magazine calm.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}

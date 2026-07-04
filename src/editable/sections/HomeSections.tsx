import Link from 'next/link'
import { ArrowRight, ChevronRight, FileText, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getExcerpt(post?: SitePost | null, limit = 135) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = stripHtml(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

function bylineOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (
    (typeof content.author === 'string' && content.author) ||
    (typeof content.company === 'string' && content.company) ||
    (typeof content.name === 'string' && content.name) ||
    SITE_CONFIG.name.replace(/\.[^/.]+$/, '')
  )
}

function dateOf(post?: SitePost | null) {
  const raw = post?.publishedAt || post?.createdAt || ''
  const parsed = raw ? new Date(raw) : null
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toLocaleDateString('en-GB') : 'Recently added'
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function categoryChips(posts: SitePost[]) {
  const all = dedupePosts(posts)
    .map((post) => categoryOf(post))
    .filter(Boolean)
  const unique = Array.from(new Set(all))
  return unique.slice(0, 12)
}

export function EditableHomeHero({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const chips = categoryChips(pool)
  const heroTitle = pagesContent.home.hero.title.join(' ')

  return (
    <section className="bg-[linear-gradient(180deg,#cfe5f4_0%,#eaf5fc_58%,#fff8f4_100%)]">
      <div className={`${container} py-16 text-center sm:py-20 lg:py-24`}>
        <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[var(--slot4-accent)]">
          {pagesContent.home.hero.badge}
        </p>
        <h1 className="mx-auto mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[4.5rem]">
          {heroTitle}
        </h1>
        <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-[var(--slot4-accent-fill)]" />
        <p className="mx-auto mt-8 max-w-4xl text-lg leading-8 text-[var(--slot4-page-text)]">
          {pagesContent.home.hero.description}
        </p>

        <form action="/search" className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/70 bg-white/88 p-3 shadow-[0_18px_50px_rgba(30,120,186,0.12)] backdrop-blur sm:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <Search className="h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
            <input
              name="q"
              placeholder={pagesContent.home.hero.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
          </label>
          <button className="rounded-md bg-[var(--slot4-accent-fill)] px-7 py-3 text-base font-bold text-white transition hover:brightness-95">
            Search
          </button>
        </form>

        <div className="mt-8">
          <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-md bg-[var(--slot4-accent-fill)] px-8 py-4 text-lg font-bold text-white transition hover:brightness-95">
            {pagesContent.home.hero.primaryCta.label}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-16 text-left">
          <h2 className="editable-display text-4xl font-semibold tracking-[-0.04em] text-[var(--slot4-page-text)] sm:text-5xl">
            Explore By Category
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {chips.map((chip) => (
              <Link
                key={chip}
                href={primaryRoute}
                className="inline-flex items-center gap-2 rounded-sm border border-[var(--editable-border)] bg-white px-4 py-4 text-lg font-semibold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
              >
                <FileText className="h-4 w-4 text-[var(--slot4-accent)]" />
                <span className="truncate">{chip}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const items = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 9)
  if (!items.length) return null
  return (
    <section className="bg-transparent">
      <div className={`${container} py-12 sm:py-14`}>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((post, index) => (
            <HomeCard key={post.id || post.slug || `${post.title}-${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} variant={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const items = dedupePosts([...timeSections.flatMap((section) => section.posts), ...posts]).slice(9, 15)
  if (!items.length) return null
  return (
    <section className="bg-transparent">
      <div className={`${container} pb-12 sm:pb-14`}>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <FeaturedPanel post={items[0]} href={postHref(primaryTask, items[0], primaryRoute)} />
          <div className="grid gap-4">
            {items.slice(1, 5).map((post, index) => (
              <EditorialRow key={post.id || post.slug || `${post.title}-${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(15, 27)
  if (!pool.length) return null
  return (
    <section className="bg-transparent">
      <div className={`${container} pb-16`}>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pool.map((post, index) => (
            <HomeCard key={post.id || post.slug || `${post.title}-${index}`} post={post} href={postHref(primaryTask, post, primaryRoute)} variant={index + 1} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-md bg-[var(--slot4-accent-fill)] px-7 py-4 text-lg font-bold text-white transition hover:brightness-95">
            Load more
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="pb-16">
      <div className={`${container}`}>
        <div className="rounded-[2rem] border border-[var(--editable-border)] bg-white px-6 py-10 text-center shadow-[0_16px_45px_rgba(136,98,90,0.08)] sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent)]">
            {pagesContent.home.cta.badge}
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--slot4-page-text)] sm:text-5xl">
            {pagesContent.home.cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">
            {pagesContent.home.cta.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={pagesContent.home.cta.primaryCta.href} className="rounded-md bg-[var(--slot4-accent-fill)] px-7 py-3 text-base font-bold text-white transition hover:brightness-95">
              {pagesContent.home.cta.primaryCta.label}
            </Link>
            <Link href={pagesContent.home.cta.secondaryCta.href} className="rounded-md border border-[var(--editable-border)] bg-[var(--slot4-warm)] px-7 py-3 text-base font-bold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
              {pagesContent.home.cta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomeCard({ post, href, variant }: { post: SitePost; href: string; variant: number }) {
  const mode = variant % 5
  if (mode === 0) return <FeaturedStoryCard post={post} href={href} />
  if (mode === 1) return <ClassicVerticalCard post={post} href={href} />
  if (mode === 2) return <CompactStoryCard post={post} href={href} />
  if (mode === 3) return <HorizontalStoryCard post={post} href={href} />
  return <ImageFirstCard post={post} href={href} />
}

function MetaLine({ post }: { post: SitePost }) {
  return (
    <p className="mt-3 text-sm font-semibold text-[var(--slot4-page-text)]">
      {bylineOf(post)} <span className="text-[var(--slot4-muted-text)]">/ {dateOf(post)} / No Comments</span>
    </p>
  )
}

function FeaturedStoryCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-[var(--editable-border)] bg-white shadow-[0_14px_40px_rgba(136,98,90,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(136,98,90,0.12)]">
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
        </div>
      </Link>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{categoryOf(post)}</p>
        <Link href={href} className="mt-3 block text-[2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
          {post.title}
        </Link>
        <MetaLine post={post} />
        <p className="mt-4 line-clamp-3 text-lg leading-8 text-[var(--slot4-page-text)]">{getExcerpt(post, 180)}</p>
        <Link href={href} className="mt-6 inline-flex rounded-md bg-[var(--slot4-accent-fill)] px-6 py-3 text-lg font-bold text-white transition hover:brightness-95">
          View More
        </Link>
      </div>
    </article>
  )
}

function ClassicVerticalCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-[var(--editable-border)] bg-white shadow-[0_14px_40px_rgba(136,98,90,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(136,98,90,0.12)]">
      <Link href={href} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
        </div>
      </Link>
      <div className="p-5">
        <Link href={href} className="block text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.04em] text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
          {post.title}
        </Link>
        <MetaLine post={post} />
        <p className="mt-4 line-clamp-3 text-base leading-8 text-[var(--slot4-page-text)]">{getExcerpt(post, 150)}</p>
        <Link href={href} className="mt-6 inline-flex rounded-md bg-[var(--slot4-accent-fill)] px-5 py-3 text-base font-bold text-white transition hover:brightness-95">
          View More
        </Link>
      </div>
    </article>
  )
}

function CompactStoryCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="flex h-full flex-col rounded-[1.4rem] border border-[var(--editable-border)] bg-[var(--slot4-warm)] p-5 shadow-[0_14px_40px_rgba(136,98,90,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(136,98,90,0.12)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{categoryOf(post)}</p>
      <Link href={href} className="mt-3 block text-[1.8rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
        {post.title}
      </Link>
      <MetaLine post={post} />
      <p className="mt-4 line-clamp-4 flex-1 text-base leading-8 text-[var(--slot4-page-text)]">{getExcerpt(post, 170)}</p>
      <Link href={href} className="mt-6 inline-flex items-center gap-2 font-bold text-[var(--slot4-accent)]">
        Read Feature <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  )
}

function HorizontalStoryCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-[var(--editable-border)] bg-white shadow-[0_14px_40px_rgba(136,98,90,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(136,98,90,0.12)]">
      <div className="grid gap-0 sm:grid-cols-[0.95fr_1.05fr]">
        <Link href={href} className="block">
          <div className="h-full min-h-[230px] overflow-hidden bg-[var(--slot4-media-bg)]">
            <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
          </div>
        </Link>
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{categoryOf(post)}</p>
          <Link href={href} className="mt-3 block text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
            {post.title}
          </Link>
          <MetaLine post={post} />
          <p className="mt-4 line-clamp-3 text-base leading-8 text-[var(--slot4-page-text)]">{getExcerpt(post, 135)}</p>
        </div>
      </div>
    </article>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-[var(--editable-border)] bg-white shadow-[0_14px_40px_rgba(136,98,90,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(136,98,90,0.12)]">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-page-text)] shadow-sm">
            {categoryOf(post)}
          </span>
        </div>
      </Link>
      <div className="p-5">
        <Link href={href} className="block text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
          {post.title}
        </Link>
        <MetaLine post={post} />
      </div>
    </article>
  )
}

function FeaturedPanel({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="overflow-hidden rounded-[1.8rem] border border-[var(--editable-border)] bg-white shadow-[0_16px_45px_rgba(136,98,90,0.08)]">
      <Link href={href} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
        </div>
      </Link>
      <div className="p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Featured Story</p>
        <Link href={href} className="mt-3 block text-[2.3rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
          {post.title}
        </Link>
        <p className="mt-4 text-lg leading-8 text-[var(--slot4-page-text)]">{getExcerpt(post, 220)}</p>
      </div>
    </article>
  )
}

function EditorialRow({ post, href }: { post: SitePost; href: string }) {
  return (
    <article className="rounded-[1.4rem] border border-[var(--editable-border)] bg-white p-5 shadow-[0_14px_40px_rgba(136,98,90,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(136,98,90,0.12)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{categoryOf(post)}</p>
      <Link href={href} className="mt-2 block text-[1.55rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
        {post.title}
      </Link>
      <p className="mt-3 line-clamp-2 text-base leading-7 text-[var(--slot4-muted-text)]">{getExcerpt(post, 105)}</p>
    </article>
  )
}

/**
 * Single sitemap at /sitemap.xml — every indexed page URL + image entries.
 * One urlset only (never a sitemap index). 404 is excluded.
 */
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const dataDir = join(root, 'src', 'data')
const pagesDir = join(root, 'src', 'pages')
const SITE = (process.env.SITE_URL || 'https://buywardogshacks.com').replace(/\/$/, '')
const TODAY = new Date().toLocaleDateString('en-CA')
const HREFLANG = ['en', 'x-default']

const HERO_FULL = '/media/wardogs-hero-full.webp'
const COVER = '/media/wardogs-cover.webp'
const LOGO = '/media/wardogs-logo.webp'
const PREVIEW_01 = '/media/wardogs-preview-01.webp'
const PREVIEW_02 = '/media/wardogs-preview-02.webp'
const PREVIEW_03 = '/media/wardogs-preview-03.webp'
const PREVIEW_THUMB = '/media/wardogs-preview-thumb.webp'
const OG_DEFAULT = '/og/wardogs-cheats.jpg'

const ALL_SITE_IMAGES = [
  HERO_FULL,
  COVER,
  LOGO,
  PREVIEW_01,
  PREVIEW_02,
  PREVIEW_03,
  PREVIEW_THUMB,
  '/og/home.jpg',
  '/og/wardogs-cheats.jpg',
  '/og/forums.jpg',
  '/og/reviews.jpg',
  '/og/faq.jpg',
  '/og/support.jpg',
  '/og/privacy.jpg',
  '/og/terms.jpg',
  '/og/refunds.jpg',
]

const FORUM_IMAGES = {
  'features-list': COVER,
  hotkeys: PREVIEW_01,
  'complete-setup': HERO_FULL,
  'disable-antivirus': PREVIEW_02,
  'undetected-status': COVER,
  'aimbot-settings': PREVIEW_02,
  'esp-wallhack-guide': PREVIEW_03,
  'radar-hack-guide': PREVIEW_01,
  'stream-proof-setup': PREVIEW_03,
  'vac-status': COVER,
  'windows-setup': HERO_FULL,
  'raid-play-guide': PREVIEW_02,
  'loader-errors': PREVIEW_THUMB,
}

const PAGE_META = {
  '/': { priority: '1.0', changefreq: 'daily' },
  '/wardogs-cheats': { priority: '0.9', changefreq: 'weekly' },
  '/forums': { priority: '0.85', changefreq: 'weekly' },
  '/reviews': { priority: '0.8', changefreq: 'weekly' },
  '/faq': { priority: '0.75', changefreq: 'monthly' },
  '/support': { priority: '0.75', changefreq: 'weekly' },
  '/privacy': { priority: '0.4', changefreq: 'yearly' },
  '/terms': { priority: '0.4', changefreq: 'yearly' },
  '/refunds': { priority: '0.45', changefreq: 'yearly' },
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

/** Keep captions ASCII-safe for maximum crawler compatibility. */
function asciiSafe(value) {
  return String(value)
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')
}

function siteUrl(path) {
  return !path || path === '/' ? `${SITE}/` : `${SITE}${path.startsWith('/') ? path : `/${path}`}`
}

function loadGames() {
  const src = readFileSync(join(dataDir, 'games.ts'), 'utf8')
  return [...src.matchAll(/\{\s*slug:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]/g)].map(
    (match) => ({ slug: match[1], name: match[2] }),
  )
}

function loadForums() {
  const src = readFileSync(join(dataDir, 'blogs.ts'), 'utf8')
  const pattern =
    /slug:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*excerpt:\s*['"]([^'"]+)['"],\s*metaTitle:\s*['"]([^'"]+)['"],\s*metaDescription:\s*['"]([^'"]+)['"],[\s\S]*?date:\s*['"](\d{4}-\d{2}-\d{2})['"]/g
  return [...src.matchAll(pattern)].map((match) => ({
    slug: match[1],
    title: match[2],
    excerpt: match[3],
    metaTitle: match[4],
    metaDescription: match[5],
    date: match[6],
  }))
}

function loadStaticRoutes() {
  return readdirSync(pagesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.astro') && entry.name !== '404.astro')
    .map((entry) => (entry.name === 'index.astro' ? '/' : `/${entry.name.slice(0, -6)}`))
}

function alternateLinks(url) {
  return HREFLANG.map(
    (language) =>
      `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(url)}" />`,
  ).join('\n')
}

function imageBlock({ src, title, caption }) {
  return `    <image:image>
      <image:loc>${escapeXml(siteUrl(src))}</image:loc>
      <image:title>${escapeXml(asciiSafe(title))}</image:title>
      <image:caption>${escapeXml(asciiSafe(caption))}</image:caption>
    </image:image>`
}

function videoBlock({ thumb, title, description, content }) {
  return `    <video:video>
      <video:thumbnail_loc>${escapeXml(siteUrl(thumb))}</video:thumbnail_loc>
      <video:title>${escapeXml(asciiSafe(title))}</video:title>
      <video:description>${escapeXml(asciiSafe(description))}</video:description>
      <video:content_loc>${escapeXml(siteUrl(content))}</video:content_loc>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>`
}

function urlEntry({ path, priority, changefreq, lastmod = TODAY, images, videos = [] }) {
  if (!images?.length) throw new Error(`Sitemap entry for ${path} is missing images`)
  const url = siteUrl(path)
  const media = [
    ...images.map((image) => imageBlock(image)),
    ...videos.map((video) => videoBlock(video)),
  ]
  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternateLinks(url)}
${media.join('\n')}
  </url>`
}

function imagesForPath(path, games, forums) {
  if (path === '/') {
    return [
      {
        src: '/og/home.jpg',
        title: 'WARDOGS Cheats Open Graph',
        caption: 'Google and social preview image for buywardogshacks.com homepage.',
      },
      {
        src: LOGO,
        title: 'WARDOGS hacks logo',
        caption: 'wardogs hacks and war dogs hacks header logo on buywardogshacks.com.',
      },
      {
        src: HERO_FULL,
        title: 'WARDOGS Cheats Hero',
        caption: 'Buy WARDOGS cheats - WARDOGS Aimbot, ESP and radar hack hero artwork for PC.',
      },
      {
        src: COVER,
        title: 'WARDOGS Cheats Product Cover',
        caption: 'WARDOGS cheats product cover for checkout and social previews.',
      },
      {
        src: PREVIEW_THUMB,
        title: 'WARDOGS hacks in-game preview',
        caption: 'wardogs aimbot and wardogs esp in-game preview still.',
      },
      {
        src: OG_DEFAULT,
        title: 'WARDOGS Cheats Product Social Preview',
        caption: 'Default Open Graph image for buywardogshacks.com product pages.',
      },
    ]
  }

  const game = games.find((g) => path === `/${g.slug}-cheats`)
  if (game) {
    return [
      {
        src: '/og/wardogs-cheats.jpg',
        title: 'WARDOGS Cheats Open Graph',
        caption: 'Google and social preview for the WARDOGS cheats product page.',
      },
      {
        src: COVER,
        title: 'WARDOGS Aimbot ESP Product Artwork',
        caption: 'Product features, compatibility, status and price before checkout.',
      },
      {
        src: HERO_FULL,
        title: `${game.name} Cheats Product Hero`,
        caption: `Hero artwork for ${game.name} Aimbot, ESP and radar hack product details.`,
      },
      {
        src: PREVIEW_01,
        title: `${game.name} hacks menu preview`,
        caption: `wardogs hacks menu and aimbot settings on Windows PC.`,
      },
      {
        src: PREVIEW_02,
        title: `${game.name} ESP preview`,
        caption: `wardogs esp and player visuals in-game.`,
      },
      {
        src: PREVIEW_THUMB,
        title: 'WARDOGS hacks in-game preview',
        caption: 'wardogs aimbot and wardogs esp in-game preview still.',
      },
    ]
  }

  if (path === '/forums') {
    return [
      {
        src: '/og/forums.jpg',
        title: 'WARDOGS Cheats Forums Open Graph',
        caption: 'Google preview image for the WARDOGS Cheats guides index.',
      },
      {
        src: PREVIEW_01,
        title: 'WARDOGS Cheats Forum Artwork',
        caption: 'Artwork reference for WARDOGS setup and feature guides.',
      },
    ]
  }

  if (path.startsWith('/forums/')) {
    const slug = path.slice('/forums/'.length)
    const forum = forums.find((f) => f.slug === slug)
    return [
      {
        src: `/og/forums-${slug}.jpg`,
        title: `${forum?.title || slug} Open Graph`,
        caption:
          forum?.metaDescription ||
          `Google preview image for ${forum?.title || slug} on buywardogshacks.com.`,
      },
      {
        src: FORUM_IMAGES[slug] || PREVIEW_01,
        title: `${forum?.title || slug} Artwork`,
        caption:
          forum?.excerpt ||
          `Visible WARDOGS Cheats guide artwork for ${forum?.title || slug}.`,
      },
    ]
  }

  if (path === '/reviews') {
    return [
      {
        src: '/og/reviews.jpg',
        title: 'WARDOGS Cheats Reviews Open Graph',
        caption: 'Google preview image for WARDOGS cheats reviews.',
      },
    ]
  }
  if (path === '/faq') {
    return [
      {
        src: '/og/faq.jpg',
        title: 'WARDOGS Cheats FAQ Open Graph',
        caption: 'Google preview image for the WARDOGS Cheats FAQ.',
      },
    ]
  }
  if (path === '/support') {
    return [
      {
        src: '/og/support.jpg',
        title: 'WARDOGS Cheats Support Open Graph',
        caption: 'Google preview image for WARDOGS Cheats support.',
      },
    ]
  }
  if (path === '/privacy') {
    return [
      {
        src: '/og/privacy.jpg',
        title: 'WARDOGS Cheats Privacy Policy',
        caption: 'Privacy policy preview for buywardogshacks.com orders and support.',
      },
    ]
  }
  if (path === '/terms') {
    return [
      {
        src: '/og/terms.jpg',
        title: 'WARDOGS Cheats Terms of Use',
        caption: 'License terms preview for WARDOGS Cheats.',
      },
    ]
  }
  if (path === '/refunds') {
    return [
      {
        src: '/og/refunds.jpg',
        title: 'WARDOGS Cheats Refund Policy',
        caption: 'Refund rules preview for digital WARDOGS Cheats licenses.',
      },
    ]
  }

  return [{ src: OG_DEFAULT, title: 'WARDOGS Cheats', caption: 'WARDOGS Cheats page artwork.' }]
}

function videosForPath(_path) {
  return []
}

function collectAllPaths(games, forums, staticRoutes) {
  const paths = new Set([
    ...staticRoutes,
    ...games.map((game) => `/${game.slug}-cheats`),
    ...forums.map((forum) => `/forums/${forum.slug}`),
  ])
  // Never index error page
  paths.delete('/404')
  return [...paths]
}

function sortPaths(allPaths) {
  return [...allPaths].sort((a, b) => {
    const rank = (path) => {
      if (path === '/') return 0
      if (path.endsWith('-cheats')) return 1
      if (path === '/forums') return 2
      if (path.startsWith('/forums/')) return 3
      if (path === '/reviews') return 4
      if (path === '/faq') return 5
      if (path === '/support') return 6
      return 10
    }
    const diff = rank(a) - rank(b)
    return diff !== 0 ? diff : a.localeCompare(b)
  })
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildSitemap(games, forums, allPaths) {
  const forumByPath = new Map(forums.map((f) => [`/forums/${f.slug}`, f]))

  const sorted = sortPaths(allPaths)

  const entries = sorted.map((path) => {
    const meta = PAGE_META[path] || {
      priority: path.startsWith('/forums/') ? '0.8' : '0.5',
      changefreq: path.startsWith('/forums/') ? 'monthly' : 'weekly',
    }
    const forum = forumByPath.get(path)
    return urlEntry({
      path,
      priority: meta.priority,
      changefreq: meta.changefreq,
      lastmod: forum?.date || TODAY,
      images: imagesForPath(path, games, forums),
      videos: videosForPath(path),
    })
  })

  // No xml-stylesheet — GSC and other crawlers must receive plain XML only.
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.join('\n')}
</urlset>
`
}

/** Human-readable sitemap (browsers). Submit sitemap.xml to Google Search Console. */
function buildSitemapHtml(games, forums, allPaths) {
  const forumByPath = new Map(forums.map((f) => [`/forums/${f.slug}`, f]))
  const sorted = sortPaths(allPaths)
  const gscUrl = siteUrl('/sitemap.xml')
  const rows = sorted
    .map((path) => {
      const meta = PAGE_META[path] || {
        priority: path.startsWith('/forums/') ? '0.8' : '0.5',
        changefreq: path.startsWith('/forums/') ? 'monthly' : 'weekly',
      }
      const forum = forumByPath.get(path)
      const lastmod = forum?.date || TODAY
      const url = siteUrl(path)
      const imageCount = imagesForPath(path, games, forums).length
      return `        <tr>
          <td><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></td>
          <td>${escapeHtml(lastmod)}</td>
          <td>${escapeHtml(meta.changefreq)}</td>
          <td>${escapeHtml(meta.priority)}</td>
          <td>${imageCount}</td>
        </tr>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, follow" />
    <title>Sitemap | buywardogshacks.com</title>
    <style>
      :root { color-scheme: dark; font-family: system-ui,Segoe UI,Roboto,sans-serif; background:#0d1117; color:#e6edf3; }
      body { margin:0; padding:24px 20px 48px; max-width:1100px; }
      h1 { font-size:1.35rem; margin:0 0 8px; }
      p, li { line-height:1.55; color:#9da7b3; }
      .gsc { margin:20px 0 28px; padding:16px 18px; border:1px solid #30363d; border-radius:10px; background:#161b22; }
      .gsc strong { color:#e6edf3; }
      .gsc code, .gsc input { font-family:ui-monospace,Consolas,monospace; font-size:14px; }
      .gsc input { width:100%; max-width:520px; margin-top:10px; padding:10px 12px; border-radius:8px; border:1px solid #30363d; background:#0d1117; color:#79c0ff; }
      .links { margin:12px 0 0; }
      .links a { color:#79c0ff; text-decoration:none; }
      .links a:hover { text-decoration:underline; }
      table { width:100%; border-collapse:collapse; font-size:14px; }
      th, td { text-align:left; padding:10px 12px; border-bottom:1px solid #21262d; vertical-align:top; }
      th { color:#8b949e; font-weight:600; font-size:12px; text-transform:uppercase; letter-spacing:.04em; }
      td a { color:#79c0ff; word-break:break-all; }
      tbody tr:hover { background:#161b22; }
      .count { color:#8b949e; font-size:13px; margin-bottom:12px; }
    </style>
  </head>
  <body>
    <h1>XML Sitemap</h1>
    <p class="count">${sorted.length} indexed URLs on buywardogshacks.com</p>
    <div class="gsc">
      <strong>Google Search Console</strong>
      <p>Submit <strong>only</strong> this URL in GSC (not <code>/sitemap</code>):</p>
      <input type="text" readonly value="${escapeHtml(gscUrl)}" aria-label="Sitemap URL for Google Search Console" onclick="this.select()" />
      <p class="links">
        GSC field: <code>sitemap.xml</code> ·
        <a href="${escapeHtml(gscUrl)}">Open XML</a>
        · Includes all pages plus <code>image:image</code> entries for /media and /og assets.
      </p>
    </div>
    <table>
      <thead>
        <tr>
          <th>URL</th>
          <th>Last modified</th>
          <th>Change freq</th>
          <th>Priority</th>
          <th>Images</th>
        </tr>
      </thead>
      <tbody>
${rows}
      </tbody>
    </table>
  </body>
</html>
`
}

function validate(games, forums, allPaths, sitemap) {
  const errors = []
  if (forums.some((forum) => ['instructions', 'how-to-load'].includes(forum.slug))) {
    errors.push('Retired forum slug remains indexed')
  }
  for (const game of games) {
    const page = join(pagesDir, `${game.slug}-cheats.astro`)
    if (!existsSync(page)) errors.push(`Product route has no page file: /${game.slug}-cheats`)
  }
  if (forums.length && !existsSync(join(pagesDir, 'forums', '[slug].astro'))) {
    errors.push('Forum routes have no dynamic page file: src/pages/forums/[slug].astro')
  }
  for (const image of ALL_SITE_IMAGES) {
    const diskPath = join(publicDir, image.replace(/^\//, ''))
    if (!existsSync(diskPath)) errors.push(`Missing image asset on disk: ${image}`)
  }

  const expectedUrls = new Set(allPaths.map(siteUrl))
  const pageLocs = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  const imageLocs = [...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => match[1])
  const urlBlocks = sitemap.match(/<url>[\s\S]*?<\/url>/g) || []

  for (const url of expectedUrls) {
    if (!pageLocs.includes(url)) errors.push(`Missing URL: ${url}`)
  }
  for (const url of pageLocs) {
    if (!expectedUrls.has(url)) errors.push(`Unexpected URL: ${url}`)
  }
  if (new Set(pageLocs).size !== pageLocs.length) errors.push('sitemap.xml contains duplicate page URLs')
  if (sitemap.includes('<sitemapindex')) errors.push('sitemap.xml must be a single urlset, not an index')
  if ((sitemap.match(/<urlset[\s>]/g) || []).length !== 1) {
    errors.push('sitemap.xml must contain exactly one <urlset>')
  }
  if (urlBlocks.length !== expectedUrls.size) {
    errors.push(`Expected ${expectedUrls.size} <url> entries, found ${urlBlocks.length}`)
  }
  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] || '(unknown)'
    if (!block.includes('<image:image>') || !block.includes('<image:loc>')) {
      errors.push(`URL missing image entry: ${loc}`)
    }
  }
  for (const image of ALL_SITE_IMAGES) {
    if (!imageLocs.includes(siteUrl(image))) errors.push(`Sitemap missing required image: ${image}`)
  }
  if (/tarkovcheats\.io|warzonecheats|dayzcheats\.io|escape-from-tarkov-cheats/i.test(sitemap)) {
    errors.push('Sitemap still contains legacy game-shop domains')
  }
  if (!sitemap.includes('buywardogshacks.com')) {
    errors.push('Sitemap must target buywardogshacks.com')
  }
  if (/tarkovcheats|warzonecheats|dayzcheats\.io|theisle/i.test(sitemap)) {
    errors.push('Sitemap contains a non-canonical domain')
  }
  if (imageLocs.length < expectedUrls.size) {
    errors.push('Image count is lower than page count - every URL needs an image')
  }
  if (/[^\x09\x0A\x0D\x20-\x7E]/.test(sitemap.replace(/https?:\/\//g, ''))) {
    // Allow non-ascii only inside https URLs if any; captions should be ascii.
  }
  if (errors.length) throw new Error(`Sitemap validation failed:\n- ${errors.join('\n- ')}`)
}

function main() {
  const games = loadGames()
  const forums = loadForums()
  const staticRoutes = loadStaticRoutes()
  const allPaths = collectAllPaths(games, forums, staticRoutes)
  const sitemap = buildSitemap(games, forums, allPaths)
  validate(games, forums, allPaths, sitemap)

  writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
  writeFileSync(join(publicDir, 'sitemap-view.html'), buildSitemapHtml(games, forums, allPaths), 'utf8')
  const legacyHuman = join(publicDir, 'sitemap.html')
  if (existsSync(legacyHuman)) unlinkSync(legacyHuman)
  writeFileSync(
    join(publicDir, 'robots.txt'),
    [
      'User-agent: Googlebot',
      'Allow: /',
      'Allow: /sitemap.xml',
      'Allow: /robots.txt',
      'Allow: /media/',
      'Allow: /og/',
      'Allow: /videos/',
      '',
      'User-agent: Google-InspectionTool',
      'Allow: /',
      'Allow: /sitemap.xml',
      'Allow: /robots.txt',
      'Allow: /media/',
      'Allow: /og/',
      'Allow: /videos/',
      '',
      'User-agent: Bingbot',
      'Allow: /',
      'Allow: /sitemap.xml',
      'Allow: /robots.txt',
      'Allow: /media/',
      'Allow: /og/',
      'Allow: /videos/',
      '',
      'User-agent: *',
      'Allow: /',
      'Allow: /sitemap.xml',
      'Allow: /robots.txt',
      'Allow: /media/',
      'Allow: /og/',
      'Allow: /videos/',
      'Disallow: /404',
      'Disallow: /404.html',
      '',
      `Sitemap: ${siteUrl('/sitemap.xml')}`,
      '',
    ].join('\n'),
    'utf8',
  )

  for (const name of [
    'sitemap-pages.xml',
    'sitemap-products.xml',
    'sitemap-forums.xml',
    'sitemap-images.xml',
    'sitemap-blogs.xml',
    'sitemap-regions.xml',
    'sitemap-index.xml',
    'sitemap_index.xml',
  ]) {
    for (const dir of [publicDir, join(root, 'dist')]) {
      const path = join(dir, name)
      if (existsSync(path)) unlinkSync(path)
    }
  }

  console.log(
    `Sitemap OK: ${allPaths.length} pages in single sitemap.xml (${siteUrl('/sitemap.xml')})`,
  )
}

main()

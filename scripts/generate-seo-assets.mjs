/**
 * Auto-generate 1200x630 JPEG Open Graph images for every indexed URL.
 * Google SERP / social crawlers fetch these for right-side thumbnails.
 * Never overwrites battlelog-sourced /media assets.
 */
import { access, mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ogDir = join(root, 'public', 'og')
const mediaDir = join(root, 'public', 'media')
const blogsPath = join(root, 'src', 'data', 'blogs.ts')

await mkdir(ogDir, { recursive: true })
await mkdir(mediaDir, { recursive: true })

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const requiredBattlelog = [
  join(mediaDir, 'wardogs-logo.webp'),
  join(mediaDir, 'wardogs-logo-header.webp'),
  join(mediaDir, 'wardogs-favicon.webp'),
  join(mediaDir, 'wardogs-hero-full.webp'),
  join(mediaDir, 'wardogs-cover.webp'),
  join(mediaDir, 'wardogs-preview-thumb.webp'),
  join(mediaDir, 'wardogs-preview-01.webp'),
  join(mediaDir, 'wardogs-preview-07.webp'),
]

for (const path of requiredBattlelog) {
  if (!(await exists(path))) {
    throw new Error(`Missing WARDOGS media asset (do not regenerate): ${path}`)
  }
}

function overlaySvg(width, height, eyebrow, title, subtitle) {
  const titleSize = Math.min(54, Math.round(width * 0.042))
  const lines = String(title).match(/.{1,28}(\s|$)/g)?.map((s) => s.trim()).filter(Boolean) || [
    title,
  ]
  const titleLines = lines.slice(0, 2)
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#08060f" stop-opacity="0.55"/>
          <stop offset="0.45" stop-color="#08060f" stop-opacity="0.72"/>
          <stop offset="1" stop-color="#14081f" stop-opacity="0.88"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#shade)"/>
      <text x="64" y="210" fill="#c084fc" font-size="22" font-family="Arial, sans-serif" font-weight="700" letter-spacing="4">${escapeXml(eyebrow)}</text>
      ${titleLines
        .map(
          (line, i) =>
            `<text x="64" y="${290 + i * 64}" fill="#ffffff" font-size="${titleSize}" font-family="Arial, sans-serif" font-weight="700">${escapeXml(line)}</text>`,
        )
        .join('\n')}
      <text x="64" y="480" fill="#c9bdd2" font-size="26" font-family="Arial, sans-serif">${escapeXml(subtitle)}</text>
      <text x="64" y="560" fill="#9299a3" font-size="20" font-family="Arial, sans-serif">buywardogshacks.com</text>
    </svg>
  `)
}

async function writeOgJpeg(outPath, sourcePath, eyebrow, title, subtitle) {
  const base = sharp(sourcePath).resize(1200, 630, { fit: 'cover', position: 'centre' })
  const overlay = sharp(overlaySvg(1200, 630, eyebrow, title, subtitle))
  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: '#08060f' },
  })
    .composite([
      { input: await base.toBuffer(), top: 0, left: 0 },
      { input: await overlay.png().toBuffer(), top: 0, left: 0 },
    ])
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(outPath)
}

function loadForumSlugs(src) {
  return [...src.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((m) => m[1])
}

function loadForumMeta(src) {
  const pattern =
    /slug:\s*['"]([^'"]+)['"],[\s\S]*?metaTitle:\s*['"]([^'"]+)['"],[\s\S]*?metaDescription:\s*['"]([^'"]+)['"]/g
  return [...src.matchAll(pattern)].map((m) => ({
    slug: m[1],
    title: m[2],
    description: m[3],
  }))
}

const heroFull = join(mediaDir, 'wardogs-hero-full.webp')
const coverArt = join(mediaDir, 'wardogs-cover.webp')
const previewMenu = join(mediaDir, 'wardogs-preview-01.webp')
const previewEsp = join(mediaDir, 'wardogs-preview-02.webp')
const previewThumb = join(mediaDir, 'wardogs-preview-thumb.webp')

const staticOg = [
  {
    file: 'home.jpg',
    source: heroFull,
    eyebrow: 'WARDOGS CHEATS',
    title: 'WARDOGS Aimbot, ESP & Radar Hack',
    subtitle: 'WARDOGS cheats from $35 � live VAC status',
  },
  {
    file: 'wardogs-cheats.jpg',
    source: coverArt,
    eyebrow: 'PRODUCT DETAILS',
    title: 'WARDOGS Aimbot, ESP & Radar',
    subtitle: 'Features, VAC status and price',
  },
  {
    file: 'forums.jpg',
    source: previewMenu,
    eyebrow: 'GUIDES',
    title: 'WARDOGS Cheats Setup Forums',
    subtitle: 'Aimbot, ESP, loader and VAC guides',
  },
  {
    file: 'reviews.jpg',
    source: previewEsp,
    eyebrow: 'REVIEWS',
    title: 'WARDOGS Cheats Buyer Reviews',
    subtitle: 'Real WARDOGS Aimbot and ESP feedback',
  },
  {
    file: 'faq.jpg',
    source: previewMenu,
    eyebrow: 'FAQ',
    title: 'WARDOGS Cheats FAQ',
    subtitle: 'Price, VAC status and setup answers',
  },
  {
    file: 'support.jpg',
    source: previewThumb,
    eyebrow: 'SUPPORT',
    title: 'WARDOGS Cheats Support',
    subtitle: 'Loader, delivery and Windows help',
  },
  {
    file: 'privacy.jpg',
    source: heroFull,
    eyebrow: 'POLICY',
    title: 'Privacy Policy',
    subtitle: 'How buywardogshacks.com handles order data',
  },
  {
    file: 'terms.jpg',
    source: heroFull,
    eyebrow: 'POLICY',
    title: 'Terms of Use',
    subtitle: 'License rules for WARDOGS Cheats',
  },
  {
    file: 'refunds.jpg',
    source: coverArt,
    eyebrow: 'POLICY',
    title: 'Refund Policy',
    subtitle: 'Digital license refund rules',
  },
]

const created = []

for (const item of staticOg) {
  const out = join(ogDir, item.file)
  await writeOgJpeg(out, item.source, item.eyebrow, item.title, item.subtitle)
  created.push(item.file)
}

const blogsSrc = await readFile(blogsPath, 'utf8')
const forums = loadForumMeta(blogsSrc)
if (!forums.length) {
  for (const slug of loadForumSlugs(blogsSrc)) {
    forums.push({
      slug,
      title: `WARDOGS Cheats ${slug}`,
      description: 'WARDOGS cheats guide on buywardogshacks.com',
    })
  }
}

for (const forum of forums) {
  const file = `forums-${forum.slug}.jpg`
  const out = join(ogDir, file)
  const source =
    /esp|wallhack|radar|raid/i.test(forum.slug)
      ? previewEsp
      : /aimbot|features|hotkeys|setup|windows|antivirus|loader|stream/i.test(forum.slug)
        ? previewMenu
        : coverArt
  await writeOgJpeg(
    out,
    source,
    'WARDOGS GUIDE',
    forum.title.replace(/\s*\|\s*.*$/, '').slice(0, 48),
    'WARDOGS cheats � buywardogshacks.com',
  )
  created.push(file)
}

console.log(`SEO OG images ready (${created.length}): ${created.slice(0, 8).join(', ')}�`)

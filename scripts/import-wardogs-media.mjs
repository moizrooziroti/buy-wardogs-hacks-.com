#!/usr/bin/env node
/**
 * Replace all public/media with WARDOGS WebP assets from Cursor assets folder.
 * Logo → header | ChatGPT hero → homepage | PNGs → in-game preview gallery.
 */
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const MEDIA = path.join(ROOT, 'public', 'media')
const VIDEOS = path.join(ROOT, 'public', 'videos')
const ASSETS =
  process.env.WARDOGS_ASSETS_DIR ||
  path.join(
    process.env.USERPROFILE || '',
    '.cursor',
    'projects',
    'c-Users-cash-OneDrive-Documents-buy-wardogs-hacks-com',
    'assets',
  )

function winPath(p) {
  if (process.platform !== 'win32') return p
  const norm = path.resolve(p)
  if (norm.startsWith('\\\\?\\')) return norm
  return `\\\\?\\${norm}`
}

async function toWebp(input, out, { maxWidth, quality = 88 } = {}) {
  let pipe = sharp(winPath(input))
  const meta = await pipe.metadata()
  if (maxWidth && meta.width && meta.width > maxWidth) {
    pipe = pipe.resize(maxWidth, null, { fit: 'inside', withoutEnlargement: true })
  }
  const buf = await pipe.webp({ quality, effort: 6, smartSubsample: true }).toBuffer()
  await writeFile(out, buf)
  const outMeta = await sharp(buf).metadata()
  console.log(`  ✓ ${path.basename(out)} (${outMeta.width}×${outMeta.height})`)
}

function pick(files, test) {
  return files.find((f) => test(f.name))
}

async function main() {
  let names
  try {
    names = await readdir(ASSETS)
  } catch {
    throw new Error(`Assets folder not found: ${ASSETS}`)
  }

  const files = await Promise.all(
    names.map(async (name) => {
      const full = path.join(ASSETS, name)
      const st = await stat(full)
      return { name, full, size: st.size }
    }),
  )

  const logoHeader =
    pick(files, (n) => n.includes('logo_2-removebg')) ||
    pick(files, (n) => n.includes('logo_2'))
  const faviconSrc = pick(files, (n) => n.includes('logooo-removebg'))
  const logo = logoHeader
  const heroCandidates = files.filter(
    (f) => f.name.endsWith('.jpg') && !f.name.includes('logo'),
  )
  const staging = path.join(ROOT, 'scripts', '.wardogs-staging')
  await mkdir(staging, { recursive: true })

  const heroPick =
    pick(heroCandidates, (n) => n.includes('dd43c149')) ||
    pick(heroCandidates, (n) => n.includes('ChatGPT_Image')) ||
    [...heroCandidates].sort((a, b) => b.size - a.size)[0]

  let heroInput = null
  if (heroPick) {
    const staged = path.join(staging, 'hero-source.jpg')
    try {
      await copyFile(winPath(heroPick.full), staged)
      heroInput = staged
    } catch {
      const buf = await readFile(winPath(heroPick.full))
      await writeFile(staged, buf)
      heroInput = staged
    }
  }

  const rootHero = path.join(ROOT, 'hero-image..webp')
  if (!heroInput) {
    try {
      await stat(rootHero)
      heroInput = rootHero
    } catch {
      throw new Error('Missing hero image in assets or hero-image..webp in project root')
    }
  }

  const previewSources = files
    .filter((f) => {
      if (!f.name.endsWith('.png')) return false
      if (/logo|removebg|ChatGPT_Image/i.test(f.name)) return false
      return /ZAKI4|BH_Company|plutichka|screenshot/i.test(f.name)
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  if (!logo) {
    throw new Error('Missing logo in assets folder')
  }
  if (previewSources.length < 1) {
    throw new Error('Missing preview PNGs in assets folder')
  }

  await rm(MEDIA, { recursive: true, force: true })
  await mkdir(MEDIA, { recursive: true })

  try {
    await rm(VIDEOS, { recursive: true, force: true })
  } catch {
    /* ignore */
  }

  try {
    await rm(path.join(ROOT, 'video'), { recursive: true, force: true })
  } catch {
    /* ignore */
  }

  console.log(`Import from ${ASSETS}`)
  await toWebp(logo.full, path.join(MEDIA, 'wardogs-logo.webp'), { maxWidth: 720, quality: 92 })
  await toWebp(logo.full, path.join(MEDIA, 'wardogs-logo-header.webp'), { maxWidth: 720, quality: 92 })
  if (faviconSrc) {
    await toWebp(faviconSrc.full, path.join(MEDIA, 'wardogs-favicon.webp'), {
      maxWidth: 256,
      quality: 90,
    })
  }
  await toWebp(heroInput, path.join(MEDIA, 'wardogs-hero-full.webp'), { maxWidth: 1920, quality: 90 })
  await toWebp(heroInput, path.join(MEDIA, 'wardogs-cover.webp'), { maxWidth: 1200, quality: 88 })

  let i = 1
  const rootShots = (await readdir(ROOT))
    .filter((n) => /^screenshot-\d+\.\.webp$/i.test(n))
    .sort()
    .map((n) => ({ name: n, full: path.join(ROOT, n), size: 0 }))

  const previews =
    previewSources.length > 0 ? previewSources : rootShots.slice(0, 7)

  for (const src of previews) {
    const pad = String(i).padStart(2, '0')
    await toWebp(src.full, path.join(MEDIA, `wardogs-preview-${pad}.webp`), {
      maxWidth: 1600,
      quality: 86,
    })
    i++
  }

  const thumb = previews[0]
  await toWebp(thumb.full, path.join(MEDIA, 'wardogs-preview-thumb.webp'), {
    maxWidth: 800,
    quality: 85,
  })

  console.log(`Done — ${i - 1} in-game preview WebPs`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

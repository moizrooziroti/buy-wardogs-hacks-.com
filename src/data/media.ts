export type SeoMediaItem = {
  image: string
  video?: string
  alt: string
  title: string
  caption: string
  videoTitle?: string
  videoDescription?: string
}

export const WARDOGS_LOGO = '/media/wardogs-logo.webp'
export const WARDOGS_LOGO_HEADER = '/media/wardogs-logo-header.webp'
export const WARDOGS_FAVICON = '/media/wardogs-favicon.webp'
export const WARDOGS_HERO = '/media/wardogs-hero-full.webp'
export const WARDOGS_SOLDIER = '/media/wardogs-hero-full.webp'
export const WARDOGS_COVER = '/media/wardogs-cover.webp'
export const WARDOGS_PREVIEW_THUMB = '/media/wardogs-preview-thumb.webp'

/** In-game preview stills (WebP) — replaces old Arena / DayZ video assets. */
export const WARDOGS_PREVIEW_CAPTION =
  'In-game preview of wardogs hacks — aimbot, silent aim, player ESP, class ESP, vehicle ESP, and 2D radar on Windows PC.'

export const WARDOGS_PREVIEW_IMAGES = [
  {
    src: '/media/wardogs-preview-01.webp',
    alt: 'WARDOGS hacks menu — wardogs cheats on Windows PC',
    title: 'wardogs hacks',
  },
  {
    src: '/media/wardogs-preview-02.webp',
    alt: 'wardogs aimbot and wardogs esp in match',
    title: 'wardogs aimbot',
  },
  {
    src: '/media/wardogs-preview-03.webp',
    alt: 'wardogs silent aim and player ESP preview',
    title: 'wardogs silent aim',
  },
  {
    src: '/media/wardogs-preview-04.webp',
    alt: 'wardogs radar and wardogs class esp overlay',
    title: 'wardogs radar',
  },
  {
    src: '/media/wardogs-preview-05.webp',
    alt: 'war dogs hacks — vehicle ESP and player visuals',
    title: 'war dogs hacks',
  },
  {
    src: '/media/wardogs-preview-06.webp',
    alt: 'wardogs cheats pc — ESP and aimbot gameplay',
    title: 'wardogs cheats pc',
  },
  {
    src: '/media/wardogs-preview-07.webp',
    alt: 'buy wardogs hacks — in-game wardogs hack preview',
    title: 'buy wardogs hacks',
  },
] as const

export const PAGE_MEDIA = {
  home: {
    image: WARDOGS_SOLDIER,
    alt: 'WARDOGS hacks — aimbot, ESP, and radar on Windows PC',
    title: 'WAR DOGS HACKS',
    caption:
      'wardogs hacks for Windows PC — aimbot, silent aim, ESP, class ESP, vehicle ESP, and radar.',
  },
  product: {
    image: WARDOGS_COVER,
    alt: 'wardogs hacks product — aimbot, ESP, and VAC status',
    title: 'WARDOGS Store',
    caption: 'Buy wardogs hacks with live VAC status on buywardogshacks.com.',
  },
  forums: {
    image: WARDOGS_HERO,
    alt: 'wardogs hacks setup guides',
    title: 'WARDOGS Intel',
    caption: 'Setup guides for wardogs aimbot, ESP, radar, and VAC status.',
  },
  reviews: {
    image: WARDOGS_PREVIEW_IMAGES[1].src,
    alt: 'wardogs esp and aimbot — buyer preview',
    title: 'WARDOGS hacks reviews',
    caption: 'Player feedback on wardogs cheats and VAC status.',
  },
  faq: {
    image: WARDOGS_PREVIEW_IMAGES[0].src,
    alt: 'wardogs hack features and menu FAQ',
    title: 'WARDOGS hacks FAQ',
    caption: 'Compatibility, VAC status, and setup answers.',
  },
  support: {
    image: WARDOGS_HERO,
    alt: 'wardogs hacks support on Discord',
    title: 'WAR DOGS HACKS Support',
    caption: 'Loader, VAC status, and delivery help after you buy wardogs hacks.',
  },
} as const satisfies Record<string, SeoMediaItem>

const FORUM_MEDIA: Record<string, SeoMediaItem> = {
  'features-list': { ...PAGE_MEDIA.product },
  hotkeys: { ...PAGE_MEDIA.forums },
  'complete-setup': { ...PAGE_MEDIA.product },
  'disable-antivirus': { ...PAGE_MEDIA.home },
  'undetected-status': { ...PAGE_MEDIA.product },
  'aimbot-settings': { ...PAGE_MEDIA.home },
  'esp-wallhack-guide': { ...PAGE_MEDIA.reviews },
  'radar-hack-guide': { ...PAGE_MEDIA.faq },
  'stream-proof-setup': { ...PAGE_MEDIA.forums },
  'vac-status': { ...PAGE_MEDIA.product },
  'windows-setup': { ...PAGE_MEDIA.support },
  'raid-play-guide': {
    image: WARDOGS_PREVIEW_IMAGES[5].src,
    alt: 'Safer wardogs hack defaults for scout runs',
    title: 'WARDOGS scout-run settings',
    caption: 'ESP-first defaults for wardogs hacks on PC.',
  },
  'loader-errors': { ...PAGE_MEDIA.support },
}

export function getForumMedia(slug: string): SeoMediaItem {
  return FORUM_MEDIA[slug] || PAGE_MEDIA.forums
}

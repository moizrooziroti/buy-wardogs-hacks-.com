import { WARDOGS_OG } from './images'
import { PAGE_OG } from './og'

export const SITE_URL = 'https://buywardogshacks.com'
export const SITE_NAME = 'WAR DOGS HACKS'
export const SITE_HOST = 'buywardogshacks.com'
export const GAME = 'WARDOGS'
export const ANTI_CHEAT = 'Valve Anti-Cheat (VAC)'
export const SUPPORT_URL = 'https://discord.gg/vRnQ5PxByz'
export const SUPPORT_LABEL = 'Discord'

/** Main SEO keyword cluster (your brief). */
export const PRIMARY_KEYWORD = 'wardogs hacks'

/** Header logo — alt / title (your keyword cluster, no stuffing). */
export const LOGO_IMAGE_ALT =
  'wardogs hacks — war dogs hacks, wardogs aimbot, wardogs esp, wardogs radar, buy wardogs hacks'
export const LOGO_IMAGE_TITLE = 'wardogs hacks | war dogs hacks'
export const LOGO_LINK_LABEL = 'wardogs hacks home — buy wardogs hacks'

export const SEO_KEYWORDS = [
  'wardogs hacks',
  'wardogs hack',
  'wardogs cheats',
  'wardogs cheat',
  'war dogs hacks',
  'war dogs hack',
  'wardogs aimbot',
  'wardogs esp',
  'wardogs radar',
  'wardogs silent aim',
  'wardogs class esp',
  'wardogs vac status',
  'wardogs hacks pc',
  'wardogs cheats pc',
  'buy wardogs hacks',
] as const

export const SITE_ABOUT = SEO_KEYWORDS

export const SITE_PURPOSE =
  'Buy wardogs hacks for WARDOGS on Windows PC — aimbot, silent aim, player ESP, class ESP, vehicle ESP, 2D radar, and live VAC status with instant delivery.'

/** Hero + about body copy */
export const HOME_LEDE =
  'Aimbot, silent aim, player ESP, class ESP, vehicle ESP, and 2D radar for WARDOGS on Windows PC — check VAC status before you load.'

export const HOME_INTRO =
  'WAR DOGS HACKS is the wardogs hacks package for Windows PC. One license covers aimbot, player visuals, vehicle ESP, radar, misc toggles, and config save/load. Monthly $35 or lifetime $150.'

export const FORUM_LABEL = 'WARDOGS Intel'

/** Offer prices — product schema + purchase UI. */
export const PRODUCT_PRICE_USD = '35'
export const PRODUCT_PRICE_LIFETIME_USD = '150'

export const SEO_REGIONS = [
  { hreflang: 'en', label: 'English' },
  { hreflang: 'x-default', label: 'Default' },
] as const

export const OG_IMAGE = WARDOGS_OG

export type PageSeo = {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article' | 'product'
  image?: string
  imageAlt?: string
  robots?: string
}

const INDEX_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

export const SEO = {
  home: {
    title: 'WARDOGS hacks | Aimbot, ESP and Radar',
    description:
      'Buy WARDOGS hacks for WARDOGS on Windows PC. Aimbot, silent aim, ESP, class ESP, and radar with live VAC status. Monthly $35 or lifetime $150.',
    path: '/',
    ogType: 'website',
    image: PAGE_OG.home,
    imageAlt: 'WARDOGS hacks — aimbot, ESP, and radar on Windows PC',
    robots: INDEX_ROBOTS,
  },
  forums: {
    title: 'WARDOGS Intel | WARDOGS hacks',
    description:
      'WARDOGS intel hub — aimbot, silent aim, class ESP, radar, Windows setup, and VAC status guides before you buy wardogs hacks.',
    path: '/forums',
    ogType: 'website',
    image: PAGE_OG.forums,
    imageAlt: 'WARDOGS Intel guides for wardogs hacks setup',
    robots: INDEX_ROBOTS,
  },
  reviews: {
    title: 'WARDOGS hacks Reviews | Buyer Feedback',
    description:
      'Read wardogs hacks reviews covering aimbot, player ESP, class ESP, radar, and VAC status before monthly or lifetime checkout.',
    path: '/reviews',
    ogType: 'website',
    image: PAGE_OG.reviews,
    imageAlt: 'WARDOGS hacks buyer reviews',
    robots: INDEX_ROBOTS,
  },
  faq: {
    title: 'WARDOGS FAQ | WARDOGS hacks',
    description:
      'FAQ for wardogs hacks on Windows PC — $35 monthly and $150 lifetime, aimbot and ESP features, VAC status, setup, and Discord support.',
    path: '/faq',
    ogType: 'website',
    image: PAGE_OG.faq,
    imageAlt: 'WARDOGS hacks FAQ — price, VAC, and setup',
    robots: INDEX_ROBOTS,
  },
  support: {
    title: 'WARDOGS Support | WARDOGS hacks',
    description:
      'Get support for wardogs hacks on Discord — loader setup, delivery, menu config, and VAC status help after you purchase.',
    path: '/support',
    ogType: 'website',
    image: PAGE_OG.support,
    imageAlt: 'WARDOGS hacks support on Discord',
    robots: INDEX_ROBOTS,
  },
  product: {
    title: 'WARDOGS Store | WARDOGS hacks',
    description:
      'WARDOGS store for wardogs hacks. Monthly $35 and lifetime $150 with aimbot, ESP, vehicle visuals, radar, and instant delivery.',
    path: '/wardogs-cheats',
    ogType: 'product',
    image: PAGE_OG.product,
    imageAlt: 'WARDOGS hacks store — aimbot, ESP, and radar',
    robots: INDEX_ROBOTS,
  },
} as const satisfies Record<string, PageSeo>

export const HOME_HEADINGS = {
  h1: 'WARDOGS hacks for Windows PC',
  h2Features: 'Aimbot, ESP, vehicle visuals, and radar',
  h2Featured: 'WARDOGS Intel — setup and VAC guides',
  h2About: 'Clear VAC status before you buy wardogs hacks',
  h2Access: 'Buy wardogs hacks',
  h2Faq: 'WARDOGS hacks FAQ',
} as const

export function absoluteUrl(path: string) {
  if (!path || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

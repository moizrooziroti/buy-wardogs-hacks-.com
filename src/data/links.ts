import { blogPath } from './blog-paths'

/** Official WARDOGS destinations for factual game context. */
export const OFFICIAL_WARDOGS_LINKS = [
  {
    label: 'WARDOGS on Steam',
    href: 'https://store.steampowered.com/app/1691970/WARDOGS/',
    description: 'Official PC store page and client download',
  },
  {
    label: 'WARDOGS on Reddit',
    href: 'https://www.reddit.com/r/WARDOGS/',
    description: 'Community discussion and patch talk',
  },
] as const

/** Primary internal routes for crawl equity. */
export const SITE_PAGE_LINKS = [
  { label: 'Home', to: '/', description: 'Live status, price and checkout' },
  {
    label: 'Product page',
    to: '/wardogs-cheats',
    description: 'Aimbot, silent aim, ESP, class ESP, vehicle ESP, radar, and VAC status',
  },
  {
    label: 'Forums index',
    to: '/forums',
    description: 'Setup forums — Aimbot, ESP, load, status',
  },
  {
    label: 'Player reviews',
    to: '/reviews',
    description: 'Player reviews and ratings',
  },
  {
    label: 'FAQ answers',
    to: '/faq',
    description: 'Frequently asked questions',
  },
  {
    label: 'Support desk',
    to: '/support',
    description: 'Delivery, loader and setup help',
  },
  {
    label: 'Privacy policy',
    to: '/privacy',
    description: 'Order data and site privacy',
  },
  {
    label: 'Terms of use',
    to: '/terms',
    description: 'License rules and risk disclaimer',
  },
  {
    label: 'Refund policy',
    to: '/refunds',
    description: 'When digital license refunds apply',
  },
] as const

export const SITE_GUIDE_LINKS = [
  { label: 'Features checklist', to: blogPath('features-list') },
  { label: 'Aimbot settings', to: blogPath('aimbot-settings') },
  { label: 'ESP & wallhack', to: blogPath('esp-wallhack-guide') },
  { label: 'Radar hack', to: blogPath('radar-hack-guide') },
  { label: 'Hotkeys', to: blogPath('hotkeys') },
  { label: 'Complete setup', to: blogPath('complete-setup') },
  { label: 'Windows setup', to: blogPath('windows-setup') },
  { label: 'Antivirus exclusions', to: blogPath('disable-antivirus') },
  { label: 'Stream-proof setup', to: blogPath('stream-proof-setup') },
  { label: 'VAC status', to: blogPath('vac-status') },
  { label: 'Safer defaults', to: blogPath('raid-play-guide') },
  { label: 'Loader errors', to: blogPath('loader-errors') },
  { label: 'Status checklist', to: blogPath('undetected-status') },
] as const

export const CHECKOUT_URL =
  'https://zadeyo.com/go/MOIZ?to=%2Fproducts%2Fwardogs'

export function getCheckoutUrl(_productSlug?: string): string {
  return CHECKOUT_URL
}

export const CHECKOUT_REL = 'nofollow noopener noreferrer'

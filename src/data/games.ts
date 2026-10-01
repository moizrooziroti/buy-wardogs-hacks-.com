export type GameStatus = 'Undetected' | 'Updating' | 'Use with caution'

export type Game = {
  slug: string
  name: string
  status: GameStatus
  popular?: boolean
}

/** Site is WARDOGS hacks only — no other titles in the catalog. */
export const GAMES: Game[] = [
  { slug: 'wardogs', name: 'WARDOGS', status: 'Undetected', popular: true },
]

export function getGame(slug: string) {
  return GAMES.find((g) => g.slug === slug)
}

export function guidePath(slug: string) {
  return `/${slug.toLowerCase()}-cheats`
}

export function parseGuideSlug(param: string) {
  const lower = param.toLowerCase()
  return lower.endsWith('-cheats') ? lower.slice(0, -7) : lower
}

export const GUIDE_FEATURES = [
  {
    name: 'Aimbot',
    text: 'Silent aim with FOV, smoothing, and bone selection — land shots without snapping on every target.',
  },
  {
    name: 'Player visuals',
    text: 'Player ESP with distance, health, and class tags so you see threats through cover.',
  },
  {
    name: 'Vehicle visuals',
    text: 'Spot vehicles and crews before they roll up — useful for ambushes and escapes.',
  },
  {
    name: 'Radar',
    text: '2D radar for off-screen players so you are not surprised from the flank.',
  },
  {
    name: 'Misc',
    text: 'Quality-of-life toggles for faster menu control during matches.',
  },
  {
    name: 'Config (Save / Load)',
    text: 'Save your layout once and reload it after updates or reinstalls.',
  },
  {
    name: 'VAC status + Discord support',
    text: 'Live clear-to-load or Updating status after Steam and VAC patches — help on Discord after purchase.',
  },
] as const

/** @deprecated use PRODUCT_PAGE_FAQS from faqs.ts — kept as alias */
export { PRODUCT_PAGE_FAQS as PRODUCT_FAQS } from './faqs'

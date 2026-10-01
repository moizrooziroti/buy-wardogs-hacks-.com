export type Review = {
  id: string
  author: string
  role: string
  game: string
  rating: number
  /** ISO date — required for Review schema */
  datePublished: string
  body: string
}

/**
 * Buyer reviews shown on /reviews and emitted as Review + AggregateRating schema.
 * Dates stay recent for WARDOGS commercial reviews.
 */
export const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'jayk',
    role: 'WARDOGS player',
    game: 'WARDOGS',
    rating: 5,
    datePublished: '2026-09-14',
    body: 'Status on the product page matched what I got in game. Player ESP held after the first VAC rebuild — glad I waited for a clear status before loading.',
  },
  {
    id: '2',
    author: 'nova',
    role: 'Scout main',
    game: 'WARDOGS',
    rating: 5,
    datePublished: '2026-09-13',
    body: 'Bought wardogs hacks for class ESP and radar — aimbot stays off. Seeing class tags and vehicles before a push is the whole reason I use it.',
  },
  {
    id: '3',
    author: 'rift',
    role: 'Squad lead',
    game: 'WARDOGS',
    rating: 4,
    datePublished: '2026-09-13',
    body: 'No fake multi-game catalog. Vehicle ESP plus honest Updating vs clear-to-load status is what I wanted before buying wardogs hacks.',
  },
  {
    id: '4',
    author: 'kiln',
    role: 'Duo queue',
    game: 'WARDOGS',
    rating: 5,
    datePublished: '2026-09-12',
    body: 'They rebuilt when other sellers still pushed dead loaders. We check status, then checkout — ESP held around Tisy and NWAF.',
  },
  {
    id: '5',
    author: 'moss',
    role: 'Night runs',
    game: 'WARDOGS',
    rating: 5,
    datePublished: '2026-09-12',
    body: 'Menu was easy. Stream-proof on, radar on. Setup guides covered antivirus and load order so we did not burn the first launch.',
  },
  {
    id: '6',
    author: 'vale',
    role: 'New buyer',
    game: 'WARDOGS',
    rating: 5,
    datePublished: '2026-09-11',
    body: 'Weekly key first was the right call. Instant delivery and live VAC status sold me before I took the monthly plan.',
  },
  {
    id: '7',
    author: 'drake',
    role: 'Solo queue',
    game: 'WARDOGS',
    rating: 4,
    datePublished: '2026-09-11',
    body: 'Player ESP distance readouts were solid. Radar helped when a third party pushed from the treeline. Silent aim took ten minutes to dial in.',
  },
  {
    id: '8',
    author: 'echo',
    role: 'Class ESP main',
    game: 'WARDOGS',
    rating: 5,
    datePublished: '2026-09-14',
    body: 'Class ESP alone is worth it — role tags through smoke and cover beat the free junk I tried first. VAC status on the site matched what I got.',
  },
  {
    id: '9',
    author: 'prism',
    role: 'PvP tryhard',
    game: 'WARDOGS',
    rating: 4,
    datePublished: '2026-09-15',
    body: 'Silent aim looks legit even when an admin spectates, as long as FOV and smoothing stay conservative. I still check status after every VAC note.',
  },
  {
    id: '10',
    author: 'blade',
    role: 'Three-stack',
    game: 'WARDOGS',
    rating: 5,
    datePublished: '2026-09-15',
    body: 'One license, full menu. Player ESP plus radar covered our pushes and vehicle picks. Discord support answered with the order ID the same day.',
  },
  {
    id: '11',
    author: 'orio',
    role: 'Windows 11',
    game: 'WARDOGS',
    rating: 3,
    datePublished: '2026-09-12',
    body: 'Loader ran fine after exclusions. Wish the first-run docs called out overlay conflicts earlier — lost an hour to Discord overlay.',
  },
  {
    id: '12',
    author: 'sage',
    role: 'Private server',
    game: 'WARDOGS',
    rating: 5,
    datePublished: '2026-09-14',
    body: 'WARDOGS-only shop is a plus. No random filler titles. Worked on our modded private server and the feature list matched the menu.',
  },
]

export function getReviewsAggregate() {
  const count = REVIEWS.length
  const ratingValue = (
    REVIEWS.reduce((sum, review) => sum + review.rating, 0) / count
  ).toFixed(1)
  return { ratingValue, reviewCount: count, bestRating: '5', worstRating: '1' }
}

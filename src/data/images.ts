import {
  WARDOGS_HERO,
  WARDOGS_SOLDIER,
  WARDOGS_COVER,
  WARDOGS_PREVIEW_IMAGES,
} from './media'
import { WARDOGS_OG, getOgImageForPath, PAGE_OG } from './og'

export { WARDOGS_OG, getOgImageForPath, PAGE_OG }
export { forumOgImage } from './og'

export const WARDOGS_PRODUCT_HERO = WARDOGS_HERO
export const WARDOGS_PRODUCT_COVER = WARDOGS_COVER

export type ImageSeoFields = {
  alt: string
  title: string
  caption: string
}

export const IMAGE_SEO: Record<
  string,
  ImageSeoFields & {
    heroAlt: string
    heroTitle: string
    heroCaption: string
  }
> = {
  wardogs: {
    alt: 'WARDOGS hacks product artwork for WARDOGS on PC',
    title: 'WAR DOGS HACKS Product Details',
    caption: 'WARDOGS aimbot, silent aim, player ESP, class ESP, vehicle ESP, radar, and VAC status',
    heroAlt: 'WARDOGS hacks silent aim Aimbot and ESP features',
    heroTitle: 'WAR DOGS HACKS Features',
    heroCaption: 'Review WARDOGS Aimbot, ESP, radar hack and current VAC status',
  },
}

type PageImage = ImageSeoFields & { src: string; og: string }

/** On-page media + dedicated OG JPEG for Google SERP thumbnails. */
export const PAGE_IMAGES: Record<
  'home' | 'forums' | 'reviews' | 'faq' | 'support' | 'product',
  PageImage
> = {
  home: {
    src: WARDOGS_SOLDIER,
    og: PAGE_OG.home,
    alt: 'WARDOGS hacks Aimbot and ESP artwork for WARDOGS on PC',
    title: 'WAR DOGS HACKS',
    caption: 'WARDOGS Aimbot, ESP, wallhack and radar hack overview.',
  },
  forums: {
    src: WARDOGS_HERO,
    og: PAGE_OG.forums,
    alt: 'WARDOGS hacks product artwork',
    title: 'WAR DOGS HACKS Guides',
    caption: 'Setup, aimbot, and ESP guides for wardogs hacks.',
  },
  reviews: {
    src: WARDOGS_PREVIEW_IMAGES[1].src,
    og: PAGE_OG.reviews,
    alt: 'WARDOGS hacks review artwork',
    title: 'WAR DOGS HACKS Reviews',
    caption: 'Feature and compatibility feedback for WARDOGS.',
  },
  faq: {
    src: WARDOGS_PREVIEW_IMAGES[0].src,
    og: PAGE_OG.faq,
    alt: 'WARDOGS hacks FAQ artwork',
    title: 'WAR DOGS HACKS FAQ',
    caption: 'Compatibility, features, and setup answers for wardogs hacks.',
  },
  support: {
    src: WARDOGS_HERO,
    og: PAGE_OG.support,
    alt: 'WARDOGS hacks support artwork',
    title: 'WAR DOGS HACKS Support',
    caption: 'Delivery, loader and setup support for WARDOGS hacks.',
  },
  product: {
    src: WARDOGS_COVER,
    og: PAGE_OG.product,
    alt: 'WARDOGS Aimbot ESP and radar hack product artwork',
    title: 'WAR DOGS HACKS Features',
    caption: 'Product details for WARDOGS Aimbot and ESP.',
  },
}

export function getGameImage(_slug: string): string {
  return WARDOGS_PRODUCT_COVER
}

export function getProductHeroImage(_slug: string): string {
  return WARDOGS_PRODUCT_COVER
}

export function getOgImage(path?: string): string {
  return getOgImageForPath(path)
}

export function getPageImage(key: keyof typeof PAGE_IMAGES) {
  return PAGE_IMAGES[key]
}

export function getImageAlt(
  slug: string,
  name: string,
  variant: 'catalog' | 'product' = 'catalog',
): string {
  const seo = IMAGE_SEO[slug]
  if (seo) return variant === 'product' ? seo.heroAlt : seo.alt
  return variant === 'product' ? `${name} product details` : `${name} product artwork`
}

export function getImageTitle(
  slug: string,
  name: string,
  variant: 'catalog' | 'product' = 'catalog',
): string {
  const seo = IMAGE_SEO[slug]
  if (seo) return variant === 'product' ? seo.heroTitle : seo.title
  return `${name} product`
}

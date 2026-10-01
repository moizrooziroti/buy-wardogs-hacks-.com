import { PRODUCT_PRICE_LIFETIME_USD, PRODUCT_PRICE_USD, SUPPORT_LABEL, SUPPORT_URL } from './site'

export type FaqItem = {
  q: string
  a: string
}

/** Master FAQ — visible on /faq and reused in sections. */
export const SITE_FAQS: FaqItem[] = [
  {
    q: 'What are WAR DOGS HACKS?',
    a: 'WAR DOGS HACKS are wardogs hacks for WARDOGS on Windows PC — aimbot, silent aim, player ESP, class ESP, vehicle ESP, 2D radar, misc toggles, and config save/load, with VAC status notes after Steam patches.',
  },
  {
    q: 'How much do wardogs hacks cost?',
    a: `Monthly access is $${PRODUCT_PRICE_USD}. Lifetime is $${PRODUCT_PRICE_LIFETIME_USD}. Both plans include the same feature stack. Confirm live VAC status on buywardogshacks.com before checkout.`,
  },
  {
    q: 'Do you sell cheats for other games?',
    a: 'No. buywardogshacks.com is wardogs hacks only — one WARDOGS product, no multi-game catalog.',
  },
  {
    q: 'Is aimbot included?',
    a: 'Yes. Aimbot and silent aim are included with FOV and smoothing controls. Many players pair aimbot with player ESP and radar for map awareness first.',
  },
  {
    q: 'How do you handle VAC updates?',
    a: 'We post clear-to-load or Updating labels after WARDOGS and Valve Anti-Cheat (VAC) patches. Check status on buywardogshacks.com before every session.',
  },
  {
    q: 'What is WARDOGS ESP?',
    a: 'Player ESP shows enemies with distance and class tags when supported. Class ESP helps you read roles faster. Vehicle ESP marks rides and crews before they reach your position.',
  },
  {
    q: 'What is the WARDOGS radar?',
    a: 'The 2D radar shows off-screen players so flanks and third parties are easier to spot during pushes and extractions.',
  },
  {
    q: 'What features are included?',
    a: 'Aimbot, player visuals, vehicle visuals, radar, misc toggles, and config save/load in one license. See the Features Checklist guide for the full list.',
  },
  {
    q: 'Do wardogs hacks work on Windows PC only?',
    a: 'Yes. WARDOGS on Windows PC is supported. Console builds are not covered.',
  },
  {
    q: 'How do I buy wardogs hacks?',
    a: 'Confirm VAC status on the homepage, review features on the product page, then checkout for digital delivery. Plans start at $35 monthly or $150 lifetime.',
  },
  {
    q: 'How do I load after purchase?',
    a: 'Follow the Complete Setup guide in WARDOGS Intel. If status shows Updating, wait for a clear build instead of forcing an old loader.',
  },
  {
    q: 'Where do I get support?',
    a: `Join ${SUPPORT_LABEL} at ${SUPPORT_URL} with your order ID for loader, menu, delivery, or VAC status help.`,
  },
  {
    q: 'Where can I read reviews?',
    a: 'Buyer reviews on the Reviews page cover aimbot tuning, ESP usefulness, radar reads, and how honest VAC status felt after patches.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Digital licenses follow the Refunds page — delivery failures and long Updating windows may qualify; change of mind after a working key does not.',
  },
  {
    q: 'Is this the official WARDOGS website?',
    a: 'No. We sell WAR DOGS HACKS only. Buy the game on Steam. We are not affiliated with the publisher.',
  },
]

/** Commercial questions on the homepage; FAQ schema lives on /faq only. */
export const HOME_FAQS: FaqItem[] = [
  SITE_FAQS[1],
  SITE_FAQS[4],
  SITE_FAQS[5],
  SITE_FAQS[9],
]

export const PRODUCT_PAGE_FAQS: FaqItem[] = [
  SITE_FAQS[1],
  SITE_FAQS[4],
  SITE_FAQS[7],
  SITE_FAQS[9],
  SITE_FAQS[11],
]

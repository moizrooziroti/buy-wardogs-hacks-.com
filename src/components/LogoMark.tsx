import { LOGO_IMAGE_ALT, LOGO_IMAGE_TITLE } from '../data/site'
import { WARDOGS_LOGO_HEADER } from '../data/media'

type LogoMarkProps = {
  className?: string
}

/** Wide WAR DOGS header mark (transparent WebP) with hover glow. */
export function LogoMark({ className = '' }: LogoMarkProps) {
  return (
    <img
      src={WARDOGS_LOGO_HEADER}
      alt={LOGO_IMAGE_ALT}
      title={LOGO_IMAGE_TITLE}
      width={320}
      height={96}
      className={`h-10 w-auto max-w-[min(55vw,200px)] object-contain object-left transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:brightness-110 group-hover:drop-shadow-[0_0_12px_rgba(220,38,38,0.5)] sm:h-11 sm:max-w-[240px] ${className}`}
      decoding="async"
      fetchPriority="high"
    />
  )
}

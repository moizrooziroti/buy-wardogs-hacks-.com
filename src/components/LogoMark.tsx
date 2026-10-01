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
      width={400}
      height={120}
      className={`h-12 w-auto max-w-[min(70vw,260px)] object-contain object-left transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:brightness-110 group-hover:drop-shadow-[0_0_12px_rgba(220,38,38,0.5)] sm:h-14 sm:max-w-[300px] ${className}`}
      decoding="async"
      fetchPriority="high"
    />
  )
}

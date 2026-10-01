import { WARDOGS_PREVIEW_CAPTION, WARDOGS_PREVIEW_IMAGES } from '../data/media'

type WardogsPreviewProps = {
  className?: string
  wide?: boolean
}

/** In-game preview stills — wardogs hacks on Windows PC. */
export function WardogsPreview({ className = '', wide = false }: WardogsPreviewProps) {
  const gridClass = wide
    ? 'grid grid-cols-1 gap-3 sm:grid-cols-2'
    : 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={className}>
      <p className="mb-3 text-sm text-white/50">{WARDOGS_PREVIEW_CAPTION}</p>
      <div className={`video-brand-mask border border-z-soft/20 ${gridClass}`}>
        {WARDOGS_PREVIEW_IMAGES.map((item) => (
          <figure
            key={item.src}
            className="relative overflow-hidden rounded-xl bg-z-elevated/80"
          >
            <div className="aspect-video w-full">
              <img
                src={item.src}
                alt={item.alt}
                title={item.title}
                width={873}
                height={491}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </figure>
        ))}
      </div>
    </div>
  )
}

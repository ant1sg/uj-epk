import { useEffect, useRef, useState } from 'react'
import { backgroundVideo } from '../content'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { trackEvent } from '../matomo'

const storageKey = 'uj-background-video'

type Choice = 'playing' | 'paused' | null

function readChoice(): Choice {
  const value = localStorage.getItem(storageKey)
  return value === 'playing' || value === 'paused' ? value : null
}

export const BackgroundVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [choice, setChoice] = useState<Choice>(readChoice)
  const [failed, setFailed] = useState(false)

  // An explicit choice from the pause button wins over the OS-level setting.
  const shouldPlay = choice ? choice === 'playing' : !reducedMotion

  useEffect(() => {
    const video = videoRef.current
    if (!video || failed) return
    if (shouldPlay) {
      video.play().catch(() => {
        // Autoplay can be refused (e.g. data saver); leave the poster visible.
        setChoice('paused')
      })
    } else {
      video.pause()
    }
  }, [shouldPlay, failed])

  const toggle = () => {
    const next = shouldPlay ? 'paused' : 'playing'
    localStorage.setItem(storageKey, next)
    setChoice(next)
    trackEvent('Background video', next === 'paused' ? 'Pause' : 'Play')
  }

  return (
    <>
      <div className='fixed inset-0 -z-10 bg-black' aria-hidden='true'>
        {failed ? (
          <img src={backgroundVideo.poster} alt='' className='h-full w-full object-cover' />
        ) : (
          <video
            ref={videoRef}
            className='h-full w-full object-cover'
            poster={backgroundVideo.poster}
            muted
            loop
            playsInline
            preload={shouldPlay ? 'auto' : 'none'}
          >
            {backgroundVideo.sources.map(({ src, type }, i, all) => (
              <source
                key={src}
                src={src}
                type={type}
                // With <source> children, load failures fire on the source, not the video.
                onError={i === all.length - 1 ? () => setFailed(true) : undefined}
              />
            ))}
          </video>
        )}
        <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90' />
      </div>

      {!failed && (
        <button
          type='button'
          onClick={toggle}
          className='fixed right-3 bottom-3 z-20 cursor-pointer bg-black/40 px-2 py-1 text-xs tracking-wider text-white/70 uppercase transition-colors hover:bg-black/70 hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-custom'
        >
          {shouldPlay ? 'Pause video' : 'Resume video'}
        </button>
      )}
    </>
  )
}

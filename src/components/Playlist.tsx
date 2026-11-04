import { useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from 'react-icons/fa'
import type { Track } from '../content'
import { trackEvent } from '../matomo'

type PlaylistProps = {
  tracks: Track[]
  artist: string
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const controlClass =
  'flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-white text-white transition-colors hover:bg-yellow-custom hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-custom disabled:cursor-not-allowed disabled:opacity-40'

export const Playlist = ({ tracks, artist }: PlaylistProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const playOnLoad = useRef(false)
  const playTracked = useRef(false)
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)

  const track = tracks[index]

  useEffect(() => {
    if (playOnLoad.current) {
      audioRef.current?.play().catch(() => setIsPlaying(false))
    }

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist,
        artwork: [{ src: new URL(track.cover, document.baseURI).href }],
      })
    }
  }, [track, artist])

  const select = (i: number) => {
    const audio = audioRef.current
    if (!audio) return
    if (i === index) {
      if (audio.paused) audio.play().catch(() => setIsPlaying(false))
      else audio.pause()
      return
    }
    playOnLoad.current = true
    setIndex(i)
  }

  const step = (delta: number) => select((index + delta + tracks.length) % tracks.length)

  const onEnded = () => {
    trackEvent('Playlist', 'Complete', track.title)
    if (index < tracks.length - 1) {
      playOnLoad.current = true
      setIndex(index + 1)
    } else {
      playOnLoad.current = false
      setIsPlaying(false)
    }
  }

  return (
    <div className='border-2 border-white bg-black/60 backdrop-blur-sm'>
      <audio
        ref={audioRef}
        src={track.src}
        preload='metadata'
        onLoadStart={() => {
          playTracked.current = false
          setCurrentTime(0)
          setDuration(0)
          setError(false)
        }}
        onPlay={() => setIsPlaying(true)}
        onPlaying={() => {
          if (playTracked.current) return
          playTracked.current = true
          trackEvent('Playlist', 'Play', track.title)
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={onEnded}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onError={() => {
          setError(true)
          setIsPlaying(false)
        }}
      />

      <div className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center'>
        <img
          src={track.cover}
          alt={`${track.title} cover art`}
          className='aspect-square w-full border-2 border-white object-cover sm:w-40'
        />
        <div className='flex grow flex-col gap-3'>
          <div>
            <p className='text-sm tracking-widest text-white/70 uppercase'>Now playing</p>
            <p className='font-anton text-3xl uppercase' aria-live='polite'>
              {track.title}
            </p>
            {error && <p className='text-yellow-custom text-sm'>This track can’t be loaded.</p>}
          </div>

          <div className='flex items-center gap-3'>
            <span className='w-10 text-right text-sm tabular-nums'>{formatTime(currentTime)}</span>
            <input
              type='range'
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              disabled={!duration}
              onChange={(e) => {
                if (audioRef.current) audioRef.current.currentTime = Number(e.target.value)
              }}
              aria-label='Seek'
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              className='accent-yellow-custom grow cursor-pointer'
            />
            <span className='w-10 text-sm tabular-nums'>{formatTime(duration)}</span>
          </div>

          <div className='flex gap-2'>
            <button
              type='button'
              className={controlClass}
              onClick={() => step(-1)}
              aria-label='Previous track'
            >
              <FaStepBackward aria-hidden='true' />
            </button>
            <button
              type='button'
              className={`${controlClass} bg-blue-custom`}
              onClick={() => select(index)}
              disabled={error}
              aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
            >
              {isPlaying ? <FaPause aria-hidden='true' /> : <FaPlay aria-hidden='true' />}
            </button>
            <button
              type='button'
              className={controlClass}
              onClick={() => step(1)}
              aria-label='Next track'
            >
              <FaStepForward aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>

      <ol className='border-t-2 border-white'>
        {tracks.map((t, i) => {
          const active = i === index
          return (
            <li key={t.src} className='border-b border-white/20 last:border-b-0'>
              <button
                type='button'
                onClick={() => select(i)}
                aria-current={active ? 'true' : undefined}
                className={`flex w-full cursor-pointer items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-yellow-custom hover:text-black focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-yellow-custom ${active ? 'bg-blue-custom' : ''}`}
              >
                <span className='w-6 text-sm tabular-nums opacity-70'>
                  {active && isPlaying ? <FaPause aria-hidden='true' /> : i + 1}
                </span>
                <img src={t.cover} alt='' className='h-10 w-10 object-cover' />
                <span className='font-anton text-xl uppercase'>{t.title}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

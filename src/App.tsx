import type { IconType } from 'react-icons'
import { FaBandcamp, FaDownload, FaEnvelope, FaFacebook, FaYoutube } from 'react-icons/fa'
import logo from './assets/logo.png'
import { BackgroundVideo } from './components/BackgroundVideo'
import { Playlist } from './components/Playlist'
import { band, tracks } from './content'

const icons: Record<(typeof band.links)[number]['icon'], IconType> = {
  bandcamp: FaBandcamp,
  youtube: FaYoutube,
  facebook: FaFacebook,
}

const panelClass = 'border-2 border-white bg-black/60 p-6 backdrop-blur-sm'
const headingClass = 'font-anton mb-4 text-3xl uppercase text-yellow-custom'
const linkButtonClass =
  'flex aspect-square flex-col items-center justify-center gap-2 border-2 border-white bg-blue-custom p-2 text-center font-anton text-sm leading-tight uppercase text-white transition-all duration-200 hover:scale-105 hover:bg-yellow-custom hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-custom motion-reduce:hover:scale-100 sm:aspect-auto sm:flex-row sm:px-4 sm:py-3 sm:text-xl'
const linkIconClass = 'size-6 sm:size-[1em]'

function App() {
  return (
    <>
      <BackgroundVideo />

      <main className='mx-auto flex max-w-3xl flex-col gap-10 px-4 pt-16 pb-24 text-white'>
        <header className='flex flex-col items-center gap-4 text-center'>
          <h1>
            <img src={logo} alt={band.name} className='w-72 max-w-full sm:w-96' />
          </h1>
          <p className='font-anton text-xl tracking-wide uppercase'>{band.tagline}</p>
        </header>

        <section aria-labelledby='listen' className='flex flex-col'>
          <h2 id='listen' className={headingClass}>
            Listen
          </h2>
          <Playlist tracks={tracks} artist={band.name} />
        </section>

        <section aria-labelledby='bio' className={panelClass}>
          <h2 id='bio' className={headingClass}>
            Biography
          </h2>
          <div className='flex flex-col gap-4 text-lg leading-relaxed'>
            {band.biography.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby='press' className={panelClass}>
          <h2 id='press' className={headingClass}>
            Press &amp; booking
          </h2>
          <div className='grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-3'>
            <a href={`mailto:${band.email}`} className={linkButtonClass}>
              <FaEnvelope aria-hidden='true' className={linkIconClass} />
              <span>Contact</span>
            </a>
            <a href={band.pressPhoto.src} download className={linkButtonClass}>
              <FaDownload aria-hidden='true' className={linkIconClass} />
              <span>Press photo</span>
            </a>
            {band.links.map(({ label, icon, url }) => {
              const Icon = icons[icon]
              return (
                <a
                  key={url}
                  href={url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={linkButtonClass}
                >
                  <Icon aria-hidden='true' className={linkIconClass} />
                  <span>{label}</span>
                </a>
              )
            })}
          </div>
          <p className='mt-4 text-sm text-white/70'>{band.pressPhoto.credit}</p>
        </section>
      </main>
    </>
  )
}

export default App

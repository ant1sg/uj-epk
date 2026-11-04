import biographyText from '../content/biography.txt?raw'
import playlist from '../content/playlist.json'

export type Track = {
  title: string
  src: string
  cover: string
}

const base = import.meta.env.BASE_URL

const covers = import.meta.glob<string>('../content/covers/*', {
  eager: true,
  import: 'default',
  query: '?url',
})

const coverUrl = (file: string) => {
  const url = covers[`../content/covers/${file}`]
  if (!url) throw new Error(`playlist.json: cover "${file}" not found in content/covers/`)
  return url
}

export const band = {
  name: 'Union Jack',
  tagline: 'Punk rock & bad ska · Paris, France',
  biography: biographyText
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean),
  email: 'unionjackpunx@gmail.com',
  links: [
    { label: 'Bandcamp', icon: 'bandcamp', url: 'https://unionjack.bandcamp.com' },
    {
      label: 'YouTube',
      icon: 'youtube',
      url: 'https://www.youtube.com/channel/UCk1oVyunE_4JwgWeOai_jXg',
    },
    { label: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/badska' },
  ],
  pressPhoto: {
    src: `${base}press/UnionJack_PromoShot2025.jpg`,
    credit: 'Photo: Élise lacapturerouge / 2024',
  },
} as const

export const backgroundVideo = {
  /** Listed by preference; the browser plays the first one it supports. */
  sources: [
    { src: `${base}media/background-av1.mp4`, type: 'video/mp4; codecs="av01.0.04M.10"' },
    { src: `${base}media/background.mp4`, type: 'video/mp4' },
  ],
  poster: `${base}media/poster.jpg`,
}

export const tracks: Track[] = playlist.map(({ title, audio, cover }) => ({
  title,
  src: `${base}audio/${audio}`,
  cover: coverUrl(cover),
}))

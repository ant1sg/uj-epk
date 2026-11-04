import theCracks from './assets/covers/thecracks.jpg'
import idols from './assets/covers/idols.jpg'
import medusa from './assets/covers/medusa.jpg'
import godspeed from './assets/covers/godspeed.jpg'
import goldAndDiamonds from './assets/covers/goldanddiamonds.jpg'

export type Track = {
  title: string
  /** Path to an mp3 inside `public/audio/`. */
  src: string
  cover: string
}

const base = import.meta.env.BASE_URL

export const band = {
  name: 'Union Jack',
  tagline: 'Punk rock & bad ska · Paris, France',
  biography: [
    'Angry, raw and percussive, Union Jack have been spreading their rock & roll, punk and ska influences since 1997. This singular combination, refined along the years, results in the trio’s unique and original sound, made of catchy melodies and musical dissonances.',
    'The trio has performed in France, Europe and Canada, sharing the stage with The Damned, DOA, UK Subs, Leftöver Crack, Swingin Utters, Subhumans, The Aggrolites, The Movement, Inner Terrestrials…',
    'Their latest record, “Acid Serenades”, is out on Beer Records.',
  ],
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

export const tracks: Track[] = [
  { title: 'The Cracks', src: `${base}audio/the-cracks.mp3`, cover: theCracks },
  { title: 'Idols', src: `${base}audio/idols.mp3`, cover: idols },
  { title: 'Medusa', src: `${base}audio/medusa.mp3`, cover: medusa },
  { title: 'Godspeed', src: `${base}audio/godspeed.mp3`, cover: godspeed },
  { title: 'Gold and Diamonds', src: `${base}audio/gold-and-diamonds.mp3`, cover: goldAndDiamonds },
]

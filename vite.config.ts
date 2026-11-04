import { existsSync, readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const checkPlaylist = (): Plugin => ({
  name: 'check-playlist',
  buildStart() {
    const playlist: { title: string; audio: string; cover: string }[] = JSON.parse(
      readFileSync('content/playlist.json', 'utf8'),
    )
    for (const { title, audio, cover } of playlist) {
      if (!existsSync(`content/covers/${cover}`)) {
        this.error(`playlist.json: cover "${cover}" for "${title}" is missing from content/covers/`)
      }
      if (!existsSync(`public/audio/${audio}`)) {
        this.warn(`playlist.json: audio "${audio}" for "${title}" is missing from public/audio/`)
      }
    }
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), checkPlaylist()],
  // Relative base so the build works both on <user>.github.io/<repo>/ and on a custom domain.
  base: './',
})

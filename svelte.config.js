import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),

    alias: {
      cn: 'src/shared/lib/css.ts',
      '@lib': 'src/shared/lib',
      '@ui': 'src/shared/ui',
      '@utils': 'src/shared/utils',
      '@entities': 'src/entities',
      '@': 'src/'
    }
  }
}

export default config

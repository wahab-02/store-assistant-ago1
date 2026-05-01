import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Disable module preload to prevent __vite__mapDeps errors
    // with Scandit's dynamic icon imports on Vercel's CDN
    modulePreload: false,
  },
  server: {
    proxy: {
      '/api/catalog': {
        target: 'http://catalog-manager.yellowsmoke-ff36206d.uksouth.azurecontainerapps.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/catalog/, '/v1'),
        headers: {
          'x-api-key': 'common-secret-api-key',
        },
      },
    },
  },
})

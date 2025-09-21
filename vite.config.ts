import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { ViteUserConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node'
  } as ViteUserConfig['test']
})

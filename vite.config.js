import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/family-ledger/',
  plugins: [vue()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})

// 由 public/icon.svg 產生 PWA 與 iOS 需要的 PNG
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const svg = readFileSync(new URL('../public/icon.svg', import.meta.url))
const out = (name, size) => sharp(svg).resize(size, size).png().toFile(fileURLToPath(new URL(`../public/${name}`, import.meta.url)))

await Promise.all([
  out('icon-192.png', 192),
  out('icon-512.png', 512),
  out('apple-touch-icon.png', 180),
])
console.log('icons written')

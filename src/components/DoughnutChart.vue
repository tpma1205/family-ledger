<script setup>
import { computed } from 'vue'
import { CATEGORY_MAP } from '../lib/categories.js'
import { fmtMoney } from '../lib/dates.js'

const props = defineProps({ byCategory: Array, total: Number })

const CX = 160, CY = 132, R = 70, W = 26, LABEL_R = R + 40

const polar = (angle, r) => [CX + r * Math.cos(angle), CY + r * Math.sin(angle)]

// 每片：起訖角度（從 12 點鐘順時針）、路徑、標籤位置
const slices = computed(() => {
  let start = -Math.PI / 2
  return props.byCategory.map((c) => {
    const sweep = c.ratio * Math.PI * 2
    const end = start + sweep
    const mid = start + sweep / 2
    const [x1, y1] = polar(start, R)
    const [x2, y2] = polar(end - 0.0001, R)
    const large = sweep > Math.PI ? 1 : 0
    const path = c.ratio >= 0.9999
      ? `M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - 0.01} ${CY - R}`
      : `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`
    const [lx, ly] = polar(mid, LABEL_R)
    const slice = {
      ...c,
      path,
      color: CATEGORY_MAP[c.category].color,
      iconPath: CATEGORY_MAP[c.category].path,
      lx, ly,
      right: Math.cos(mid) >= 0,
      showLabel: c.ratio >= 0.04,
    }
    start = end
    return slice
  })
})
</script>

<template>
  <svg viewBox="0 0 320 264" class="chart" role="img" :aria-label="`總消費 ${total} 元`">
    <circle v-if="!byCategory.length" :cx="CX" :cy="CY" :r="R" fill="none" stroke="#e3e9ef" :stroke-width="W" />
    <path v-for="s in slices" :key="s.category" :d="s.path" fill="none" :stroke="s.color" :stroke-width="W" />

    <text :x="CX" :y="CY - 8" class="center-label">支出</text>
    <text :x="CX" :y="CY + 18" class="center-amount">${{ fmtMoney(total) }}</text>

    <g v-for="s in slices.filter((s) => s.showLabel)" :key="'l' + s.category">
      <circle :cx="s.lx" :cy="s.ly" r="11" :fill="s.color" />
      <path :d="s.iconPath" :transform="`translate(${s.lx - 7} ${s.ly - 7}) scale(0.58)`" class="icon" />
      <text :x="s.right ? s.lx + 15 : s.lx - 15" :y="s.ly + 4" :text-anchor="s.right ? 'start' : 'end'" class="pct">
        {{ Math.round(s.ratio * 100) }}%
      </text>
    </g>
  </svg>
</template>

<style scoped>
.chart { width: 100%; height: auto; display: block; }
.center-label { font-size: 12px; fill: var(--muted); text-anchor: middle; }
.center-amount { font-size: 22px; font-weight: 500; fill: var(--expense); text-anchor: middle; font-variant-numeric: tabular-nums; }
.pct { font-size: 12px; fill: var(--ink); font-variant-numeric: tabular-nums; }
.icon { fill: none; stroke: #fff; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
</style>

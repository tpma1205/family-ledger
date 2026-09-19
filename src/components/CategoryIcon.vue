<script setup>
import { computed } from 'vue'
import { CATEGORY_MAP, DEPOSIT_STYLE } from '../lib/categories.js'

const props = defineProps({ category: String, kind: { type: String, default: 'expense' }, size: { type: Number, default: 34 } })
const style = computed(() => (props.kind === 'deposit' ? DEPOSIT_STYLE : CATEGORY_MAP[props.category] ?? CATEGORY_MAP.other))
</script>

<template>
  <span class="icon" :style="{ background: style.color, width: size + 'px', height: size + 'px' }" :aria-label="style.label">
    <svg viewBox="0 0 24 24" :style="{ width: size * 0.58 + 'px', height: size * 0.58 + 'px' }"><path :d="style.path" /></svg>
  </span>
</template>

<style scoped>
.icon { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; flex: none; }
svg { fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
</style>

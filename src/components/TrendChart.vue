<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

const props = defineProps({ trend: Array })
const canvas = ref(null)
let chart

const build = () => ({
  labels: props.trend.map((t) => t.label),
  datasets: [{
    data: props.trend.map((t) => t.amount),
    backgroundColor: '#e2503c',
    borderRadius: 3,
    maxBarThickness: 18,
  }],
})

onMounted(() => {
  chart = new Chart(canvas.value, {
    type: 'bar',
    data: build(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 250 },
      plugins: {
        tooltip: {
          displayColors: false,
          callbacks: { label: (ctx) => `$${ctx.parsed.y.toLocaleString('zh-TW')}` },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 }, color: '#6b7a88', maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
        },
        y: {
          beginAtZero: true,
          grid: { color: '#eef2f6' },
          border: { display: false },
          ticks: { font: { size: 10 }, color: '#6b7a88', maxTicksLimit: 5, callback: (v) => (v >= 1000 ? v / 1000 + 'k' : v) },
        },
      },
    },
  })
})

watch(() => props.trend, () => {
  if (!chart) return
  chart.data = build()
  chart.update()
})

onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="wrap"><canvas ref="canvas" /></div>
</template>

<style scoped>
.wrap { position: relative; height: 180px; }
</style>

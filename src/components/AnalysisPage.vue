<script setup>
import { ref, computed } from 'vue'
import { useLedger } from '../composables/useLedger.js'
import { periodStats } from '../lib/ledger.js'
import { todayStr, shiftDay, shiftMonth, shiftYear, fmtMoney } from '../lib/dates.js'
import { CATEGORY_MAP } from '../lib/categories.js'
import DoughnutChart from './DoughnutChart.vue'
import TrendChart from './TrendChart.vue'
import CategoryIcon from './CategoryIcon.vue'

const { expenses } = useLedger()

const granularity = ref('month')
const anchor = ref(todayStr())

const stats = computed(() => periodStats(expenses.value, { granularity: granularity.value, anchor: anchor.value }))

const title = computed(() => {
  const [y, m, d] = anchor.value.split('-')
  if (granularity.value === 'day') return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
  if (granularity.value === 'month') return `${y} 年 ${Number(m)} 月`
  return `${y} 年`
})

function shift(delta) {
  if (granularity.value === 'day') anchor.value = shiftDay(anchor.value, delta)
  else if (granularity.value === 'month') anchor.value = shiftMonth(anchor.value.slice(0, 7), delta) + anchor.value.slice(7)
  else anchor.value = shiftYear(anchor.value, delta)
}
const isNow = computed(() => {
  const t = todayStr()
  const len = { day: 10, month: 7, year: 4 }[granularity.value]
  return anchor.value.slice(0, len) === t.slice(0, len)
})

const GRANULARITIES = [
  { key: 'day', label: '日' },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' },
]
const trendTitle = computed(() => (granularity.value === 'month' ? '每日消費' : '每月消費'))
</script>

<template>
  <header class="sky">
    <div class="seg" role="tablist">
      <button
        v-for="g in GRANULARITIES"
        :key="g.key"
        role="tab"
        :aria-selected="granularity === g.key"
        :class="{ on: granularity === g.key }"
        @click="granularity = g.key"
      >{{ g.label }}</button>
    </div>
    <div class="nav">
      <button class="arrow" aria-label="上一個" @click="shift(-1)">‹</button>
      <span class="title">{{ title }}</span>
      <button class="arrow" aria-label="下一個" @click="shift(1)">›</button>
    </div>
    <button v-if="!isNow" class="now" @click="anchor = todayStr()">回到現在</button>
  </header>

  <section class="card doughnut">
    <DoughnutChart :by-category="stats.byCategory" :total="stats.total" />
  </section>

  <section class="card">
    <h3>分類明細</h3>
    <p v-if="!stats.byCategory.length" class="empty">這段期間沒有消費。</p>
    <ul v-else>
      <li v-for="c in stats.byCategory" :key="c.category">
        <CategoryIcon :category="c.category" :size="30" />
        <span class="name">{{ CATEGORY_MAP[c.category].label }}</span>
        <span class="count num">{{ c.count }} 筆</span>
        <span class="amount num">${{ fmtMoney(c.amount) }}</span>
      </li>
    </ul>
  </section>

  <section v-if="stats.trend" class="card">
    <h3>{{ trendTitle }}</h3>
    <TrendChart :trend="stats.trend" />
  </section>
</template>

<style scoped>
.sky {
  background: var(--sky);
  color: var(--sky-ink);
  padding: calc(env(safe-area-inset-top) + 12px) 20px 40px;
  display: grid;
  gap: 12px;
  justify-items: center;
}
.seg { display: flex; background: rgba(255, 255, 255, .35); border-radius: 999px; padding: 3px; }
.seg button { width: 56px; height: 30px; border-radius: 999px; font-size: 14px; color: var(--sky-ink); }
.seg button.on { background: var(--card); font-weight: 500; }
.nav { display: flex; align-items: center; gap: 4px; }
.arrow { width: 36px; height: 36px; font-size: 24px; border-radius: 50%; }
.title { font-size: 20px; font-weight: 500; min-width: 160px; text-align: center; }
.now { font-size: 12px; border: 1px solid rgba(29, 75, 104, .35); border-radius: 999px; padding: 3px 10px; }

.card { margin: 12px 12px 0; background: var(--card); border-radius: var(--radius); padding: 14px; }
.card.doughnut { margin-top: -24px; padding: 8px 8px 4px; }
h3 { margin: 0 0 10px; font-size: 14px; font-weight: 500; color: var(--muted); }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; align-items: center; gap: 10px; padding: 8px 0; }
li + li { border-top: 1px solid var(--hair); }
.name { flex: 1; font-size: 15px; }
.count { font-size: 13px; color: var(--muted); }
.amount { font-size: 16px; font-weight: 500; min-width: 80px; text-align: right; }
.empty { margin: 0; color: var(--muted); font-size: 14px; }
</style>

<script setup>
import { computed } from 'vue'
import { CATEGORY_MAP } from '../lib/categories.js'
import { fmtMoney, todayStr } from '../lib/dates.js'
import CategoryIcon from './CategoryIcon.vue'

const props = defineProps({ date: String, records: Array, loading: Boolean })
defineEmits(['edit'])

const title = computed(() => {
  const [y, m, d] = props.date.split('-')
  const base = `${Number(m)} 月 ${Number(d)} 日`
  return props.date === todayStr() ? `今天 ${base}` : `${y} 年 ${base}`
})
const dayTotal = computed(() => props.records.filter((r) => r.kind === 'expense').reduce((s, r) => s + r.amount, 0))
const label = (r) => (r.kind === 'deposit' ? '存入共同錢包' : r.note || CATEGORY_MAP[r.category].label)
</script>

<template>
  <section class="list">
    <div class="head">
      <span>{{ title }}</span>
      <span v-if="dayTotal" class="expense num">-${{ fmtMoney(dayTotal) }}</span>
    </div>
    <p v-if="loading && !records.length" class="empty">讀取中…</p>
    <p v-else-if="!records.length" class="empty">這天還沒有紀錄，按右下角「+」新增。</p>
    <ul v-else>
      <li v-for="r in records" :key="r.kind + r.id">
        <button class="row" @click="$emit('edit', r)">
          <CategoryIcon :kind="r.kind" :category="r.category" />
          <span class="text">
            <span class="name">{{ label(r) }}</span>
            <span v-if="r.kind === 'expense' && r.note" class="cat">{{ CATEGORY_MAP[r.category].label }}</span>
          </span>
          <span class="amount num" :class="r.kind">{{ r.kind === 'deposit' ? '+' : '' }}${{ fmtMoney(r.amount) }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.list { margin: 16px 12px 0; }
.head { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); padding: 0 6px 8px; }
ul { list-style: none; margin: 0; padding: 0; background: var(--card); border-radius: var(--radius); overflow: hidden; }
li + li { border-top: 1px solid var(--hair); }
.row { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 14px; text-align: left; }
.row:active { background: var(--page); }
.text { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.name { font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cat { font-size: 12px; color: var(--muted); }
.amount { font-size: 16px; font-weight: 500; }
.empty { margin: 0; padding: 22px 16px; background: var(--card); border-radius: var(--radius); color: var(--muted); font-size: 14px; text-align: center; }
</style>

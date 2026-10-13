<script setup>
import { computed } from 'vue'
import { categoryOf } from '../lib/categories.js'
import { formatShortDate } from '../lib/dates.js'
import { fmtMoney } from '../lib/money.js'
import { sum } from '../lib/ledger.js'
import CategoryIcon from './CategoryIcon.vue'

// 分類消費清單：唯讀，紀錄由父層即時算好傳入
const props = defineProps({ category: String, records: Array, periodTitle: String, showDate: Boolean })
const emit = defineEmits(['close'])

const label = computed(() => categoryOf(props.category).label)
const total = computed(() => sum(props.records))
</script>

<template>
  <div class="backdrop" @click.self="emit('close')">
    <div class="sheet" role="dialog" aria-modal="true" :aria-label="`${label}消費清單`">
      <div class="head">
        <CategoryIcon :category="category" :size="30" />
        <h2>{{ label }}</h2>
        <button type="button" class="close" aria-label="關閉" @click="emit('close')">×</button>
      </div>
      <p class="sub num">{{ periodTitle }} · {{ records.length }} 筆 · ${{ fmtMoney(total) }}</p>

      <p v-if="!records.length" class="empty">這段期間沒有這個分類的消費。</p>
      <ul v-else>
        <li v-for="r in records" :key="r.id">
          <span v-if="showDate" class="date num">{{ formatShortDate(r.date) }}</span>
          <span class="note" :class="{ fallback: !r.note }">{{ r.note || label }}</span>
          <span class="amount num">${{ fmtMoney(r.amount) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(34, 48, 60, .4);
  z-index: 40;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.sheet {
  width: 100%;
  max-width: 520px;
  box-sizing: border-box;
  max-height: 85dvh;
  background: var(--card);
  border-radius: 20px 20px 0 0;
  padding: 14px 18px 0;
  display: flex;
  flex-direction: column;
  animation: rise .22s ease-out;
}
@keyframes rise { from { transform: translateY(40px); opacity: 0; } }

.head { display: flex; align-items: center; gap: 10px; min-height: 40px; }
h2 { flex: 1; margin: 0; font-size: 17px; font-weight: 500; }
.close { width: 36px; height: 36px; flex: none; border-radius: 50%; font-size: 24px; line-height: 1; color: var(--muted); }
.close:active { background: var(--page); }
.sub { margin: 4px 0 10px; font-size: 13px; color: var(--muted); }

/* 清單在 sheet 內捲動，分析頁位置不受影響 */
ul {
  list-style: none;
  margin: 0 -18px;
  padding: 0 18px calc(10px + env(safe-area-inset-bottom));
  overflow-y: auto;
  overscroll-behavior: contain;
}
li { display: flex; align-items: center; gap: 12px; padding: 11px 0; }
li + li { border-top: 1px solid var(--hair); }
.date { flex: none; min-width: 40px; font-size: 13px; color: var(--muted); }
.note { flex: 1; min-width: 0; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.note.fallback { color: var(--muted); }
.amount { font-size: 16px; font-weight: 500; }
.empty { margin: 0; padding: 22px 0 calc(22px + env(safe-area-inset-bottom)); color: var(--muted); font-size: 14px; text-align: center; }
</style>

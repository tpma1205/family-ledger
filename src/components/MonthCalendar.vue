<script setup>
import { computed } from 'vue'
import { calendarCells, todayStr } from '../lib/dates.js'
import { shortMoney as short } from '../lib/money.js'

const props = defineProps({ yearMonth: String, selected: String, summaries: Object })
defineEmits(['select'])

const cells = computed(() => calendarCells(props.yearMonth))
const today = todayStr()
const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

</script>

<template>
  <div class="grid" role="grid">
    <span v-for="w in WEEKDAYS" :key="w" class="weekday">{{ w }}</span>
    <template v-for="(cell, i) in cells" :key="i">
      <span v-if="!cell" class="cell empty" />
      <button
        v-else
        class="cell"
        :class="{ selected: cell === selected, today: cell === today }"
        @click="$emit('select', cell)"
      >
        <span class="day">{{ Number(cell.slice(8)) }}</span>
        <span v-if="summaries[cell]?.expenseTotal" class="sum expense num">{{ short(summaries[cell].expenseTotal) }}</span>
        <span v-if="summaries[cell]?.depositTotal" class="sum deposit num">+{{ short(summaries[cell].depositTotal) }}</span>
      </button>
    </template>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.weekday { text-align: center; font-size: 11px; color: var(--muted); padding: 4px 0 6px; }
.cell {
  height: 54px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
  gap: 1px;
  font-size: 14px;
}
.cell.empty { pointer-events: none; }
.cell.today .day { color: var(--sky-deep); font-weight: 700; }
.cell.selected { background: var(--sky); }
.cell.selected .day { color: var(--sky-ink); font-weight: 700; }
.sum { font-size: 10px; line-height: 1.2; }
.cell.selected .sum.expense { color: #8f2f21; }
.cell.selected .sum.deposit { color: #0f5c40; }
</style>

<script setup>
import { ref, computed } from 'vue'
import { useLedger } from '../composables/useLedger.js'
import { useAuth } from '../composables/useAuth.js'
import { daySummaries, recordsOn } from '../lib/ledger.js'
import { todayStr, toYearMonth, shiftMonth, formatYearMonth } from '../lib/dates.js'
import { fmtMoney } from '../lib/money.js'
import MonthCalendar from './MonthCalendar.vue'
import RecordList from './RecordList.vue'
import RecordSheet from './RecordSheet.vue'

const { deposits, expenses, walletBalance, loading, create, update, remove } = useLedger()
const { signOut } = useAuth()

const selectedDay = ref(todayStr())
const yearMonth = computed(() => toYearMonth(selectedDay.value))
const onToday = computed(() => selectedDay.value === todayStr())

const summaries = computed(() => daySummaries(deposits.value, expenses.value, yearMonth.value))
const dayRecords = computed(() => recordsOn(deposits.value, expenses.value, selectedDay.value))

function goMonth(delta) {
  const next = shiftMonth(yearMonth.value, delta)
  selectedDay.value = next === toYearMonth(todayStr()) ? todayStr() : next + '-01'
}
const goToday = () => (selectedDay.value = todayStr())

const monthTitle = computed(() => formatYearMonth(yearMonth.value))

// 表單：null | { mode: 'create' } | { mode: 'edit', record }
const sheet = ref(null)
const saving = ref(false)
const openCreate = () => (sheet.value = { mode: 'create' })
const openEdit = (record) => (sheet.value = { mode: 'edit', record })
const closeSheet = () => (sheet.value = null)

async function onSave({ kind, id, fields }) {
  if (saving.value) return
  saving.value = true
  const ok = id ? await update(kind, id, fields) : await create(kind, fields)
  saving.value = false
  if (ok) {
    selectedDay.value = fields.date
    closeSheet()
  }
}
async function onDelete({ kind, id }) {
  if (saving.value) return
  saving.value = true
  const ok = await remove(kind, id)
  saving.value = false
  if (ok) closeSheet()
}
</script>

<template>
  <header class="sky">
    <div class="top">
      <span class="brand">家庭記帳</span>
      <button class="logout" @click="signOut">登出</button>
    </div>
    <div class="balance">
      <span class="label">錢包餘額</span>
      <span class="amount num" :class="{ negative: walletBalance < 0 }">${{ fmtMoney(walletBalance) }}</span>
    </div>
  </header>

  <section class="calendar-card">
    <div class="month-nav">
      <button class="arrow" aria-label="上個月" @click="goMonth(-1)">‹</button>
      <span class="title">{{ monthTitle }}</span>
      <button class="arrow" aria-label="下個月" @click="goMonth(1)">›</button>
      <button v-if="!onToday" class="today" @click="goToday">回到本日</button>
    </div>
    <MonthCalendar :year-month="yearMonth" :selected="selectedDay" :summaries="summaries" @select="selectedDay = $event" />
  </section>

  <RecordList :date="selectedDay" :records="dayRecords" :loading="loading" @edit="openEdit" />

  <button class="fab" aria-label="新增紀錄" @click="openCreate">+</button>

  <RecordSheet
    v-if="sheet"
    :mode="sheet.mode"
    :record="sheet.record"
    :default-date="selectedDay"
    :busy="saving"
    @save="onSave"
    @delete="onDelete"
    @close="closeSheet"
  />
</template>

<style scoped>
.sky {
  position: sticky;
  top: 0;
  z-index: 12;
  background: var(--sky);
  color: var(--sky-ink);
  padding: calc(env(safe-area-inset-top) + 12px) 20px 18px;
}
.top { display: flex; justify-content: space-between; align-items: center; }
.brand { font-weight: 500; font-size: 15px; }
.logout { font-size: 13px; opacity: .75; padding: 6px 0; }
.balance { display: flex; flex-direction: column; margin-top: 18px; }
.label { font-size: 13px; opacity: .8; }
.amount { font-size: 40px; font-weight: 500; line-height: 1.15; letter-spacing: -.01em; }
.amount.negative { color: #a33a2a; }

.calendar-card {
  margin: 12px 12px 0;
  background: var(--card);
  border-radius: var(--radius);
  padding: 12px 10px 10px;
}
.month-nav { display: flex; align-items: center; gap: 6px; padding: 0 4px 8px; }
.arrow { width: 34px; height: 34px; font-size: 22px; color: var(--muted); border-radius: 50%; }
.arrow:active { background: var(--page); }
.title { font-weight: 500; font-size: 16px; min-width: 110px; text-align: center; }
.today {
  margin-left: auto;
  font-size: 12px;
  color: var(--sky-deep);
  border: 1px solid var(--sky);
  border-radius: 999px;
  padding: 4px 10px;
}

.fab {
  position: fixed;
  right: max(16px, calc(50% - 260px + 16px));
  bottom: calc(var(--tab-h) + env(safe-area-inset-bottom) + 16px);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--sky-deep);
  color: #fff;
  font-size: 32px;
  line-height: 1;
  box-shadow: 0 6px 16px rgba(47, 111, 149, .35);
  z-index: 25;
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { CATEGORIES } from '../lib/categories.js'
import { pressKey, isValidAmount } from '../lib/amountInput.js'
import CategoryIcon from './CategoryIcon.vue'

const props = defineProps({
  mode: { type: String, default: 'create' }, // create | edit
  record: Object, // edit 時帶入，含 kind
  defaultDate: String,
  busy: Boolean,
})
const emit = defineEmits(['save', 'delete', 'close'])

const isEdit = props.mode === 'edit'
const kind = ref(props.record?.kind ?? 'expense')
const amount = ref(props.record ? String(props.record.amount) : '')
const date = ref(props.record?.date ?? props.defaultDate)
const category = ref(props.record?.category ?? 'food')
const note = ref(props.record?.note ?? '')

// 內容欄取得焦點時換成系統文字鍵盤，其餘時間顯示自製數字鍵盤
const noteInput = ref(null)
const noteFocused = ref(false)
const keypadOpen = computed(() => !noteFocused.value)

const valid = computed(() => isValidAmount(amount.value) && !!date.value)

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0', 'ok']

function press(key) {
  if (key === 'ok') return submit()
  amount.value = pressKey(amount.value, key)
}

function focusAmount() {
  noteInput.value?.blur()
}

// Enter／完成只收鍵盤，不送出；注音選字時的 Enter 不算
function onNoteEnter(e) {
  if (e.isComposing || e.keyCode === 229) return
  e.preventDefault()
  noteInput.value?.blur()
}

function submit() {
  if (!valid.value || props.busy) return
  const fields = { amount: Number(amount.value), date: date.value }
  if (kind.value === 'expense') {
    fields.category = category.value
    fields.note = note.value.trim() || null
  }
  emit('save', { kind: kind.value, id: props.record?.id, fields })
}

function del() {
  if (!window.confirm('確定刪除這筆紀錄？')) return
  emit('delete', { kind: kind.value, id: props.record.id })
}
</script>

<template>
  <div class="backdrop" @click.self="emit('close')">
    <div class="sheet" role="dialog" aria-modal="true" :aria-label="isEdit ? '修改紀錄' : '新增紀錄'">
      <div class="head">
        <div v-if="!isEdit" class="kind">
          <button type="button" :class="{ on: kind === 'expense' }" @click="kind = 'expense'">消費</button>
          <button type="button" :class="{ on: kind === 'deposit' }" @click="kind = 'deposit'">存款</button>
        </div>
        <template v-else>
          <button type="button" class="delete" :disabled="busy" @click="del">刪除</button>
          <h2>{{ kind === 'deposit' ? '修改存款' : '修改消費' }}</h2>
        </template>
        <button type="button" class="close" aria-label="關閉" @click="emit('close')">×</button>
      </div>

      <button type="button" class="amount-field" :class="[kind, { active: keypadOpen }]" aria-label="金額" @click="focusAmount">
        <span class="currency">$</span>
        <span class="digits num" :class="{ placeholder: !amount }">{{ amount || '0' }}</span>
        <span v-if="keypadOpen" class="caret" aria-hidden="true" />
      </button>

      <label class="field">
        <span>日期</span>
        <input v-model="date" type="date" required />
      </label>

      <template v-if="kind === 'expense'">
        <div class="cats" role="radiogroup" aria-label="分類">
          <button
            v-for="c in CATEGORIES"
            :key="c.key"
            type="button"
            role="radio"
            :aria-checked="category === c.key"
            :class="{ on: category === c.key }"
            @click="category = c.key"
          >
            <CategoryIcon :category="c.key" :size="38" />
            <span>{{ c.label }}</span>
          </button>
        </div>
        <label class="field">
          <span>內容</span>
          <input
            ref="noteInput"
            v-model="note"
            type="text"
            placeholder="選填，例如：家樂福"
            maxlength="60"
            enterkeyhint="done"
            @focus="noteFocused = true"
            @blur="noteFocused = false"
            @keydown.enter="onNoteEnter"
          />
        </label>
      </template>

      <div v-if="keypadOpen" class="keypad">
        <template v-for="k in KEYS" :key="k">
          <button v-if="k === 'back'" type="button" class="key fn" aria-label="退格" @click="press(k)">⌫</button>
          <button
            v-else-if="k === 'ok'"
            type="button"
            class="key ok"
            :aria-label="isEdit ? '儲存變更' : '儲存'"
            :disabled="!valid || busy"
            @click="press(k)"
          >{{ busy ? '…' : '✓' }}</button>
          <button v-else type="button" class="key num" @click="press(k)">{{ k }}</button>
        </template>
      </div>
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
  overflow: hidden;
  background: var(--card);
  border-radius: 20px 20px 0 0;
  padding: 14px 18px calc(10px + env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  animation: rise .22s ease-out;
}
@keyframes rise { from { transform: translateY(40px); opacity: 0; } }

.head { position: relative; display: flex; align-items: center; gap: 10px; min-height: 40px; }
/* 標題以整列置中，不受左右按鈕寬度影響 */
h2 { position: absolute; inset: 0; margin: 0; font-size: 16px; font-weight: 500; line-height: 40px; text-align: center; pointer-events: none; }
.close { margin-left: auto; width: 36px; height: 36px; flex: none; border-radius: 50%; font-size: 24px; line-height: 1; color: var(--muted); }
.close:active { background: var(--page); }
.delete { flex: none; height: 34px; padding: 0 12px; border-radius: 10px; font-size: 14px; color: var(--expense); background: var(--expense-soft); }
.delete:disabled { opacity: .6; }

.kind { flex: 1; display: flex; background: var(--page); border-radius: 12px; padding: 4px; }
.kind button { flex: 1; height: 34px; border-radius: 9px; font-size: 15px; color: var(--muted); }
.kind button.on { background: var(--card); color: var(--ink); font-weight: 500; }

.amount-field {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 0 6px;
  color: var(--expense);
  border-bottom: 2px solid transparent;
  margin: 0 15%;
}
.amount-field.active { border-bottom-color: currentColor; }
.amount-field.deposit { color: var(--deposit); }
.currency { font-size: 24px; font-weight: 500; }
.digits { font-size: 40px; font-weight: 500; line-height: 1.15; }
.digits.placeholder { opacity: .3; }
.caret { width: 2px; height: 36px; background: currentColor; animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }

.field { display: flex; align-items: center; gap: 12px; font-size: 14px; }
.field span { color: var(--muted); width: 36px; flex: none; }
.field input {
  flex: 1 1 0;
  width: 0;
  min-width: 0;
  height: 42px;
  border: 1px solid var(--hair);
  border-radius: 10px;
  padding: 0 12px;
  font-size: 16px;
  background: var(--page);
  -webkit-appearance: none;
  appearance: none;
}
.field input[type=date] { text-align: center; }
.field input:focus, .field input:focus-visible { outline: none; border-color: var(--sky-deep); }
/* iOS date input 內部容器也要允許縮小 */
.field input::-webkit-date-and-time-value { text-align: center; min-width: 0; }

.cats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; }
.cats button {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--muted);
  padding: 5px 0 4px;
  border-radius: 10px;
  opacity: .55;
}
.cats button.on { opacity: 1; color: var(--ink); font-weight: 500; background: var(--page); }

.keypad {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  margin: 0 -8px;
}
.key {
  height: 48px;
  border-radius: 10px;
  background: var(--page);
  font-size: 22px;
  font-weight: 500;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}
.key:active { background: var(--hair); }
.key.fn { font-size: 20px; color: var(--muted); }
.key.ok { background: var(--sky-deep); color: #fff; }
.key.ok:disabled { opacity: .35; }
</style>

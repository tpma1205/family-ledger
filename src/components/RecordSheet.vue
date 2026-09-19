<script setup>
import { ref, computed, onMounted } from 'vue'
import { CATEGORIES } from '../lib/categories.js'
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
const error = ref('')
const amountInput = ref(null)

// v-if 動態掛載時 autofocus 不可靠，明確 focus 一次
onMounted(() => amountInput.value?.focus())

const amountValue = computed(() => Number(amount.value))
const valid = computed(() => /^\d+$/.test(amount.value) && amountValue.value > 0 && date.value)

function onAmountInput(e) {
  amount.value = e.target.value.replace(/\D/g, '')
}

function submit() {
  if (!valid.value) {
    error.value = '請輸入大於 0 的整數金額'
    return
  }
  const fields = { amount: amountValue.value, date: date.value }
  if (kind.value === 'expense') {
    fields.category = category.value
    fields.note = note.value.trim() || null
  }
  emit('save', { kind: kind.value, id: props.record?.id, fields })
}

function del() {
  emit('delete', { kind: kind.value, id: props.record.id })
}
</script>

<template>
  <div class="backdrop" @click.self="emit('close')">
    <form class="sheet" @submit.prevent="submit">
      <div class="handle" />

      <div v-if="!isEdit" class="kind">
        <button type="button" :class="{ on: kind === 'expense' }" @click="kind = 'expense'">消費</button>
        <button type="button" :class="{ on: kind === 'deposit' }" @click="kind = 'deposit'">存款</button>
      </div>
      <h2 v-else>{{ kind === 'deposit' ? '修改存款' : '修改消費' }}</h2>

      <label class="amount-field" :class="kind">
        <span class="currency">$</span>
        <input
          ref="amountInput"
          :value="amount"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          placeholder="0"
          enterkeyhint="done"
          @input="onAmountInput"
        />
      </label>

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
          <input v-model="note" type="text" placeholder="選填，例如：家樂福" maxlength="60" />
        </label>
      </template>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="actions">
        <button v-if="isEdit" type="button" class="delete" :disabled="busy" @click="del">刪除</button>
        <button type="submit" class="save" :disabled="busy">{{ busy ? '儲存中…' : isEdit ? '儲存變更' : '儲存' }}</button>
      </div>
    </form>
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
  background: var(--card);
  border-radius: 20px 20px 0 0;
  padding: 8px 18px calc(18px + env(safe-area-inset-bottom));
  display: grid;
  gap: 14px;
  animation: rise .22s ease-out;
}
@keyframes rise { from { transform: translateY(40px); opacity: 0; } }
.handle { width: 40px; height: 4px; border-radius: 2px; background: var(--hair); margin: 0 auto 4px; }
h2 { margin: 0; font-size: 16px; font-weight: 500; text-align: center; }

.kind { display: flex; background: var(--page); border-radius: 12px; padding: 4px; }
.kind button { flex: 1; height: 38px; border-radius: 9px; font-size: 15px; color: var(--muted); }
.kind button.on { background: var(--card); color: var(--ink); font-weight: 500; }

.amount-field {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  padding: 6px 0 2px;
  color: var(--expense);
}
.amount-field.deposit { color: var(--deposit); }
.currency { font-size: 24px; font-weight: 500; }
.amount-field input {
  width: 60%;
  border: 0;
  border-bottom: 2px solid currentColor;
  background: none;
  font-size: 40px;
  font-weight: 500;
  text-align: center;
  padding: 0 0 4px;
  border-radius: 0;
}
.amount-field input::placeholder { color: currentColor; opacity: .3; }

.field { display: flex; align-items: center; gap: 12px; font-size: 14px; }
.field span { color: var(--muted); width: 36px; flex: none; }
.field input {
  flex: 1;
  height: 42px;
  border: 1px solid var(--hair);
  border-radius: 10px;
  padding: 0 12px;
  font-size: 16px;
  background: var(--page);
  min-width: 0;
}

.cats { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.cats button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--muted);
  padding: 6px 0 4px;
  border-radius: 10px;
  opacity: .55;
}
.cats button.on { opacity: 1; color: var(--ink); font-weight: 500; background: var(--page); }

.error { margin: -4px 0 0; color: var(--expense); font-size: 13px; text-align: center; }
.actions { display: flex; gap: 10px; }
.save {
  flex: 1;
  height: 48px;
  border-radius: 12px;
  background: var(--sky-deep);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}
.save:disabled { opacity: .6; }
.delete { padding: 0 18px; height: 48px; border-radius: 12px; color: var(--expense); border: 1px solid var(--expense-soft); background: var(--expense-soft); }
</style>

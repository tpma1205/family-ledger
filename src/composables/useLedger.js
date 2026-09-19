import { ref, computed } from 'vue'
import * as api from '../lib/api.js'
import { balance } from '../lib/ledger.js'

const deposits = ref([])
const expenses = ref([])
const loading = ref(false)
const error = ref('')

async function refresh() {
  loading.value = true
  error.value = ''
  try {
    const data = await api.listAll()
    deposits.value = data.deposits
    expenses.value = data.expenses
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// 寫入後一律重新撈全部，兩人資料量小，這比樂觀更新單純
async function mutate(action) {
  error.value = ''
  try {
    await action()
    await refresh()
    return true
  } catch (e) {
    error.value = e.message
    return false
  }
}

export function useLedger() {
  return {
    deposits,
    expenses,
    loading,
    error,
    walletBalance: computed(() => balance(deposits.value, expenses.value)),
    refresh,
    create: (kind, fields) => mutate(() => api.createRecord(kind, fields)),
    update: (kind, id, fields) => mutate(() => api.updateRecord(kind, id, fields)),
    remove: (kind, id) => mutate(() => api.deleteRecord(kind, id)),
  }
}

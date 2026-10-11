import { ref, computed } from 'vue'
import * as api from '../lib/api.js'
import { balance } from '../lib/ledger.js'

const deposits = ref([])
const expenses = ref([])
const loading = ref(false)
const error = ref('')
// 「曾經成功載入過」：之後的背景重撈失敗時，畫面繼續顯示舊資料
const loaded = ref(false)
// 最近一次 refresh 是否失敗（不含寫入失敗）
const loadFailed = ref(false)
// 只採用最後一次發出的 refresh 結果；reset 後也會丟掉還在路上的回應
let seq = 0

async function refresh() {
  const mine = ++seq
  loading.value = true
  error.value = ''
  try {
    const data = await api.listAll()
    if (mine !== seq) return
    deposits.value = data.deposits
    expenses.value = data.expenses
    loaded.value = true
    loadFailed.value = false
  } catch (e) {
    if (mine !== seq) return
    error.value = e.message
    loadFailed.value = true
  } finally {
    if (mine === seq) loading.value = false
  }
}

// 登出時清掉，下一次登入重新走「讀取中 → 金額」
function reset() {
  seq++
  deposits.value = []
  expenses.value = []
  loading.value = false
  error.value = ''
  loaded.value = false
  loadFailed.value = false
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
    loaded,
    loadFailed,
    error,
    walletBalance: computed(() => balance(deposits.value, expenses.value)),
    refresh,
    reset,
    create: (kind, fields) => mutate(() => api.createRecord(kind, fields)),
    update: (kind, id, fields) => mutate(() => api.updateRecord(kind, id, fields)),
    remove: (kind, id) => mutate(() => api.deleteRecord(kind, id)),
  }
}

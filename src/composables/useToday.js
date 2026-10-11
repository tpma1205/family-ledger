import { ref } from 'vue'
import { todayStr } from '../lib/dates.js'

// 全 app 共用的「今天」；App 回到前景時重算，跨過午夜才會變
const today = ref(todayStr())

export function syncToday() {
  today.value = todayStr()
}

export function useToday() {
  return today
}

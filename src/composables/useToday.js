import { ref, watch } from 'vue'
import { todayStr } from '../lib/dates.js'

// 全 app 共用的「今天」；App 回到前景時重算，跨過午夜才會變
const today = ref(todayStr())

export function syncToday() {
  today.value = todayStr()
}

export function useToday() {
  return today
}

// 跨日時，dateRef 若停在舊的今天就跟著換成新的今天；刻意選的其他日期不動
export function followToday(dateRef) {
  watch(today, (next, prev) => {
    if (dateRef.value === prev) dateRef.value = next
  })
}

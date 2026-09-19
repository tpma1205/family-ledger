import { ref } from 'vue'

const message = ref('')
let timer

export function useToast() {
  function show(text, ms = 2500) {
    message.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (message.value = ''), ms)
  }
  return { message, show }
}

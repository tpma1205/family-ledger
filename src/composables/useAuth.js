import { ref } from 'vue'
import { supabase } from '../lib/supabase.js'

// undefined = 還在讀取 session；null = 未登入
const session = ref(undefined)

supabase.auth.getSession().then(({ data }) => {
  session.value = data.session
})
supabase.auth.onAuthStateChange((_event, next) => {
  session.value = next
})

export function useAuth() {
  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) return
    // 400 = 帳密錯；其他（含 fetch 失敗）視為連不上
    throw new Error(error.status === 400 ? '帳號或密碼不正確' : '無法連線，請稍後再試')
  }
  async function signOut() {
    await supabase.auth.signOut()
  }
  return { session, signIn, signOut }
}

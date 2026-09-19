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
    if (error) throw new Error('帳號或密碼不正確')
  }
  async function signOut() {
    await supabase.auth.signOut()
  }
  return { session, signIn, signOut }
}

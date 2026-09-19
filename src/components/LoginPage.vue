<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth.js'

const { signIn } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

async function submit() {
  error.value = ''
  busy.value = true
  try {
    await signIn(email.value.trim(), password.value)
  } catch (e) {
    error.value = e.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="login">
    <div class="sky">
      <h1>家庭記帳</h1>
      <p>我們的共同錢包</p>
    </div>
    <form class="card" @submit.prevent="submit">
      <label>
        <span>Email</span>
        <input v-model="email" type="email" autocomplete="username" inputmode="email" required />
      </label>
      <label>
        <span>密碼</span>
        <input v-model="password" type="password" autocomplete="current-password" required />
      </label>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" :disabled="busy">{{ busy ? '登入中…' : '登入' }}</button>
    </form>
  </div>
</template>

<style scoped>
.login { min-height: 100dvh; background: var(--sky); }
.sky { padding: 20vh 24px 40px; color: var(--sky-ink); }
h1 { margin: 0; font-size: 34px; font-weight: 700; letter-spacing: .02em; }
p { margin: 6px 0 0; opacity: .8; }
.card {
  margin: 0 16px;
  background: var(--card);
  border-radius: var(--radius);
  padding: 20px;
  display: grid;
  gap: 14px;
}
label { display: grid; gap: 6px; font-size: 13px; color: var(--muted); }
input {
  height: 46px;
  border: 1px solid var(--hair);
  border-radius: 10px;
  padding: 0 12px;
  font-size: 16px;
  background: var(--page);
}
button[type=submit] {
  height: 48px;
  border-radius: 12px;
  background: var(--sky-deep);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-top: 4px;
}
button:disabled { opacity: .6; }
.error { margin: 0; color: var(--expense); font-size: 14px; }
</style>

<script setup>
import { ref, watch } from 'vue'
import { useAuth } from './composables/useAuth.js'
import { useLedger } from './composables/useLedger.js'
import { useToast } from './composables/useToast.js'
import LoginPage from './components/LoginPage.vue'
import LedgerPage from './components/LedgerPage.vue'
import AnalysisPage from './components/AnalysisPage.vue'
import TabBar from './components/TabBar.vue'

const { session } = useAuth()
const { refresh, error } = useLedger()
const toast = useToast()
const tab = ref('ledger')

watch(session, (s) => { if (s) refresh() }, { immediate: true })
watch(error, (msg) => { if (msg) toast.show(msg) })
</script>

<template>
  <div v-if="session === undefined" class="splash">家庭記帳</div>
  <LoginPage v-else-if="!session" />
  <template v-else>
    <main class="page">
      <LedgerPage v-if="tab === 'ledger'" />
      <AnalysisPage v-else />
    </main>
    <TabBar v-model="tab" />
  </template>
  <Transition name="toast">
    <div v-if="toast.message.value" class="toast" role="status">{{ toast.message.value }}</div>
  </Transition>
</template>

<style scoped>
.splash {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: var(--sky);
  color: var(--sky-ink);
  font-size: 20px;
  font-weight: 500;
}
.page { padding-bottom: calc(var(--tab-h) + env(safe-area-inset-bottom) + 84px); }
.toast {
  position: fixed;
  left: 50%;
  bottom: calc(var(--tab-h) + env(safe-area-inset-bottom) + 16px);
  transform: translateX(-50%);
  background: var(--ink);
  color: #fff;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 14px;
  z-index: 50;
  max-width: 90vw;
}
.toast-enter-active, .toast-leave-active { transition: opacity .2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; }
</style>

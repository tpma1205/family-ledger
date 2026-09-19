<script setup>
defineProps({ modelValue: String })
defineEmits(['update:modelValue'])
</script>

<template>
  <nav class="tabs">
    <button :class="{ active: modelValue === 'ledger' }" @click="$emit('update:modelValue', 'ledger')">
      <svg viewBox="0 0 24 24"><path d="M4 5h16v15H4zM4 10h16M9 5v15M9 14h11" /></svg>
      記帳
    </button>
    <button :class="{ active: modelValue === 'analysis' }" @click="$emit('update:modelValue', 'analysis')">
      <svg viewBox="0 0 24 24"><path d="M12 12V3a9 9 0 1 1-9 9zM12 12l6.4 6.4" /></svg>
      分析
    </button>
  </nav>
</template>

<style scoped>
.tabs {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 520px;
  height: calc(var(--tab-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--card);
  border-top: 1px solid var(--hair);
  display: flex;
  z-index: 20;
}
.tabs button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 12px;
  color: var(--muted);
}
.tabs button.active { color: var(--sky-deep); font-weight: 500; }
.tabs svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
</style>

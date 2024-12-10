<template>
  <router-view></router-view>
</template>

<script setup>
import { ref,computed,onMounted } from 'vue'
import { useMobileStore } from '@/stores/index'
const mobileStore = useMobileStore()
const isMobile = computed(() => {
  return mobileStore.isMobile
})
const setWidth = () => {
  mobileStore.setMobile(window.innerWidth)
}

onMounted(() => {
  setWidth()

  window.addEventListener('resize', () => {
    setWidth()
  }, false);

})
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

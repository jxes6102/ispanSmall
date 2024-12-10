<template>
    <div v-stoprightmouse class="w-[100vw] h-[100vh] fixed left-0 top-0 bg-[rgba(39,39,39,0.2)] flex flex-wrap items-center justify-center">
        <div class="w-[50px] h-[50px] bg-[#FAF3E0] rounded-xl flex flex-col items-center justify-center">
            <slot name="text"></slot>
            <slot name="button"></slot>
        </div>
    </div>
</template>
<script setup>
import { ref,computed,watch  } from 'vue'
import { useClickStore } from '@/stores/index'
const clickStore = useClickStore()
const position = computed(() => {
  return clickStore.position
})

console.log('position',position.value)
</script>
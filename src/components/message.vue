<template>
    <div v-stoprightmouse class="w-[100vw] h-[100vh] fixed left-0 top-0 bg-[rgba(39,39,39,0.9)] flex flex-wrap items-center justify-center">
        <div class="relative w-[80vw] h-[60vw] md:w-auto md:h-auto md:py-12 md:px-20 bg-[#FAF3E0] rounded-xl flex flex-col items-center justify-center gap-[10px]">
            <slot name="text"></slot>
            <slot name="button"></slot>
        </div>
    </div>
</template>
<script setup>
</script>
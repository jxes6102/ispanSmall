import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMobileStore = defineStore('mobile', () => {
    const width = ref(0)
    const isMobile = computed(() => {
        return width.value <= 768
    })
    const setMobile = (value) => {
        width.value = value
    }

    return { width, isMobile ,setMobile }
})

export const useClickStore = defineStore('click', () => {
    const position = ref({
        elementX:0,
        elementY:0,
        elementPositionX:0,
        elementPositionY:0
    })

    const setPosition = (ex,ey,epx,epy) => {
        position.value.elementX = ex
        position.value.elementY = ey
        position.value.elementPositionX = epx
        position.value.elementPositionY = epy
        console.log('position',position)
    }

    return { position,setPosition }
})

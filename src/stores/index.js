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

export const useGameStore = defineStore('game', () => {
    const setRule = (isMobile,level) => {
        let gameDetail = {
            easy:{
                p:{
                    boomAmount:10,
                    row:8,
                    col:10,
                },
                m:{
                    boomAmount:10,
                    row:12,
                    col:6,
                }
            },
            normal:{
                p:{
                    boomAmount:40,
                    row:14,
                    col:18,
                },
                m:{
                    boomAmount:30,
                    row:18,
                    col:10,
                }
            }
        }
        let target = {}
        if(isMobile && level == 'easy'){
            target = gameDetail.easy.m
        }else if(isMobile && level == 'normal'){
            target = gameDetail.normal.m
        }else if(!isMobile && level == 'easy'){
            target = gameDetail.easy.p
        }else if(!isMobile && level == 'normal'){
            target = gameDetail.normal.p
        }
    
        return target
    }

    return { setRule }
})

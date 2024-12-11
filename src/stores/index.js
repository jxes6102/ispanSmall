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

    const recordSecond = ref('無')
    const second = ref(0)
    let timer = null
    const timerStatus = ref(false)

    const createTimer = () => {
        timerStatus.value = true
        timer = setInterval(() => {
            if(second.value<999){
                second.value++
            }
        }, 1000);
    }

    const clearTimer = () => {
        clearInterval(timer)
        timerStatus.value = false
    }

    const setRecord = () => {
        // localStorage.setItem("bestRecord", second.value)
    }
    const getRecord = () => {
        // recordSecond.value = localStorage.getItem("bestRecord") || '無'
        recordSecond.value = second.value
    }
    const clearSecond = () => {
        second.value = 0
    }

    return { setRule,createTimer,clearTimer,getRecord,setRecord,clearSecond,timerStatus,second,recordSecond }
})

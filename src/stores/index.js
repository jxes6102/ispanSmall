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

    const recordSecond = ref({
        easy:{
            p:999,
            m:999
        },
        normal:{
            p:999,
            m:999
        }
    })
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

    const setRecord = (isMobile,level) => {
        getRecord()
        let target = JSON.parse(localStorage.getItem("bestRecord")) 
        if(!target){
            target = {
                easy:{
                    p:999,
                    m:999
                },
                normal:{
                    p:999,
                    m:999
                }
            }
        }

        let temp = null
        if(isMobile && level == 'easy'){
            temp = recordSecond.value.easy.m
            target.easy.m = second.value
        }else if(isMobile && level == 'normal'){
            temp = recordSecond.value.normal.m
            target.normal.m = second.value
        }else if(!isMobile && level == 'easy'){
            temp = recordSecond.value.easy.p
            target.easy.p = second.value
        }else if(!isMobile && level == 'normal'){
            temp = recordSecond.value.normal.p
            target.normal.p = second.value
        }

        if(temp>second.value){
            localStorage.setItem("bestRecord", JSON.stringify(target))
        }
        
    }

    const getRecord = () => {
        let target = JSON.parse(localStorage.getItem("bestRecord")) 
        if(!target) return false

        recordSecond.value = target
    }

    const bestSecond = (isMobile,level) => {
        if(isMobile && level == 'easy'){
            return recordSecond.value.easy.m >= 999 ? '無' : recordSecond.value.easy.m
        }else if(isMobile && level == 'normal'){
            return recordSecond.value.normal.m >= 999 ? '無' : recordSecond.value.normal.m
        }else if(!isMobile && level == 'easy'){
            return recordSecond.value.easy.p >= 999 ? '無' : recordSecond.value.easy.p
        }else if(!isMobile && level == 'normal'){
            return recordSecond.value.normal.p >= 999 ? '無' : recordSecond.value.normal.p
        }
    }

    const clearSecond = () => {
        second.value = 0
    }

    return { setRule,createTimer,clearTimer,getRecord,setRecord,clearSecond,bestSecond,timerStatus,second,recordSecond }
})

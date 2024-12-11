<template>
  <div class="w-[auto] md:w-[auto] h-auto flex flex-col items-center justify-start">
    <div class="w-full flex flex-wrap items-center bg-[rgba(255,209,102,0.7)] rounded-md">
      <select v-model="level" class="w-[70px] md:w-1/5 m-1 md:m-2 p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 ">
        <option value="easy">簡單</option>
        <option value="normal">普通</option>
      </select>
      <div class="w-auto p-1 md:p-2 flex flex-wrap items-center justify-center">
        <img class="h-[20px] md:h-[35px]" src="@/assets/img/redflag.png" alt="">
        <div class="text-base md:text-xl text-[#3D3D3D] font-bold">{{boomCount}}</div>
      </div>
      <div class="w-auto p-1 md:p-2 flex flex-wrap items-center justify-center">
        <img class="h-[20px] md:h-[35px]" src="@/assets/img/clock.png" alt="">
        <div class="w-[30px] md:w-[35px] mx-[2px] text-base md:text-xl text-[#3D3D3D] font-bold">{{second}}</div>
      </div>
    </div>  
    <div ref="broad" v-if="land.length > 0" class="flex-wrap mine-flex-center border-[#A0C4FF] border-2 md:border-4 rounded-md">
      <div v-for="(item, index) in land[0].length" :key="index">
          <div class="w-[24px] h-[24px] md:w-[42px] md:h-[42px] border-[1px] md:border-2 border-[#E0F7FA] rounded mine-flex-center " 
            v-for="(items, indexs) in land" :class="[land[indexs][index].check ? 'bg-[#F4A261]' : 'bg-[#228B22]']" 
            @mousedown="action(indexs,index,$event)" :key="indexs">
            <span v-if="land[indexs][index].display == 'F'">
              <img class="h-full" src="@/assets/img/redflag.png" alt="">
            </span>
            <span v-else-if="land[indexs][index].display == 'X'">
              <img class="h-full" src="@/assets/img/boom.png" alt="">
            </span>
            <span v-else>{{land[indexs][index].display}}</span>
          </div>
      </div>
    </div>
    <Teleport to='body'>
      <Transition
        name="custom-classes"
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
      >
        <messageBox v-if="endStatus">
          <template v-slot:text>
            <div class="text-3xl font-bold">
              {{ '時間:' + recordSecond }}
            </div>
            <div class="text-5xl font-bold" :class="[isWin ? 'text-green-500' : 'text-red-500']">
              {{ isWin ? '成功' : '失敗' }}
            </div>
          </template>
          <template v-slot:button>
            <button class="bg-green-500 text-xl font-bold text-[#FFFFF0] py-2 px-4 rounded-xl transition-all duration-300 hover:bg-green-400" @click="init">再玩一次</button>
          </template>
        </messageBox> 
      </Transition>
      <mobileBroad v-if="mobileSelectStatus">
        <template v-slot:icon>
          <div
            :class="[iconPositionObject.isVertical ? 'flex-col' : '']" 
            class="absolute w-[auto] h-[auto] rounded-xl flex gap-[2px]" 
            :style="iconPositionObject">
            <img @click="mark(null,null)" class="h-[30px]" src="@/assets/img/shovel.png" alt="">
            <img @click="close" class="h-[30px]" src="@/assets/img/arrow.png" alt="">
            <img @click="mark(null,null,2)" class="h-[30px]" src="@/assets/img/redflag.png" alt="">
          </div>
        </template>
      </mobileBroad>
    </Teleport>
  </div>
</template>
<script setup>
import 'animate.css';
import { useMouseInElement } from '@vueuse/core'
import messageBox from '@/components/message.vue'
import mobileBroad from '@/components/mobileBroad.vue'
import { ref,computed,watch  } from 'vue'
import { useMobileStore,useGameStore } from '@/stores/index'
const mobileStore = useMobileStore()
const gameStore = useGameStore()
const isMobile = computed(() => {
  return mobileStore.isMobile
})
const broad = ref(null)
const { elementX, elementY,elementPositionX,elementPositionY } = useMouseInElement(broad)
const endStatus = ref(false)
const mobileSelectStatus = ref(false)
const isWin = ref(false)
const land = ref([])
let flagBoom = []
const guessBoom = ref([])
const level = ref('easy')
const gameRule = computed(() => {
  gameStore.clearTimer()
  return gameStore.setRule(isMobile.value,level.value)
})
const second = computed(() => {
  return gameStore.second
})
const timerStatus = computed(() => {
  return gameStore.timerStatus
})
const recordSecond = computed(() => {
  return gameStore.recordSecond
})
const boomCount = computed(() => {
  return gameRule.value.boomAmount - guessBoom.value.length
})
const iconPositionObject = ref({
  top: '0px',
  left: '0px',
  isVertical:true
})
let step = {x:null,y:null}

const init = () => {
  // 初始化格子和炸彈
  endStatus.value = false
  land.value = []
  guessBoom.value = []
  isWin.value = false
  flagBoom = []

  for(let i = 0;i<gameRule.value.row;i++) {
    land.value[i] = []
    for(let j = 0;j<gameRule.value.col;j++) {
      land.value[i][j] = {
        isBoom:false,
        flag:false,
        display:'',
        check:false,
      }
    }
  }
  madeBoom()
  gameStore.clearSecond()
}
    
const madeBoom = () => {
  // 生成炸彈
  let count = gameRule.value.boomAmount
  for(let i = 0;i<count;) {
    const x = Math.floor(Math.random() * gameRule.value.row)
    const y = Math.floor(Math.random() * gameRule.value.col)
    if(!land.value[x][y].isBoom){
      land.value[x][y].isBoom = true
      flagBoom.push(x + ',' +y)
      i++
    }
  }

}

init()

const action = (x,y,event = null) => {
  //點擊時觸發
  if(endStatus.value) return false

  if(!timerStatus.value){
    gameStore.createTimer()
  }

  //手機板改流程和調整icon位置
  if(isMobile.value && !land.value[x][y].check){
    step.x = x
    step.y = y
    mobileSelectStatus.value = true

    if(step.x + 1 == land.value.length){
      iconPositionObject.value.isVertical = false
      iconPositionObject.value.top = Math.floor(elementY.value) + Math.floor(elementPositionY.value) - 15 + 'px'
      iconPositionObject.value.left = Math.floor(elementX.value) + Math.floor(elementPositionX.value) -50 + 'px'
    }else{
      iconPositionObject.value.isVertical = true
      iconPositionObject.value.top = Math.floor(elementY.value) + Math.floor(elementPositionY.value) - 50 + 'px'
      iconPositionObject.value.left = Math.floor(elementX.value) + Math.floor(elementPositionX.value) - 15 + 'px'
    }
  }else{
    mark(x,y,event)
  }
}

const mark = (x = null,y = null,event = null) => {
  if((x ==  null)){
    x = step.x
  }
  if((y == null)){
    y = step.y
  }
  if(isMobile.value){
    close()
  }

  // 標記時動作
  if (((event?.button == 2) || (event == 2)) && (!land.value[x][y].check)) {
    if(land.value[x][y].display == 'F') {
      land.value[x][y].display = ''
      guessBoom.value.splice(guessBoom.value.indexOf(x + ',' + y),1)
    }else {
      guessBoom.value.push(x + ',' + y)
      land.value[x][y].display = 'F'
    }
    return false
  }
  if(land.value[x][y].display === 'F') return false
  // 爆炸時動作
  if (land.value[x][y].isBoom) {
    land.value[x][y].display = 'X'
    land.value[x][y].check = true
    endStatus.value = true
    gameStore.clearTimer()
    gameStore.getRecord()
    return false
  }
  // 計算本格和周圍數字
  count(x,y)
}
    
const count = (x,y) => {
  let num = 0
  // 本格周圍炸彈數
  if ((x - 1 >= 0) && (y - 1 >= 0)) if (land.value[x - 1][y - 1].isBoom) num++
  if (x - 1 >= 0) if (land.value[x - 1][y].isBoom) num++
  if (x - 1 >= 0 && (y + 1 < gameRule.value.col)) if (land.value[x - 1][y + 1].isBoom) num++
  if (y - 1 >= 0) if (land.value[x][y - 1].isBoom) num++
  if (y + 1 < gameRule.value.col) if (land.value[x][y + 1].isBoom) num++
  if ((x + 1 < gameRule.value.row) && (y - 1 >= 0)) if (land.value[x + 1][y - 1].isBoom) num++
  if (x + 1 < gameRule.value.row) if (land.value[x + 1][y].isBoom) num++
  if ((x + 1 < gameRule.value.row) && (y + 1 < gameRule.value.col)) if (land.value[x + 1][y + 1].isBoom) num++
  land.value[x][y].check = true

  if (!num) {
    // 本格周圍炸彈數0時擴散檢查
    if ((x - 1 >= 0) && (y - 1 >= 0)) if (!land.value[x - 1][y - 1].check) mark(x - 1,y - 1)
    if (x - 1 >= 0 ) if (!land.value[x - 1][y].check) mark(x - 1,y)
    if ((x - 1 >= 0) && (y + 1 < gameRule.value.col)) if (!land.value[x - 1][y + 1].check) mark(x - 1,y + 1)
    if (y - 1 >= 0) if (!land.value[x][y - 1].check) mark(x,y - 1)
    if (y + 1 < gameRule.value.col) if (!land.value[x][y + 1].check) mark(x,y + 1)
    if ((x + 1 < gameRule.value.row) && (y - 1 >= 0)) if (!land.value[x + 1][y - 1].check) mark(x + 1,y - 1)
    if (x + 1 < gameRule.value.row) if (!land.value[x + 1][y].check) mark(x + 1,y)
    if ((x + 1 < gameRule.value.row) && (y + 1 < gameRule.value.col)) if (!land.value[x + 1][y + 1].check) mark(x + 1,y + 1)
  } else land.value[x][y].display = num

}

const close = () => {
  mobileSelectStatus.value = false
}

watch(() => guessBoom.value ,() => {
  // 判斷勝負
  if (flagBoom.sort().toString() === guessBoom.value.sort().toString()) {
    gameStore.setRecord()
    endStatus.value = true
    isWin.value = true
    gameStore.clearTimer()
    gameStore.getRecord()
  }

},{deep: true})

watch(() => gameRule.value ,() => {
  init()
})
</script>
    
<template>
    <div class="w-[auto] md:w-[auto] h-auto flex flex-col items-center justify-start">
      <div class="w-4/5 md:w-full bg-[#FFD166] rounded-md">
        <select v-model="level" class="w-[70px] md:w-1/5 m-1 p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  ">
          <option value="easy">簡單</option>
          <option value="normal">普通</option>
        </select>
      </div>  
      <div v-if="land.length > 0" class="flex-wrap mine-flex-center">
            <div v-for="(item, index) in land[0].length" :key="index">
                <div class="w-[22px] h-[22px] md:w-[40px] md:h-[40px] border-2 border-[#E0F7FA] rounded mine-flex-center " 
                  v-for="(items, indexs) in land" :class="[land[indexs][index].check ? 'bg-[#F4A261]' : 'bg-[#228B22]']" 
                  @click="action(indexs,index)" :key="indexs">
                  {{land[indexs][index].display}}
                </div>
            </div>
        </div>
        <div class="flex-col mine-flex-center m-1">
            <div class="my-1" v-text="'現在模式: ' + (flagStatus ? '標記' : '點擊')"></div>
            <button class="text-white py-2 px-4 font-medium rounded-xl transition-all duration-300" :class="[flagStatus ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400']" @click="flagStatus = !flagStatus">切換 點擊/標記</button>
        </div>
        <div
            class="flex-col mine-flex-centerr" v-if="endStatus">
            <div class="flex-col mine-flex-center text-2xl my-1" v-text="isWin ? '贏了' : '暴了'" :class="[isWin ? 'text-green-500' : 'text-red-500']"></div><button class="bg-green-500 text-white py-2 px-4 font-medium rounded-xl transition-all duration-300 hover:bg-green-400" @click="init">再玩一次</button>
        </div>
    </div>
</template>
<script setup>
import { ref,computed,watch  } from 'vue'
import { useMobileStore } from '@/stores/index'
const mobileStore = useMobileStore()
const isMobile = computed(() => {
  return mobileStore.isMobile
})
const flagStatus = ref(false)
const endStatus = ref(false)
const isWin = ref(false)
const land = ref([])
let flagBoom = []
const guessBoom = ref([])
const level = ref('easy')

const gameRule = computed(() => {
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
        boomAmount:35,
        row:18,
        col:10,
      }
    }
  }
  let target = {}
  if(isMobile.value && level.value == 'easy'){
    target = gameDetail.easy.m
  }else if(isMobile.value && level.value == 'normal'){
    target = gameDetail.normal.m
  }else if(!isMobile.value && level.value == 'easy'){
    target = gameDetail.easy.p
  }else if(!isMobile.value && level.value == 'normal'){
    target = gameDetail.normal.p
  }

  return target
})
    
const init = () => {
  // 初始化格子和炸彈
  endStatus.value = false
  flagStatus.value = false
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
    
const action = (x,y) => {
  if(endStatus.value) return false
  // 標記時動作
  if (flagStatus.value && !land.value[x][y].check) {
    if(land.value[x][y].display === 'F') {
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
    if ((x - 1 >= 0) && (y - 1 >= 0)) if (!land.value[x - 1][y - 1].check) action(x - 1,y - 1)
    if (x - 1 >= 0 ) if (!land.value[x - 1][y].check) action(x - 1,y)
    if ((x - 1 >= 0) && (y + 1 < gameRule.value.col)) if (!land.value[x - 1][y + 1].check) action(x - 1,y + 1)
    if (y - 1 >= 0) if (!land.value[x][y - 1].check) action(x,y - 1)
    if (y + 1 < gameRule.value.col) if (!land.value[x][y + 1].check) action(x,y + 1)
    if ((x + 1 < gameRule.value.row) && (y - 1 >= 0)) if (!land.value[x + 1][y - 1].check) action(x + 1,y - 1)
    if (x + 1 < gameRule.value.row) if (!land.value[x + 1][y].check) action(x + 1,y)
    if ((x + 1 < gameRule.value.row) && (y + 1 < gameRule.value.col)) if (!land.value[x + 1][y + 1].check) action(x + 1,y + 1)
  } else land.value[x][y].display = num

}
    
watch(() => guessBoom.value ,() => {
  // 判斷勝負
  if (flagBoom.sort().toString() === guessBoom.value.sort().toString()) {
    endStatus.value = true
    isWin.value = true
  }
},{deep: true})

watch(() => gameRule.value ,() => {
  init()
})
</script>
    
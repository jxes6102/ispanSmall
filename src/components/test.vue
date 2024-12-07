<template lang='pug'>
    <!-- div(class="w-[310px] md:w-[400px] h-auto flex flex-col items-center justify-start")
      div(class="flex-wrap mine-flex-center")
        div(v-for="(item, index) in land[0].length")
          div(
            v-for="(items, indexs) in land"
            :class="[land[indexs][index].check ? 'bg-[#fcfccf]' : 'bg-[#79fcac]']"
            class="w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-[#b59ec2] mine-flex-center "
            @click="action(indexs,index)"
          ) {{land[indexs][index].display}}
      div(
        class="flex-col mine-flex-center m-1"
      )
        div(
          class="my-1"
          v-text="'現在模式: ' + (flagStatus ? '標記' : '點擊')"
        )
        button(
          :class="[flagStatus ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400']"
          class='text-white py-2 px-4 font-medium rounded-xl transition-all duration-300'
          @click="flagStatus = !flagStatus"
        ) 切換 點擊/標記
      div(
        v-if="endStatus"
        class="flex-col mine-flex-centerr"
      )
        div(
          v-text="isWin ? '贏了' : '暴了'"
          :class="[isWin ? 'text-green-500' : 'text-red-500']"
          class="flex-col mine-flex-center text-2xl my-1"
        )
        button(
          class='bg-green-500 text-white py-2 px-4 font-medium rounded-xl transition-all duration-300 hover:bg-green-400'
          @click="init"
        ) 再玩一次 -->
    </template>
    <script>
      // @ is an alias to /src
      import { ref, watch } from 'vue'
      export default {
        name: 'landmineView',
        components: {
        },
        setup() {
          const flagStatus = ref(false)
          const endStatus = ref(false)
          const isWin = ref(false)
          const land = ref([])
          let flagBoom = []
          const guessBoom = ref([])
    
          const init = () => {
            // 初始化格子和炸彈
            endStatus.value = false
            flagStatus.value = false
            land.value = []
            guessBoom.value = []
            isWin.value = false
            flagBoom = []
    
            for(let i = 0;i<10;i++) {
              land.value[i] = []
              for(let j = 0;j<8;j++) {
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
            let count = 12
            for(let i = 0;i<count;) {
              const x = Math.floor(Math.random() * 10)
              const y = Math.floor(Math.random() * 8)
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
            if (x - 1 >= 0 && y - 1 >= 0) if (land.value[x - 1][y - 1].isBoom) num++
            if (x - 1 >= 0) if (land.value[x - 1][y].isBoom) num++
            if (x - 1 >= 0 && y + 1 < 8) if (land.value[x - 1][y + 1].isBoom) num++
            if (y - 1 >= 0) if (land.value[x][y - 1].isBoom) num++
            if (y + 1 < 8) if (land.value[x][y + 1].isBoom) num++
            if (x + 1 < 10 && y - 1 >= 0) if (land.value[x + 1][y - 1].isBoom) num++
            if (x + 1 < 10) if (land.value[x + 1][y].isBoom) num++
            if (x + 1 < 10 && y + 1 < 8) if (land.value[x + 1][y + 1].isBoom) num++
            land.value[x][y].check = true
    
            if (!num) {
              // 本格周圍炸彈數0時擴散檢查
              if (x - 1 >= 0 && y - 1 >= 0) if (!land.value[x - 1][y - 1].check) action(x - 1,y - 1)
              if (x - 1 >= 0 ) if (!land.value[x - 1][y].check) action(x - 1,y)
              if (x - 1 >= 0 && y + 1 < 8) if (!land.value[x - 1][y + 1].check) action(x - 1,y + 1)
              if (y - 1 >= 0) if (!land.value[x][y - 1].check) action(x,y - 1)
              if (y + 1 < 8) if (!land.value[x][y + 1].check) action(x,y + 1)
              if (x + 1 < 10 && y - 1 >= 0) if (!land.value[x + 1][y - 1].check) action(x + 1,y - 1)
              if (x + 1 < 10) if (!land.value[x + 1][y].check) action(x + 1,y)
              if (x + 1 < 10 && y + 1 < 8) if (!land.value[x + 1][y + 1].check) action(x + 1,y + 1)
            } else land.value[x][y].display = num
          }
    
          watch(() => guessBoom.value ,() => {
            // 判斷勝負
            if (flagBoom.sort().toString() === guessBoom.value.sort().toString()) {
              endStatus.value = true
              isWin.value = true
            }
          },{deep: true})
    
          return {
            land,
            endStatus,
            flagStatus,
            isWin,
            action,
            init,
          }
        }
      }
    </script>
    
<template>
    <div v-stoprightmouse @click.self="closeIntroduction" class="w-[100vw] h-[100vh] fixed left-0 top-0 bg-[rgba(39,39,39,0.9)] flex flex-wrap items-center justify-center">
        <div class="relative w-[80vw] h-[60vw] md:w-[600px] md:h-[450px] bg-[#FAF3E0] rounded-xl flex flex-col items-center justify-center">
            <img @click="closeIntroduction" class="absolute top-0 right-0 m-1 md:m-2 h-[20px] md:h-[35px] z-[10] cursor-pointer" src="@/assets/img/error.png" alt="">
            <div @mousedown="down" @mouseup="up" class="w-full h-full overflow-hidden">
                <div class="transition-all h-full flex flex-wrap items-center justify-center"
                    :style="moveStyle">
                    <div :style="childStyle" class=" h-full flex flex-col items-center justify-center">
                        <div class="py-1 md:py-2 px-2 md:px-4 text-sm md:text-2xl font-bold">
                            踩地雷(Minesweeper)
                        </div>
                        <div class="py-1 md:py-2 px-2 md:px-4 text-xs md:text-lg">
                            一款經典的益智遊戲，其主要目的是在不點擊地雷的情況下，找出所有安全的格子，並標記所有藏有地雷的格子。
                        </div>
                    </div>
                    <div :style="childStyle" class=" h-full flex flex-col items-center justify-center">
                        <div class="w-full h-4/5 overflow-x-hidden overflow-y-auto">
                            <div class="py-[1px] md:py-1 px-2 md:px-4 text-base md:text-2xl font-bold text-center">
                                遊戲規則
                            </div>
                            <div class="w-full py-[1px] md:py-1 px-2 md:px-4 text-xs md:text-lg">
                                <span class="font-semibold text-sm md:text-xl">棋盤與地雷數量:</span>棋盤是一個矩形網格，每個格子可能藏有地雷或是安全的。地雷的數量會在遊戲開始時確定。
                            </div>
                            <div class="w-full py-[1px] md:py-1 px-2 md:px-4 text-xs md:text-lg">
                                <span class="font-semibold text-sm md:text-xl">點擊格子:</span>點擊後，安全格子會顯示一個數字，表示與該格子相鄰的八個格子中有多少個地雷。點擊後若遊戲結束，表示踩到地雷
                            </div>
                            <div class="w-full py-[1px] md:py-1 px-2 md:px-4 text-xs md:text-lg">
                                <span class="font-semibold text-sm md:text-xl">標記地雷:</span>玩家可以右鍵點擊（或使用標記功能）將格子標記為地雷，避免誤點。通常用旗子表示。
                            </div>
                            <div class="w-full py-[1px] md:py-1 px-2 md:px-4 text-xs md:text-lg">
                                <span class="font-semibold text-sm md:text-xl">連鎖反應:</span>如果點擊的格子周圍沒有地雷(顯示數字為「0」)，會自動揭開相鄰的安全格子，直到顯示非零數字的格子為止。
                            </div>
                            <div class="w-full py-[1px] md:py-1 px-2 md:px-4 text-xs md:text-lg">
                                <span class="font-semibold text-sm md:text-xl">勝利條件:</span>成功揭開所有非地雷的格子，並正確標記所有地雷，即可贏得遊戲。
                            </div>
                            <div class="w-full py-[1px] md:py-1 px-2 md:px-4 text-xs md:text-lg">
                                <span class="font-semibold text-sm md:text-xl">失敗條件:</span>點擊到地雷即遊戲結束。
                            </div>
                        </div>
                    </div>
                    <div :style="childStyle" class=" h-full flex flex-col items-center justify-center">
                        <div class="py-[1px] md:py-1 px-2 md:px-4 text-sm md:text-2xl font-bold text-center">
                            遊戲技巧
                        </div>
                        <div class="w-full py-[1px] md:py-1 px-2 md:px-4 text-xs md:text-lg">
                            <span class="font-semibold text-sm md:text-xl">邏輯推理:</span>利用格子上的數字推斷地雷的位置。例如，數字「1」表示該格子周圍只有一個地雷。
                        </div>
                        <div class="w-full py-[1px] md:py-1 px-2 md:px-4 text-xs md:text-lg">
                            <span class="font-semibold text-sm md:text-xl">標記功能:</span>當確定某個格子是地雷時，立即標記以減少風險。
                        </div>
                        <div class="w-full py-[1px] md:py-1 px-2 md:px-4 text-xs md:text-lg">
                            <span class="font-semibold text-sm md:text-xl">注意邊界:</span>靠近棋盤邊緣的格子可能會增加判斷的難度。
                        </div>
                    </div>
                </div>
                <!-- <div class="absolute w-auto bottom-0 left-1/2 -translate-x-1/2 p-1 flex flex-wrap items-center justify-center gap-[10px]">
                    <img @click="move(false)" class="h-[20px] md:h-[35px]" src="@/assets/img/subtraction.png" alt="">
                    <img @click="move(true)" class="h-[20px] md:h-[35px]" src="@/assets/img/add.png" alt="">
                </div> -->
                <div class="absolute w-auto bottom-0 left-1/2 -translate-x-1/2 p-[1px] md:p-1 flex flex-wrap items-center justify-center">
                    <template v-for="item in 3" :key="item">
                        <img @click="shift(item)" class="h-[25px] md:h-[35px] cursor-pointer" src="@/assets/img/dot.png" alt="">
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref,computed,inject } from 'vue'
const { closeIntroduction } = inject('location')

let max = 3
const count = ref(0)
const offset = computed(() => {
  return (100/max).toFixed(1)*count.value
})
const moveStyle = computed(() => {
    return {
        width: max*100 + '%',
        transform: 'translateX(-'+offset.value+'%)'
    }
})
const childStyle = ref({
    width: (100/max).toFixed(1) + '%',
})

// const move = (toRight) => {
//     if(toRight){
//         if(count.value < max - 1){
//             count.value++
//         }
//     }else {
//         if(count.value > 0){
//             count.value--
//         }
//     }
// }

const shift = (val) => {
    count.value = val - 1
}

let downX = 0
let upX = 0
const down = (event) => {
    downX = event?.clientX || 0
}

const up = (event) => {
    upX = event?.clientX || 0
    let temp = 0
    if((upX - downX) > 100){
        temp = -1
    }else if((upX - downX) < -100){
        temp = 1
    }

    if((count.value > 0) && (temp == -1)){
        count.value += temp
    }else if((count.value < max-1) && (temp == 1)){
        count.value += temp
    }

    downX = 0
    upX = 0
}

</script>

<style scoped>
::-webkit-scrollbar {
    width: 7px;
}

::-webkit-scrollbar-button {
    background: transparent;
    border-radius: 4px;
}

::-webkit-scrollbar-track-piece {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid slategrey;
}

::-webkit-scrollbar-track {
    box-shadow: transparent;
}
</style>
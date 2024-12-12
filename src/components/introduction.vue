<template>
    <div v-stoprightmouse @click.self="closeIntroduction" class="w-[100vw] h-[100vh] fixed left-0 top-0 bg-[rgba(39,39,39,0.9)] flex flex-wrap items-center justify-center">
        <div id="main" class="relative w-[80vw] h-[60vw] md:w-[600px] md:h-[450px] bg-[#FAF3E0] rounded-xl flex flex-col items-center justify-center gap-[10px]">
            <img @click="closeIntroduction" class="absolute top-0 right-0 m-2 h-[20px] md:h-[35px]" src="@/assets/img/error.png" alt="">
            <div class="w-[200px] h-[200px] overflow-hidden">
                <div class="transition-all w-[600px] h-[200px] flex flex-wrap items-center justify-center"
                    :style="moveStyle">
                    <div class="w-[200px] h-[200px] bg-[red]">1</div>
                    <div class="w-[200px] h-[200px] bg-[yellow]">2</div>
                    <div class="w-[200px] h-[200px] bg-[blue]">3</div>
                </div>
                
            </div>
            <!-- <div class="btnContainer">
                <button class="btn btn-prev">&larr;</button>
                <button class="btn btn-next">&rarr;</button>
            </div> -->
            <button @click="move(1)" class="btn btn-prev">++</button>
            <button @click="move(-1)" class="btn btn-next">--</button>
        </div>
    </div>
</template>
<script setup>
import { ref,computed,watch,inject  } from 'vue'
const { closeIntroduction } = inject('location')


let offset = 0
const move = (step) => {
    console.log(step)
    if(step == 1){
        offset += 33
        moveStyle.value.transform = 'translateX(-'+offset+'%)'
    }

    if(step == -1){
        offset -= 33
        moveStyle.value.transform = 'translateX(-'+offset+'%)'
    }
    
}

const moveStyle = ref({
    transform: 'translateX(0%)',
})
// transform: translateX(1px);

// 踩地雷（Minesweeper）是一款經典的益智遊戲，其主要目的是在不點擊地雷的情況下，找出所有安全的格子，並標記所有藏有地雷的格子。


// 遊戲規則
//     棋盤與地雷數量
//         棋盤是一個矩形網格，每個格子可能藏有地雷或是安全的。
//         地雷的數量會在遊戲開始時確定。
//     點擊格子
//         安全格子：點擊後，格子會顯示一個數字，表示與該格子相鄰的八個格子中有多少個地雷。
//         地雷格子：點擊後遊戲結束，表示踩到地雷。
//     標記地雷
//         玩家可以右鍵點擊（或使用標記功能）將格子標記為地雷，避免誤點。通常用旗子表示。
//     連鎖反應
//         如果點擊的格子周圍沒有地雷（顯示數字為「0」），會自動揭開相鄰的安全格子，直到顯示非零數字的格子為止。
//     勝利條件
//         成功揭開所有非地雷的格子，並正確標記所有地雷，即可贏得遊戲。
//     失敗條件
//         點擊到地雷即遊戲結束。
// 遊戲技巧
//     邏輯推理：利用格子上的數字推斷地雷的位置。例如，數字「1」表示該格子周圍只有一個地雷。
//     標記功能：當確定某個格子是地雷時，立即標記以減少風險。
//     注意邊界：靠近棋盤邊緣的格子可能會增加判斷的難度。
</script>
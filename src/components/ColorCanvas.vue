<script setup lang="ts">
import { useMouse } from '@vueuse/core'
import { onMounted, computed, watch, ref } from 'vue'
import { assignColor } from '../composables/pallet'
import { 
  offCanvas, 
  canvasPixelColor, 
  isActiveCanvas, 
  mousedown,
  clamp 
} from '../composables/utils'
import { colorWheel, colorCanvas, pos } from '../composables/color'
import Handle from "./Handle.vue"

const mouseOn = ref(false)

//when clicked on canvas and dragging inside canvas
function spectrumChange(e: MouseEvent, click = false) {
  if(offCanvas(e, click)) return
  if(isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, colorCanvas.value)
  if(!hex) return
  assignColor(hex.color)
  pos.value = hex.pixel
  mouseOn.value = true
}

//when clicked on canvas but dragging outside canvas
const { x, y } = useMouse()
const posPixel = computed(() => ({x: x.value, y: y.value}))
watch(posPixel, (val) => {
  const activeOutside = 
    !mouseOn.value 
    && mousedown.value 
    && !isActiveCanvas(colorCanvas.value)
  if(!activeOutside && colorCanvas.value) return
  clampPos(val)
})

function clampPos(val: {x: number, y: number}) {
  const box = colorCanvas.value?.getBoundingClientRect()
  if(!box) return
  pos.value = {
    x: clamp(val.x - box?.left, 0, box?.width),
    y: clamp(val.y - box?.top, 0, box?.height)
  }
}

onMounted(() => colorWheel({hue: 'blue'}))
</script>

<template>
  <div class="canvas">
    <Handle
      :canvas="colorCanvas" 
      :position="pos"
    />
    <canvas
      ref="colorCanvas"
      width="300"
      height="300"
      @mousedown="(e) => spectrumChange(e, true)"
      @mousemove="(e) => spectrumChange(e)"
      @mouseleave="() => mouseOn = false"
    >
    </canvas>
  </div>
</template>

<style lang="scss" scoped>
.canvas {
  position: relative;
}
</style>

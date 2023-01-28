<script setup lang="ts">
import { useMouse } from '@vueuse/core'
import { onMounted, computed, watch, ref } from 'vue'
import { assignColor } from '../composables/pallet'
import { 
  hexType,
  offCanvas, 
  pixelColor,
  canvasPixelColor,
  isActiveCanvas, 
  mousedown,
  clamp 
} from '../composables/utils'
import { colorWheel, colorCanvas, pos } from '../composables/color'
import Handle from "./Handle.vue"

const mouseOn = ref(false)

function assignHex(hex: hexType) {
  if(!hex) return
  assignColor(hex.color)
  pos.value = hex.pixel
}

//when clicked on canvas and dragging inside canvas
function spectrumChange(e: MouseEvent, click = false) {
  if(offCanvas(e, click)) return
  if(isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, colorCanvas.value)
  assignHex(hex)
  mouseOn.value = true
}

//when clicked on canvas but dragging outside canvas
const { x, y } = useMouse()
const posPixel = computed(() => ({x: x.value, y: y.value}))
watch(posPixel, (pos) => {
  const activeOutside = 
    !mouseOn.value 
    && mousedown.value 
    && !isActiveCanvas(colorCanvas.value)
  if(!activeOutside && colorCanvas.value) return
  clampPos(pos)
})

function clampPos(pos: {x: number, y: number}) {
  const box = colorCanvas.value?.getBoundingClientRect()
  if(!box) return
  const hex = pixelColor({
    x: clamp(pos.x - box.left, 0, box.width - 1),
    y: clamp(pos.y - box.top, 0, box.height - 1)
  }, colorCanvas.value)
  assignHex(hex)
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

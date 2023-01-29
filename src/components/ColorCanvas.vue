<script setup lang="ts">
import { useMouse } from '@vueuse/core'
import { onMounted, computed, watch, ref, reactive } from 'vue'
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

function updateColorCanvas(hex: hexType) {
  if(!hex) return
  assignColor(hex.color)
  pos.value = hex.pixel
}

//Update color while dragging inside canvas
function colorChange(e: MouseEvent, click = false) {
  if(click) mousedown.value = true
  if(offCanvas(e, click)) return
  if(isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, colorCanvas.value)
  updateColorCanvas(hex)
  mouseOn.value = true
}

//Update color while dragging outside canvas
const { x, y } = useMouse()
const posPixel = computed(() => ({x: x.value, y: y.value}))
watch(posPixel, (pos) => {
  const activeOutside = 
    !mouseOn.value 
    && mousedown.value 
    && !isActiveCanvas(colorCanvas.value)
  if(!activeOutside && colorCanvas.value) return
  clampedColorUpdate(pos)
})

//confines handle pos to inside the canvas element
function clampedColorUpdate(pos: {x: number, y: number}) {
  const box = colorCanvas.value?.getBoundingClientRect()
  if(!box) return
  const hex = pixelColor({
    x: clamp(pos.x - box.left, 0, box.width - 2),
    y: clamp(pos.y - box.top, 0, box.height - 2)
  }, colorCanvas.value)
  updateColorCanvas(hex)
}

const t = 100
const width = ref(t)
const height = ref(t)
const defaultHue = 'blue'

const observer = new ResizeObserver(() => {
  setCanvas()
})

function setCanvas() {
  const box = colorCanvas.value?.getBoundingClientRect()
  width.value = box?.width || t
  height.value = box?.height || t
  setTimeout(() => {
    colorWheel({hue: defaultHue})
  }, 1000)
}

onMounted(() => {
  if(!colorCanvas.value) return
  observer.observe(colorCanvas.value)
  setCanvas()
})
</script>

<template>
  <div class="wrapper">
    <Handle
      :canvas="colorCanvas" 
      :position="pos"
    />
    <canvas
      ref="colorCanvas"
      :width="width"
      :height="height"
      @mousedown="(e) => colorChange(e, true)"
      @mousemove="(e) => colorChange(e)"
      @mouseleave="() => mouseOn = false"
    >
    </canvas>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
}

canvas {
  border: 1px solid purple;
  aspect-ratio: 1/1;
  width: 40vw;
}
</style>

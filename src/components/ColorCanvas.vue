<script setup lang="ts">
import { useMouse } from '@vueuse/core'
import { onMounted, computed, watch, ref } from 'vue'
import { assignColor, color } from '../composables/pallet'
import { 
  offCanvas, 
  getPixelColor, 
  isActiveCanvas, 
  mousedown,
  clamp 
} from '../composables/utils'
import { colorWheel, colorCanvas, pos } from '../composables/color'
import Handle from "./Handle.vue"

const mouseOn = ref(false)

function spectrumChange(e: MouseEvent, click = false) {
  if(offCanvas(e, click)) return
  if(isActiveCanvas(e.target)) return
  const hex = getPixelColor(e, colorCanvas.value)
  if(!hex) return
  assignColor(hex.color)
  pos.value = hex.pixel
  mouseOn.value = true
}

const { x, y } = useMouse()
const posPixel = computed(() => ({x: x.value, y: y.value}))
watch(posPixel, (val) => {
  const activeOutside = !mouseOn.value 
    && mousedown.value 
    && !isActiveCanvas(colorCanvas.value)

  if(!activeOutside && colorCanvas.value) return
  console.log("rex1")
  //pos.value = val

  const box = colorCanvas.value?.getBoundingClientRect()
  if(!box) return
  pos.value = {
    x: clamp(val.x - box?.left, 0, box?.width),
    y: clamp(val.y - box?.top, 0, box?.height)
  }
})

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

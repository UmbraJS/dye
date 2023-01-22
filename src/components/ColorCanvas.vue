<script setup lang="ts">
import { onMounted } from 'vue'
import { assignColor } from '../composables/pallet'
import { canvasCheck, getPixelColor, activeCanvas } from '../composables/utils'
import { colorWheel, colorCanvas, pos } from '../composables/color'
import Handle from "./Handle.vue"

function spectrumChange(e: MouseEvent, click = false) {
  if(canvasCheck(e, click)) return
  if(activeCanvas.value !== e.target) return
  const hex = getPixelColor(e, colorCanvas.value)
  if(!hex) return
  assignColor(hex.color)
  pos.value = hex.pixel
}

onMounted(() => {
  colorWheel({hue: 'blue'})
})
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
    >
    </canvas>
  </div>
</template>

<style lang="scss" scoped>
.canvas {
  position: relative;
}
</style>

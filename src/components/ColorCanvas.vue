<script setup lang="ts">
import { assignColor } from '../composables/pallet'
import { 
  hexType,
  offCanvas, 
  canvasPixelColor,
  isActiveCanvas, 
  mousedown,
  outsideCanvas,
  responsiveCanvas
} from '../composables/utils'
import { fillCanvas, colorCanvas, pos } from '../composables/color'
import Handle from "./Handle.vue"

function updateCanvas(hex: hexType) {
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
  updateCanvas(hex)
  mouseOn.value = true
}

//when outside canvas
const { mouseOn } = outsideCanvas({ 
  canvas: colorCanvas, 
  updateCanvas
})

const defaultHue = 'blue'
const { width, height } = responsiveCanvas({
  canvas: colorCanvas,
  updateCanvas: () => fillCanvas({
    hue: defaultHue,
    saturation: 100,
    lightness: 100
  })
})
</script>

<template>
  <div class="wrapper">
    <Handle
      v-if="true"
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
  user-select: none;
  overflow: hidden;
}

canvas {
  border: 1px solid var(--foreground);
  border-right: none;
  aspect-ratio: 1/1;
  width: 300px;
}
</style>

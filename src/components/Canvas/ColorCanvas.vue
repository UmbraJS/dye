<script setup lang="ts">
import { ref, Ref} from 'vue'
import { 
  hexType,
  offCanvas, 
  canvasPixelColor,
  isActiveCanvas, 
  mousedown,
  outsideCanvas,
  responsiveCanvas,
} from '../../composables/canvas'
import { fillCanvas } from '../../composables/gradient'
import Handle from '../Handle.vue'

const emit = defineEmits(['change'])
const props = defineProps<{
  getRef: () => Ref<HTMLCanvasElement | null>
  setRef: (el: any) => void
  color: {
    value: string;
    name: string;
  };
}>()

let position = ref({x: 0, y: 0})

function updateCanvas(hex: hexType) {
  if(!hex) return
  emit('change', hex)
  position.value = hex.position
}

//Update color while dragging inside canvas
function colorChange(e: MouseEvent, click = false) {
  if(click) mousedown.value = true
  if(offCanvas(e, click)) return
  if(isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, props.getRef().value)
  updateCanvas(hex)
  mouseOn.value = true
}

//when outside canvas
const { mouseOn } = outsideCanvas({ 
  canvas: props.getRef(), 
  updateCanvas
})

const defaultHue = 'blue'
const { width, height } = responsiveCanvas({
  canvas: props.getRef(),
  updateCanvas: () => fillCanvas({
    hue: defaultHue,
    saturation: 100,
    lightness: 100
  }, props.getRef().value)
})
</script>

<template>
  <div class="color-canvas-wrapper">
    <slot :position="position">
      <Handle 
        :position="position" 
        :color="color"
      />
    </slot>
    <canvas
      :ref="setRef"
      class="color-canvas"
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
.color-canvas-wrapper {
  position: relative;
  user-select: none;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

canvas.color-canvas {
  aspect-ratio: 1/1;
  width: 100%;
  height: 100%;
  background-color: var(--background-20, rgb(64, 0, 0));
}
</style>

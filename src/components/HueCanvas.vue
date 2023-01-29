<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDimentions } from "../composables/useDimentions"
import { assignColor } from '../composables/pallet'
import { 
  offCanvas, 
  pixelColor, 
  canvasPixelColor, 
  isActiveCanvas,
  mousedown,
  useCanvasClamp,
  hexType,
  useResponsiveCanvas
} from '../composables/utils'
import { fillCanvas, colorCanvas, pos } from '../composables/color'
import Handle from "./Handle.vue"

type dimentionsType = {
  left: number, 
  top: number, 
  right: number, 
  bottom: number
}

type sizesType = {
  height: number, 
  width: number,
  dimentions: dimentionsType,
}

const hueCanvas = ref<HTMLCanvasElement>()
const position = ref({x: 30, y: 30})

const { mouseOn } = useCanvasClamp({ 
  canvas: hueCanvas, 
  updateCanvas
})

function addHueSpectrum(ctx: CanvasRenderingContext2D, sizes: sizesType) {
  const {height, width} = sizes
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  hueSpectrum(gradient)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function hueSpectrum(gradient: CanvasGradient) {
  gradient.addColorStop(0, 'red')
  gradient.addColorStop(0.17, 'orange')
  gradient.addColorStop(0.34, 'yellow')
  gradient.addColorStop(0.51, 'green')
  gradient.addColorStop(0.68, 'blue')
  gradient.addColorStop(0.85, 'indigo')
  gradient.addColorStop(1, 'violet')
}

function hueSlider(canvas?: HTMLCanvasElement) {
  if(!canvas) return
  const ctx = canvas.getContext('2d')
  if(ctx === null) return
  const sizes = useDimentions(canvas)
  addHueSpectrum(ctx, sizes)
}

function hueChange(e: MouseEvent, click = false) {
  if(click) mousedown.value = true
  if(offCanvas(e, click)) return
  if(isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, hueCanvas.value)
  updateCanvas(hex)
  updatePallet()
  mouseOn.value = true
}

function updateCanvas(hex: hexType) {
  if(!hex) return
  fillCanvas({hue: hex.color})
  position.value = {
    x: position.value.x, 
    y: hex.pixel.y
  }
}

function updatePallet() {
  const hex = pixelColor(pos.value, colorCanvas.value)
  if(!hex) return
  assignColor(hex.color)
}

const { width, height } = useResponsiveCanvas({
  canvas: hueCanvas,
  updateCanvas: () => hueSlider(hueCanvas.value)
})

onMounted(() => {
  hueSlider(hueCanvas.value)
  const canvasWidth = hueCanvas.value?.width
  const canvasCenter = canvasWidth ? canvasWidth / 2 : 0
  position.value = {
    x:  canvasCenter,
    y: 0
  }
})
</script>

<template>
  <div class="wrapper">
    <Handle
      :canvas="hueCanvas" 
      :position="position"
    />
    <canvas
      ref="hueCanvas"
      :width="width"
      :height="height"
      @mousedown="(e) => hueChange(e, true)"
      @mousemove="(e) => hueChange(e)"
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

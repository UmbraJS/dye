<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { getDimentions } from "../../composables/canvas"
import { 
  offCanvas, 
  canvasPixelColor, 
  isActiveCanvas,
  mousedown,
  outsideCanvas,
  hexType,
  responsiveCanvas
} from '../../composables/canvas'
import { fillCanvas } from '../../composables/gradient'

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

const emit = defineEmits(['change'])
const props = defineProps<{
  colorCanvas: () => Ref<HTMLCanvasElement | null>
}>()

const hueCanvas = ref<HTMLCanvasElement | null>(null)
const position = ref({x: 30, y: 30})

const { mouseOn } = outsideCanvas({ 
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

function hueSlider(canvas?: HTMLCanvasElement | null) {
  if(!canvas) return
  const ctx = canvas.getContext('2d')
  if(ctx === null) return
  const sizes = getDimentions(canvas)
  addHueSpectrum(ctx, sizes)
}

function hueChange(e: MouseEvent, click = false) {
  if(click) mousedown.value = true
  if(offCanvas(e, click)) return
  if(isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, hueCanvas.value)
  updateCanvas(hex)
  mouseOn.value = true
}

function updateCanvas(hex: hexType) {
  if(!hex) return
  emit('change', hex)
  fillCanvas({hue: hex.color}, props.colorCanvas().value)
  position.value = {
    x: position.value.x, 
    y: hex.pixel.y
  }
}

const { width, height } = responsiveCanvas({
  canvas: hueCanvas,
  updateCanvas: () => {
    hueSlider(hueCanvas.value)
    setCenterHandle(position.value.y)
  }
})

function setCenterHandle(y = 0) {
  const canvasWidth = hueCanvas.value?.width
  const canvasCenter = canvasWidth ? canvasWidth / 2 : 0
  position.value = {
    x:  canvasCenter,
    y
  }
}

onMounted(() => {
  hueSlider(hueCanvas.value)
  setCenterHandle()
})
</script>

<template>
  <div class="wrapper">
    <slot :position="position"/>
    <canvas
      ref="hueCanvas"
      class="hue-canvas"
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
  user-select: none;
  overflow: hidden;
}

canvas.hue-canvas {
  width: 25px;
  height: 100%;
}
</style>

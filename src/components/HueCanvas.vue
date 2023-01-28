<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDimentions } from "../composables/useDimentions"
import { assignColor } from '../composables/pallet'
import { offCanvas, pixelColor, canvasPixelColor, isActiveCanvas } from '../composables/utils'
import { colorWheel, colorCanvas, pos } from '../composables/color'

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
//let pos = ref({x: 30, y: 30})

function addHueSpectrum(ctx: CanvasRenderingContext2D, sizes: sizesType) {
  const {height, width} = sizes
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, 'red')
  gradient.addColorStop(0.17, 'orange')
  gradient.addColorStop(0.34, 'yellow')
  gradient.addColorStop(0.51, 'green')
  gradient.addColorStop(0.68, 'blue')
  gradient.addColorStop(0.85, 'indigo')
  gradient.addColorStop(1, 'violet')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function hueSlider(canvas?: HTMLCanvasElement) {
  if(!canvas) return
  const ctx = canvas.getContext('2d')
  if(ctx === null) return

  const sizes = useDimentions(canvas)
  addHueSpectrum(ctx, sizes)
}

function hueChange(e: MouseEvent, click = false) {
  if(offCanvas(e, click)) return
  if(isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, hueCanvas.value)
  if(!hex) return
  colorWheel({hue: hex.color})
  updateFromHue()
}

function updateFromHue() {
  const hex2 = pixelColor(pos.value, colorCanvas.value)
  if(!hex2) return
  assignColor(hex2.color)
}

onMounted(() => {
  hueSlider(hueCanvas.value)
})
</script>

<template>
  <div class="canvas">
    <canvas
      ref="hueCanvas"
      width="50" 
      height="300"
      @mousedown="(e) => hueChange(e, true)"
      @mousemove="(e) => hueChange(e)"
    >
    </canvas>
  </div>
</template>

<style lang="scss" scoped>
.canvas {
  position: relative;
}
</style>

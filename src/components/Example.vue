<script setup lang="ts">
import { colorBus } from "../myriad";
import { ref, reactive, onMounted, watch } from 'vue'
import { useColorName } from "../composables/useColorName"
//import { eyeDropper } from "../composables/eyedropper"
import { useMousePressed } from '@vueuse/core'

const colorCanvas = ref<HTMLCanvasElement>()
const hueCanvas = ref<HTMLCanvasElement>()
const pallet = ref<HTMLCanvasElement>()

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

function addHueGradient(props: {ctx: CanvasRenderingContext2D, hue: string, sizes: sizesType}) {
  const {width, dimentions} = props.sizes
  const gradient2 = props.ctx.createLinearGradient(0, 0, width, 0)
  gradient2.addColorStop(0, 'transparent')
  gradient2.addColorStop(1, props.hue)
  
  props.ctx.fillStyle = gradient2
  fillRect(props.ctx, dimentions)
}

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

function addValueGradient(ctx: CanvasRenderingContext2D, sizes: sizesType) {
  const {height, dimentions} = sizes
  const gradient3 = ctx.createLinearGradient(0, 0, 0, height)
  gradient3.addColorStop(0, 'transparent')
  gradient3.addColorStop(1, 'black')

  ctx.fillStyle = gradient3
  fillRect(ctx, dimentions)
}

function addLightValue(ctx: CanvasRenderingContext2D, sizes: sizesType) {
  const {dimentions} = sizes
  ctx.fillStyle = "white"
  fillRect(ctx, dimentions)
}

function useDimentions(canvas: HTMLCanvasElement, frame = {top: 0, bottom: 0}) {
  const height = canvas.getBoundingClientRect().height
  const width = canvas.getBoundingClientRect().width
  return { height, width, 
    dimentions: {
      left: 0, 
      top: 0 + frame.top, 
      right: width, 
      bottom: height - frame.bottom
     }
  }
}

function fillRect(ctx: CanvasRenderingContext2D, dimentions: dimentionsType) {
  ctx.fillRect(
    dimentions.left, 
    dimentions.top, 
    dimentions.right, 
    dimentions.bottom
  )
}

type colorWheelType = { 
  hue?: string, 
  frame?: {top: number, bottom: number}
}

function colorWheel(canvas?: HTMLCanvasElement, props?: colorWheelType) {
  if(!canvas) return
  const {hue = 'red', frame = {top: 0, bottom: 0}} = props || {}

  const ctx = canvas.getContext('2d')
  if(ctx === null) return
  
  const sizes = useDimentions(canvas, frame)
  addLightValue(ctx, sizes)
  addHueGradient({ctx, hue, sizes})
  addValueGradient(ctx, sizes)
}

function hueSlider(canvas?: HTMLCanvasElement) {
  if(!canvas) return
  const ctx = canvas.getContext('2d')
  if(ctx === null) return

  const sizes = useDimentions(canvas)
  addHueSpectrum(ctx, sizes)
}

const color = reactive({
  name: 'red',
  hex: '#ff0000',
})

function assignColor(hex: string) {
  const get = useColorName(hex)
  const { name, value } = get()
  color.name = name
  color.hex = value
  colorBus({
    background: color.hex,
    foreground: '#ff5555',
  }, pallet.value)
}

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

function rgbToHex(orig: any) {
  var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    hex = rgb ?
    (rgb[1] | 1 << 8).toString(16).slice(1) +
    (rgb[2] | 1 << 8).toString(16).slice(1) +
    (rgb[3] | 1 << 8).toString(16).slice(1) : orig;
  return "#" + hex;
}

function getPixelColor(evt: MouseEvent, canvas?: HTMLCanvasElement) {
  if(!canvas) return
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if(ctx === null) return
  const {x, y} = getMousePos(canvas, evt)
  const pixel = ctx.getImageData(x, y, 1, 1)
  const data = pixel.data
  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`
  return rgbToHex(rgba)
}

let mousedown = ref(false)
let activeCanvas = ref<EventTarget | null>(null)

const { pressed } = useMousePressed()
watch(pressed, (value: boolean) => {
  if(value) return
  activeCanvas.value = null
  mousedown.value = value
})

function canvasCheck(e: MouseEvent, click: boolean) {
  const returnCondition = !mousedown.value && !click
  if(!mousedown.value) activeCanvas.value = e.target
  if(activeCanvas.value === null) activeCanvas.value = e.target
  return returnCondition
}

function spectrumChange(e: MouseEvent, click = false) {
  if(canvasCheck(e, click)) return
  if(activeCanvas.value !== e.target) return
  const hex = getPixelColor(e, colorCanvas.value)
  hex && assignColor(hex)
}

function hueChange(e: MouseEvent, click = false) {
  if(canvasCheck(e, click)) return
  if(activeCanvas.value !== e.target) return
  const hex = getPixelColor(e, hueCanvas.value)
  hex && colorWheel(colorCanvas.value, {hue: hex})
}

onMounted(() => {
  colorWheel(colorCanvas.value, {hue: 'blue'})
  hueSlider(hueCanvas.value)
  assignColor('#f1c1d1')
})
</script>

<template>
<div class="color" ref="pallet">
  <p>{{ color.hex }}</p>
  <h3>{{ color.name }}</h3>
</div>
<div 
  class="canvas" 
  @mousedown="() => mousedown = true"
>
  <div class="colorCanvas">
    <canvas
      ref="colorCanvas"
      width="300"
      height="300"
      @mousedown="(e) => spectrumChange(e, true)"
      @mousemove="(e) => spectrumChange(e)"
    >
    </canvas>
  </div>

  <div class="hueCanvas">
    <canvas
      ref="hueCanvas"
      width="50" 
      height="300"
      @mousedown="(e) => hueChange(e, true)"
      @mousemove="(e) => hueChange(e)"
    >
    </canvas>
  </div>
</div>
</template>

<style lang="scss">
.color {
  background: v-bind("color.hex");
  color: var(--foreground);
  width: 350px;
  height: 100px;
  padding: 15px;
  user-select: none;
  * {
    margin: 0px;
    line-height: 1;
  }
}

.canvas {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center; 
  width: max-content;
}
</style>

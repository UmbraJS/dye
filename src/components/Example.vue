<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

import { colorBus } from "../myriad";
import { getReadable, makeReadable } from '../myriad/engine/color/primitives/color'
import { Myriad } from '../myriad/engine/color/config'

import { useColorName } from "../composables/useColorName"
import { eyeDropper } from "../composables/eyedropper"

function linkColor(m: Myriad) {
  if(!m.foreground) return "black"
  const blue = '#6b6bff'
  const linkColor = makeReadable(blue, m, 7)
  return linkColor
}

function imgColor(m: Myriad) {
  if(!m.foreground) return "black"
  return getReadable(m.foreground, 'black', 19)
}

colorBus({
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff'],
  custom: {
    link: linkColor,
    imgColor: imgColor,
    success: '#00ff00',
    error: '#ff0000',
  }
})

const colorCanvas = ref<HTMLCanvasElement>()
const hueCanvas = ref<HTMLCanvasElement>()

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

function colorWheel(canvas: HTMLCanvasElement, props?: colorWheelType) {
  const {hue = 'red', frame = {top: 0, bottom: 0}} = props || {}

  const ctx = canvas.getContext('2d')
  if(ctx === null) return
  
  const sizes = useDimentions(canvas, frame)
  addLightValue(ctx, sizes)
  addHueGradient({ctx, hue, sizes})
  addValueGradient(ctx, sizes)
}

function hueSlider(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if(ctx === null) return

  const sizes = useDimentions(canvas)
  addHueSpectrum(ctx, sizes)
}

const color = reactive({
  name: 'red',
  value: '#ff0000',
})

function assignColor(hex: string) {
  const get = useColorName(hex)
  const { name, value } = get()
  color.name = name
  color.value = value
}

onMounted(() => {
  if(!colorCanvas.value) return
  colorWheel(colorCanvas.value, {hue: 'blue'})

  if(!hueCanvas.value) return
  hueSlider(hueCanvas.value)

  assignColor('#f1c1d1')
})

</script>

<template>
<div class="color">
  <h2>{{ color.name }}</h2>
  <p>{{ color.value }}</p>
</div>
<div class="canvas">
  <canvas 
    ref="colorCanvas"
    width="300" 
    height="300"
    @click="() => eyeDropper((hex) => assignColor(hex))"
    >
  </canvas>
  <canvas
    ref="hueCanvas"
    width="50" 
    height="300">
  </canvas>
</div>
</template>

<style lang="scss">
.color {
  background: var(--link);
  width: 350px;
  height: 50px;
}

.canvas {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: max-content;
}
</style>


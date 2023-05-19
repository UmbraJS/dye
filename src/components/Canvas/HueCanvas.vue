<script setup lang="ts">
import tinycolor from "tinycolor2"
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
import Handle from '../Handle.vue'

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
  color: {
    value: string;
    name: string;
  };
}>()

const hueCanvas = ref<HTMLCanvasElement | null>(null)
const position = ref({x: 30, y: 70})

const { mouseOn } = outsideCanvas({ 
  canvas: hueCanvas, 
  updateCanvas
})

function addHueSpectrum(ctx: CanvasRenderingContext2D, sizes: sizesType) {
  const { height, width } = sizes
  ctx.fillStyle = hueSpectrum(ctx, height)
  ctx.fillRect(0, 0, width, height)
}

function hueSpectrum(ctx: CanvasRenderingContext2D, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  for (var hue = 0; hue <= 360; hue++) {
    var hslColor = "hsl(" + hue + ", 100%, 50%)";
    gradient.addColorStop(hue / 360, hslColor);
  }
  return gradient
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
    y: hex.position.y
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

function huePercent(hue: number, height?: number) {
  if(!height) return 0
  const percent = (hue / 360) * 100
  return height * (percent / 100)
}

onMounted(() => {
  hueSlider(hueCanvas.value)
  setCenterHandle()

  var color = tinycolor(props.color.value);
  const hsl = color.toHsl();

  updateCanvas({
    color: props.color.value,
    position: {
      x: 0,
      y: huePercent(hsl.h, height.value)
    }
  })
})
</script>

<template>
  <div class="hue-canvas-wrapper">
    <slot :position="position">
      <Handle 
        :position="position" 
        :color="color"
      />
    </slot>
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
.hue-canvas-wrapper {
  position: relative;
  user-select: none;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

canvas.hue-canvas {
  width: 25px;
  height: 100%;
  overflow: hidden;
  background-color: var(--background-20, rgb(64, 0, 0));
}
</style>

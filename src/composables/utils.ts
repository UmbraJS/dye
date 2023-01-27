import { ref, watch } from 'vue'
import { useMousePressed } from '@vueuse/core'

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

export function getPixelColor(evt: MouseEvent, canvas?: HTMLCanvasElement, p?: {x: number, y: number}) {
  if(!canvas) return
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if(ctx === null) return
  const {x, y} = p ? p : getMousePos(canvas, evt)
  const pixel = ctx.getImageData(x, y, 1, 1)
  const data = pixel.data
  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`
  return {color: rgbToHex(rgba), pixel: {x, y}}
}

export function offCanvas(e: MouseEvent, click: boolean) {
  const returnCondition = !mousedown.value && !click
  if(!mousedown.value) activeCanvas.value = e.target
  if(activeCanvas.value === null) activeCanvas.value = e.target
  return returnCondition
}

export function isActiveCanvas(target?: EventTarget | HTMLCanvasElement | null) {
  return activeCanvas.value !== target
}

export let mousedown = ref(false)
let activeCanvas = ref<EventTarget | null>(null)

const { pressed } = useMousePressed()
watch(pressed, (value: boolean) => {
  if(value) return
  activeCanvas.value = null
  mousedown.value = value
})

export function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}

import { useMousePressed, useMouse } from '@vueuse/core'
import { computed, watch, ref, Ref, onMounted } from 'vue'

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

export type hexType = {
  color: string,
  pixel: {x: number, y: number}
} | undefined

export function canvasPixelColor(evt: MouseEvent, canvas?: HTMLCanvasElement | null) {
  if(!canvas) return
  return pixelColor(getMousePos(canvas, evt), canvas)
}

export function pixelColor(pos: {x: number, y: number}, canvas?: HTMLCanvasElement | null): hexType {
  if(!canvas) return
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if(ctx === null) return
  const pixel = ctx.getImageData(pos.x, pos.y, 1, 1)
  const data = pixel.data
  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`
  return {color: rgbToHex(rgba), pixel: pos}
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

type RefCanvas = Ref<HTMLCanvasElement | undefined | null>
type posFunc = (pos: hexType) => void

export function outsideCanvas(props: {canvas: RefCanvas, updateCanvas: posFunc}) {
  const { canvas, updateCanvas } = props
  const mouseOn = ref(false)

  function condition() {
    //activeOutside
    return !mouseOn.value 
    && mousedown.value 
    && !isActiveCanvas(canvas.value)
  }

  //Update color while dragging outside canvas
  const { x, y } = useMouse()
  const posPixel = computed(() => ({x: x.value, y: y.value}))
  watch(posPixel, (pos) => {
    if(!condition() && canvas.value) return
    updateCanvas(clampedPos(pos))
  })

  //confines handle pos to inside the canvas element
  function clampedPos(pos: {x: number, y: number}) {
    const box = canvas.value?.getBoundingClientRect()
    if(!box) return
    return pixelColor({
      x: clamp(pos.x - (box.left + window.scrollX), 0, box.width - 2),
      y: clamp(pos.y - (box.top + window.scrollY), 0, box.height - 2)
    }, canvas.value)
  }

  return { mouseOn, clampedPos }
}


export function responsiveCanvas(props: {canvas: RefCanvas, updateCanvas: () => void, updateDelay?: number}) {
  const { canvas, updateCanvas, updateDelay } = props
  const size = 100
  const width = ref(size)
  const height = ref(size)

  const observer = new ResizeObserver(() => setCanvas())

  function setCanvas() {
    console.log('setCanvas');
    
    const box = canvas.value?.getBoundingClientRect()
    width.value = box?.width || size
    height.value = box?.height || size
    setTimeout(() => {
      updateCanvas()
    }, updateDelay)
  }

  onMounted(() => {
    if(!canvas.value) return
    observer.observe(canvas.value)
    setCanvas()
  })

  return { width, height }
}


import { ref } from "vue"
import { useDimentions } from "../composables/useDimentions"

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

type colorWheelType = { 
  hue?: string, 
  saturation? : number,
  lightness?: number
}

//globals
export const colorCanvas = ref<HTMLCanvasElement>()
export let pos = ref({x: 0, y: 0})

//canvas functions
function addHueGradient(props: {ctx: CanvasRenderingContext2D, hue: string, sizes: sizesType}) {
  const {width, dimentions} = props.sizes
  const gradient2 = props.ctx.createLinearGradient(0, 0, width, 0)
  gradient2.addColorStop(0, 'transparent')
  gradient2.addColorStop(1, props.hue)
  
  props.ctx.fillStyle = gradient2
  fillRect(props.ctx, dimentions)
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

//shared canvas functions
export function fillRect(ctx: CanvasRenderingContext2D, dimentions: dimentionsType) {
  ctx.fillRect(
    dimentions.left, 
    dimentions.top, 
    dimentions.right, 
    dimentions.bottom
  )
}

//composition
export function fillCanvas(props?: colorWheelType) {
  if(!colorCanvas.value) return
  const {hue = 'red', saturation = 100, lightness = 100} = props || {}

  const ctx = colorCanvas.value.getContext('2d')
  if(ctx === null) return
  
  const sizes = useDimentions(colorCanvas.value, {
    height: lightness,
    width: saturation
  })

  addLightValue(ctx, sizes)
  addHueGradient({ctx, hue, sizes})
  addValueGradient(ctx, sizes)
}

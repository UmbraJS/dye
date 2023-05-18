import { getDimentions } from "./canvas"

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

//canvas functions
export function addHueGradient(props: {ctx: CanvasRenderingContext2D, hue: string, sizes: sizesType}) {
  const {width, dimentions} = props.sizes
  const gradient2 = props.ctx.createLinearGradient(0, 0, width, 0)
  gradient2.addColorStop(0, 'transparent')
  gradient2.addColorStop(1, props.hue)
  
  props.ctx.fillStyle = gradient2
  fillRect(props.ctx, dimentions)
}

export function addValueGradient(ctx: CanvasRenderingContext2D, sizes: sizesType) {
  const {height, dimentions} = sizes
  const gradient3 = ctx.createLinearGradient(0, 0, 0, height)
  gradient3.addColorStop(0, 'transparent')
  gradient3.addColorStop(1, 'black')

  ctx.fillStyle = gradient3
  fillRect(ctx, dimentions)
}

export function addLightValue(ctx: CanvasRenderingContext2D, sizes: sizesType) {
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
export function fillCanvas(props?: colorWheelType, canvas?: HTMLCanvasElement | null) {
  if(!canvas) return
  const {hue = 'red', saturation = 100, lightness = 100} = props || {}

  const ctx = canvas.getContext('2d')
  if(ctx === null) return
  
  const sizes = getDimentions(canvas, {
    height: lightness,
    width: saturation
  })

  addLightValue(ctx, sizes)
  addHueGradient({ctx, hue, sizes})
  addValueGradient(ctx, sizes)
}
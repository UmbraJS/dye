import { ref, reactive } from 'vue'
import { colorName } from "./colorName"

//globals
export const colorCanvas = ref<HTMLCanvasElement | null>(null)
export let pos = ref({x: 0, y: 0})

export function useCanvas() {
  return { colorCanvas, pos }
}

//pallet store
export const pallet = ref<HTMLCanvasElement>()
export const color = reactive({
  name: 'red',
  hex: '#ff0000',
})

export function palletElement(el: any) {
  pallet.value = el
}

export function assignColor(hex: string) {
  const get = colorName(hex)
  const { name, value } = get()
  color.name = name
  color.hex = value
}
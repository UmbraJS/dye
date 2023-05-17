import { ref, reactive } from 'vue'
import { colorName } from "./colorName"
import { hexType } from '../composables/utils/canvas'

//globals
export const colorCanvas = ref<HTMLCanvasElement | null>(null)
export let pos = ref({x: 0, y: 0})

export function useCanvas() {
  return { colorCanvas, pos }
}

//pallet store
export const color = reactive({
  name: 'red',
  hex: '#ff0000',
})

export function assignColor(hex?: hexType) {
  if (!hex) return
  const get = colorName(hex.color)
  const { name, value } = get()
  color.name = name
  color.hex = value
}
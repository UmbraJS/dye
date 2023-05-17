import { ref, reactive } from 'vue'
import { colorName } from "./colorName"

//pallet store
const pallet = ref<HTMLCanvasElement>()
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
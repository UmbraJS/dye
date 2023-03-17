import { colorBus } from "../myriad";
import { ref, reactive } from 'vue'
import { useColorName } from "./useColorName"

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
  const get = useColorName(hex)
  const { name, value } = get()
  color.name = name
  color.hex = value
  colorBus({
    background: color.hex,
    foreground: '#ff5555',
  }, pallet.value)
}
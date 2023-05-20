<script setup lang="ts">
import tinycolor from "tinycolor2"
import { ref } from 'vue'
import { colorName } from "../composables/colorName"
import { hexType } from '../composables/canvas'
import Pallet from "./Pallet.vue";
import ColorCanvas from "./Canvas/ColorCanvas.vue";
import HueCanvas from "./Canvas/HueCanvas.vue";

const emit = defineEmits(['change'])
const props = defineProps<{
  default: string;
}>()

const pallet = ref<HTMLElement | null>(null)
const colorCanvas = ref<HTMLCanvasElement | null>(null)

function getRef() {
  return colorCanvas
}

function setRef(el: HTMLCanvasElement) {
  colorCanvas.value = el
}

const hslRange = ref({ h: 0, s: 0, l: 0 })

const color = ref({
  name: 'red',
  value: props.default,
})

function handleChange(hex?: hexType) {
  if (!hex) return
  const get = colorName(hex.color)
  const { name, value } = get()

  color.value = { name, value }

  emit('change', {
    name,
    value: tinycolor(value),
    position: hex.position
  })
}
</script>

<template>
  <div class="dyepicker-wrapper">
    <div ref="pallet" class="pallet-wrapper">
      <slot :color="color" >
        <Pallet :color="color" />
      </slot>
    </div>
    <ColorCanvas
      @change="handleChange"
      :getRef="getRef"
      :setRef="setRef"
      :color="color"
    />
    <HueCanvas
      @change="handleChange"
      :colorCanvas="getRef"
      :color="color"
    />
  </div>
</template>

<style lang="scss" scoped>
.dyepicker-wrapper {
  display: grid;
  //width: max-content;
  height: 400px;
  width: auto;

  border-radius: var(--radius);
  overflow: hidden;

  .pallet-wrapper {
    grid-column: span 2;
  }
}
</style>

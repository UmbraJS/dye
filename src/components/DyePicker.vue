<script setup lang="ts">
import { ref } from 'vue'
import { colorName } from "../composables/colorName"
import { hexType } from '../composables/canvas'
import Pallet from "./Pallet.vue";
import ColorCanvas from "./Canvas/ColorCanvas.vue";
import HueCanvas from "./Canvas/HueCanvas.vue";

const emit = defineEmits(['change'])

const colorCanvas = ref<HTMLCanvasElement | null>(null)

function getRef() {
  return colorCanvas
}

function setRef(el: HTMLCanvasElement) {
  colorCanvas.value = el
}

const color = ref({
  name: 'red',
  value: '#ff0000',
})

function handleChange(hex?: hexType) {
  if (!hex) return
  const get = colorName(hex.color)
  const { name, value } = get()
  const output = {
    name,
    value,
    position: hex.position
  }

  color.value = output
  emit('change', output)
}
</script>

<template>
  <div class="dyepicker-wrapper">
    <slot :color="color" >
      <Pallet :color="color" />
    </slot>
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
  width: max-content;
  height: 400px;

  .pallet {
    grid-column: span 2;
  }
}
</style>

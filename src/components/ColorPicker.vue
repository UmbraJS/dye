<script setup lang="ts">
import { ref } from 'vue'
import { colorName } from "../composables/colorName"
import { hexType } from '../composables/canvas'
import Pallet from "./Pallet.vue";
import ColorCanvas from "./Canvas/ColorCanvas.vue";
import HueCanvas from "./Canvas/HueCanvas.vue";
import Handle from "./Handle.vue"

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
    position: hex.pixel
  }

  color.value = output
  emit('change', output)
}
</script>

<template>
  <div class="wrapper">
    <slot :color="color" >
      <Pallet :color="color" />
    </slot>
    <ColorCanvas 
      v-slot="slotProps" 
      @change="handleChange"
      :getRef="getRef"
      :setRef="setRef"
    >
      <Handle
        :position="slotProps.position" 
        :color="color"
      />
    </ColorCanvas>
    <HueCanvas 
      v-slot="slotProps"
      @change="handleChange"
      :colorCanvas="getRef"
    >
      <Handle
        :position="slotProps.position" 
        :color="color"
      />
    </HueCanvas>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  width: max-content;
  .pallet {
    grid-column: span 2;
  }
}
</style>

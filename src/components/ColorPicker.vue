<script setup lang="ts">
import { color, assignColor } from '../composables/color'
import { hexType } from '../composables/utils/canvas'
import Pallet from "./Pallet.vue";
import ColorCanvas from "./Canvas/ColorCanvas.vue";
import HueCanvas from "./Canvas/HueCanvas.vue";
import Handle from "./Handle.vue"

function handleChange(hex?: hexType) {
  assignColor(hex)
}

</script>

<template>
  <div class="wrapper">
    <Pallet/>
    <ColorCanvas v-slot="slotProps" @change="handleChange">
      <Handle 
        :position="slotProps.position" 
        :color="color"
      />
    </ColorCanvas>
    <HueCanvas v-slot="slotProps" @change="handleChange">
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

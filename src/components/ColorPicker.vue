<script setup lang="ts">
import { color } from '../composables/pallet'
import Pallet from "./Pallet.vue";
import ColorCanvas from "./Canvas/ColorCanvas.vue";
import HueCanvas from "./Canvas/HueCanvas.vue";
import Handle from "./Handle.vue"
</script>

<template>
  <div class="wrapper">
    <Pallet/>
    <ColorCanvas v-slot="slotProps">
      <Handle 
        :position="slotProps.position" 
        :color="color"
      />
    </ColorCanvas>
    <HueCanvas v-slot="slotProps">
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

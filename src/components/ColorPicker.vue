<script setup lang="ts">
import Pallet from "./Pallet.vue";
import ColorCanvas from "./Canvas/ColorCanvas.vue";
import HueCanvas from "./Canvas/HueCanvas.vue";
</script>

<template>
  <div class="wrapper">
    <slot>
      <Pallet/>
      <ColorCanvas />
      <HueCanvas />
    </slot>
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

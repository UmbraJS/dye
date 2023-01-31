<script setup lang="ts">
import Pallet from "./Pallet.vue";
import ColorCanvas from "./ColorCanvas.vue";
import HueCanvas from "./HueCanvas.vue";
</script>

<template>
  <div class="wrapper">
    <Pallet/>
    <ColorCanvas />
    <HueCanvas />
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

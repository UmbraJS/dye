<script setup lang="ts">
import { onMounted } from 'vue'
import Pallet from "./Pallet.vue";
import ColorCanvas from "./ColorCanvas.vue";
import HueCanvas from "./HueCanvas.vue";
import { assignColor, color, } from '../composables/pallet'

onMounted(() => assignColor('#f1c1d1'))
</script>

<template>
  <div class="wrsapper">
    <Pallet/>
    <ColorCanvas />
    <HueCanvas />
  </div>
</template>

<style lang="scss" scoped>
.color {
  background: v-bind("color.hex");
  color: var(--foreground);
  width: 350px;
  height: 100px;
  padding: 15px;
  user-select: none;
  * {
    margin: 0px;
    line-height: 1;
  }
}

.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center; 
  width: max-content;
}

.canvas {
  position: relative;
}

</style>

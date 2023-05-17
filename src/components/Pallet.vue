<script setup lang="ts">
import { myriad } from "@myriadjs/core"
import { ref, watch } from 'vue'
import { color } from '../composables/color'
const pallet =  ref<HTMLElement>()

watch(color, (color) => {
  myriad({
    background: color.hex,
  }).attach(pallet.value)
})
</script>

<template>
  <div class="pallet" ref="pallet">
    <p>{{ color.hex }}</p>
    <h3>{{ color.name }}</h3>
  </div>
</template>

<style lang="scss" scoped>
.pallet {
  background: v-bind("color.hex");
  color: var(--foreground);
  height: 100px;
  padding: 15px;
  user-select: none;
  * {
    margin: 0px;
    line-height: 1;
  }
}
</style>


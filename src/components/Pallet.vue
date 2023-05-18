<script setup lang="ts">
import { myriad } from "@myriadjs/core"
import { ref, watch } from 'vue'

const props = defineProps<{
  color: {
    name: string
    value: string
  }
}>()

const pallet =  ref<HTMLElement>()

watch(() => props.color, (color) => {
  myriad({
    background: color.value,
  }).attach(pallet.value)
})
</script>

<template>
  <div class="pallet" ref="pallet">
    <p>{{ color.value }}</p>
    <h3>{{ color.name }}</h3>
  </div>
</template>

<style lang="scss" scoped>
.pallet {
  background: v-bind("color.value");
  color: var(--foreground);
  height: 75px;
  padding: 15px;
  user-select: none;
  * {
    margin: 0px;
    line-height: 1;
  }
}
</style>


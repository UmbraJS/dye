<script setup lang="ts">
import { onMounted } from 'vue'
import { assignColor, color, palletElement } from '../composables/pallet'
onMounted(() => assignColor('#f1c1d1'))
</script>

<template>
<div class="pallet" :ref="palletElement">
  <p>{{ color.hex }}</p>
  <h3>{{ color.name }}</h3>
</div>
</template>

<style lang="scss" scoped>
.pallet {
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

</style>


<script setup lang="ts">
import ColorPicker from './components/ColorPicker.vue'
</script>

<template>
  <div class="pickers">
    <ColorPicker />
    <ColorPicker />
    <ColorPicker />
  </div>
</template>

<style lang="scss">
.pickers {
  display: flex;
  gap: 15px;
  padding: 15px;
}
</style>

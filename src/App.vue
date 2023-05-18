<script setup lang="ts">
import DyePicker from './components/DyePicker.vue'
</script>

<template>
  <div class="pickers">
    <DyePicker />
    <DyePicker />
    <DyePicker />
  </div>
</template>

<style lang="scss">
.pickers {
  display: flex;
  gap: 15px;
  padding: 15px;
}
</style>

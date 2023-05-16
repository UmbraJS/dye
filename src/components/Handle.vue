<script setup lang="ts">
defineProps<{
  position: {
    x: number;
    y: number;
  }
}>()
</script>

<template>
  <div class="handle"><slot/></div>
</template>

<style lang="scss" scoped>
.handle {
  position: absolute;
  --size: 20px;
  width: var(--size);
  aspect-ratio: 1/1;
  background-color: red;
  border-radius: 50%;
  border: solid 3px blue;
  pointer-events: none;
  top: calc(v-bind("position.y") * 1px - var(--size) / 2);
  left: calc(v-bind("position.x") * 1px - var(--size) / 2);
}
</style>

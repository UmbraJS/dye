<script setup lang="ts">
interface Props {
  canvas: HTMLCanvasElement | undefined,
  position: {
    x: number;
    y: number;
  }
}

const props = defineProps<Props>()
</script>

<template>
  <div class="handle"></div>
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
  //transition: .2s;
}
</style>

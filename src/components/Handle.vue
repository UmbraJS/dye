<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useMousePressed } from '@vueuse/core'

interface Props {
  canvas: HTMLCanvasElement | undefined,
  position: {
    x: number;
    y: number;
  }
}

const props = defineProps<Props>()
const handle = ref(false)

onMounted(() => {
  if(!props.canvas) return
  //const sizes = props.canvas.getBoundingClientRect()
})

const { pressed } = useMousePressed()
watch(pressed, (value: boolean) => {
  if(value) return
  handle.value = false
})
</script>

<template>
  <div
    class="handle"
    :class="{click: handle}"
    @mousedown="handle = true"
  ></div>
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
  &.click {
    pointer-events: none;
    transform: scale(1.2);
  }
}
</style>

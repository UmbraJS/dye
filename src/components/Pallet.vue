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

const copied = ref(false)

function handleClick() {
  if(!navigator?.clipboard) return
  navigator.clipboard.writeText(props.color.value)
  copied.value = true
  setTimeout(() => copied.value = false, 400)
}
</script>

<template>
  <div 
    ref="pallet" 
    class="pallet"
    :class="{copied}"
    @click="handleClick"
  >
    <div class="content">
      <p>{{ color.value }}</p>
      <p class="h3 name">{{ color.name }}</p>
    </div>

    <div class="shade" style="background: var(--background);"></div>
    <div class="shade" style="background: var(--background-10);"></div>
    <div class="shade" style="background: var(--background-20);"></div>

    <div v-if="true" class="cap">
      <h3>{{ copied ? "copied" : "copy" }}</h3>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pallet {
  position: relative;
  display: grid;
  grid-template-columns: 12fr 1fr 1fr;
  justify-content: center;
  align-items: center;

  background: var(--background);
  color: var(--foreground);
  min-height: 75px;
  user-select: none;
  cursor: pointer;
  * {
    margin: 0px;
    line-height: 1;
  }
}

.content {
  position: absolute;
  overflow: hidden;
  max-width: 80%;

  display: flex;
  flex-direction: column;
  //gap: var(--space-xs);
  padding: var(--space-s);
  p.name {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 1.2;
  }
}

.shade {
  height: 100%;
}

.pallet.copied .cap {
  animation: flash .4s ease-in-out;
}

@keyframes flash {
  0% {
    background-color: var(--foreground-20);
  }
  100% {
    background-color: var(--background-10);
  }
}

.cap {
  border-radius: var(--radius);
  position: absolute;
  right: var(--space-s);
  background-color: var(--background-20);
  padding: var(--space-s);

  clip-path: circle(0%);
  transition: .2s;
}

.pallet:hover .cap {
  clip-path: circle(100%);
}
</style>


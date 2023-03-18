<script setup lang="ts">
import ColorPicker from './components/ColorPicker.vue'

import { 
  myriad, 
  getReadable, 
  makeReadable, 
  Myriad 
} from "@myriadjs/core";

function linkColor(m: Myriad) {
  if(!m.foreground) return "black"
  const blue = '#6b6bff'
  const linkColor = makeReadable(blue, m, 7)
  return linkColor
}

function imgColor(m: Myriad) {
  if(!m.foreground) return "black"
  return getReadable(m.foreground, 'black', 19)
}

myriad({
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff'],
  custom: {
    link: linkColor,
    imgColor: imgColor,
    success: '#00ff00',
    error: '#ff0000',
  }
})
</script>

<template>
  <ColorPicker />
</template>


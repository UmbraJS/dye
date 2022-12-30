<script setup lang="ts">
import { colorBus } from "../myriad";
import { getReadable, makeReadable } from '../myriad/engine/color/primitives/color'
import { Myriad } from '../myriad/engine/color/config'

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

colorBus({
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
<h1>some shit</h1>
</template>


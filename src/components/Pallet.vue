<script setup lang="ts">
import { color, palletElement } from '../composables/pallet'
</script>

<template>
<div class="color" :ref="palletElement">
  <p>{{ color.hex }}</p>
  <h3>{{ color.name }}</h3>
</div>
</template>


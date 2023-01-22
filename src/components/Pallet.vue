<script setup lang="ts">
import { pallet, color, } from '../composables/pallet'
</script>

<template>
<div class="color" ref="pallet">
  <p>{{ color.hex }}</p>
  <h3>{{ color.name }}</h3>
</div>
</template>


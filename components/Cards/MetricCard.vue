<script setup lang="ts">
import UCard from '@nuxt/ui/components/Card.vue';

const props = defineProps(['title', 'value'])
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl">{{ props.title }}</h2>
    </template>

    {{ props.value }}
  </UCard>
</template>

<style scoped>

</style>
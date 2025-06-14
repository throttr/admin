<script setup lang="ts">
import UCard from '@nuxt/ui/components/Card.vue';

const props = defineProps(['title', 'total', 'per_minute'])
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl">{{ props.title }}</h2>
    </template>

    <div class="grid grid-cols-2 gap-10">
      <div>
        <h3 class="text-center text-3xl text-green-600">
          {{ props.per_minute }}
        </h3>
        <h4 class="text-center text-green-600">
          PER MINUTE
        </h4>
      </div>
      <div>
        <h3 class="text-center text-3xl">
          {{ props.total }}
        </h3>
        <h4 class="text-center text-gray-500">
          TOTAL
        </h4>
      </div>
    </div>
  </UCard>
</template>

<style scoped>

</style>
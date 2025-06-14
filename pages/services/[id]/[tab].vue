<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <div class="p-32">
    <TabsServicesTab class="mb-10" />


    <div v-if="route.params.tab === 'overview'">
      <ResourcesServicesOverview />
    </div>

    <div v-if="route.params.tab === 'connections'">
      <ResourcesServicesConnections />
    </div>

  </div>
</template>
<script setup lang="ts">
const props = defineProps(['service', 'type'])

const services = useServices();
</script>

<template>
  <div>
    <UCard>
      <div :class="[props.type !== 'xs' ? 'flex justify-between' : 'grid grid-cols-1']">
        <h4>ID</h4>
        <div>{{ props.service.id }}</div>
      </div>
      <hr class="border-gray-800 mt-2 mb-5">

      <div>
        <div class="mb-4">
          <div class="grid gap-8" :class="[props.type == 'xs' ? 'grid-cols-2' : 'grid-cols-4']">
            <div>
              <h4 class="mb-2">Status</h4>
              <div><UBadge :color="props.service.instance.connected ? 'success' : 'error'" variant="outline">Connected</UBadge></div>
            </div>

            <div>
              <h4 class="mb-2">Host</h4>
              <div>{{ props.service.instance.config.host }}:{{ props.service.instance.config.port }}</div>
            </div>

            <div>
              <h4 class="mb-2">Connections</h4>
              <div>{{ props.service.instance.connections.length }}</div>
            </div>


            <div>
              <h4 class="mb-2">Value Size</h4>
              <div>{{ services.attributes.value_sizes[props.service.instance.config.value_size - 1] }}</div>
            </div>
          </div>
        </div>

        <div v-if="props.type !== 'xs'">
          <CardsInstanceMetricsCard :service="props.service" />
        </div>

      </div>

    </UCard>
  </div>
</template>

<style scoped>

</style>
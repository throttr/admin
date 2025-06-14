<script setup lang="ts">
import type {ConnectionsResponse, ConnectionsItem} from "@throttr/sdk";

const route = useRoute()
const services = useServices()


const data = ref({
  success: false,
  connections: [] as ConnectionsItem[]
});

const loading = ref(true);


const fetch = async () => {
  loading.value = true;
  data.value = await services.connections(route.params.id) as ConnectionsResponse;
  console.log(data.value)
  loading.value = false;
}

onMounted(async () => {
  await fetch()
})
</script>

<template>
  <div>
    <div class="mb-10">
      <UButton type="button" @click="fetch">Reload</UButton>
    </div>

    <div v-if="!loading">
      <TablesConnectionsTable :connections="data.connections"/>
    </div>
  </div>
</template>

<style scoped>

</style>
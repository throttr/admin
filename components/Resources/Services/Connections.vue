<script setup lang="ts">
// Copyright (C) 2025 Ian Torres
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

import type {ConnectionsResponse, ConnectionsItem} from "@throttr/sdk";

const route = useRoute()
const services = useServices()
const toast = useToast()
const {t} = useI18n()


const data = ref({
  success: false,
  connections: [] as ConnectionsItem[]
});

const loading = ref(true);


const fetch = async () => {
  loading.value = true;
  data.value = await services.connections(route.params.id) as ConnectionsResponse;
  toast.add({title: t('forms.event', { name: "Connections Retrieved ⤑ Success"}), color: 'success'})
  loading.value = false;
}

onMounted(async () => {
  await fetch()
})
</script>

<template>
  <div>
    <div v-if="!loading">
      <UCard>
        <TablesConnectionsTable :connections="data.connections"/>
      </UCard>
    </div>
  </div>
</template>

<style scoped>

</style>
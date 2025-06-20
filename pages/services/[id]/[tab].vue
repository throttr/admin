<script lang="ts" setup>
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

import type { BreadcrumbItem } from "@nuxt/ui";

const route = useRoute()

const items = ref<BreadcrumbItem[]>([
])

onMounted(() => {
  items.value.push({
    label: (route.params.id as string).substring(0, 6),
    to: `/services/${route.params.id}`
  })

  switch (route.params.tab) {
    case 'overview':
      items.value.push({
        label: 'Overview',
        to: `/services/${route.params.id}/overview`
      })
      break;
    case 'connections':
      items.value.push( {
        label: 'Connections',
        to: `/services/${route.params.id}/connections`
      })
      break;
    case 'stats':
      items.value.push( {
        label: 'Stats',
        to: `/services/${route.params.id}/stats`
      })
      break;
    case 'storage':
      items.value.push( {
        label: 'Storage',
        to: `/services/${route.params.id}/storage`
      })
      break;
    case 'channels':
      items.value.push( {
        label: 'Channels',
        to: `/services/${route.params.id}/channels`
      })
      break;
  }
})

</script>

<template>
  <div class="p-8">
    <div class="py-10">
      <UBreadcrumb :items="items" />
    </div>

    <div v-if="route.params.tab === 'overview'">
      <ResourcesServicesOverview />
    </div>

    <div v-if="route.params.tab === 'storage'">
      <ResourcesServicesStorage />
    </div>

    <div v-if="route.params.tab === 'stats'">
      <ResourcesServicesStats />
    </div>

    <div v-if="route.params.tab === 'connections'">
      <ResourcesServicesConnections />
    </div>

    <div v-if="route.params.tab === 'channels'">
      <ResourcesServicesChannels />
    </div>

  </div>
</template>
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

import type { TabsItem } from '@nuxt/ui'

const route = useRoute()

const active = computed({
  get() {
    return (route.params.tab as string) || '/'
  },
  set(tab: any) {
    // Hash is specified here to prevent the page from scrolling to the top
    navigateTo(`/services/${route.params.id}/${tab}`)
    items.value.forEach((item) => {
      item.active = tab === item.value;
    })
  }
})

const items = ref<TabsItem[]>([
  {
    label: 'Overview',
    value: 'overview',
    active: true,
  },
  {
    label: 'Storage',
    value: 'storage',
    active: false,
  },
  {
    label: 'Stats',
    value: 'stats',
    active: false,
  },
  {
    label: 'Connections',
    value: 'connections',
    active: false,
  }
])
</script>

<template>
  <UTabs v-model="active" size="xl" variant="pill" :content="false" :items="items" class="w-full" />
</template>

<style scoped>

</style>
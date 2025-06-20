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

import type {BreadcrumbItem} from "@nuxt/ui";

const {t} = useI18n()

const services = useServices()

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Home',
    to: '/'
  },
  {
    label: 'Instances',
    to: '/services'
  },
])


onMounted(async () => {
  await services.setup();
})
</script>

<template>
  <div class="p-16">
    <div class="py-10">
      <UBreadcrumb :items="items" />
    </div>
    <UModal v-model:open="services.attributes.formOpen"
            :title="t('welcome.modal.title')"
            :description="t('welcome.modal.description')"
            :dismissible="false"
            :close="false">
      <template #body>
        <FormsServicesForm/>
      </template>
    </UModal>
    <div>
      <UCard >
        <ListsServicesList />
      </UCard>
    </div>
  </div>
</template>
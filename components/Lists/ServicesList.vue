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

const {t} = useI18n()
const services = useServices();

const props = defineProps(['type'])

onMounted(async () => {
  await services.setup();
})
</script>

<template>
  <UModal v-model:open="services.attributes.formOpen"
          :title="t('welcome.modal.title')"
          :description="t('welcome.modal.description')"
          :dismissible="true"
          :close="true">
    <template #body>
      <FormsServicesForm/>
    </template>
  </UModal>

  <div class="mb-4">
    <UButton :label="t('forms.add_server')" type="button" variant="outline" @click="services.attributes.formOpen = true"/>
  </div>

  <div class="grid grid-cols-1 gap-y-5">
    <ItemsServicesItem v-for="service in services.services" :service="service" :type="props.type" class="cursor-pointer" @click="navigateTo(`/services/${service.id}`)"/>
  </div>
</template>

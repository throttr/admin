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
  <UTable :data="services.services" :columns="services.columns" class="flex-1" />
  <div class="p-4">
    <UButton :label="t('forms.add_server')" type="button" variant="outline" @click="services.attributes.formOpen = true"/>
  </div>
</template>

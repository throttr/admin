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

const services = useServices()
const {t} = useI18n()
</script>

<template>
  <UForm :schema="services.schema" :state="services.state" class="space-y-4" @submit="services.submit">
    <UFormField :label="t('forms.ip_address.title')" name="ip_address">
      <UInput :placeholder="t('forms.ip_address.description')" v-model="services.state.ip_address" type="text" class="w-full" />
    </UFormField>

    <UFormField :label="t('forms.port.title')" name="port">
      <UInput :placeholder="t('forms.port.description')" v-model="services.state.port" type="number" class="w-full" />
    </UFormField>

    <UFormField :label="t('forms.value_size.title')" name="value_size">
      <USelect v-model="services.state.value_size" :items="services.attributes.value_sizes" class="w-full" />
    </UFormField>

    <UFormField :label="t('forms.connections.title')" name="connections">
      <UInput :placeholder="t('forms.connections.description')" v-model="services.state.connections" type="number" class="w-full" />
    </UFormField>

    <UButton :label="t('forms.connect')" type="submit"/>
  </UForm>
</template>
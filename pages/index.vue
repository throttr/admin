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

import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'

const open = ref(false)

const {t} = useI18n()

const valueTypes = ref(['UINT8', 'UINT16', 'UINT32', 'UINT64'])

const schema = z.object({
  ip_address: z.string().ip({ version: "v4", message: t('forms.ipAddress.on_error') }),
  value_type: z.enum(valueTypes.value),
  port: z.number().max(65535, t('forms.port.on_error')),
  connections: z.number().min(1),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  ip_address: '127.0.0.1',
  value_type: 'UINT16',
  port: 9000,
  connections: 1,
})

const toast = useToast()

const services = useServices()

interface ServiceRegistrationRequest {
  ip: string
  port: number
  value_type: string
  connections: string
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({title: t('forms.success'), description: t('forms.submitted'), color: 'success'})

  const { data, error } = await $fetch('/api/service-registration', {
    method: 'POST',
    body: {
      ip: event.data.ip_address,
      port: event.data.port,
      value_type: event.data.value_type,
      connections: event.data.connections
    }
  } as any)

  await services.retrieve();

  if (services.services.length === 0) {
    open.value = false;
  }
}

onMounted(async () => {
  await services.retrieve();

  if (services.services.length === 0) {
    open.value = true;
  }
})
</script>

<template>
  <UModal v-model:open="open"
          :title="t('welcome.modal.title')"
          :description="t('welcome.modal.description')"
          :dismissible="false"
          :close="false">
    <template #body>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField :label="t('forms.ipAddress.title')" name="ipAddress">
          <UInput :placeholder="t('forms.ipAddress.description')" v-model="state.ip_address" type="text" class="w-full" />
        </UFormField>

        <UFormField :label="t('forms.port.title')" name="port">
          <UInput :placeholder="t('forms.port.description')" v-model="state.port" type="number" class="w-full" />
        </UFormField>

        <UFormField :label="t('forms.valueType.title')" name="valueType">
          <USelect v-model="state.value_type" :items="valueTypes" class="w-full" />
        </UFormField>

        <UFormField :label="t('forms.connections.title')" name="connections">
          <UInput :placeholder="t('forms.connections.description')" v-model="state.connections" type="number" class="w-full" />
        </UFormField>

        <UButton :label="t('forms.connect')" type="submit"/>
      </UForm>
    </template>
  </UModal>
  <div>
    <ServicesTable />
  </div>
</template>
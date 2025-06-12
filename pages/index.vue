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

import * as v from 'valibot'
import type {FormSubmitEvent} from '@nuxt/ui'

const open = ref(true)

const {t} = useI18n()

const schema = v.object({
  ipAddress: v.pipe(v.string(), v.ip(t('forms.ipAddress.on_error'))),
  port: v.pipe(v.number(), v.maxValue(65535, t('forms.port.on_error')))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  ipAddress: '127.0.0.1',
  valueType: 'UINT16',
  port: 9000
})

const valueTypes = ref(['UINT8', 'UINT16', 'UINT32', 'UINT64'])

const toast = useToast()

const servers = useServers()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({title: t('forms.success'), description: t('forms.submitted'), color: 'success'})
  console.log(event.data)

  const { data, error } = await $fetch('/api/server-registration', {
    method: 'POST',
    body: {
      ip: event.data.ipAddress,
      port: event.data.port,
      value_type: event.data.valueType
    }
  })

}
</script>

<template>
  <UModal v-model:open="open"
          :title="t('welcome.modal.title')"
          :description="t('welcome.modal.description')"
          :dismissible="false"
          :close="false">
    <UButton label="Open" color="neutral" variant="subtle"/>

    <template #body>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField :label="t('forms.ipAddress.title')" name="ipAddress">
          <UInput :placeholder="t('forms.ipAddress.description')" v-model="state.ipAddress" type="text" class="w-full" />
        </UFormField>

        <UFormField :label="t('forms.port.title')" name="port">
          <UInput :placeholder="t('forms.port.description')" v-model="state.port" type="number" class="w-full" />
        </UFormField>

        <UFormField :label="t('forms.valueType.title')" name="valueType">
          <USelect v-model="state.valueType" :items="valueTypes" class="w-full" />
        </UFormField>

        <UButton :label="t('forms.connect')" type="submit"/>
      </UForm>
    </template>
  </UModal>
</template>
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

import * as z from "zod";
import { TTLType } from "@throttr/sdk";
import type {FormSubmitEvent} from "@nuxt/ui";

const {t} = useI18n()

const emit = defineEmits(['success'])

const ttl_types = ref([
  {
    label: "Nanoseconds",
    value: TTLType.Nanoseconds.valueOf()
  },
  {
    label: "Microseconds",
    value: TTLType.Microseconds.valueOf()
  },
  {
    label: "Milliseconds",
    value: TTLType.Milliseconds.valueOf()
  },
  {
    label: "Seconds",
    value: TTLType.Seconds.valueOf()
  },
  {
    label: "Minutes",
    value: TTLType.Minutes.valueOf()
  },
  {
    label: "Hours",
    value: TTLType.Hours.valueOf()
  },
])

const schema = z.object({
  key: z.string(),
  // @ts-ignore: This is-as documentation said.
  ttl_type: z.number().min(1).max(6),
  quota: z.number().max(65535),
  ttl: z.number().max(65535),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  key: '',
  ttl_type: TTLType.Seconds.valueOf(),
  quota: 1,
  ttl: 60,
})

const toast = useToast()
const route = useRoute()

const submit = async (event: FormSubmitEvent<Schema>) => {
  try {
    const response = await $fetch(`/api/services/${route.params.id}/insert`, {
      method: 'POST',
      body: {
        key: event.data.key,
        ttl_type: event.data.ttl_type,
        ttl: event.data.ttl,
        quota: event.data.quota
      }
    })

    toast.add({title: t('forms.event', { name: "Counter Created"}), color: 'success'})
    emit('success');

  } catch (error) {
    toast.add({title: t('forms.event', { name: "Counter Created ⤑ Exception"}), color: 'error'})
    console.error("Counter Created ⤑ Exception", error)

    throw error;
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="submit">
    <UFormField label="Key" name="key">
      <UInput v-model="state.key" type="text" class="w-full" />
    </UFormField>

    <UFormField label="TTL Type" name="ttl_type">
      <USelect v-model="state.ttl_type" :items="ttl_types" class="w-full" />
    </UFormField>

    <UFormField label="Quota" name="quota">
      <UInput v-model="state.quota" type="number" class="w-full" />
    </UFormField>

    <UFormField label="TTL" name="ttl">
      <UInput v-model="state.ttl" type="number" class="w-full" />
    </UFormField>

    <UButton label="Confirm" type="submit"/>
  </UForm>
</template>
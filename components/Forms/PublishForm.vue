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

const props = defineProps(['channel']);
const emit = defineEmits(['success'])

const schema = z.object({
  // @ts-ignore: This is-as documentation said.
  value: z.string(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  value: '',
})

const toast = useToast()
const route = useRoute()

const submit = async (event: FormSubmitEvent<Schema>) => {
  try {
    const response = await $fetch(`/api/services/${route.params.id}/publish`, {
      method: 'POST',
      body: {
        channel: props.channel,
        value: event.data.value
      }
    })

    toast.add({title: t('forms.event', { name: "Published"}), color: 'success'})

    emit('success');

  } catch (error) {
    toast.add({title: t('forms.event', { name: "Published ⤑ Exception"}), color: 'error'})
    console.error("Published ⤑ Exception", error)

    throw error;
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="submit">

    <UFormField label="Value" name="value">
      <UInput v-model="state.value" class="w-full" />
    </UFormField>

    <UButton label="Confirm" type="submit"/>
  </UForm>
</template>
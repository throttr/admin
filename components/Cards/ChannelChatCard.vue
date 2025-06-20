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

import UCard from '@nuxt/ui/components/Card.vue';
import * as z from "zod";
import type {FormSubmitEvent} from "@nuxt/ui";

const props = defineProps<{ channel: string }>()
const messages = ref<string[]>([])

const toast = useToast();
const { t } = useI18n();
const { connect, close } = useSocket()
const route = useRoute();

const schema = z.object({
  value: z.string(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  value: '',
})

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
    console.log("Published ⤑ Response", response)
  } catch (error) {
    toast.add({title: t('forms.event', { name: "Published ⤑ Exception"}), color: 'error'})
    console.error("Published ⤑ Exception", error)
    throw error;
  }
}

onMounted(() => {
  connect(props.channel, route.params.id!, (msg) => {
    if (msg.event === "MESSAGE") {
      const now = new Date();
      messages.value.push(`${now.toLocaleString()} RCV: ${msg.data}`)
    }
  })
})

onUnmounted(() => {
  close(props.channel, route.params.id!)
})
</script>

<template>
  <div>
    <h2 class="text-lg font-bold">Channel: {{ props.channel }}</h2>
    <pre
        class="w-full h-64 p-2 mb-4 border border-gray-700 rounded mt-2 font-mono overflow-auto"
        readonly
        v-html="messages.join('\n')"
    ></pre>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="submit">
      <UFormField label="Value" name="value">
        <UInput v-model="state.value" type="text" class="w-full" />
      </UFormField>

      <UButton label="Send" type="submit"/>
    </UForm>
  </div>
</template>

<style scoped>

</style>
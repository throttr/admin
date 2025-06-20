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

const emit = defineEmits(["chat_closed"]);

const schema = z.object({
  channel: z.string(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  channel: '',
})

const subscriptions = useSubscriptions();

const open_chat = ref(false);
const channel_listen = ref("");

const submit = async (event: FormSubmitEvent<Schema>) => {
  try {
    channel_listen.value = event.data.channel;

    subscriptions.subscriptions.push({
      name: event.data.channel,
    })

    open_chat.value = true;
  } catch (error) {
    throw error;
  }
}

watch(open_chat, (next, old) => {
  console.log(old, next);
  if (old == true && next == false) {
    emit("chat_closed");
  }
})
</script>

<template>
  <!-- LISTEN -->
  <UModal v-model:open="open_chat"
          title="Listen Channel"
          description="Intercept and view channel messages"
          :dismissible="true"
          :close="true"
          class="max-w-3xl">
    <template #body>
      <CardsChannelChatCard :channel="channel_listen" />
    </template>
  </UModal>
  <!-- FORM -->
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="submit">
    <UFormField label="Channel" name="channel">
      <UInput v-model="state.channel" type="text" class="w-full" />
    </UFormField>

    <UButton label="Confirm" type="submit"/>
  </UForm>
</template>
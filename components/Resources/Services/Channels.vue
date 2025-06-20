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

import {
  type ChannelsResponse,
} from "@throttr/sdk";
import UButton from "#ui/components/Button.vue";
import type {ChannelItem} from "@throttr/sdk/dist/src/types";

const route = useRoute()
const services = useServices()
const toast = useToast()
const {t} = useI18n()

const data = ref({
  success: false,
  channels: [] as ChannelItem[]
});

const loading = ref(true);
const open_subscribe = ref(false);


const fetch = async () => {
  loading.value = true;
  data.value = await services.channels(route.params.id) as ChannelsResponse;
  toast.add({title: t('forms.event', {name: "Channels Retrieved ⤑ Success"}), color: 'success'})
  console.log("Stats Retrieved ⤑ Success", data.value)
  loading.value = false;
}

onMounted(async () => {
  await fetch()
})
</script>

<template>
  <div>
    <div v-if="!loading">
      <!-- SUBSCRIBE -->
      <UModal v-model:open="open_subscribe"
              title="Subscribe"
              description="Complete the form to start to intercept channel"
              :dismissible="true"
              :close="true"
              class="max-w-sm">
        <template #body>
          <FormsSubscribeForm v-on:chat_closed="open_subscribe = false" />
        </template>
      </UModal>

      <UCard>
        <div class="flex gap-2">
          <UButton type="button" @click="fetch">Reload</UButton>
          <UButton type="button" @click="open_subscribe = true">Subscribe</UButton>
        </div>
        <TablesChannelsTable :channels="data.channels" v-on:reload="fetch"/>
      </UCard>
    </div>
  </div>
</template>

<style scoped>

</style>
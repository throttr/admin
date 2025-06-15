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

import {KeyType, type ListItem, type ListResponse, TTLType} from "@throttr/sdk";
import { formatDate } from "~/server/throttr/utils";

const route = useRoute()
const services = useServices()


const data = ref({
  success: false,
  keys: [] as ListItem[]
});

const loading = ref(true);
const open_insert = ref(false);
const open_set = ref(false);


const fetch = async () => {
  loading.value = true;
  data.value = await services.list(route.params.id) as ListResponse;
  loading.value = false;
}

onMounted(async () => {
  await fetch()
})
</script>

<template>
  <div>
    <div v-if="!loading">
      <div class="mb-10">
        <h1 class="text-5xl">Storage</h1>
      </div>
      <UModal v-model:open="open_insert"
              title="INSERT"
              description="Complete the form to create a counter"
              :dismissible="true"
              :close="true">
        <template #body>
          <FormsInsertForm/>
        </template>
      </UModal>

      <UModal v-model:open="open_set"
              title="SET"
              description="Complete the form to create a buffer"
              :dismissible="true"
              :close="true">
        <template #body>
          <FormsSetForm/>
        </template>
      </UModal>

      <UCard>
          <div class="flex gap-x-2">
            <UButton type="button" @click="open_insert = true">INSERT</UButton>
            <UButton type="button" @click="open_set = true">SET</UButton>
          </div>
          <TablesKeysTable :keys="data.keys"/>
      </UCard>
    </div>
  </div>
</template>

<style scoped>

</style>
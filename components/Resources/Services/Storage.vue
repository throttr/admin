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

import {type ListItem, type ListResponse} from "@throttr/sdk";

const route = useRoute()
const services = useServices()
const toast = useToast()
const {t} = useI18n()

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
  toast.add({title: t('forms.event', { name: "Keys Retrieved ⤑ Success"}), color: 'success'})
  loading.value = false;
}

onMounted(async () => {
  await fetch()
})
</script>

<template>
  <div>
    <div v-if="!loading">
      <UModal v-model:open="open_insert"
              title="Add Counter"
              description="Complete the form to create a counter"
              :dismissible="true"
              :close="true">
        <template #body>
          <FormsInsertForm v-on:success="open_insert = false; fetch()"/>
        </template>
      </UModal>

      <UModal v-model:open="open_set"
              title="Add Buffer"
              description="Complete the form to create a buffer"
              :dismissible="true"
              :close="true">
        <template #body>
          <FormsSetForm v-on:success="open_set = false; fetch()"/>
        </template>
      </UModal>

      <UCard>
          <div class="flex gap-x-2">
            <UButton type="button" @click="fetch">Reload</UButton>
            <UButton type="button" @click="open_insert = true">Add Counter</UButton>
            <UButton type="button" @click="open_set = true">Add Buffer</UButton>
          </div>
          <TablesKeysTable :keys="data.keys" v-on:reload="fetch"/>
      </UCard>
    </div>
  </div>
</template>

<style scoped>

</style>
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

import type {TableColumn} from '@nuxt/ui'
import {type GetResponse, KeyType, type ListItem, type QueryResponse, type StatResponse, TTLType} from '@throttr/sdk';
import {formatDate} from '~/server/throttr/utils';
import UButton from '@nuxt/ui/components/Button.vue';
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue';

const {t} = useI18n()
const toast = useToast()
const services = useServices()
const route = useRoute()
const emit = defineEmits(['reload'])

const get: Ref<GetResponse> = ref({} as GetResponse);
const query: Ref<QueryResponse> = ref({} as QueryResponse);
const stat: Ref<StatResponse> = ref({} as StatResponse);
const key = ref();

const get_ttl_type = (ttl_type: TTLType) => {
  switch (ttl_type) {
    case TTLType.Nanoseconds:
      return "nanoseconds";
    case TTLType.Microseconds:
      return "microseconds";
    case TTLType.Milliseconds:
      return "milliseconds";
    case TTLType.Seconds:
      return "seconds";
    case TTLType.Minutes:
      return "minutes";
    case TTLType.Hours:
      return "hours";
  }
}

const is_json = (input: string) => {
  try {
    JSON.parse(input);
    return true;
  } catch (e) {
    return false;
  }
}

const copy = (input: string) => {
  navigator.clipboard.writeText(input)
  toast.add({title: t('forms.event', { name: "Value Copied"}), color: 'success'})
}

const transform_to_json = (value: string) => {
  const parsed = JSON.parse(value);
  return JSON.stringify(parsed, null, "  ");
}

const columns: TableColumn<ListItem>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({row}) => row.original.key,
  },
  {
    accessorKey: 'kind',
    header: 'Kind',
    cell: ({row}) => row.original.key_type == KeyType.Counter ? `Counter` : `Buffer`,
  },
  {
    accessorKey: 'ttl_type',
    header: 'TTL Type',
    cell: ({row}) => get_ttl_type(row.original.ttl_type),
  },
  {
    accessorKey: 'expires_at',
    header: 'Expires At',
    cell: ({row}) => formatDate(row.original.expires_at, true),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({row}) => {
      const items = [{
        type: 'label',
        label: 'Actions'
      }, {
        label: 'View',
        async onSelect() {
          switch (row.original.key_type) {
            case KeyType.Buffer:
              get.value = await services.get(route.params.id, row.original.key);
              const has_json = is_json(get.value.value);
              if (has_json) {
                get.value.value = transform_to_json(get.value.value);
              }
              open_get.value = true;
              break;
            case KeyType.Counter:
              query.value = await services.query(route.params.id, row.original.key);
              open_query.value = true;
              break;
          }
        }
      }, {
        label: 'Update',
        async onSelect() {
          key.value = row.original;
          open_update.value = true;
        }
      }, {
        type: 'separator'
      }, {
        label: 'Metrics',
        async onSelect() {
          key.value = row.original;
          const response = await services.stat(route.params.id, row.original.key);
          if (response.success) {
            toast.add({title: t('forms.event', { name: "Key Metrics Retrieved ⤑ Success"}), color: 'success'})
            console.log("Key Metrics Retrieved ⤑ Success", row.original.key)
            stat.value = response;
          } else {
            toast.add({title: t('forms.event', { name: "Key Metrics Retrieved ⤑ Failed"}), color: 'error'})
            console.log("Key Metrics Retrieved ⤑ Failed", row.original.key)
          }
          open_stats.value = true;
        }
      }, {
        type: 'separator'
      }, {
        label: 'Remove',
        async onSelect() {
          const response = await services.purge(route.params.id, row.original.key);
          if (response.success) {
            toast.add({title: t('forms.event', { name: "Key Purged ⤑ Success"}), color: 'success'})
            console.log("Key Purged ⤑ Success", row.original.key)
            emit('reload');
          } else {
            toast.add({title: t('forms.event', { name: "Key Purged ⤑ Failed"}), color: 'error'})
            console.log("Key Purged ⤑ Failed", row.original.key)
          }
        }
      }]

      return h('div', {class: 'text-right'}, h(UDropdownMenu, {
        'content': {
          align: 'end'
        },
        items,
        'aria-label': 'Actions dropdown'
      }, () => h(UButton, {
        'icon': 'i-lucide-ellipsis-vertical',
        'color': 'neutral',
        'variant': 'ghost',
        'class': 'ml-auto',
        'aria-label': 'Actions dropdown'
      })))
    }
  }
]

const props = defineProps(['keys'])

const open_get = ref(false);
const open_query = ref(false);
const open_update = ref(false);
const open_stats = ref(false);

</script>

<template>
  <!-- GET -->
  <UModal v-model:open="open_get"
          title="View Buffer"
          description="Get the stored data and time to live"
          :dismissible="true"
          :close="true">
    <template #body>
      <h1 class="text-lg">Expires in</h1>
      <div class="p-4">
        {{ get.ttl }} {{ get_ttl_type(get.ttl_type) }}
      </div>
      <div class="pt-2 rounded">
        <div class="flex justify-between">
          <h3 class="text-lg">Data</h3>
          <div class="w-1/2 text-right">
            <UBadge size="md" icon="i-lucide-clipboard-copy" color="primary" variant="solid" class="mr-2 cursor-pointer" @click="copy(get.value)">Copy</UBadge>
            <UBadge v-if="is_json(get.value)" size="md" icon="i-lucide-file-json-2" color="primary" variant="solid">JSON</UBadge>
            <UBadge v-else size="md" icon="i-lucide-binary" color="primary" variant="solid">Raw</UBadge>
          </div>
        </div>

        <pre class="mt-5 p-4 overflow-auto rounded border border-gray-700 max-h-48">{{ get.value }}</pre>
      </div>
    </template>
  </UModal>
  <!-- QUERY -->
  <UModal v-model:open="open_query"
          title="View Counter"
          description="Get the stored quota and time to live"
          :dismissible="true"
          :close="true">
    <template #body>
      <div class="flex justify-between">
        <div>
          <h3 class="text-lg mb-2">Expires in</h3>
          <div>
            {{ query.ttl }} {{ get_ttl_type(query.ttl_type) }}
          </div>
        </div>
        <div class="rounded text-right">
          <h3 class="text-lg mb-2">Quota</h3>

          <div>
            {{ query.quota }}
          </div>
        </div>
      </div>
    </template>
  </UModal>
  <!-- UPDATE -->
  <UModal v-model:open="open_update"
          title="Update Key"
          description="Complete the form to change stored attributes"
          :dismissible="true"
          :close="true">
    <template #body>
      <FormsUpdateForm :stored_key="key" />
    </template>
  </UModal>
  <!-- STAT -->
  <UModal v-model:open="open_stats"
          title="View Metrics"
          description="Get the stored metrics."
          :dismissible="true"
          :close="true">
    <template #body>
      <div class="grid grid-cols-2 gap-10">
        <div>
          <h1 class="text-xl">Total reads</h1>
          <p class="px-8 py-8 text-3xl">{{ stat.total_reads }}</p>
        </div>
        <div>
          <h1 class="text-xl">Reads per minute</h1>
          <p class="px-8 py-8 text-3xl">{{ stat.reads_per_minute }}</p>
        </div>
        <div>
          <h1 class="text-xl">Total writes</h1>
          <p class="px-8 py-8 text-3xl">{{ stat.total_writes }}</p>
        </div>
        <div>
          <h1 class="text-xl">Writes per minute</h1>
          <p class="px-8 py-8 text-3xl">{{ stat.writes_per_minute }}</p>
        </div>
      </div>
    </template>
  </UModal>
  <UTable :data="props.keys" :columns="columns" class="w-full"/>
</template>

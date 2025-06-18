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

import type { TableColumn } from '@nuxt/ui'
import type { ConnectionsItem } from '@throttr/sdk';
import {formatDate, getHeader} from '~/server/throttr/utils';
import UDropdownMenu from "#ui/components/DropdownMenu.vue";
import UButton from "#ui/components/Button.vue";

const {t} = useI18n()

const columns: TableColumn<ConnectionsItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: 'kind',
    header: ({ column }) => getHeader(column, 'Kind'),
    cell: ({ row }) => row.original.kind == 0 ? `Client` : `Agent`,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => getHeader(column, 'Type'),
    cell: ({ row }) => row.original.type == 0 ? `TCP` : `UNIX`,
  },
  {
    accessorKey: 'connected_at',
    header: ({ column }) => getHeader(column, 'Connected At'),
    cell: ({ row }) => formatDate(row.original.connected_at, true),
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
        }
      }, {
        label: 'Publish',
        async onSelect() {
          publish_channel.value = row.original.id;
          open_publish.value = true;
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

const props = defineProps(['connections'])

const open_publish = ref(false);
const publish_channel = ref('');

</script>

<template>
  <UModal v-model:open="open_publish"
          title="Publish"
          description="Complete the form to send a message to the connection"
          :dismissible="true"
          :close="true">
    <template #body>
      <FormsPublishForm :channel="publish_channel" v-on:success="open_publish = false;"/>
    </template>
  </UModal>
  <UTable :data="props.connections" :columns="columns" class="flex-1" />
</template>

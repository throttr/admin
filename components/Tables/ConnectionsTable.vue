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
import type { ConnectionsItem, ConnectionResponse } from '@throttr/sdk';
import {formatDate, getHeader} from '~/server/throttr/utils';
import UDropdownMenu from "#ui/components/DropdownMenu.vue";
import UButton from "#ui/components/Button.vue";

const {t} = useI18n()
const services = useServices();
const route = useRoute();

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
          connection.value = await services.connection(route.params.id, row.original.id);
          open_connection.value = true;
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
const open_connection = ref(false);

const connection : Ref<ConnectionResponse> = ref({} as ConnectionResponse);
const publish_channel = ref('');

</script>

<template>
  <!-- CONNECTION -->
  <UModal v-model:open="open_connection"
          title="View Connection"
          description="Get the connection details"
          :dismissible="true"
          :close="true"
          class="max-w-3xl">
    <template #body>
      <div class="grid grid-cols-4 gap-8">
        <div class="col-span-2">
          <h1>ID</h1>
          {{ connection.id }}
        </div>

        <div class="col-span-2">
          <h1>Connected At</h1>
          {{ formatDate(connection.connected_at, true) }}
        </div>

        <div>
          <h1>Kind</h1>
          {{ connection.kind === 0 ? 'Client' : 'Agent' }}
        </div>

        <div>
          <h1>Type</h1>
          {{ connection.type === 0 ? 'TCP' : 'UNIX' }}
        </div>
        <div>
          <h1>IP</h1>
          {{ connection.ip }}
        </div>
        <div>
          <h1>Port</h1>
          {{ connection.port }}
        </div>
        <!-- Storage -->
        <div class="col-span-4">
          <h1 class="text-2xl">Storage <span class="text-xs">in bytes</span></h1>
        </div>
        <div class="col-span-2">
          <h1>Allocated</h1>
          {{ connection.allocated_bytes }}
        </div>
        <div class="col-span-2">
          <h1>Consumed</h1>
          {{ connection.consumed_bytes }}
        </div>
        <!-- Network -->
        <div class="col-span-4">
          <h1 class="text-2xl">Network <span class="text-xs">in bytes</span></h1>
        </div>
        <div>
          <h1>Read</h1>
          {{ connection.read_bytes }}
        </div>
        <div>
          <h1>Write</h1>
          {{ connection.write_bytes }}
        </div>
        <div>
          <h1>Received</h1>
          {{ connection.received_bytes }}
        </div>
        <div>
          <h1>Published</h1>
          {{ connection.published_bytes }}
        </div>
        <!-- Service -->
        <div class="col-span-4">
          <h1 class="text-2xl">Service</h1>
        </div>

        <div>
          <h1>INSERT</h1>
          {{ connection.insert_requests }}
        </div>

        <div>
          <h1>QUERY</h1>
          {{ connection.query_requests }}
        </div>

        <div>
          <h1>SET</h1>
          {{ connection.set_requests }}
        </div>

        <div>
          <h1>GET</h1>
          {{ connection.get_requests }}
        </div>

        <div>
          <h1>UPDATE</h1>
          {{ connection.update_requests }}
        </div>

        <div>
          <h1>PURGE</h1>
          {{ connection.purge_requests }}
        </div>

        <div>
          <h1>LIST</h1>
          {{ connection.list_requests }}
        </div>

        <div>
          <h1>INFO</h1>
          {{ connection.info_requests }}
        </div>

        <div>
          <h1>STAT</h1>
          {{ connection.stat_requests }}
        </div>

        <div>
          <h1>STATS</h1>
          {{ connection.stats_requests }}
        </div>

        <div>
          <h1>SUBSCRIBE</h1>
          {{ connection.subscribe_requests }}
        </div>

        <div>
          <h1>UNSUBSCRIBE</h1>
          {{ connection.unsubscribe_requests }}
        </div>

        <div>
          <h1>PUBLISH</h1>
          {{ connection.publish_requests }}
        </div>

        <div>
          <h1>CHANNEL</h1>
          {{ connection.channel_requests }}
        </div>

        <div>
          <h1>CHANNELS</h1>
          {{ connection.channels_requests }}
        </div>

        <div>
          <h1>CONNECTION</h1>
          {{ connection.connection_requests }}
        </div>

        <div>
          <h1>CONNECTIONS</h1>
          {{ connection.connections_requests }}
        </div>

        <div>
          <h1>WHOAMI</h1>
          {{ connection.whoami_requests }}
        </div>
      </div>
    </template>
  </UModal>
  <!-- PUBLISH -->
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

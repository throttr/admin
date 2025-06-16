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
import {getHeader} from "~/server/throttr/utils";
import type {ChannelItem} from "@throttr/sdk/dist/src/types";
import {type ChannelResponse} from "@throttr/sdk";
import UDropdownMenu from "#ui/components/DropdownMenu.vue";
import UButton from "#ui/components/Button.vue";

const {t} = useI18n();
const toast = useToast();

const channel: Ref<ChannelResponse> = ref({} as ChannelResponse);

const route = useRoute();
const services = useServices();

const columns: TableColumn<ChannelItem>[] = [
  {
    accessorKey: 'channel',
    header: "Name",
    cell: ({row}) => row.original.channel,
  },
  {
    accessorKey: 'read_bytes',
    header: ({column}) => getHeader(column, 'Read bytes'),
    cell: ({row}) => row.original.read_bytes,
  },
  {
    accessorKey: 'write_bytes',
    header: ({column}) => getHeader(column, 'Write bytes'),
    cell: ({row}) => row.original.write_bytes,
  },
  {
    accessorKey: 'connections',
    header: ({column}) => getHeader(column, 'Connections'),
    cell: ({row}) => row.original.connections,
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
          channel.value = await services.channel(route.params.id, row.original.channel);
          console.log(channel.value);
          toast.add({title: t('forms.event', {name: "Channel Details Retrieved ⤑ Success"}), color: 'success'})
          console.log("Channel Details Retrieved ⤑ Success", row.original.channel)
          open_channel.value = true;
        }
      }, {
        label: 'Update',
        async onSelect() {
        }
      }, {
        type: 'separator'
      }, {
        label: 'Stats',
        async onSelect() {
        }
      }, {
        type: 'separator'
      }, {
        label: 'Remove',
        async onSelect() {
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

const props = defineProps(['channels'])
const open_channel = ref(false);

const sorting = ref([
  {
    id: 'read_bytes',
    desc: true
  }
])
</script>

<template>
  <!-- GET -->
  <UModal v-model:open="open_channel"
          title="View Channel"
          description="Get the active connections including metrics"
          :dismissible="true"
          :close="true"
          class="max-w-3xl">
    <template #body>
      <TablesChannelConnectionsTable :connections="channel.connections" />
    </template>
  </UModal>
  <UTable v-model:sorting="sorting" :data="props.channels" :columns="columns" class="w-full"/>
</template>

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
import { formatDate, getHeader } from '~/server/throttr/utils';
import type {ChannelConnectionItem} from "@throttr/sdk/dist/src/types";

const columns: TableColumn<ChannelConnectionItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: 'subscribed_at',
    header: ({ column }) => getHeader(column, 'Subscribed At'),
    cell: ({ row }) => formatDate(row.original.subscribed_at, true),
  },
  {
    accessorKey: 'read_bytes',
    header: ({ column }) => getHeader(column, 'Read bytes'),
    cell: ({ row }) => row.original.read_bytes,
  },
  {
    accessorKey: 'write_bytes',
    header: ({ column }) => getHeader(column, 'Write bytes'),
    cell: ({ row }) => row.original.write_bytes,
  }
]

const props = defineProps(['connections'])

</script>

<template>
  <UTable :data="props.connections" :columns="columns" class="flex-1 max-h-80" />
</template>

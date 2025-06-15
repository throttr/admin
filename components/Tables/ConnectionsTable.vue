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
import { formatDate } from '~/server/throttr/utils';

const {t} = useI18n()

const columns: TableColumn<ConnectionsItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `${row.original.id.substring(0, 6)}`,
  },
  {
    accessorKey: 'kind',
    header: 'Kind',
    cell: ({ row }) => row.original.kind == 0 ? `Client` : `Agent`,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => row.original.type == 0 ? `TCP` : `UNIX`,
  },
  {
    accessorKey: 'connected_at',
    header: 'Connected At',
    cell: ({ row }) => formatDate(row.original.connected_at, true),
  }
]

const props = defineProps(['connections'])

</script>

<template>
  <UTable :data="props.connections" :columns="columns" class="flex-1" />
</template>

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
import { getHeader } from "~/server/throttr/utils";
import {
  type StatsItem,
} from '@throttr/sdk';

const columns: TableColumn<StatsItem>[] = [
  {
    accessorKey: 'name',
    header: "Name",
    cell: ({row}) => row.original.key,
  },
  {
    accessorKey: 'total_reads',
    header: ({ column }) => getHeader(column, 'Reads'),
    cell: ({row}) => row.original.total_reads,
  },
  {
    accessorKey: 'total_writes',
    header: ({ column }) => getHeader(column, 'Writes'),
    cell: ({row}) => row.original.total_writes,
  },
  {
    accessorKey: 'reads_per_minute',
    header: ({ column }) => getHeader(column, 'Reads per minute'),
    cell: ({row}) => row.original.reads_per_minute,
  },
  {
    accessorKey: 'writes_per_minute',
    header: ({ column }) => getHeader(column, 'Writes per minute'),
    cell: ({row}) => row.original.writes_per_minute,
  }
]

const props = defineProps(['keys'])

const sorting = ref([
  {
    id: 'total_reads',
    desc: true
  }
])
</script>

<template>
  <UTable v-model:sorting="sorting" :data="props.keys" :columns="columns" class="w-full"/>
</template>

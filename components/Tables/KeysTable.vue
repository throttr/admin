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
import {type ListItem, TTLType} from '@throttr/sdk';
import { KeyType } from '@throttr/sdk';
import {formatDate} from '~/server/throttr/utils';

const {t} = useI18n()

const get_ttl_type = (ttl_type: TTLType) => {
  switch (ttl_type) {
    case TTLType.Nanoseconds:
      return "Nanoseconds";
    case TTLType.Microseconds:
      return "Microseconds";
    case TTLType.Milliseconds:
      return "Milliseconds";
    case TTLType.Seconds:
      return "Seconds";
    case TTLType.Minutes:
      return "Minutes";
    case TTLType.Hours:
      return "Hours";
  }
}

const columns: TableColumn<ListItem>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.original.key,
  },
  {
    accessorKey: 'kind',
    header: 'Kind',
    cell: ({ row }) => row.original.key_type == KeyType.Counter ? `Counter` : `Buffer`,
  },
  {
    accessorKey: 'ttl_type',
    header: 'TTL Type',
    cell: ({ row }) => get_ttl_type(row.original.ttl_type),
  },
  {
    accessorKey: 'expires_at',
    header: 'Expires At',
    cell: ({ row }) => formatDate(row.original.expires_at, true),
  }
]

const props = defineProps(['keys'])

</script>

<template>
  <UTable :data="props.keys" :columns="columns" class="w-full" />
</template>

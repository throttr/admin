<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { ValueSize } from "@throttr/sdk"

const UBadge = resolveComponent('UBadge')

const services = useServices();

const columns: TableColumn<StoredService>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `${row.original.id.substring(0, 6)}`,
  },
  {
    accessorKey: 'host',
    header: 'Host',
    cell: ({ row }) => `${row.original.instance.config.host}`,
  },
  {
    accessorKey: 'port',
    header: 'Port',
    cell: ({ row }) => `${row.original.instance.config.port}`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const isConnected = row.original.instance.connected;
      const color = isConnected ? 'success' : 'error';
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
          isConnected ? 'Connected' : 'Disconnected'
      )
    }
  },
  {
    accessorKey: 'connections',
    header: 'Connections',
    cell: ({ row }) => `${row.original.instance.config.max_connections}`,
  },
  {
    accessorKey: 'value_size',
    header: 'Value Size',
    cell: ({ row }) => {
      switch (row.original.instance.config.value_size) {
        case ValueSize.UInt8:
          return "UINT8";
        case ValueSize.UInt16:
          return "UINT16";
        case ValueSize.UInt32:
          return "UINT32";
        case ValueSize.UInt64:
          return "UINT64";
      }
    },
  }
]
</script>

<template>
  <UTable :data="services.services" :columns="columns" class="flex-1" />
</template>

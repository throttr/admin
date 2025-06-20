<script lang="ts" setup>
import type {InfoResponse} from "@throttr/sdk";
import {formatDate} from "~/server/throttr/utils";

const props = defineProps(['historic']);

const colorMode = useColorMode()

const categories: Record<string, BulletLegendItemInterface> = computed(() => ({
  total_requests_per_minute: {
    name: "ALL",
    color: "#607D8B", // Un gris azulado neutro para "ALL"
  },
  total_insert_requests_per_minute: {
    name: "INSERT",
    color: "#4CAF50", // Verde brillante para "INSERT" (creación)
  },
  total_query_requests_per_minute: {
    name: "QUERY",
    color: "#2196F3", // Azul para "QUERY" (consulta/lectura)
  },
  total_set_requests_per_minute: {
    name: "SET",
    color: "#8BC34A", // Verde más suave para "SET" (establecer/actualizar)
  },
  total_get_requests_per_minute: {
    name: "GET",
    color: "#03A9F4", // Azul claro para "GET" (obtener)
  },
  total_update_requests_per_minute: {
    name: "UPDATE",
    color: "#FFC107", // Naranja/amarillo para "UPDATE" (modificación)
  },
  total_purge_requests_per_minute: {
    name: "PURGE",
    color: "#F44336", // Rojo intenso para "PURGE" (eliminación destructiva)
  },
  total_list_requests_per_minute: {
    name: "LIST",
    color: "#00BCD4", // Turquesa para "LIST" (enumerar)
  },
  total_info_requests_per_minute: {
    name: "INFO",
    color: "#9E9E9E", // Gris para "INFO" (información general)
  },
  total_stat_requests_per_minute: {
    name: "STAT",
    color: "#616161", // Gris oscuro para "STAT" (estadísticas)
  },
  total_stats_requests_per_minute: {
    name: "STATS",
    color: "#424242", // Gris muy oscuro para "STATS"
  },
  total_subscribe_requests_per_minute: {
    name: "SUBSCRIBE",
    color: "#9C27B0", // Púrpura para "SUBSCRIBE" (conectar/seguir)
  },
  total_unsubscribe_requests_per_minute: {
    name: "UNSUBSCRIBE",
    color: "#E91E63", // Rosa oscuro para "UNSUBSCRIBE" (desconectar/dejar de seguir)
  },
  total_publish_requests_per_minute: {
    name: "PUBLISH",
    color: "#FF9800", // Naranja para "PUBLISH" (difundir)
  },
  total_connection_requests_per_minute: {
    name: "CONNECTION",
    color: "#673AB7", // Púrpura oscuro para "CONNECTION" (conexiones)
  },
  total_connections_requests_per_minute: {
    name: "CONNECTIONS",
    color: "#5E35B1", // Púrpura aún más oscuro para "CONNECTIONS"
  },
  total_channels_requests_per_minute: {
    name: "CHANNELS",
    color: "#8BC34A", // Verde para "CHANNELS"
  },
  total_channel_requests_per_minute: {
    name: "CHANNEL",
    color: "#7CB342", // Verde un poco más oscuro para "CHANNEL"
  },
  total_whoami_requests_per_minute: {
    name: "WHOAMI",
    color: "#795548", // Marrón para "WHOAMI" (identificación)
  },
}));

const chart_data = computed(() => {
  return props.historic.map((item: InfoResponse) => {
    return {
      date: formatDate(item.timestamp, false),
      total_requests_per_minute: item.total_requests_per_minute,
      total_insert_requests_per_minute: item.total_insert_requests_per_minute,
      total_query_requests_per_minute: item.total_query_requests_per_minute,
      total_update_requests_per_minute: item.total_update_requests_per_minute,
      total_purge_requests_per_minute: item.total_purge_requests_per_minute,
      total_set_requests_per_minute: item.total_set_requests_per_minute,
      total_get_requests_per_minute: item.total_get_requests_per_minute,
      total_list_requests_per_minute: item.total_list_requests_per_minute,
      total_info_requests_per_minute: item.total_info_requests_per_minute,
      total_stat_requests_per_minute: item.total_stat_requests_per_minute,
      total_stats_requests_per_minute: item.total_stats_requests_per_minute,
      total_subscribe_requests_per_minute: item.total_subscribe_requests_per_minute,
      total_unsubscribe_requests_per_minute: item.total_unsubscribe_requests_per_minute,
      total_publish_requests_per_minute: item.total_publish_requests_per_minute,
      total_connections_requests_per_minute: item.total_connections_requests_per_minute,
      total_connection_requests_per_minute: item.total_connection_requests_per_minute,
      total_channels_requests_per_minute: item.total_channels_requests_per_minute,
      total_channel_requests_per_minute: item.total_channel_requests_per_minute,
      total_whoami_requests_per_minute: item.total_whoami_requests_per_minute,
    }
  })
})

const xFormatter = (i: number): string | number => `${chart_data.value[i].date}`

</script>

<template>
  <!-- :key="colorMode.value" re-renders the component on colorMode change -->
  <AreaChart
      :key="colorMode.value"
      :data="chart_data"
      :height="240"
      :categories="categories"
      y-label="Requests per minute"
      :x-num-ticks="10"
      :y-num-ticks="10"
      :y-grid-line="true"
      :x-formatter="xFormatter"
      :curve-type="CurveType.MonotoneX"
      :legend-position="LegendPosition.Top"
      :hide-legend="false"
  />
</template>
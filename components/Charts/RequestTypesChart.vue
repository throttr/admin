<script lang="ts" setup>
import type {InfoResponse} from "@throttr/sdk";
import {formatDate} from "~/server/throttr/utils";

const props = defineProps(['historic']);

const colorMode = useColorMode()

const categories: Record<string, BulletLegendItemInterface> = computed(() => ({
  total_requests: {
    name: "ALL",
    color: "#607D8B" // Un gris azulado neutro para "ALL"
  },
  total_insert_requests: {
    name: "INSERT",
    color: "#4CAF50" // Verde brillante para "INSERT" (creación)
  },
  total_query_requests: {
    name: "QUERY",
    color: "#2196F3" // Azul para "QUERY" (consulta/lectura)
  },
  total_set_requests: {
    name: "SET",
    color: "#8BC34A" // Verde más suave para "SET" (establecer/actualizar)
  },
  total_get_requests: {
    name: "GET",
    color: "#03A9F4" // Azul claro para "GET" (obtener)
  },
  total_update_requests: {
    name: "UPDATE",
    color: "#FFC107" // Naranja/amarillo para "UPDATE" (modificación)
  },
  total_purge_requests: {
    name: "PURGE",
    color: "#F44336" // Rojo intenso para "PURGE" (eliminación destructiva)
  },
  total_list_requests: {
    name: "LIST",
    color: "#00BCD4" // Turquesa para "LIST" (enumerar)
  },
  total_info_requests: {
    name: "INFO",
    color: "#9E9E9E" // Gris para "INFO" (información general)
  },
  total_stat_requests: {
    name: "STAT",
    color: "#616161" // Gris oscuro para "STAT" (estadísticas)
  },
  total_stats_requests: {
    name: "STATS",
    color: "#424242" // Gris muy oscuro para "STATS"
  },
  total_subscribe_requests: {
    name: "SUBSCRIBE",
    color: "#9C27B0" // Púrpura para "SUBSCRIBE" (conectar/seguir)
  },
  total_unsubscribe_requests: {
    name: "UNSUBSCRIBE",
    color: "#E91E63" // Rosa oscuro para "UNSUBSCRIBE" (desconectar/dejar de seguir)
  },
  total_publish_requests: {
    name: "PUBLISH",
    color: "#FF9800" // Naranja para "PUBLISH" (difundir)
  },
  total_connection_requests: {
    name: "CONNECTION",
    color: "#673AB7" // Púrpura oscuro para "CONNECTION" (conexiones)
  },
  total_connections_requests: {
    name: "CONNECTIONS",
    color: "#5E35B1" // Púrpura aún más oscuro para "CONNECTIONS"
  },
  total_channels_requests: {
    name: "CHANNELS",
    color: "#8BC34A" // Verde para "CHANNELS"
  },
  total_channel_requests: {
    name: "CHANNEL",
    color: "#7CB342" // Verde un poco más oscuro para "CHANNEL"
  },
  total_whoami_requests: {
    name: "WHOAMI",
    color: "#795548" // Marrón para "WHOAMI" (identificación)
  },
}));


const chart_data = computed(() => {
  return props.historic.map((item: InfoResponse) => {
    return {
      date: formatDate(item.timestamp, false),
      total_requests: item.total_requests,
      total_insert_requests: item.total_insert_requests,
      total_query_requests: item.total_query_requests,
      total_update_requests: item.total_update_requests,
      total_purge_requests: item.total_purge_requests,
      total_set_requests: item.total_set_requests,
      total_get_requests: item.total_get_requests,
      total_list_requests: item.total_list_requests,
      total_info_requests: item.total_info_requests,
      total_stat_requests: item.total_stat_requests,
      total_stats_requests: item.total_stats_requests,
      total_subscribe_requests: item.total_subscribe_requests,
      total_unsubscribe_requests: item.total_unsubscribe_requests,
      total_publish_requests: item.total_publish_requests,
      total_connections_requests: item.total_connections_requests,
      total_connection_requests: item.total_connection_requests,
      total_channels_requests: item.total_channels_requests,
      total_channel_requests: item.total_channel_requests,
      total_whoami_requests: item.total_whoami_requests,
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
      y-label="Requests"
      :y-grid-line="true"
      :x-formatter="xFormatter"
      :x-num-ticks="10"
      :y-num-ticks="10"
      :curve-type="CurveType.MonotoneX"
      :legend-position="LegendPosition.Top"
      :hide-legend="false"
  />
</template>
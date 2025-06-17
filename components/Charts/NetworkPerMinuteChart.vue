<script lang="ts" setup>
import type {InfoResponse} from "@throttr/sdk";
import {formatDate} from "~/server/throttr/utils";

const props = defineProps(['historic']);

const colorMode = useColorMode()

const categories: Record<string, BulletLegendItemInterface> = computed(() => ({
  total_read_bytes_per_minute: {
    name: "Read",
    color: "#607D8B" // Un gris azulado neutro para "ALL"
  },
  total_write_bytes_per_minute: {
    name: "Write",
    color: "#4CAF50" // Verde brillante para "INSERT" (creación)
  },
}));


const chart_data = computed(() => {
  return props.historic.map((item: InfoResponse) => {
    return {
      date: formatDate(item.timestamp, false),
      total_read_bytes_per_minute: item.total_read_bytes_per_minute,
      total_write_bytes_per_minute: item.total_write_bytes_per_minute,
    }
  })
})

const xFormatter = (i: number): string | number => `${chart_data.value[i].date}`

</script>

<template>
  <LineChart
      :data="chart_data"
      :height="150"
      y-label="Bytes per minute"
      :x-num-ticks="4"
      :y-num-ticks="4"
      :categories="categories"
      :x-formatter="xFormatter"
      :y-grid-line="true"
      :curve-type="CurveType.Linear"
      :legend-position="LegendPosition.Top"
      :hide-legend="false"
  />
</template>
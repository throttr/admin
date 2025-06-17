<script lang="ts" setup>
import type {InfoResponse} from "@throttr/sdk";
import {formatDate} from "~/server/throttr/utils";

const props = defineProps(['historic']);


const categories: Record<string, BulletLegendItemInterface> = computed(() => ({
  total_counters: {
    name: "Counters",
    color: "#607D8B" // Un gris azulado neutro para "ALL"
  },
  total_buffers: {
    name: "Buffers",
    color: "#4CAF50" // Verde brillante para "INSERT" (creación)
  },
}));


const chart_data = computed(() => {
  return props.historic.map((item: InfoResponse) => {
    return {
      date: formatDate(item.timestamp, false),
      total_counters: item.total_counters,
      total_buffers: item.total_buffers,
    }
  })
})

const xFormatter = (i: number): string | number => `${chart_data.value[i].date}`

</script>

<template>
  <BarChart
      :data="chart_data"
      :height="150"
      :categories="categories"
      :radius="4"
      :y-axis="['total_buffers', 'total_counters']"
      :group-padding="0"
      :bar-padding="0.2"
      :xNumTicks="5"
      :x-formatter="xFormatter"
      :legend-position="LegendPosition.Top"
      :y-num-ticks="4"
  />
</template>
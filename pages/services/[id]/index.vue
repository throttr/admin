<script lang="ts" setup>
import type {InfoResponse} from "@throttr/sdk";
import MetricCard from "~/components/Cards/MetricCard.vue";
import UCard from "#ui/components/Card.vue";
import TimedMetricCard from "~/components/Cards/TimedMetricCard.vue";

const route = useRoute()
const services = useServices()

const data = ref({
  success: false
});

const sections = [
  { name: 'ALL', totalKey: 'total_requests', perMinuteKey: 'total_requests_per_minute' },
  { name: 'INSERT', totalKey: 'total_insert_requests', perMinuteKey: 'total_insert_requests_per_minute' },
  { name: 'QUERY', totalKey: 'total_query_requests', perMinuteKey: 'total_query_requests_per_minute' },
  { name: 'UPDATE', totalKey: 'total_update_requests', perMinuteKey: 'total_update_requests_per_minute' },
  { name: 'PURGE', totalKey: 'total_purge_requests', perMinuteKey: 'total_purge_requests_per_minute' },
  { name: 'SET', totalKey: 'total_set_requests', perMinuteKey: 'total_set_requests_per_minute' },
  { name: 'GET', totalKey: 'total_get_requests', perMinuteKey: 'total_get_requests_per_minute' },
  { name: 'LIST', totalKey: 'total_list_requests', perMinuteKey: 'total_list_requests_per_minute' },
  { name: 'INFO', totalKey: 'total_info_requests', perMinuteKey: 'total_info_requests_per_minute' },
  { name: 'STAT', totalKey: 'total_stat_requests', perMinuteKey: 'total_stat_requests_per_minute' },
  { name: 'STATS', totalKey: 'total_stats_requests', perMinuteKey: 'total_stats_requests_per_minute' },
  { name: 'SUBSCRIBE', totalKey: 'total_subscribe_requests', perMinuteKey: 'total_subscribe_requests_per_minute' },
  { name: 'UNSUBSCRIBE', totalKey: 'total_unsubscribe_requests', perMinuteKey: 'total_unsubscribe_requests_per_minute' },
  { name: 'PUBLISH', totalKey: 'total_publish_requests', perMinuteKey: 'total_publish_requests_per_minute' },
  { name: 'CONNECTIONS', totalKey: 'total_connections_requests', perMinuteKey: 'total_connections_requests_per_minute' },
  { name: 'CONNECTION', totalKey: 'total_connection_requests', perMinuteKey: 'total_connection_requests_per_minute' },
  { name: 'CHANNELS', totalKey: 'total_channels_requests', perMinuteKey: 'total_channels_requests_per_minute' },
  { name: 'CHANNEL', totalKey: 'total_channel_requests', perMinuteKey: 'total_channel_requests_per_minute' },
  { name: 'WHOAMI', totalKey: 'total_whoami_requests', perMinuteKey: 'total_whoami_requests_per_minute' },
]

onMounted(async () => {
    data.value = await services.info(route.params.id) as InfoResponse;
})

const formatDate = (value: number, isNano: boolean): string => {
  const ms = isNano ? Math.floor(value / 1e6) : value * 1000;
  const date = new Date(ms);
  return date.toLocaleString();
}
</script>

<template>
  <div class="p-32">
    <div v-if="data.success">
      <div class="mb-10">
        <h1 class="text-5xl">Instance</h1>
      </div>

      <div class="grid grid-cols-4 gap-10 mb-20">
        <MetricCard
            title="Report At" :value="formatDate(data.timestamp, false)" />
        <MetricCard
            title="Started At" :value="formatDate(data.startup_timestamp, true)" />
        <MetricCard
            title="Version" :value="data.version" />
        <MetricCard
            title="Connections"
            :value="data.total_connections" />
      </div>


      <div class="mb-10">
        <h1 class="text-5xl">Storage</h1>
      </div>

      <div class="grid grid-cols-3 gap-10 mb-20">
        <MetricCard title="Number of Keys" :value="data.total_keys" />
        <MetricCard title="Number of Buffers" :value="data.total_buffers" />
        <MetricCard title="Number of Counters" :value="data.total_counters" />
      </div>


      <div class="mb-10">
        <h1 class="text-5xl">Memory Allocated</h1>
      </div>

      <div class="grid grid-cols-2 gap-10 mb-20">
        <MetricCard
            title="Allocated Bytes on Buffers"
            :value="data.total_allocated_bytes_on_buffers" />
        <MetricCard
            title="Allocated Bytes on Counters"
            :value="data.total_allocated_bytes_on_counters" />
      </div>

      <div class="mb-10">
        <h1 class="text-5xl">Network</h1>
      </div>

      <div class="grid grid-cols-2 gap-10 mb-20">
        <TimedMetricCard
            title="Read Bytes"
            :total="data.total_read_bytes"
            :per_minute="data.total_read_bytes_per_minute"/>
        <TimedMetricCard
            title="Write Bytes"
            :total="data.total_write_bytes"
            :per_minute="data.total_write_bytes_per_minute"/>
      </div>

      <div class="mb-10">
        <h1 class="text-5xl">Requests</h1>
      </div>

      <div class="grid grid-cols-4 gap-8">
        <TimedMetricCard
            v-for="section in sections"
            :key="section.name"
            :title="section.name"
            :total="data[section.totalKey]"
            :per_minute="data[section.perMinuteKey]"/>
      </div>
    </div>
  </div>
</template>